import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class RESP {

    public static class DecodeResult {
        public Object value;
        public int delta;

        public DecodeResult(Object value, int delta) {
            this.value = value;
            this.delta = delta;
        }
    }

    public Object decode(byte[] data) throws Exception {
        return decodeOne(data).value;
    }

    public DecodeResult decodeOne(byte[] data) throws Exception {
        if (data == null || data.length == 0) {
            throw new Exception("new data");
        }

        byte type = data[0];

        switch (type) {
            case '+':
                return readSimpleString(data);
            case '-':
                return readError(data);
            case ':':
                return readInt64(data);
            case '$':
                return readBulkString(data);
            case '*':
                return readArray(data);
            default:
                throw new Exception("unknown RESP type : " + (char) type);
        }
    }

    private DecodeResult readSimpleString(byte[] data) {
        int pos = 1;
        while (pos < data.length && data[pos] != '\r') {
            pos++;
        }
        String str = new String(data, 1, pos - 1, StandardCharsets.UTF_8);
        return new DecodeResult(str, pos + 2);
    }

    private DecodeResult readError(byte[] data) {
        int pos = 1;
        while (pos < data.length && data[pos] != '\r') {
            pos++;
        }
        String str = new String(data, 1, pos - 1, StandardCharsets.UTF_8);
        return new DecodeResult(new Exception(str), pos + 2);
    }

    private DecodeResult readInt64(byte[] data) {
        int pos = 1;
        long value = 0;
        while (pos < data.length && data[pos] != '\r') {
            byte b = data[pos];
            value = value * 10 + (b - '0');
            pos++;
        }
        return new DecodeResult(value, pos + 2);
    }

    private DecodeResult readLength(byte[] data) {
        int pos = 1;
        int length = 0;
        while (pos < data.length && data[pos] != '\r') {
            byte b = data[pos];
            if (b < '0' || b > '9') {
                break;
            }
            length = length * 10 + (b - '0');
            pos++;
        }
        return new DecodeResult(length, pos + 2);
    }

    private DecodeResult readBulkString(byte[] data) {
        DecodeResult len = readLength(data);
        int count = (Integer) len.value;
        int pos = len.delta;

        String str = new String(data, pos, count, StandardCharsets.UTF_8);
        return new DecodeResult(str, pos + count + 2);
    }

    private DecodeResult readArray(byte[] data) throws Exception {
        DecodeResult lenResult = readLength(data);
        int pos = lenResult.delta;
        int count = (Integer) lenResult.value;

        Object[] arr = new Object[count];

        for (int i = 0; i < count; i++) {
            byte[] subData = Arrays.copyOfRange(data, pos, data.length);
            DecodeResult res = decodeOne(subData);

            arr[i] = res.value;
            pos += res.delta;
        }

        return new DecodeResult(arr, pos);
    }
}