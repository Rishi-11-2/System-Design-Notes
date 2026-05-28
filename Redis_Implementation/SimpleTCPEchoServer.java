
import java.io.*;

import java.net.*;

public class SimpleTCPEchoServer {
    public static void main(String args[])
    {
        String host = "0.0.0.0";
        int port = 7379;

        System.out.println("Rolling the dice..");
        System.out.println("Starting TCP server  on"+host+":"+port);

        // create the server socket and bind it to the host and port
        try(ServerSocket serverSocket = new ServerSocket()){

            serverSocket.bind(new InetSocketAddress(host,port));
            int concurrentClients = 0;


            // infinite loop waiting for new connections to be accepted
            while(true)
            {
                // blocking call wait for client to conenct
                Socket clientSocket = serverSocket.accept();
                concurrentClients++;
                System.out.println("Client connected with address:"+clientSocket.getRemoteSocketAddress());
                System.out.println("Concurrent Clients:"+concurrentClients);

                // handle the client connection
                try(InputStream in = clientSocket.getInputStream();
                    OutputStream out = clientSocket.getOutputStream())
                    {
                        byte [] buffer = new byte[1024];
                        int bytesRead;

                        // infinite loop continuously reading commands from connected socket 
                        // this is a blocking call  ; waits until the client sends data or drop connection

                        while((bytesRead=in.read(buffer))!=-1)
                        {
                            String command = new String(buffer ,0,bytesRead);
                            System.out.println("Received command: "+command);

                            //respond(echo back ) over the socket

                            out.write(buffer, 0,bytesRead);
                            out.flush();
                        }
                    }
                    catch(IOException e)
                    {
                        System.out.println("Error reading from the client: "+e.getMessage());
                    }
                    finally{
                        concurrentClients-- ;
                        System.out.println("Client disconnected");
                        System.out.println("Concurrent clients:"+concurrentClients);
                        clientSocket.close();
                    }
            }
        }
        catch(IOException e)
        {
            System.out.println("Server error:"+e.getMessage());
        }

    }
}
