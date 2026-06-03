/**
 * A compatibility adapter class to map RESPDecoder to the RESP parser.
 * This ensures that tests or other components that reference RESPDecoder
 * continue to compile and function seamlessly using the RESP parser's rules.
 */
public class RESPDecoder extends RESP {
    // Inherits all decode and utility methods directly from RESP
}
