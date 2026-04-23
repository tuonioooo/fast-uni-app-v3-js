/**
 * 计算数据占用内存大小
 * @param data
 */
function getByte(data){
    const seen = new WeakSet();
    function sizeOfObj(obj) {
        if (obj === null) return 0;
        let bytes = 0;
        // 对象里的key也是占用内存空间的
        const props = Object.keys(obj);
        for (let i = 0; i < props.length; i++) {
            const key = props[i];
            // 无论value是否重复，都需要计算key
            bytes += calculator(key);
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // 这里需要注意value使用相同内存空间（只需计算一次内存）
                if (seen.has(obj[key])) continue;
                seen.add(obj[key])
            }
            bytes += calculator(obj[key])
        }
        return bytes
    }
    function calculator(obj) {
        const objType = typeof obj
        switch (objType) {
            case 'string':
                return obj.length * 2
            case 'boolean':
                return 4
            case 'number':
                return 8
            case 'object':
                if (Array.isArray(obj)) {
                    // 数组处理 [1,2] [{x:1},{y:2}]
                    return obj.map(calculator).reduce((res, cur) => res + cur, 0)
                } else {
                    // 对象处理
                    return sizeOfObj(obj)
                }
            default:
                return 0
        }
    }

    return calculator(data);
}

/**
 * formatBytes(1024);       // 1 KB
   formatBytes('1024');     // 1 KB
   formatBytes(1234);       // 1.21 KB
   formatBytes(1234, 3);    // 1.205 KB
 * @param a  byte字节
 * @param b  保留小数位
 * @returns {string}
 */
function formatBytes(a, b) {
    if (0 === a) return "0 Bytes";
    let c = 1024,
        d = b || 2,
        e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

export {
	formatBytes,
	getByte
}