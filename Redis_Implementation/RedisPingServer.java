import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

/**
 * A blocking, single-threaded TCP server implementing a Redis replica.
 * 
 * It exposes package-private helper functions for command evaluation and RESP format responses
 * so that they can be reused by non-blocking implementations (e.g. RedisEventLoopServer)
 * without duplicating business logic.
 */
public class RedisPingServer {
    private static final int PORT = 7379;

    public static void main(String args[]) {
        RESP respParser = new RESP();
        
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Redis replica server listening on PORT: " + PORT);

            while (true) {
                try (Socket clientSocket = serverSocket.accept()) {
                    System.out.println("Client connected: " + clientSocket.getRemoteSocketAddress());
                    handleClient(clientSocket, respParser);
                    System.out.println("Client disconnected.");
                } catch (Exception e) {
                    System.err.println("Error processing connection: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.out.println("Server exception: " + e.getMessage());
        }
    }

    private static void handleClient(Socket socket, RESP respParser) throws Exception {
        InputStream in = socket.getInputStream();
        OutputStream out = socket.getOutputStream();
        byte[] buffer = new byte[4096];
        while (true) {
            int bytesRead = in.read(buffer);
            if (bytesRead == -1) {
                break;
            }

            byte[] rawPayload = Arrays.copyOf(buffer, bytesRead);

            try {
                Object decodedObject = respParser.decode(rawPayload);

                if (decodedObject instanceof Object[]) {
                    Object[] tokens = (Object[]) decodedObject;

                    if (tokens.length > 0) {
                        String command = tokens[0].toString().toUpperCase();
                        Object[] args = Arrays.copyOfRange(tokens, 1, tokens.length);

                        evalAndRespond(out, command, args);
                    } else {
                        sendError(out, "ERR protocol error: expected an array command packet");
                    }
                }
            } catch (Exception e) {
                sendError(out, "ERR Parsing error: " + e.getMessage());
            }
        }
    }

    /**
     * Evaluates a Redis command and sends the response to the output stream.
     * Reused by RedisEventLoopServer.
     */
    static void evalAndRespond(OutputStream out, String command, Object[] args) throws IOException {
        if ("PING".equals(command)) {
            evalPing(out, args);
        } else {
            sendError(out, "ERR unknown command " + command + " ");
        }
    }

    /**
     * Handles PING commands.
     * Reused by RedisEventLoopServer.
     */
    static void evalPing(OutputStream out, Object[] args) throws IOException {
        if (args.length > 1) {
            sendError(out, "ERR wrong number of arguments for PING command");
        } else if (args.length == 0) {
            sendSimpleString(out, "PONG");
        } else {
            sendBulkString(out, args[0].toString());
        }
    }

    /**
     * Sends a RESP simple string.
     * Reused by RedisEventLoopServer.
     */
    static void sendSimpleString(OutputStream out, String str) throws IOException {
        String response = "+" + str + "\r\n";
        out.write(response.getBytes(StandardCharsets.UTF_8));
        out.flush();
    }

    /**
     * Sends a RESP bulk string.
     * Reused by RedisEventLoopServer.
     */
    static void sendBulkString(OutputStream out, String str) throws IOException {
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        String header = "$" + bytes.length + "\r\n";
        out.write(header.getBytes(StandardCharsets.UTF_8));
        out.write(bytes);
        out.write("\r\n".getBytes(StandardCharsets.UTF_8));
        out.flush();
    }

    /**
     * Sends a RESP error message.
     * Reused by RedisEventLoopServer.
     */
    static void sendError(OutputStream out, String errMsg) throws IOException {
        String response = "-" + errMsg + "\r\n";
        out.write(response.getBytes(StandardCharsets.UTF_8));
        out.flush();
    }
}
