<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
  /*每个页面公共css */
  // uv-ui 样式
  @import '@climblee/uv-ui/index.scss';
  // jasper-ui 样式
  @import '@/uni_modules/jasper-ui/index.scss';
</style>