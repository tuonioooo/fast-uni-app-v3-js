/**
 * 图像转换工具，可用于图像和base64的转换
 * @see https://ext.dcloud.net.cn/plugin?id=123
 * @param path
 * @returns {*|string|string}
 */
const getLocalFilePath = (path) => {
  if (
    path.indexOf('_www') === 0 ||
    path.indexOf('_doc') === 0 ||
    path.indexOf('_documents') === 0 ||
    path.indexOf('_downloads') === 0
  ) return path

  if (path.indexOf('/storage/emulated/0/') === 0) return path
	
  if (path.indexOf('/storage/sdcard0/') === 0) return path

  if (path.indexOf('/var/mobile/') === 0) return path

  if (path.indexOf('file://') === 0) return path

  if (path.indexOf('/') === 0) {
		// ios 无法获取本地路径
    let localFilePath = plus.os.name === 'iOS' ? path : plus.io.convertLocalFileSystemURL(path)
    if (localFilePath !== path) {
      return localFilePath
    } else {
      path = path.substring(1)
    }
  }
	
  return '_www/' + path
}

const pathToBase64 = (path) => {
	return new Promise((resolve, reject) => {
		if (typeof window === 'object' && 'document' in window) {
			if (typeof FileReader === 'function') {
				let xhr = new XMLHttpRequest()
				xhr.open('GET', path, true)
				xhr.responseType = 'blob'
				xhr.onload = function() {
					if (this.status === 200) {
						let fileReader = new FileReader()
						fileReader.onload = function(e) {
							resolve(e.target.result)
						}
						fileReader.onerror = reject
						fileReader.readAsDataURL(this.response)
					}
				}
				xhr.onerror = reject
				xhr.send()
				return
			}
			let canvas = document.createElement('canvas')
			let c2x = canvas.getContext('2d')
			let img = new Image
			img.onload = function() {
				canvas.width = img.width
				canvas.height = img.height
				c2x.drawImage(img, 0, 0)
				resolve(canvas.toDataURL())
				canvas.height = canvas.width = 0
			}
			img.onerror = reject
			img.src = path
			return
		}
		
		if (typeof plus === 'object') {
			let tempPath = getLocalFilePath(path)
			plus.io.resolveLocalFileSystemURL(tempPath, (entry) => {
				entry.file((file) => {
					let fileReader = new plus.io.FileReader()
					fileReader.onload = function(data) {
						resolve(data.target.result)
					}
					fileReader.onerror = function(error) {
						console.log(error)
						reject(error)
					}
					fileReader.readAsDataURL(file)
				}, (error) => {
					reject(error)
				})
			}, (error) => {
				reject(error)
			})
			return
		}
		
		if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
			wx.getFileSystemManager().readFile({
				filePath: path,
				encoding: 'base64',
				success: (res) => {
					resolve('data:image/png;base64,' + res.data)
				},
				fail: (error) => {
					reject(error)
				}
			})
			return
		}
		reject(new Error('not support'))
	})
}


/**
 * 路径转base64
 * @param {Object} string
 */
function pathToBase64V2(path) {
	if (/^data:/.test(path)) return path
	return new Promise((resolve, reject) => {
		// #ifdef H5
		let image = new Image();
		image.setAttribute("crossOrigin", 'Anonymous');
		image.onload = function() {
			let canvas = document.createElement('canvas');
			canvas.width = this.naturalWidth;
			canvas.height = this.naturalHeight;
			canvas.getContext('2d').drawImage(image, 0, 0);
			let result = canvas.toDataURL('image/png')
			resolve(result);
			canvas.height = canvas.width = 0
		}
		image.src = path + '?v=' + Math.random()
		image.onerror = (error) => {
			reject(error);
		};
		// #endif

		// #ifdef MP
		if (uni.canIUse('getFileSystemManager')) {
			uni.getFileSystemManager().readFile({
				filePath: path,
				encoding: 'base64',
				success: (res) => {
					resolve('data:image/png;base64,' + res.data)
				},
				fail: (error) => {
					console.error({error, path})
					reject(error)
				}
			})
		}
		// #endif

		// #ifdef APP-PLUS
		plus.io.resolveLocalFileSystemURL(getLocalFilePath(path), (entry) => {
			entry.file((file) => {
				const fileReader = new plus.io.FileReader()
				fileReader.onload = (data) => {
					resolve(data.target.result)
				}
				fileReader.onerror = (error) => {
					reject(error)
				}
				fileReader.readAsDataURL(file)
			}, reject)
		}, reject)
		// #endif
	})
}


const base64ToPath= (base64)=> {
	const [, format] = /^data:image\/(\w+);base64,/.exec(base64) || [];

	return new Promise((resolve, reject) => {
		// #ifdef MP
		const fs = uni.getFileSystemManager()
		//自定义文件名
		if (!format) {
			reject(new Error('ERROR_BASE64SRC_PARSE'))
		}
		const time = new Date().getTime();
		let pre = prefix()
		const filePath = `${pre.env.USER_DATA_PATH}/${time}.${format}`
		fs.writeFile({
			filePath,
			data: base64.split(',')[1],
			encoding: 'base64',
			success() {
				resolve(filePath)
			},
			fail(err) {
				console.error(err)
				reject(err)
			}
		})
		// #endif

		// #ifdef H5
		// mime类型
		let mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
		//base64 解码
		let byteString = atob(base64.split(',')[1]);
		//创建缓冲数组
		let arrayBuffer = new ArrayBuffer(byteString.length);
		//创建视图
		let intArray = new Uint8Array(arrayBuffer);
		for (let i = 0; i < byteString.length; i++) {
			intArray[i] = byteString.charCodeAt(i);
		}
		resolve(URL.createObjectURL(new Blob([intArray], {
			type: mimeString
		})))
		// #endif

		// #ifdef APP-PLUS
		const bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
		bitmap.loadBase64Data(base64, () => {
			if (!format) {
				reject(new Error('ERROR_BASE64SRC_PARSE'))
			}
			const time = new Date().getTime();
			const filePath = `_doc/uniapp_temp/${time}.${format}`
			bitmap.save(filePath, {},
				() => {
					bitmap.clear()
					resolve(filePath)
				},
				(error) => {
					bitmap.clear()
					reject(error)
				})
		}, (error) => {
			bitmap.clear()
			reject(error)
		})
		// #endif
	})
}

const isBase64 = (path) => /^data:image\/(\w+);base64/.test(path);



export {
	pathToBase64,
	pathToBase64V2,
	base64ToPath,
	isBase64
}