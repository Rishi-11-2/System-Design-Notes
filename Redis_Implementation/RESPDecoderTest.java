import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class RESPDecoderTest {

    @Test
    public void testDecodeSimpleString() throws Exception {
        RESPDecoder decoder = new RESPDecoder();
        byte[] data = "+OK\r\n".getBytes();
        
        Object result = decoder.decode(data);
        
        assertEquals("OK", result);
    }

    @Test
    public void testDecodeError() throws Exception {
        RESPDecoder decoder = new RESPDecoder();
        byte[] data = "-Error message\r\n".getBytes();
        
        Object result = decoder.decode(data);
        
        // Errors were decoded into standard Java Exceptions
        assertTrue(result instanceof Exception);
        assertEquals("Error message", ((Exception) result).getMessage());
    }

    @Test
    public void testDecodeInteger() throws Exception {
        RESPDecoder decoder = new RESPDecoder();
        byte[] data = ":1000\r\n".getBytes();
        
        Object result = decoder.decode(data);
        
        // We parse integers as 'long' to match Go's int64
        assertEquals(1000L, result);
    }

    @Test
    public void testDecodeBulkString() throws Exception {
        RESPDecoder decoder = new RESPDecoder();
        // $5\r\nhello\r\n
        byte[] data = "$5\r\nhello\r\n".getBytes();
        
        Object result = decoder.decode(data);
        
        assertEquals("hello", result);
    }

    @Test
    public void testDecodeSimpleArray() throws Exception {
        RESPDecoder decoder = new RESPDecoder();
        // *2\r\n$5\r\nhello\r\n$5\r\nworld\r\n
        byte[] data = "*2\r\n$5\r\nhello\r\n$5\r\nworld\r\n".getBytes();
        
        Object result = decoder.decode(data);
        
        assertTrue(result instanceof Object[]);
        Object[] arr = (Object[]) result;
        
        assertEquals(2, arr.length);
        assertEquals("hello", arr[0]);
        assertEquals("world", arr[1]);
    }

    @Test
    public void testDecodeNestedArray() throws Exception {
        // This mirrors the complex test case mentioned in the video at [00:12:04]
        // An array of 2 elements:
        // 1. A sub-array of 3 integers (1, 2, 3)
        // 2. A sub-array of 1 simple string ("Hello") and 1 error ("World")
        
        String payload = "*2\r\n" +
                         "*3\r\n:1\r\n:2\r\n:3\r\n" +
                         "*2\r\n+Hello\r\n-World\r\n";
                         
        RESPDecoder decoder = new RESPDecoder();
        Object result = decoder.decode(payload.getBytes());
        
        assertTrue(result instanceof Object[]);
        Object[] outerArr = (Object[]) result;
        assertEquals(2, outerArr.length);
        
        // Verify First Inner Array (Integers)
        assertTrue(outerArr[0] instanceof Object[]);
        Object[] innerArr1 = (Object[]) outerArr[0];
        assertEquals(3, innerArr1.length);
        assertEquals(1L, innerArr1[0]);
        assertEquals(2L, innerArr1[1]);
        assertEquals(3L, innerArr1[2]);
        
        // Verify Second Inner Array (String + Error)
        assertTrue(outerArr[1] instanceof Object[]);
        Object[] innerArr2 = (Object[]) outerArr[1];
        assertEquals(2, innerArr2.length);
        assertEquals("Hello", innerArr2[0]);
        
        assertTrue(innerArr2[1] instanceof Exception);
        assertEquals("World", ((Exception) innerArr2[1]).getMessage());
    }
}