import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

/**
 * An asynchronous, single-threaded TCP Echo Server implementing an Event Loop.
 * This refactors the original blocking TCP server to use Java NIO (Selector),
 * allowing it to handle multiple concurrent clients on a single thread.
 */
public class SimpleTCPEchoServer {
    public static void main(String[] args) {
        String host = "0.0.0.0";
        int port = 7379;

        System.out.println("Rolling the dice..");
        System.out.println("Starting Event Loop TCP Echo Server on " + host + ":" + port);

        try (Selector selector = Selector.open();
             ServerSocketChannel serverChannel = ServerSocketChannel.open()) {

            // 1. Configure the server socket channel to be non-blocking
            serverChannel.configureBlocking(false);

            // 2. Bind the socket to the host and port
            serverChannel.bind(new InetSocketAddress(host, port));

            // 3. Register the channel with the selector for accepting new connections
            serverChannel.register(selector, SelectionKey.OP_ACCEPT);

            int concurrentClients = 0;

            // 4. The Event Loop
            while (true) {
                // Block until at least one event is ready
                int readyChannels = selector.select();
                if (readyChannels == 0) {
                    continue;
                }

                Set<SelectionKey> selectedKeys = selector.selectedKeys();
                Iterator<SelectionKey> keyIterator = selectedKeys.iterator();

                while (keyIterator.hasNext()) {
                    SelectionKey key = keyIterator.next();
                    keyIterator.remove(); // Remove to avoid reprocessing

                    if (!key.isValid()) {
                        continue;
                    }

                    try {
                        if (key.isAcceptable()) {
                            // Event: New client connection request
                            ServerSocketChannel server = (ServerSocketChannel) key.channel();
                            SocketChannel clientChannel = server.accept();

                            // Configure the client connection to be non-blocking
                            clientChannel.configureBlocking(false);

                            concurrentClients++;
                            System.out.println("Client connected with address: " + clientChannel.getRemoteAddress());
                            System.out.println("Concurrent Clients: " + concurrentClients);

                            // Register the client channel for reading data
                            clientChannel.register(selector, SelectionKey.OP_READ);

                        } else if (key.isReadable()) {
                            // Event: Client channel has data ready to be read
                            SocketChannel clientChannel = (SocketChannel) key.channel();
                            ByteBuffer buffer = ByteBuffer.allocate(1024);

                            int bytesRead = clientChannel.read(buffer);

                            if (bytesRead == -1) {
                                // Connection closed by client
                                concurrentClients--;
                                System.out.println("Client disconnected");
                                System.out.println("Concurrent clients: " + concurrentClients);
                                clientChannel.close();
                                key.cancel();
                                continue;
                            }

                            if (bytesRead > 0) {
                                // Flip buffer from writing mode to reading mode
                                buffer.flip();

                                // Echo back the received data directly over the socket channel
                                while (buffer.hasRemaining()) {
                                    clientChannel.write(buffer);
                                }
                            }
                        }
                    } catch (IOException e) {
                        System.out.println("Error communicating with client: " + e.getMessage());
                        try {
                            key.channel().close();
                        } catch (IOException ignored) {}
                        key.cancel();
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("Server error: " + e.getMessage());
        }
    }
}
