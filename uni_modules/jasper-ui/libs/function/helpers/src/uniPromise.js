/**
 * @description 获取图片信息
 * @param {*} src 图片地址（本地路径/网络路径）
 * @param (String) savePath 自定义图片在本地设备临时路径
 */
function getImageInfo(src, savePath = '') {
    return new Promise((resolve, reject) => {
        if (savePath) {
            //savePath 不为空时 用于解决 同一张命名相同图片 替换原有图片的问题
            // eg: `_doc/uniapp_temp_${Date.now()}_large/download/` 用于区分默认的临时路径（`_doc/uniapp_temp_${Date.now()}/download/`）
            // 示例1：this.src = await this.getImageSrc(this.largeSrc, `_doc/uniapp_temp_${Date.now()}_large/download/`);
            plus.io.getImageInfo({
                src,
                savePath, //存储的本地相对路径位置
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    console.error(err)
                    reject(err)
                }
            })
        } else {
            // savePath 为空时 则使用默认的临时路径   uni官方默认的 `_doc/uniapp_temp_${Date.now()}/download/` 临时路径
            uni.getImageInfo({
                src,
                success: (res) => {
                    console.log(res)
                    resolve(res)
                },
                fail: (e) => {
                    console.error(e)
                    reject(e)
                }
            });
        }
    })
}

/**
 * @description 保存文件
 * @param {*} tempFilePath 需要保存的文件的临时路径
 */
function saveFile(tempFilePath) {
    return new Promise((resolve, reject) => {
        uni.saveFile({
            tempFilePath,
            success: (res) => {
                resolve(res.savedFilePath);
            },
            fail: (e) => {
                reject(e);
            }
        })
    });
}


/**
 * @description 删除本地存储的文件。
 * @param {Object} filePath  需要删除的文件路径
 */
function removeSavedFile(filePath) {
    return new Promise((resolve, reject) => {
        uni.removeSavedFile({
            filePath,
            success: () => {
                resolve(true);
            },
            fail: (error) => {
                reject(false);
            }
        })
    });
}

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        uni.downloadFile({
            url,
            success: (res) => {
                console.log(res);
                resolve(res)
            },
            fail: (e) => {
                console.error(e)
                reject(e)
            }
        });

    })
}

function saveImageToPhotosAlbum(filePath) {
    return new Promise((resolve, reject) => {
        uni.saveImageToPhotosAlbum({
            filePath,
            success: (res) => {
                console.log(res);
                resolve(res)
            },
            fail: (e) => {
                console.log(e);
                reject(e)
            }
        });
    })
}

function saveVideoToPhotosAlbum(filePath) {
    return new Promise((resolve, reject) => {
        uni.saveVideoToPhotosAlbum({
            filePath,
            success: (res) => {
                console.log(res);
                resolve(res)
            },
            fail: (e) => {
                console.log(e);
                reject(e)
            }
        });
    })
}

function getNetworkType() {
    return new Promise((resolve, reject) => {
        uni.getNetworkType({
            success: (res) => resolve(res),
            fail: (e) => reject(e)
        })
    });
}

/**
 * convertLocalFileSystemURL: 将本地URL路径转换成平台（设备）绝对路径
 * convertAbsoluteFileSystem: 将平台（设备）绝对路径转换成本地URL路径
 * @param {Object} filePath  本地URL、平台绝对路径都识别、相对路径（_www/xxx，_doc/xxx，_downloads/xxx）
 */
function isFileExist(filePath) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(filePath, function (entry) {
            // 可通过entry.file 获取文件只读属性，可以用json解析属性
            //console.log(entry, "--------------");
            let platform = uni.getSystemInfoSync().platform;
            if (platform == 'ios' && entry.fullPath == '') {
                console.log("resolve file url failed: " + e.message);
                resolve(false);
            }
            entry.file(function (file) {
                //console.log("getFile:" + JSON.stringify(file));
                console.log("文件已存在");
                resolve(true)
            });
        }, function (e) {
            console.log("resolve file url failed: " + e.message);
            resolve(false);
        });
    })
    // #endif

    // #ifdef H5
    uni.showModal({
        showCancel: 'false',
        content: 'H5不支持 plus api'
    })
    // #endif
}

/**
 * 重命名文件
 * https://www.html5plus.org/doc/zh_cn/io.html#plus.io.FileEntry
 * https://www.html5plus.org/doc/zh_cn/io.html#plus.io.DirectoryEntry
 * @param {Object} filePath     本地URL、平台绝对路径都识别、相对路径（_www/xxx，_doc/xxx，_downloads/xxx）
 * @param {Object} filename  新的文件名称
 */
function rename(filePath, filename) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(filePath, function (entry) { //获取目录或文件对象
            // 可通过entry.file 获取文件只读属性，可以用json解析属性
            // entry.file( function(file){
            // 	console.log("getFile:" + JSON.stringify(file));
            // 	console.log("entry.fullPath:" + JSON.stringify(entry));
            // });
            entry.getParent( //获取目录
                function (de) {
                    entry.moveTo(//移动目录
                        de, //要移动到的目标目录
                        filename,//移动后的目录名称或文件，默认为原始目录名称  ps：官方文档书写错误，如果filename是文件的话，拼接目录，即可实现文件的重命名
                        function (newfile) {
                            console.log(`重命名文件=${newfile.fullPath}, convertAbsoluteFileSystem=${plus.io.convertAbsoluteFileSystem(newfile.fullPath)}`)
                            resolve(plus.io.convertAbsoluteFileSystem(newfile.fullPath));
                        }
                    )
                }
            )
        }, function (e) {
            console.error("resolve file url failed: " + e.message);
            resolve('');
        });
    })
    // #endif

    // #ifdef H5
    uni.showModal({
        showCancel: 'false',
        content: 'H5不支持 plus api'
    })
    // #endif
}


/**
 * @description 获取文件md5的文件摘要
 * @param {*} filePath 本地文件路径
 * @param {*} digestAlgorithm 算法类型，可取值 md5、sha1 默认md5
 * @example let res = await uni.$miliqk.getFileMd5(tempFilePath);  或者 await this.getFileMd5().then((res) => { //todo })
 */
function getFileMd5(filePath, digestAlgorithm = 'md5') {
    return new Promise((resolve, reject) => {
        uni.getFileInfo({
            filePath,
            digestAlgorithm,
            success: ({errMsg, size, digest}) => {
                resolve({errMsg, size, digest});
            },
            fail: (error) => {
                reject(error);
            },
            complete: () => {
                //
            },
        })
    })
}

function getSystemInfoSync() {
    // #ifdef APP-PLUS || H5
    return uni.getSystemInfoSync();
    // #endif

    // #ifdef MP-WEIXIN
    return uni.getWindowInfo();
    // #endif
}


export {
    removeSavedFile,
    saveFile,
    getImageInfo,
    downloadFile,
    saveImageToPhotosAlbum,
    saveVideoToPhotosAlbum,
    getNetworkType,
    isFileExist,
    rename,
    getFileMd5,
    getSystemInfoSync
}