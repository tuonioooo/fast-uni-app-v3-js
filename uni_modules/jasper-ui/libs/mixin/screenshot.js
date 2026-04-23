/**
 * @description 屏幕截屏功能
 */
export default {
	data(){
		return {
			ws: null
		}
	},
	created() {
		// #ifdef H5
		if (window.plus) { //3:手机端APP
			this.onPlusReady()
		} else { // 兼容老版本的plusready事件
			document.addEventListener('plusready', () => this.onPlusReady(), false)
		}
		// #endif
		
		

		// #ifdef APP-PLUS
		let pages = getCurrentPages();  
		let page = pages[pages.length - 1];  
		this.ws = page.$getAppWebview(); 
		// #endif 

	},
	
	methods: {
		onPlusReady() {
			this.ws = plus.webview.currentWebview(); //H5 模式下 获取当前页的webView对象
		},
		//截屏函数 https://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewDrawOptions
		screenshot() {
			return new Promise((resolve, reject) => {
				console.log(this.ws)
				if(!this.ws) reject('base-screenshot ===> webView对象初始化失败')
				let bitmap = new plus.nativeObj.Bitmap('draw_screen');
				this.ws.draw(bitmap,
					() => {
						console.log('截屏绘制图片成功')
						bitmap.save("_doc/draw_screen.png", {
							overwrite: true //是否覆盖原有的内容
						}, res => {  
							console.log('保存截屏绘制图片成功', res)
							resolve(res.target)
							bitmap.clear(); // 最后清除Bitmap对象  
						}, error => {
							console.log('保存截屏绘制图片失败', error)
							reject('保存截屏绘制图片失败,请稍后重试')
							bitmap.clear(); // 最后清除Bitmap对象  
						});
						
					},
					(error) => {
						console.log('截屏绘制图片失败', error)
						reject('截屏绘制图片失败,请稍后重试')
					}, 
					{	
						clip: {top:'0px',left:'0px',width:'100%',height:'100%'}, //设置截屏区域
						check: true, // 设置为检测白屏
					}
					);
			})
		}
	}
}
