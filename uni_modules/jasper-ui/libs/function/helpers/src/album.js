import {
	getImageInfo,
	downloadFile,
	saveImageToPhotosAlbum
} from "./uniPromise.js";

async function _saveImageToPhotosAlbum(src, successMsg = '图片已保存') {
	
	// #ifdef APP-PLUS
	let imageRes = await getImageInfo(src)
	console.log(imageRes, "----_saveImageToPhotosAlbum-----")
	if (imageRes.errMsg === 'getImageInfo:ok') {
		let albumRes = ''
		if (imageRes.path) { //判断图片临时路径是否存在
			albumRes = await saveImageToPhotosAlbum(imageRes.path); //保存到手机相册中
		} else {
			let downloadRes = await downloadFile(src) //下载网络图片
			if (downloadRes.statusCode === 200) {
				albumRes = await saveImageToPhotosAlbum(downloadRes.tempFilePath); //保存到手机相册中
			}
		}
		console.log(albumRes, "----saveImageToPhotosAlbum:ok-----")
		uni.$jasper.showToast(albumRes.errMsg === 'saveImageToPhotosAlbum:ok' ? successMsg : '图片保存失败');
	}
	// #endif

	// #ifdef H5
	uni.$jasper.showToast('因为H5需要配置白名单,暂不开放');
	// #endif
	uni.hideLoading();
}

export {
	_saveImageToPhotosAlbum
}
