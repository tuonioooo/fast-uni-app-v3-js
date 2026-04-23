import { getFileMd5 } from "../index.js" ;

import {getImageInfo, saveFile, removeSavedFile} from "./uniPromise.js";
/**
 * 载入图片缓存
 * @param {*} src 图片网络地址/本地地址
 */
async function loadImageCache(src) {
	//获取图片的临时路径
	let { path } = await getImageInfo(src);
	//获取文件的md5
	let res = await getFileMd5(path);
	return await getFileCache(path, res.digest);
}

/**
 * 获取文件缓存
 * @param {Object} tempFilePath 获取图片临时路径
 * @param {Object} fileMd5		文件md5
 */
async function getFileCache(tempFilePath, fileMd5) {
	// 图片缓存key值
	let storageKey = 'IMAGE_CACHE_INFO_' + fileMd5
	// 首先获取本地存储的数据，查询是否有对应文件路径，如果有缓存内容，直接返回
	const fileStorage = uni.getStorageSync(storageKey)
	if (fileStorage) {
		console.log("已缓存为：" + fileStorage)
		return fileStorage;
	} else {
		let savedFilePath = await saveFile(tempFilePath);
		uni.setStorageSync(storageKey, savedFilePath);
		console.log(`未缓存, 将临时文件保存到缓存中, 路径为${savedFilePath}`);
	}
}


export {
	loadImageCache
}