<!-- 免密登录页 -->
<template>
  <view class="uni-content">
    <uv-navbar autoBack safeAreaInsetTop />

    <view class="login-logo">
      <image :src="logo"></image>
    </view>

    <text class="title" :style="`margin-top: ${windowNavAndStatusBarHeight}px`">免密登录</text>

    <template v-if="[loginTypeEnum.APPLE, loginTypeEnum.WEIXIN, loginTypeEnum.WEIXIN_MOBILE].includes(type)">
      <text class="tip">将根据第三方账号服务平台的授权范围获取你的信息</text>
      <view class="quickLogin">
        <image
          v-if="type !== loginTypeEnum.WEIXIN_MOBILE"
          :src="imgSrc"
          mode="widthFix"
          class="quickLoginBtn"
          @click="quickLogin"
        ></image>
        <button
          v-if="needAgreements && agree && type === loginTypeEnum.WEIXIN_MOBILE"
          type="primary"
          open-type="getPhoneNumber"
          class="uni-btn"
          @getphonenumber="quickLogin"
        >
          微信授权手机号登录
        </button>
        <button
          v-if="needAgreements && !agree"
          type="primary"
          class="uni-btn"
          @click="$refs.agreements.popup"
        >
          微信授权手机号登录
        </button>
        <login-agreements ref="agreements" scope="register"></login-agreements>
      </view>
    </template>

    <template v-else>
      <text class="tip">未注册的账号验证通过后将自动注册</text>
      <!--
          注意:
        1.外层的view 不能使用flex:1 否则uni-easyinput内部的元素的border 在nvue页面上后自动适应 外层宽高
        2.placeholderStyle="font-size: 16px" 要写成 placeholderStyle="fontSize: 16px" 才会生效 这是个问题
      -->
      <view>
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
          @blur="onPhoneBlur"
          @clear="phone = ''"
        ></uni-easyinput>
        <uv-line height="4px" color="#000" :hairline="false"></uv-line>

        <view class="jasper-mt20">
          <button
            class="jasper-rds20 jasper-mb10 login-btn"
            :class="{ 'login-btn--disabled': smsButtonDisabled }"
            :disabled="smsButtonDisabled"
            :plain="smsButtonDisabled"
            @tap.stop="getCode"
          >
            <!-- #ifdef APP-NVUE -->
            <text
              class="uni-button-nvue-text login-btn__text"
              :class="{ 'login-btn__text--disabled': smsButtonDisabled }"
            >{{ showSmsText }}</text>
            <!-- #endif -->
            <!-- #ifndef APP-NVUE -->
            {{ showSmsText }}
            <!-- #endif -->
          </button>
          <login-agreements ref="agreements" scope="register"></login-agreements>
        </view>
      </view>
    </template>

    <login-methods
      ref="uniFabLogin"
      @change="handleLoginTypeChange"
      @success="handleLoginSuccess"
    ></login-methods>
  </view>
</template>

<script>
import { AUTH_LOGIN_TYPE } from "@/uni_modules/jasper-login/constants/auth";
import config from "@/uni_modules/jasper-login/config.js";
import agreementsMixin from "@/uni_modules/jasper-login/common/login-agreements-mixin.js";
import { useLoginFlow } from "@/uni_modules/jasper-login/hooks/use-login-flow.js";
import { useSmsLogin } from "@/uni_modules/jasper-login/hooks/use-sms-login.js";
import { useThirdPartyLogin } from "@/uni_modules/jasper-login/hooks/use-third-party-login.js";
import useSystemInfo from "@/uni_modules/jasper-ui/libs/mixin/systemInfo";

let currentWebview;
const smsLogin = useSmsLogin();
const thirdPartyLogin = useThirdPartyLogin();

