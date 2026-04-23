<!-- 免密登录页 -->
<template>
  <view class="uni-content">
    <!-- 导航 -->
    <uv-navbar autoBack safeAreaInsetTop />
    <view class="login-logo">
      <image :src="logo"></image>
    </view>
    <!-- 顶部文字 -->
    <text class="title" :style="`margin-top: ${windowContentTop}px`">请选择登录方式</text>
    <!-- 快捷登录框 当url带参数时有效 -->
    <template v-if="['apple','weixin', 'weixinMobile'].includes(type)">
      <text class="tip">将根据第三方账号服务平台的授权范围获取你的信息</text>
      <view class="quickLogin">
        <image v-if="type !== 'weixinMobile'" @click="quickLogin" :src="imgSrc" mode="widthFix"
               class="quickLoginBtn"></image>
        <button v-if="needAgreements && agree && type === 'weixinMobile'" type="primary" open-type="getPhoneNumber" @getphonenumber="quickLogin"
                class="uni-btn">微信授权手机号登录</button>
        <button v-if="needAgreements && !agree" type="primary" @click="$refs.agreements.popup"
                class="uni-btn">微信授权手机号登录</button>
        <b-agreements scope="register" ref="agreements"></b-agreements>
      </view>
    </template>
    <template v-else>
      <text class="tip">未注册的账号验证通过后将自动注册</text>
      <view>
        <!--
          注意:
          1.外层的view 不能使用flex:1 否则uni-easyinput内部的元素的border 在nvue页面上后自动适应 外层宽高
          2.placeholderStyle="font-size: 16px" 要写成 placeholderStyle="fontSize: 16px" 才会生效 这是个问题
          -->
        <uni-easyinput
            v-model="phone"
            :focus="focus"
            :useKeyBoardListener="true"
            type="tel"
            placeholder="请输入手机号"
            maxlength="13"
            :inputBorder="false"
            primaryColor="#c0c4cc"
            placeholderStyle="fontSize: 16px;"
            @clear=" disabled = true "
        ></uni-easyinput>
        <uv-line height="4px" color="#000" :hairline="false"></uv-line>
        <!-- 获取验证码  -->
        <view class="jasper-mt20">
          <uv-code
              ref="bCodeRef"
              @change="onChangeTips"
              seconds="10"
              change-text="X秒后重新获取"
              endText="重新获取验证码"
              @start="start"
              @end="end"
          ></uv-code>
          <button
              :style="btnStyle" class="jasper-rds20 jasper-mb10"
              :disabled="disabled"
              :plain="disabled"
              @tap.stop="getCode">
            <!-- #ifdef APP-NVUE -->
            <text class="uni-button-nvue-text" :style="btnTextStyle">{{ showSmsText }}</text>
            <!-- #endif -->
            <!-- #ifndef APP-NVUE -->
            {{ showSmsText }}
            <!-- #endif -->
          </button>
          <!-- 引入协议组件 -->
          <b-agreements scope="register" ref="agreements"></b-agreements>
        </view>
      </view>
    </template>
    <!-- 固定定位的快捷登录按钮 -->
    <b-fab-login ref="uniFabLogin"></b-fab-login>
  </view>
</template>

<script>
import {sendSmsApi} from "@/uni_modules/jasper-login/common/sampleApi";

