/**
 * @description 生成唯一ID
 * @param {Number} len 长度
 * @param {Number} radix 生成uuid的基数(进制数),2-二进制(0~1),8-八进制(0~7),10-十进制(0~9),16-十六进制(0~9,A~F)
 * @example uuid(5) 生成长度为5的uuid
 */
function muuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/**
 * @description 标准的uuid生成方法
 * @param len
 * @param binary
 * @example uni.$jasper.uuid();
 * @return {string}
 */
function uuid(len, binary) {
    len = !len ? 36 : len;
    binary = !binary ? 16 : binary;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * binary | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(binary);
    }).substring(0, len);
};

function buuid(len, radix){
    return `b_${muuid(len , radix)}` ;
}

export {
    uuid,
    buuid,
}