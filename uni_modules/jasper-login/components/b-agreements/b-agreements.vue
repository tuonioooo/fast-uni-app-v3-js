<template>
	<view class="root" v-if="agreements.length">
		<template v-if="needAgreements">
			<checkbox-group @change="setAgree">
				<label class="checkbox-box">
					<checkbox :checked="isAgree" style="transform: scale(0.7); margin-right: -2px;" />
					<text class="text">同意</text>
				</label>
			</checkbox-group>
			<view class="content">
				<view class="item" v-for="(agreement,index) in agreements" :key="index">
					<text class="agreement text" space="nbsp" @click="navigateTo(agreement)" decode>{{agreement.title}}</text>
					<text class="text" v-if="hasAnd(agreements,index)" space="nbsp" decode>和</text>
				</view>
			</view>
		</template>
		<!-- 弹出式 -->
		<uni-popup v-if="needAgreements||needPopupAgreements" ref="popupAgreement" type="center">
			<uni-popup-dialog confirmText="同意" @confirm="popupConfirm">
				<view class="content">
					<text class="text">请先同意</text>
            <view class="item" v-for="(agreement,index) in agreements" :key="index">
              <text class="agreement text" space="nbsp" @click="navigateTo(agreement)" decode>{{agreement.title}}</text>
              <text class="text" v-if="hasAnd(agreements,index)" decode>和</text>
					  </view>
				</view>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import config from '@/uni_modules/jasper-login/config.js'
	let retryFun = () => console.log('为定义')
	/**
	 * @description 用户服务协议和隐私政策条款组件, 1.页面勾选; 2.忘记勾选时,弹窗提示
	 * @property {String,Boolean} scope = [register|login]
   * 使用场景：
   * @example 登录、注册 如：微信登录、苹果登录、短信验证码登录、其他第三方登录都需要勾选协议
	 */
	export default {
		name: "jasper-agreements",
		computed: {
			agreements() {
				if (!config.agreements) {
					return []
				}
				let {
					serviceUrl,
					privacyUrl
				} = config.agreements
				return [{
						url: serviceUrl,
						title: "  用户服务协议  "
					},
					{
						url: privacyUrl,
						title: "  隐私政策条款  "
					}
				]
			}
		},
		props: {
			scope: {
				type: String,
				default () {
					return 'register'
				}
			},
		},
		created() {
			this.needAgreements = (config.agreements.scope || []).includes(this.scope)
		},
		data() {
			return {
				isAgree: false,  //勾选框选中的状态
				needAgreements: true, //是否是页面协议
				needPopupAgreements: false  //是否是弹窗协议
			};
		},
		methods: {
			popupConfirm() {
				this.isAgree = true
        //判断函数是否存在
        if(uni.$jasper.isFn(retryFun)){
          retryFun()
        }
			},
			popup(Fun) {
				this.needPopupAgreements = true
				this.$nextTick(() => {
					if (uni.$jasper.isFn(Fun)) {
						retryFun = Fun
					}
					this.$refs.popupAgreement.open()
				})
			},
			navigateTo({
				url,
				title
			}) {
				uni.navigateTo({
					//url: '/uni_modules/uni-id-pages/pages/common/webview/webview?url=' + url + '&title=' + title,
					url: url + '&title=' + title,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			hasAnd(agreements, index) {
				return agreements.length - 1 > index
			},
			setAgree(e) {
				this.isAgree = !this.isAgree
				this.$emit('setAgree', this.isAgree)
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	/* #endif */
	.root {
		flex-direction: row;
		align-items: center;
		font-size: 13px;
		color: #8a8f8b;
	}

	.checkbox-box,
	.uni-label-pointer {
		align-items: center;
		display: flex;
		flex-direction: row;
	}

	.item {
		flex-direction: row;
	}

	.text {
		/* #ifdef APP-NVUE */
		font-size: 13px;
		/* #endif */
		line-height: 26px;
	}

	.agreement {
		color: #04498c;
		cursor: pointer;
	}

	.checkbox-box :deep(.uni-checkbox-input) {
		border-radius: 100%;
		border-color: #8a8f8b !important;
	}

	.checkbox-box :deep(.uni-checkbox-input.uni-checkbox-input-checked) {
		border-color: #8a8f8b !important;
		color: #000 !important;
		background-color: $jasper-primary;
	}

	.content {
		flex-wrap: wrap;
		flex-direction: row;
	}

	.root :deep(.uni-popup__error) {
		color: #333333;
	}
</style>
