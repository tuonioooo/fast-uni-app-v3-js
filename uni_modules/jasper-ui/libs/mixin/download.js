/**
 * @description: 公共下载文件的混入组件
 */
export default {
	data(){
		return {
			downloadTask: null,
			tempFilePath: '', //下载文件的临时路径
			filename: '', //文件的名称
			downloadSuccess: false,
			downloading: false,
			downLoadPercent: 0,
			downloadedSize: 0,
			packageFileSize: 0,
			downLoadingText: '下载中 ',
		}
	},
	destroyed() {
		this.downloadTask = null //卸载任务
	},
	methods:{
		//下载
		downloadPackage(url, callback) {
			this.downloading = true;
			this.filename = this.getFilename(url);
			//下载文件
			this.downloadTask = uni.downloadFile({
				url,
				success: async (res) => {
					if (res.statusCode == 200) {
						console.log(`下载文件成功=${JSON.stringify(res)}`);
						let newTempFilePath = await uni.$jasper.rename(res.tempFilePath, "/" + this.filename);
						this.tempFilePath = newTempFilePath ?? res.tempFilePath;
						console.log(`下载临时源文件=${res.tempFilePath}, 重命名临时文件=${newTempFilePath}`);
						this.downloadSuccess = true;
					}
				},
				complete: (res) => {
					this.downloading = false;
		
					this.downLoadPercent = 0
					this.downloadedSize = 0
					this.packageFileSize = 0
		
					this.downloadTask = null;
					
					if(res.statusCode == 403){
						
						this.downLoadingText = '下载异常，请稍后重试'
					}
					console.log(`下载文件完成=${JSON.stringify(res)}`);
					callback && callback(res)
				}
			});
		
			this.downloadTask.onProgressUpdate(res => {
				//console.log(res, "--onProgressUpdate--")
				this.downLoadPercent = res.progress;
				this.downloadedSize = (res.totalBytesWritten / Math.pow(1024, 2)).toFixed(2);
				this.packageFileSize = (res.totalBytesExpectedToWrite / Math.pow(1024, 2)).toFixed(2);
			});
		},
		getFilename(url){
			try{
				let md5 = uni.$jasper.md5(url);
				return "share-" + md5 + ".mp4"; //获取文件名称
			}catch(e){
				console.log("getFilename = >", e);
				return null;
			}
		},
		//终止下载任务
		abort(){
			if(this.downloadTask){
				this.downloadTask && this.downloadTask.abort()
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				})
			}
		}
	}
}