export function stringifyBase64(wordArray) {
    // Shortcuts
    var words = wordArray.words;
    var sigBytes = wordArray.sigBytes;
    var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    // Clamp excess bits
    wordArray.clamp();

    // Convert
    var base64Chars = [];
    for (var i = 0; i < sigBytes; i += 3) {
        var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
        var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
        var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

        var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

        for (var j = 0; (j < 4) && (i + j - 1 < sigBytes); j++) {
            var base64Value = (triplet >>> (6 * (3 - j))) & 0x3f;
            base64Chars.push(map.charAt(base64Value));
        }
    }

    // Add padding
    var paddingChar = map.charAt(64);
    if (paddingChar) {
        while (base64Chars.length % 4) {
            base64Chars.push(paddingChar);
        }
    }

    return base64Chars.join('');
}

export function base64URL(str) {
    return str.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}