let currentWebview; //当前窗口对象
import config from '@/uni_modules/jasper-login/config.js'
import weixinMixin from '@/uni_modules/jasper-login/common/weixin-mixin.js';
import agreementsMixin from '@/uni_modules/jasper-login/common/login-agreements-mixin.js';
import useSystemInfo from "@/uni_modules/jasper-ui/libs/mixin/useSystemInfo";
export default {
  mixins: [agreementsMixin, useSystemInfo, weixinMixin],
  data() {
    return {
      type: "", //快捷登录方式
      phone: "", //手机号码
      focusPhone: false,
      logo: "/static/logo.png",

      smsTips: '', // 短信倒计时提示信息
      openDrawer: false, //抽屉打开状态  true：打开 false：未打开
      disabled: true,	   //验证码按钮只读状态
      sending: false,
      focus: false, //聚焦手机号输入框
      accessToken: '',
    }
  },
  computed: {
    async loginTypes() { //读取配置的登录优先级
      return config.loginTypes
    },
    isPhone() { //手机号码校验正则
      return /^1\d{10}$/.test(this.phone);
    },
    imgSrc() { //捷登录按钮大图
      return this.type === 'weixin' ? '/uni_modules/jasper-login/static/login/weixin.png' :
          '/uni_modules/jasper-login/static/app-plus/apple.png'
    },
    pageClass(){
      // #ifdef APP-VUE || H5
      return "jasper-abs jasper-plr15 jasper-w100p jasper-h100p whiteBg";
      // #endif

      // #ifdef APP-NVUE
      return "jasper-plr15 page whiteBg"
      // #endif
    },
    themeColor(){
      return uni.$unc.theme['$jasper-primary'];
    },
    themeInverseColor(){
      return uni.$unc.theme['$jasper-primary-inverse'];
    },
    btnStyle(){
      return this.disabled ? {
            color: '#bbbbbb',
            backgroundColor: '#f5f5f5',
            border: 0,
          } :
          {
            backgroundColor: this.themeColor,
            border: 0,
            color: this.themeInverseColor
          }
    },
    btnTextStyle(){
      return this.disabled ?
          {
            color: '#bbbbbb'
          } :
          {
            color: this.themeInverseColor
          }
    },
    showSmsText(){
      return this.smsTips && this.sending ? this.smsTips : '获取验证码';
    },
    checkPhone() {
      if(!uni.$unc.isMobile(uni.$unc.trim(this.phone, 'all'))){
        // 显示警告提示
        uni.$unc.showToast('请输入正确的手机号');
        return false;
      } else {
        return true;
      }
    }
  },
  async onLoad(e) {
    //监听验证码事件
    uni.$on('login-get-smscode-event', ()=> this.getCode())
    //监听登录类型事件
    uni.$on('login-setLoginType', type => {
      this.type = type
    })
    //监听登录接口结果事件（一键登录、短信登录、等其他登录方式）
    uni.$on('login-api-result-event', (res)=> this.handleLoginApiRes(res));

    //获取通过url传递的参数type设置当前登录方式，如果没传递直接默认以配置的登录，默认方式是“univerify” 一键登录
    let type = e.type || config.loginTypes[0]
    this.type = type
    //console.log("this.type: -----------",this.type);
    if (type !== 'univerify') {
      this.focus = true
    }
    this.$nextTick(() => {
      //关闭重复显示的登录快捷方式
      if (['weixin', 'apple'].includes(type)) {
        this.$refs.uniFabLogin.servicesList = this.$refs.uniFabLogin.servicesList.filter(item =>
            item.id != type)
      }
    })
  },
  onShow() {
    // #ifdef H5
    document.onkeydown = event => {
      var e = event || window.event;
      if (e && e.keyCode == 13) { //回车键的键值为13
        this.toSmsPage()
      }
    };
    // #endif
  },
  onUnload() {
    uni.$off('uni-id-pages-setLoginType')
  },
  async onReady() {
    // 是否优先启动一键登录。即：页面一加载就启动一键登录
    //#ifdef APP-PLUS

    // 是否有网络
    let _hasNetwork = await uni.$unc.hasNetwork();
    if(!_hasNetwork) return

    if (this.type == "univerify") {
      const pages = getCurrentPages();
      currentWebview = pages[pages.length - 1].$getAppWebview();
      currentWebview.setStyle({
        "top": "2000px" // 隐藏当前页面窗体
      })
      this.type == this.loginTypes[1]
      // console.log('开始一键登录');
      this.$refs.uniFabLogin.login_before('univerify')
    }
    //#endif
  },
  watch:{
    //输入电话号码，自动按3-4-4分割
    phone(value){
      this.phone = value ? value.replace(/\D/g,'').replace(/^/,'$& ').replace(/....(?!$)/g,'$& ') : ''
      this.phone = this.phone.trim();
      this.disabled = false;
      this.emitSmsEvent();
    }
  },
  methods: {
    onKeyEvent(data){
      //console.log(data, "---onKeyEvent---");
    },
    unLoad(){
      uni.$off('login-setLoginType')
      uni.$off('login-get-smscode-event')
      uni.$off('login-api-result-event')
      uni.hideLoading();
    },
    showCurrentWebview(){
      // 恢复当前页面窗体的显示 一键登录，默认不显示当前窗口
      currentWebview.setStyle({
        "top": 0
      })
    },

    async quickLogin(e) {
      let options = {}
      if (this.type === 'weixinMobile') {
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
          // 登陆成功后获取code码
          options.code = e.detail.code
        } else if (e.detail.errno === 1400001) {
          console.error('该功能使用次数已达当前小程序上限，暂时无法使用');
          uni.showToast({
            icon: 'none',
            title: '获取手机号次数已达当前小程序上限'
          });
        } else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
          console.error('您已拒绝登录');
          uni.showToast({
            icon: 'none',
            title: '您已拒绝登录'
          });
        } else {
          uni.showToast({
            icon: 'none',
            title: '获取手机号失败'
          });
          console.error('e', e);
        }
      }
      if (this.type === 'weixinMobile' && !e.detail?.code) return

      this.$refs.uniFabLogin.login_before(this.type, true, options)
    },
    //跳转到验证码的页面
    toSmsPage(phoneNumber) {
      if(!this.checkPhone) return;
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      if(page.route === 'uni_modules/jasper-login/pages/login/login-smscode') return //当前页面不需要跳转页面
      uni.navigateTo({
        url: `/uni_modules/jasper-login/pages/login/login-smscode?phone=${phoneNumber}`, // 携带定手机号跳转验证码页面
        success: res => {},
        fail: () => {},
        complete: () => {}
      });
    },
    //动态显示短信的提示信息
    onChangeTips(text){
      this.smsTips = text;
      this.emitSmsEvent();
    },
    //验证码计时器开始
    start(){
      this.disabled = true;
      this.sending = true;
      this.emitSmsEvent();
    },
    //验证码计时器结束
    end(){
      this.disabled = !this.phone;
      this.sending = false;
      this.emitSmsEvent();
    },
    //获取验证码
    async getCode(again) {
      try{
        // 是否有网络
        let _hasNetwork = await uni.$unc.hasNetwork();
        if(!_hasNetwork){
          uni.showToast({title: '网络异常，请检查网络连接后重试', icon: 'none'})
          return;
        }
        if (this.$refs.bCodeRef.canGetCode) {
          //校验手机号
          if(!this.checkPhone) return;
          if (this.needAgreements && !this.agree) {
            return this.$refs.agreements.popup(this.getCode)
          }
          let phoneNumber = uni.$unc.trim(this.phone, 'all');// 去掉中间的空格
          //跳转到验证码的页面
          this.toSmsPage(phoneNumber);
          this.emitSmsEvent();
          uni.showLoading({
            title: '正在获取验证码'
          })
          // 向指定手机号发送验证码短信
          const res = await sendSmsApi({phoneNumber});
          uni.$constants.RESULT_SUCCESS_CODE === res.code
              ? uni.$unc.toast('验证码已发送')
              : uni.$unc.showToast(res.msg)
          //演示环境 传递演示验证码
          uni.$emit('login-smscode-event', {
            mockCode: res.data,
          });
          // 通知验证码组件内部开始倒计时
          this.$refs.bCodeRef.start();
        } else {
          uni.$unc.toast('倒计时结束后再发送');
        }
      } finally {
        uni.hideLoading();
      }
    },
    //触发验证码页面的事件，传递短信动态消息参数
    emitSmsEvent(){
      uni.$emit('login-smscode-event', {
        disabled: this.disabled,
        smsTips: this.smsTips
      });
    },
    //处理登录后结果
    handleLoginApiRes({res, phoneNumber, callback}){
      const userInfo = res;
      userInfo.phone = phoneNumber;
      // 将user保存到vuex的state
      uni.$unc.userStore.dispatch('add', userInfo);
      // 添加token到缓存中
      uni.setStorageSync(uni.$unc.getValue("tokenKey"), userInfo.token);
      // 添加过期token到缓存中
      uni.setStorageSync(uni.$unc.getValue("tokenExpiredKey"), userInfo.tokenExpired);
      // 添加accountId 到 缓存
      uni.setStorageSync('miliqk-accountId', userInfo.accountId);
      //云端同步书架数据
      //this.$syncBookshelfToCloud();
      //云端同步书架历史数据
      //this.$syncHistoryToCloud();
      uni.$unc.showToast('登录成功');
      callback(); //执行callback函数
      this.back(); // 关闭登录窗口抽屉
    },
    //关闭当前页面 返回上级
    back(){
      this.clear();
      uni.navigateBack();
    },
    clear(){
      this.phone = ''
      this.smsTips = '' // 短信倒计时提示信息
      this.disabled = true
    },
    //去密码登录页
    toPwdLogin() {
      uni.navigateTo({
        url: '../login/password'
      })
    },
    chooseArea() {
      uni.showToast({
        title: '暂不支持其他国家',
        icon: 'none',
        duration: 3000
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/uni_modules/jasper-login/common/login-page.scss";

@media screen and (min-width: 690px) {
  .uni-content {
    height: 350px;
  }
}

.uni-content,
.quickLogin {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
}

.phone-box {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
}

.area {
  position: absolute;
  left: 10px;
  z-index: 9;
  top: 12px;
  font-size: 14px;
}

.area::after {
  content: "";
  border: 3px solid transparent;
  border-top-color: #000;
  top: 12px;
  left: 3px;
  position: relative;
}

/* #ifdef MP */
// 解决小程序端开启虚拟节点virtualHost引起的 class = input-box丢失的问题 [详情参考](https://uniapp.dcloud.net.cn/matter.html#%E5%90%84%E5%AE%B6%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AE%9E%E7%8E%B0%E6%9C%BA%E5%88%B6%E4%B8%8D%E5%90%8C-%E5%8F%AF%E8%83%BD%E5%AD%98%E5%9C%A8%E7%9A%84%E5%B9%B3%E5%8F%B0%E5%85%BC%E5%AE%B9%E9%97%AE%E9%A2%98)
.phone-box :deep(.uni-easyinput__content),
  /* #endif */
.input-box {
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
  flex: 1;
  padding-left: 45px;
  margin-bottom: 10px;
  border-radius: 0;
}

.quickLogin {
  height: 350px;
  align-items: center;
  justify-content: center;
}

.quickLoginBtn {
  margin: 20px 0;
  width: 450rpx;
  /* #ifndef APP-NVUE */
  max-width: 230px;
  /* #endif */
  height: 82rpx;
}

.tip {
  margin-top: -15px;
  margin-bottom: 20px;
}

@media screen and (min-width: 690px) {
  .quickLogin {
    height: auto;
  }
}

.uni-button-nvue-text {
  margin-left: auto;
  margin-right: auto;
  padding-left: 14px;
  padding-right: 14px;
  line-height: 80rpx;
  font-size: 36rpx;
}
</style>