export default {
  name: "login-passwordless",
  mixins: [agreementsMixin, useSystemInfo],
  data() {
    return {
      type: "",
      loginTypeEnum: AUTH_LOGIN_TYPE,
      phone: "",
      focusPhone: false,
      logo: "/static/logo.png",
      openDrawer: false,
      focus: false,
      accessToken: "",
    };
  },
  computed: {
    isPhone() {
      return smsLogin.validatePhone(this.phone, { silent: true }).valid;
    },
    isQuickLoginType() {
      return thirdPartyLogin.isQuickLoginType(this.type);
    },
    imgSrc() {
      return this.type === this.loginTypeEnum.WEIXIN
        ? "/uni_modules/jasper-login/static/login/weixin.png"
        : "/uni_modules/jasper-login/static/app-plus/apple.png";
    },
    pageClass() {
      // #ifdef APP-VUE || H5
      return "jasper-abs jasper-plr15 jasper-w100p jasper-h100p whiteBg";
      // #endif

      // #ifdef APP-NVUE
      return "jasper-plr15 page whiteBg";
      // #endif
    },
    smsButtonDisabled() {
      return !this.isPhone;
    },
    showSmsText() {
      return "获取验证码";
    },
    checkPhone() {
      return this.isPhone;
    },
  },
  async onLoad(e) {
    this.loginFlow = useLoginFlow({
      fallbackRedirect: () => this.back(),
    });

    const type = e.type || config.loginTypes[0];
    this.type = type;

    if (type !== AUTH_LOGIN_TYPE.UNIVERIFY) {
      this.focus = true;
    }

    this.$nextTick(() => {
      if ([AUTH_LOGIN_TYPE.WEIXIN, AUTH_LOGIN_TYPE.APPLE].includes(type)) {
        this.$refs.uniFabLogin.servicesList = this.$refs.uniFabLogin.servicesList.filter(
          (item) => item.id !== type
        );
      }
    });
  },
  onShow() {
    // #ifdef H5
    document.onkeydown = (event) => {
      const e = event || window.event;
      if (e && e.keyCode === 13 && !this.isQuickLoginType) {
        this.getCode();
      }
    };
    // #endif
  },
  onUnload() {
    // #ifdef H5
    document.onkeydown = null;
    // #endif
    uni.hideLoading();
  },
  async onReady() {
    // #ifdef APP-PLUS
    const available = await smsLogin.ensureNetworkReady();
    if (!available.ready) return;

    if (this.type === AUTH_LOGIN_TYPE.UNIVERIFY) {
      const pages = getCurrentPages();
      currentWebview = pages[pages.length - 1].$getAppWebview();
      currentWebview.setStyle({
        top: "2000px",
      });
      this.$refs.uniFabLogin.login_before(AUTH_LOGIN_TYPE.UNIVERIFY);
    }
    // #endif
  },
  watch: {
    phone(value) {
      this.phone = smsLogin.formatPhoneInput(value || "");
    },
  },
  methods: {
    onPhoneBlur() {
      smsLogin.validatePhone(this.phone)  // 失焦时才提示
    },
    /**
     * 子组件内切换登录方式时，父页面直接同步本地状态。
     * 这里刻意不用全局事件，避免路由切换后仍有其它页面意外响应。
     *
     * @param {string} type 登录方式
     */
    handleLoginTypeChange(type) {
      this.type = type;
      if (type !== AUTH_LOGIN_TYPE.UNIVERIFY) {
        this.focus = true;
      }
    },
    onKeyEvent(data) {
      console.log(data, "---onKeyEvent---");
    },
    showCurrentWebview() {
      currentWebview.setStyle({
        top: 0,
      });
    },
    async quickLogin(e = {}) {
      const quickLoginState = thirdPartyLogin.resolveQuickLoginOptions(this.type, e);
      if (!quickLoginState.canContinue && this.type === AUTH_LOGIN_TYPE.WEIXIN_MOBILE) {
        if (e.detail.errno === 1400001) {
          console.error("该功能使用次数已达当前小程序上限，暂时无法使用");
          uni.showToast({
            icon: "none",
            title: "获取手机号次数已达当前小程序上限",
          });
        } else if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
          console.error("您已拒绝登录");
          uni.showToast({
            icon: "none",
            title: "您已拒绝登录",
          });
        } else {
          uni.showToast({
            icon: "none",
            title: "获取手机号失败",
          });
          console.error("e", e);
        }
        return;
      }

      this.$refs.uniFabLogin.login_before(this.type, true, quickLoginState.options);
    },
    /**
     * 进入短信验证码页。
     *
     * 现在验证码页会自己负责：
     * 1. 首次发送验证码
     * 2. 倒计时
     * 3. 重发验证码
     * 4. 提交验证码并登录
     *
     * 当前页只负责收集手机号并导航，避免两个页面通过事件总线来回协作。
     *
     * @param {string} phoneNumber 纯净手机号
     */
    toSmsPage(phoneNumber) {
      if (!this.checkPhone) return;
      smsLogin.toSmsCodePage(phoneNumber);
    },
    async getCode() {
      const smsState = await smsLogin.ensureSmsRequestReady(this.phone);
      if (!smsState.ready) return;

      if (this.needAgreements && !this.agree) {
        return this.$refs.agreements.popup(this.getCode);
      }

      this.toSmsPage(smsState.phoneNumber);
    },
    /**
     * 处理子组件返回的登录结果。
     *
     * 旧流程依赖全局 `API_RESULT` 事件，父页面只知道“某处有登录结果来了”，
     * 但不知道是谁发起、何时结束。这里改成子组件显式回调后，
     * 结果来源会固定为当前页面下的 `login-methods` 实例。
     *
     * @param {{ res: any, phoneNumber?: string, callback?: Function }} payload 登录结果
     */
    handleLoginSuccess({ res, phoneNumber = "", callback } = {}) {
      const result = this.loginFlow.handleLoginSuccess({
        result: res,
        phoneNumber,
        callback,
      });

      return result;
    },
    back() {
      this.clear();
      uni.navigateBack();
    },
    clear() {
      this.phone = "";
    },
    toPwdLogin() {
      uni.navigateTo({
        url: "../login/password",
      });
    },
    chooseArea() {
      uni.showToast({
        title: "暂不支持其他国家",
        icon: "none",
        duration: 3000,
      });
    },
  },
};
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
// 解决小程序端开启虚拟节点 virtualHost 导致 class=input-box 丢失的问题
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

.login-btn {
  border: 0;
  background-color: $jasper-primary;
  color: $jasper-primary-inverse;
}

.login-btn::after {
  border: 0;
}

.login-btn--disabled {
  background-color: #f5f5f5 !important;
  color: #bbbbbb !important;
  border: 0 !important;
}

.login-btn__text {
  color: $jasper-primary-inverse;
}

.login-btn__text--disabled {
  color: #bbbbbb !important;
}
</style>
