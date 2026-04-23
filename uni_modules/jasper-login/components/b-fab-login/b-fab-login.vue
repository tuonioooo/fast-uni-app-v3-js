<template>
  <view>
    <view class="fab-login-box">
      <view class="item" v-for="(item,index) in servicesList" :key="index"
            @click="item.path?toPage(item.path): login_before(item.id,false)">
        <image class="logo" :src="item.logo" mode="scaleToFill"></image>
        <text class="login-title">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>
<script>
import config from '@/uni_modules/jasper-login/config.js'
import {uncLoginApi} from "@/uni_modules/jasper-login/common/sampleApi";
import {getPhoneInfoByCode} from '@/api';
import weixinMixin from '@/uni_modules/jasper-login/common/weixin-mixin.js';

export default {
  mixins: [weixinMixin],
  data() {
    return {
      platform: uni.getSystemInfoSync().platform,
      servicesList: [{
        "id": "username",
        "text": "账号登录",
        "logo": "/uni_modules/jasper-login/static/login/jasper-fab-login/user.png",
        "path": "/uni_modules/jasper-login/pages/login/login-withpwd"
      },
        {
          "id": "smsCode",
          "text": "短信验证码",
          "logo": "/uni_modules/jasper-login/static/login/jasper-fab-login/sms.png",
          "path": "/uni_modules/jasper-login/pages/login/login-withoutpwd?type=smsCode"
        },
        {
          "id": "weixin",
          "text": "微信登录",
          "logo": "/uni_modules/jasper-login/static/login/jasper-fab-login/weixin.png",
        },
        // #ifndef MP-WEIXIN
        {
          "id": "apple",
          "text": "苹果登录",
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/apple.png",
        },
        {
          "id": "univerify",
          "text": "一键登录",
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/univerify_b0.png",
        },
        {
          "id": "taobao",
          "text": "淘宝登录", //暂未提供该登录方式的接口示例
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/taobao.png",
        },
        {
          "id": "facebook",
          "text": "脸书登录", //暂未提供该登录方式的接口示例
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/facebook.png",
        },
        {
          "id": "alipay",
          "text": "支付宝登录", //暂未提供该登录方式的接口示例
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/alipay.png",
        },
        {
          "id": "qq",
          "text": "QQ登录", //暂未提供该登录方式的接口示例
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/qq.png",
        },
        {
          "id": "google",
          "text": "谷歌登录", //暂未提供该登录方式的接口示例
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/google.png",
        },
        {
          "id": "douyin",
          "text": "抖音登录", //暂未提供该登录方式的接口示例
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/douyin.png",
        },
        {
          "id": "sinaweibo",
          "text": "新浪微博", //暂未提供该登录方式的接口示例
          "logo": "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/sinaweibo.png",
        }
        // #endif
      ],
      univerifyStyle: { //一键登录弹出窗的样式配置参数
        "fullScreen": true, // 是否全屏显示，true表示全屏模式，false表示非全屏模式，默认值为false。
        "backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
        "buttons": { // 自定义登录按钮
          "iconWidth": "45px", // 图标宽度（高度等比例缩放） 默认值：45px
          "list": []
        },
        "closeIcon": { //仅支持 根目录下的static
          "path": "static/images/unverifyClose.png", // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持，默认是X的图标样式
        },
        "otherLoginButton": {
          "visible": true, // 是否显示其他登录按钮，默认值：true
          "textColor": "#656565", // 其他登录按钮文字颜色 默认值：#656565
          "title": "短信验证码登录", // 其他登录方式按钮文字 默认值：“其他登录方式”
        },
        "privacyTerms": {
          "defaultCheckBoxState": false, // 条款勾选框初始状态 默认值： true
          "textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB
          "termsColor": "#5496E3", //  协议文字颜色 默认值： #5496E3
          "prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
          "suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
          "privacyItems": []
        }
      },
    }
  },
  async created() {
    let servicesList = this.servicesList;
    let loginTypes = config.loginTypes;
    let preLogin = await this.supportPreLogin();

    servicesList = servicesList.filter(item => {
      // #ifndef APP
      //非app端去掉apple登录
      if (item.id == 'apple') {
        return false
      }
      // #endif

      // #ifdef APP
      //去掉非ios系统上的apple登录
      if (item.id == 'apple' && uni.getSystemInfoSync().osName != 'ios') {
        return false
      }
      // #endif

      // #ifdef APP
      //判断当前设备是否支持一键登录
      if (item.id == 'univerify' && !preLogin) {
        return false
      }
      // #endif

      return loginTypes.includes(item.id)
    })

    //设置一键登录功能底下的快捷登录按钮
    if (loginTypes.includes('univerify')) {
      this.univerifyStyle.privacyTerms.privacyItems = this.agreements
      servicesList.forEach(({
                              id,
                              logo,
                              path
                            }) => {
        //一键登录功能底下的快捷登录按钮 只设置第三方对接的登录方式如：（qq、微信、微博）等 。
        //短信验证码和一键登录都属于本机的一种方式
        if (id != 'univerify' && id != 'smsCode') {
          this.univerifyStyle.buttons.list.push({
            "iconPath": logo,
            "provider": id,
            path //路径用于点击快捷按钮时判断是跳转页面
          })
        }
      })
    }
    //console.log(servicesList);
    //去掉当前页面对应的登录选项
    this.servicesList = servicesList.filter(item => {
      let path = item.path ? item.path.split('?')[0] : '';
      return path != this.getRoute(1)
    })
  },
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
        title: "用户服务协议"
      },
        {
          url: privacyUrl,
          title: "隐私政策条款"
        }
      ]
    }
  },
  methods: {
    getParentComponent() {
      // #ifndef H5
      return this.$parent;
      // #endif

      // #ifdef H5
      return this.$parent.$parent;
      // #endif
    },
    //获取当前的路由地址
    getRoute(n = 0) {
      //第一页是首页，最后一页是当前页
      let pages = getCurrentPages();
      if (n > pages.length) {
        return ''
      }

      // 兼容ios平台
      //#ifdef APP-PLUS
      if (this.platform === 'ios') {
        let currentWebview = pages[pages.length - n].$getAppWebview()
        currentWebview.setStyle({
          "top": "600" // 显示当前页面窗体
        })
      }
      //#endif

      return '/' + pages[pages.length - n].route
    },
    toPage(path, index = 0) {
      let type = ['navigateTo', 'redirectTo'][index]
      if (this.getRoute(1) === path.split('?')[0] && this.getRoute(1) ===
          '/uni_modules/jasper-login/pages/login/login-withoutpwd') {
        //如果要被打开的页面已经打开，且这个页面是 /uni_modules/jasper-login/pages/login/login-withoutpwd 则把页面类型参数传给它
        let loginType = path.split('?')[1].split('=')[1]
        uni.$emit('login-setLoginType', loginType)
      } else if (this.getRoute(2) === path) { // 如果上一个页面就是，马上要打开的页面，直接返回。防止重复开启
        uni.navigateBack();
      } else if (this.getRoute(1) !== path) { // 如果不是上一个页面或当前页面直接返回
        uni[type]({
          url: path,
          animationType: 'slide-in-left',
          complete(e) {
            console.log(e);
          }
        })
      } else {
        console.log('出乎意料的情况,path：' + path);
      }
    },
    //检查当前环境是否支持一键登录方式
    async supportPreLogin() {
      // #ifdef APP-PLUS
      return new Promise((resolve, reject) => {
        uni.preLogin({
          provider: 'univerify',
          success() {  //预登录成功  支持一键登录
            resolve(true);
          },
          fail(res) {  // 预登录失败 ，不支持或者流量没开或者其它的错误，官网查看：https://uniapp.dcloud.net.cn/univerify.html#%E9%94%99%E8%AF%AF%E7%A0%81
            console.error(res)
            resolve(false);
          }
        })
      })
      // #endif
    },
    async login_before(type, navigateBack = true, options = {}) {
      console.log(`当前登录方式=[${type}]`);

      // 是否有网络
      let _hasNetwork = await uni.$unc.hasNetwork();
      if (!_hasNetwork) {
        return uni.showToast({title: '网络异常，请检查网络连接后重试', icon: 'none'})
      }

      //检查当前环境是否支持这种登录方式
      // #ifdef APP
      let isAppExist = true
      await new Promise((callback) => {
        plus.oauth.getServices(oauthServices => {
          let index = oauthServices.findIndex(e => e.id == type)
          if (index != -1) {
            isAppExist = oauthServices[index].nativeClient
            callback()
          } else {
            //设备不支持此一键登录方式，即将跳转到短信验证码的页面
            this.toPage('/uni_modules/jasper-login/pages/login/login-withoutpwd', 1);
            return;
          }
        }, err => {
          throw new Error('获取服务供应商失败：' + JSON.stringify(err))
        })
      })
      // #endif

      if (
          // #ifdef APP
          !isAppExist
          // #endif

          //非app端使用了，app特有登录方式
          // #ifndef APP
          ["univerify", "apple"].includes(type)
          // #endif

      ) {
        //设备不支持此一键登录方式，即将跳转到短信验证码的页面
        this.toPage('/uni_modules/jasper-login/pages/login/login-withoutpwd', 1);
        return;
      }

      uni.showLoading({
        mask: true
      })

      //一键登录
      if (type === 'univerify') {
        this.univerify();
      }
      // 微信手机号登录
      if (type === 'weixinMobile') {
        return this.login_weixin({
          code: options.code
        }, type)
      }
    },
    univerify() {
      let univerifyManager = uni.getUniverifyManager()
      let clickAnotherButtons = false
      let onButtonsClickFn = async res => {
        console.log('点击了第三方登录，provider：', res, res.provider, this.univerifyStyle.buttons.list);
        clickAnotherButtons = true
        let agree
        //获取一键登录勾选状态
        let checkBoxState = await uni.getCheckBoxState();
        // #ifdef VUE2
        agree = checkBoxState[1].state
        // #endif
        // #ifdef VUE3
        agree = checkBoxState.state
        // #endif
        let {
          path
        } = this.univerifyStyle.buttons.list[res.index]
        if (path) {
          if (this.getRoute(1).includes('login-withoutpwd') && path.includes('login-withoutpwd')) {
            this.getParentComponent().showCurrentWebview()
          }
          this.toPage(path, 1)
          closeUniverify()
        } else {
          if (agree) {
            closeUniverify()
            setTimeout(() => {
              this.login_before(res.provider)
            }, 500)
          } else {
            uni.showToast({
              title: "你未同意隐私政策协议",
              icon: 'none',
              duration: 3000
            });
          }
        }
      }

      function closeUniverify() {
        uni.hideLoading()
        univerifyManager.close()
        // 取消订阅自定义按钮点击事件
        univerifyManager.offButtonsClick(onButtonsClickFn)
      }

      // 订阅自定义按钮点击事件
      univerifyManager.onButtonsClick(onButtonsClickFn)
      // 调用一键登录弹框
      return univerifyManager.login({
        "univerifyStyle": this.univerifyStyle,
        success: (res) => {
          console.log('[一键登录弹框成功]', res);
          //this.login(res.authResult, 'univerify') // **调用云函数 获取手机号 扣费的 要注意**
          //模拟直接返回手机号，这里应该是调用云函数返回手机号
          let phoneNumber = 16270569395
          this.login_After(phoneNumber, 'univerify')
        },
        fail: (err) => {
          uni.hideLoading();
          if (!clickAnotherButtons) {
            //官网错误码：https://uniapp.dcloud.net.cn/univerify.html#%E9%94%99%E8%AF%AF%E7%A0%81
            console.log(err)
            this.toPage('/uni_modules/jasper-login/pages/login/login-withoutpwd', 1)
          }
        },
        complete: e => {
          uni.hideLoading()
          // 取消订阅自定义按钮点击事件
          univerifyManager.offButtonsClick(onButtonsClickFn)

        }
      })
    },
    //联网验证登录  并同步到自己的服务中，去拿token，设置到缓存中
    login(params, type) { //联网验证登录
      //toLowerCase
      let action = 'loginBy' + type.trim().replace(type[0], type[0].toUpperCase())
      console.log('[一键登录获联网验证中...]');
      const uniIdCo = uniCloud.importObject("uni-id-co", {
        customUI: true
      })
      uniIdCo[action](params).then(async (result) => {
        console.log("[一键登录成功]", result);
        //{"code":0,"errCode":0,"errMsg":"","success":true,"phoneNumber":"16270569395"}
        uni.showToast({
          title: '登录成功',
          icon: 'none',
          duration: 2000
        });
        // #ifdef H5
        result.loginType = type
        // #endif
        //将手机号同步到自有后台服务
        await this.login_After(result.phoneNumber, type)
      }).catch(e => {
            uni.showModal({
              content: e.message,
              confirmText: "知道了",
              showCancel: false
            });
      }).finally(e => {
          if (type === 'univerify') {
            uni.closeAuthView()
          }
          uni.hideLoading()
        })
    },
    //微信登录
    // -1.完整的顺序根据code码 -> 获取accessToken -> 获取手机号 -> 根据手机号去后台登录去获取token,用户信息 -> 设置到缓存中
    // -2.后台通过weixin-java-sdk 直接可以通过code 获取手机号，后台接口自动关了accessToken
    async login_weixin(params, type){
      console.log(`当前登录方式login_weixin=[${type}]`);
      if (!params?.code) {
        return
      }
      let phoneNumber = '';
      try {
        const res = await getPhoneInfoByCode({
          appid: config.appid.weixin.miniapp,
          code: params.code
        })
        if(res.code === 200){
          //获取手机号成功
          phoneNumber = res.data.phoneNumber;
        }else{
          console.error('Error fetching phone number:', res);
          return ;
        }
      } catch (error) {
        console.error('Error fetching phone number:', error);
        uni.showToast({
          icon: 'none',
          title: '获取手机号失败'
        });
        return;
      }
      //根据手机号去后台登录去获取token,用户信息
      this.login_After(phoneNumber, type);
    },

    //获取手机号后，同步到自己的服务中，并获取token和用户信息，设置到缓存中
    async login_After(phoneNumber, type) {
      if (!phoneNumber) {
        return
      }

      //将手机号同步到后台服务一键登录
      let verifyRes = await uncLoginApi({
        phoneNumber,
        source: uni.getSystemInfoSync().platform,
        loginType: type
      })

      // 触发事件，将登录结果发送到登录首页统一处理
      uni.$emit('login-api-result-event', {
        res: verifyRes,
        phoneNumber,
        callback: () => {
          if (type === 'univerify') {
            uni.closeAuthView() //关闭授权页
          }
          uni.hideLoading()
        }
      });
    }
  }
}
</script>

<style lang="scss">
/* #ifndef APP-NVUE */
.fab-login-box,
.item {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
}

/* #endif */

.fab-login-box {
  flex-direction: row;
  flex-wrap: wrap;
  width: 750rpx;
  justify-content: space-around;
  position: fixed;
  left: 0;
}

.item {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  cursor: pointer;
}

/* #ifndef APP-NVUE */
@media screen and (min-width: 690px) {
  .fab-login-box {
    max-width: 500px;
    margin-left: calc(50% - 250px);
  }

  .item {
    height: 160rpx;
  }
}

@media screen and (max-width: 690px) {
  .fab-login-box {
    bottom: 80rpx;
  }
}

/* #endif */

.logo {
  width: 120rpx;
  height: 120rpx;
  max-width: 60px;
  max-height: 60px;
  border-radius: 100%;
  //border: solid 1px #F6F6F6;
  border: solid 1px #e1e1e1;

}

.login-title {
  text-align: center;
  margin-top: 6px;
  color: #999;
  font-size: 10px;
  width: 70px;
}
</style>
