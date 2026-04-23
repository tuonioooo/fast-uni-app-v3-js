<template>
	<view :class="pageClass">
		<!-- 导航 -->
    <uv-navbar autoBack safeAreaInsetTop />
		<!-- 内容 -->
		<view class="jasper-mlr45" :style="`margin-top: ${windowContentTop}px`">
			<!-- 标题语 -->
			<jasper-title type="h1" title="请输入验证码"></jasper-title>
			<jasper-title type="h3" :title="subTitle"></jasper-title>
			<!-- 验证码输入框 -->
			<view class="jasper-mt15">
				<uv-code-input v-model="code" mode="line" maxlength="4" size="48" :focus="true" space="20" hairline borderColor="#606266"></uv-code-input>
			</view>
			<!-- 短信提示语 -->
			<view class="jasper-mt30">
				<text class="error jasper-fz16">{{ error ? '验证码错误，请重新输入':''}}</text>
				<text class="jasper-fz16" style="color: blue;">{{ mockCode ? `演示环境验证码：${mockCode}`:''}}</text>
				<view class="jasper-mt15" :class="{'smsTipsClass' : disabled}" @tap="getSmsCode">
					<text class="jasper-fz16">{{ smsTips }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 短信验证登录组件
	 */
  import useSystemInfo from '@/uni_modules/jasper-ui/libs/mixin/useSystemInfo.js'
  import {smsCheckApi, uncLoginApi} from "@/uni_modules/jasper-login/common/sampleApi";
	export default {
		name: "login-smscode",
    mixins: [useSystemInfo],
		data() {
			return {
				phone: '', //手机号
				code: '', //短信验证码
				error: '', //错误信息
				disabled: false,
				smsTips: '',
				mockCode: '', //模拟验证码接受字段，您正式环境不需要
			}
		},
		onLoad(options) {
			this.phone = options.phone; 
			//监听短信发送事件
			uni.$on('login-smscode-event', (data) => {
				this.disabled = data.disabled;
				this.smsTips = data.smsTips;
				if(data.mockCode){
					this.mockCode = data.mockCode;
				}
			})
		},
		onUnload() {
			uni.$off('login-smscode-event')
		},
		computed: {
			pageClass(){
				// #ifdef APP-VUE || H5
				return "jasper-abs jasper-plr15 jasper-w100p jasper-h100p whiteBg";
				// #endif
				
				// #ifdef APP-NVUE
				return "jasper-plr15 page whiteBg"
				// #endif
			},
			rightPhone() {
				return uni.$jasper.isMobile(this.phone);
			},
			customPhone() {
				let customPhone = "";
				for (let i = 0; i < this.phone.length; i++) {
					if (i === 3 || i === 4 || i === 5 || i === 6) {
						customPhone = customPhone.concat("*");
					} else {
						customPhone = customPhone.concat(this.phone.charAt(i));
					}
				}
				return customPhone;
			},
			subTitle() {
				return `已发送验证码到 ${this.customPhone}`;
			},
		},
		watch: {
			code(code) {
				if (/^\d{4}$/.test(code)) {
					//调用后端接口 校验验证码
					this.smsCheck();
				}
				if (code) {
					this.error = '';
				}
			},
		},
		methods: {
			//清空信息
			clear(){
				this.code = '', // 短信验证码
				this.error = ''; //错误信息
			},
			//获取验证码
			getSmsCode() {
				if(this.disabled) return
				//触发发送验证码事件
				uni.$emit('login-get-smscode-event')
			},
			//关闭抽屉界面
			back(){
				uni.navigateBack();
				this.clear();
			},
			//校验验证码
			async smsCheck() {
				const res = await smsCheckApi({
					phoneNumber : this.phone,
					verificationCode : this.code
				});
				if(uni.$constants.RESULT_SUCCESS_CODE === res.code) {
					uni.$jasper.toast(res.msg)
					//登录
					this.login();
				}else{
					uni.$jasper.toast(res.msg);
					//清除验证码
					this.code = '';
					this.error= res.msg;
				}
			},
			// 异步短信登录
			async login () {
				// 前台表单验证
				// 短信登陆
				const { phone, code } = this;
				if(!this.rightPhone) {
					uni.$jasper.showToast('手机号不正确');
					return ;
				} else if(!/^\d{4}$/.test(code)) {
					// 短信验证码必须是4位数字
					uni.$jasper.showToast('短信验证码必须是4位数字');
					return ;
				}
				// 短信登录
				let res = await uncLoginApi({
					phoneNumber : phone,
					verificationCode : code,
					loginType: 'sms'
				});
				// 触发事件，将登录结果发送统一处理
				uni.$emit('login-api-result-event', { res, phoneNumber: phone, callback: this.back});
			},
		}
	}
</script>
<style lang="scss">
	.error {
		color: #ff846c;
	}
	.smsTipsClass{
		color: #c5c5c5;
	}
</style>
