// 统一在外部安装依赖
import CryptoJS from 'crypto-js';

/**
 *  注意：

	AES (Advanced Encryption Standard) 和 DES (Data Encryption Standard) 都是被广泛使用的对称加密算法。然而它们之间存在着一些关键的区别：
	
	安全性：DES 已经不再安全，因为其使用 56 位密钥，这种密钥长度在现代计算能力下不再足够安全。早在 1997 年，DES 就已经被实际破解。然而，采用 128 位、192 位或 256 位密钥的 AES 仍然被认为是安全的。
	
	性能：AES 比 DES 更快，更高效。AES 使用哈ード矩阵来更快地进行加密、解密和密钥生成，而 DES 使用的是相对较慢的排列和替换方法。
	
	密钥大小：DES 使用固定长度（56 位）的密钥。虽然 DES 在技术上使用了 64 位密钥，但实际上只有 56 位被用于加密（其他 8 位用于奇偶校验）。AES 可以使用 128、192 或 256 位密钥。
	
	算法结构：DES 是一个费斯妥尔 (Feistel) 结构的网络。它把数据分为两半并进行交叉加密。 然而，AES 使用了称为 SPN (Substitution-permutation network) 的网络结构。
	
	模式：DES 有多种变体，包括 EDE (Encrypt-Decrypt-Encrypt) 模式 -- 这就是常说的 "Triple DES"。在 Triple DES 中，数据会被加密三次，每次使用不同的密钥，提供了更大的安全性，但要比单次 DES 慢三倍。而 AES 则具有多种工作模式, 包括 ECB、CBC、CFB、OFB 等。
	
	总结起来，AES 是 DES 的一个优秀的替代品，其安全性更强，性能更好，更为灵活。今天，AES 已成为世界上最流行的对称加密算法，用于保护各种敏感数据。


	推荐使用：AES 速度快 位数多
	 
	 DES 中iv在测试的过程中 js库偏移量 无效果
	 CryptoJS.AES.encrypt(srcs, SECRET_KEY, {
		  iv: SECRET_IV , // 偏移量 无效果
		  mode: CryptoJS.mode.CBC,
		  padding: CryptoJS.pad.ZeroPadding
	 })
 */

/**
 * AES 加密方法
 * @param content	待加密内容
 * @param key		加密秘钥
 * @param iv		偏移量
 * @returns {string}
 */
function encryptAES(content, key, iv) {
	let _content = CryptoJS.enc.Utf8.parse(content);
	const secretKey = CryptoJS.enc.Utf8.parse(key); //注意 与后端搭配使用时，这里的key要与后端保存一致
	const secretIv = CryptoJS.enc.Utf8.parse(iv); //注意 与后端搭配使用时，这里的iv要与后端保存一致
	const encrypted = CryptoJS.AES.encrypt(_content, secretKey, {
			iv: secretIv, //注意 与后端搭配使用时，这里的iv要与后端保存一致	
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
	return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * AES 解密方法
 * @param encryptStr	密文
 * @param key			加密秘钥
 * @param iv			偏移量
 * @returns {string}
 */
function decryptAES(encryptStr, key, iv) {
	let base64 = CryptoJS.enc.Base64.parse(encryptStr);
	let str = CryptoJS.enc.Base64.stringify(base64);
	const secretKey = CryptoJS.enc.Utf8.parse(key); //注意 与后端搭配使用时，这里的key要与后端保存一致
	const secretIv = CryptoJS.enc.Utf8.parse(iv); //注意 与后端搭配使用时，这里的iv要与后端保存一致
	const decrypt = CryptoJS.AES.decrypt(str, secretKey, {
			iv: secretIv, //注意 与后端搭配使用时，这里的iv要与后端保存一致	
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
	const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
	return decryptedStr;
}


/**
 * DES 加密方法
 * @param content	待加密内容
 * @param key		加密秘钥
 * @returns {string}
 */
function encryptDES(content, key) {
	let _content = CryptoJS.enc.Utf8.parse(content);
	const secretKey = CryptoJS.enc.Utf8.parse(key); //注意 与后端搭配使用时，这里的key要与后端保存一致
	var encrypted = CryptoJS.DES.encrypt(_content, secretKey, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7,

	});
	return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * DES 解密方法
 * @param content	待加密内容
 * @param key		加密秘钥
 */
function decryptDES(encryptStr, key) {
	let base64 = CryptoJS.enc.Base64.parse(encryptStr);
	let str = CryptoJS.enc.Base64.stringify(base64); // 字节数组转换为字符串
	const secretKey = CryptoJS.enc.Utf8.parse(key); //注意 与后端搭配使用时，这里的key要与后端保存一致
	const decrypted = CryptoJS.DES.decrypt(str, secretKey, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
	return decryptedStr;
}


export {
	encryptAES,
	decryptAES,
	encryptDES,
	decryptDES
}