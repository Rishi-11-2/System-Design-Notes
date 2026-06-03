import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Set;

/**
 * An asynchronous, single-threaded TCP server implementing an Event Loop.
 * This mirrors the implementation of an asynchronous event-driven design.
 * 
 * To avoid duplicate code, this class REUSES the business logic functions
 * (evalAndRespond, sendError,  etc.) defined in RedisPingServer.java by wrapping
 * the non-blocking SocketChannel in a custom OutputStream.
 */
public class RedisEventLoopServer {
    private static final int PORT = 7379;
    private static final String HOST = "0.0.0.0";
    private static final int MAX_BUFFER_SIZE = 1024 * 1024; // 1 MB buffer limit to protect against OOM

    private static final RESP respParser = new RESP();

    /**
     * Represents the session/state of a connected client, buffering incoming
     * byte streams to handle fragmented TCP packets across multiple read events.
     */
    private static class ClientSession {
        private byte[] readBuffer = new byte[0];

        public void append(byte[] data, int length) {
            int oldLen = readBuffer.length;
            readBuffer = Arrays.copyOf(readBuffer, oldLen + length);
            System.arraycopy(data, 0, readBuffer, oldLen, length);
        }

        public byte[] getBuffer() {
            return readBuffer;
        }

        public void discard(int bytesCount) {
            if (bytesCount >= readBuffer.length) {
                readBuffer = new byte[0];
            } else {
                readBuffer = Arrays.copyOfRange(readBuffer, bytesCount, readBuffer.length);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("Starting Event Loop TCP Server (Single-Threaded)...");

        try (Selector selector = Selector.open();
             ServerSocketChannel serverChannel = ServerSocketChannel.open()) {

            // 1. Configure the server socket to be non-blocking
            serverChannel.configureBlocking(false);

            // 2. Bind to host and port
            serverChannel.bind(new InetSocketAddress(HOST, PORT));
            System.out.println("Redis event-loop replica listening on " + HOST + ":" + PORT);

            // 3. Register the server channel with the selector to monitor incoming connections (OP_ACCEPT)
            serverChannel.register(selector, SelectionKey.OP_ACCEPT);

            int concurrentClients = 0;

            // 4. The Event Loop
            while (true) {
                // Block until at least one registered channel has an event ready
                int readyChannels = selector.select();
                if (readyChannels == 0) {
                    continue;
                }

                Set<SelectionKey> selectedKeys = selector.selectedKeys();
                Iterator<SelectionKey> keyIterator = selectedKeys.iterator();

                while (keyIterator.hasNext()) {
                    SelectionKey key = keyIterator.next();
                    keyIterator.remove(); // Remove key to avoid processing it twice

                    if (!key.isValid()) {
                        continue;
                    }

                    try {
                        if (key.isAcceptable()) {
                            // Event: Incoming client connection
                            ServerSocketChannel server = (ServerSocketChannel) key.channel();
                            SocketChannel clientChannel = server.accept();
                            
                            // Configure client channel to be non-blocking
                            clientChannel.configureBlocking(false);
                            
                            concurrentClients++;
                            System.out.println("\n[Event: ACCEPT] New client connected: " + clientChannel.getRemoteAddress());
                            System.out.println("Total active connections: " + concurrentClients);

                            // Register the client channel to monitor read operations (OP_READ)
                            clientChannel.register(selector, SelectionKey.OP_READ, new ClientSession());

                        } else if (key.isReadable()) {
                            // Event: Incoming data from client socket
                            SocketChannel clientChannel = (SocketChannel) key.channel();
                            ClientSession session = (ClientSession) key.attachment();

                            ByteBuffer tempBuffer = ByteBuffer.allocate(1024);
                            int bytesRead = clientChannel.read(tempBuffer);

                            if (bytesRead == -1) {
                                // Connection closed by client
                                concurrentClients--;
                                System.out.println("\n[Event: DISCONNECT] Client disconnected: " + clientChannel.getRemoteAddress());
                                System.out.println("Total active connections: " + concurrentClients);
                                clientChannel.close();
                                key.cancel();
                                continue;
                            }

                            if (bytesRead > 0) {
                                tempBuffer.flip();
                                byte[] data = new byte[tempBuffer.remaining()];
                                tempBuffer.get(data);

                                // Append received data to client session buffer
                                session.append(data, data.length);

                                // Protect against buffer inflation (DoS check)
                                if (session.getBuffer().length > MAX_BUFFER_SIZE) {
                                    System.err.println("Client buffer size exceeded maximum limit. Closing connection.");
                                    concurrentClients--;
                                    clientChannel.close();
                                    key.cancel();
                                    continue;
                                }

                                // Process buffer to execute commands
                                processClientCommands(clientChannel, session);
                            }
                        }
                    } catch (IOException e) {
                        System.err.println("Communication error with client: " + e.getMessage());
                        try {
                            key.channel().close();
                        } catch (IOException ignored) {}
                        key.cancel();
                    }
                }
            }

        } catch (IOException e) {
            System.err.println("Server exception: " + e.getMessage());
        }
    }

    /**
     * Decodes and processes all complete commands stored in the client session buffer.
     * Reuses evaluation and formatting functions defined in RedisPingServer.java.
     */
    private static void processClientCommands(SocketChannel clientChannel, ClientSession session) {
        OutputStream out = createChannelOutputStream(clientChannel);

        while (true) {
            byte[] buffer = session.getBuffer();
            if (buffer.length == 0) {
                break;
            }

            try {
                // Try decoding a single RESP entity from the buffered stream
                RESP.DecodeResult decodeResult = respParser.decodeOne(buffer);

                Object decodedObject = decodeResult.value;
                int consumedBytes = decodeResult.delta;

                // Process the complete command
                if (decodedObject instanceof Object[]) {
                    Object[] tokens = (Object[]) decodedObject;
                    if (tokens.length > 0) {
                        String command = tokens[0].toString().toUpperCase();
                        Object[] args = Arrays.copyOfRange(tokens, 1, tokens.length);
                        
                        // Reuse the command routing and logic defined in RedisPingServer.java
                        RedisPingServer.evalAndRespond(out, command, args);
                    } else {
                        RedisPingServer.sendError(out, "ERR protocol error: expected an array command packet");
                    }
                } else {
                    RedisPingServer.sendError(out, "ERR protocol error: expected an array command packet");
                }

                // Discard decoded bytes from session buffer
                session.discard(consumedBytes);

            } catch (Exception e) {
                // If parsing fails (incomplete packet), break the loop to wait for more data.
                break;
            }
        }
    }

    /**
     * Creates an OutputStream that wraps a SocketChannel, writing bytes
     * directly through non-blocking channel writes.
     */
    private static OutputStream createChannelOutputStream(SocketChannel channel) {
        return new OutputStream() {
            @Override
            public void write(int b) throws IOException {
                ByteBuffer buf = ByteBuffer.allocate(1);
                buf.put((byte) b);
                buf.flip();
                while (buf.hasRemaining()) {
                    channel.write(buf);
                }
            }

            @Override
            public void write(byte[] b, int off, int len) throws IOException {
                ByteBuffer buf = ByteBuffer.wrap(b, off, len);
                while (buf.hasRemaining()) {
                    channel.write(buf);
                }
            }
        };
    }
}
