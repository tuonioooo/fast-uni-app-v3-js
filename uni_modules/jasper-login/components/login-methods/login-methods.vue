<template>
  <view>
    <view class="fab-login-box">
      <view
        v-for="(item, index) in servicesList"
        :key="index"
        class="item"
        @click="item.path ? toPage(item.path) : login_before(item.id, false)"
      >
        <image class="logo" :src="item.logo" mode="scaleToFill"></image>
        <text class="login-title">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import config from "@/uni_modules/jasper-login/config.js";
import { loginApi, getPhoneInfoByCode } from "@/uni_modules/jasper-login/common/login-api";
import { AUTH_LOGIN_TYPE } from "@/uni_modules/jasper-login/constants/auth";
import { hasNetwork } from "@/uni_modules/jasper-login/utils/runtime-deps.js";

export default {
  name: "login-methods",
  emits: ["change", "success"],
  data() {
    return {
      platform: uni.getSystemInfoSync().platform,
      servicesList: [
        {
          id: AUTH_LOGIN_TYPE.USERNAME,
          text: "账号登录",
          logo: "/uni_modules/jasper-login/static/login/jasper-fab-login/user.png",
          path: config.paths.passwordLogin,
        },
        {
          id: AUTH_LOGIN_TYPE.SMS_CODE,
          text: "短信验证码",
          logo: "/uni_modules/jasper-login/static/login/jasper-fab-login/sms.png",
          path: `${config.paths.login}?type=${AUTH_LOGIN_TYPE.SMS_CODE}`,
        },
        {
          id: AUTH_LOGIN_TYPE.WEIXIN,
          text: "微信登录",
          logo: "/uni_modules/jasper-login/static/login/jasper-fab-login/weixin.png",
        },
        // #ifndef MP-WEIXIN
        {
          id: AUTH_LOGIN_TYPE.APPLE,
          text: "Apple 登录",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/apple.png",
        },
        {
          id: AUTH_LOGIN_TYPE.UNIVERIFY,
          text: "一键登录",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/univerify_b0.png",
        },
        {
          id: AUTH_LOGIN_TYPE.TAOBAO,
          text: "淘宝登录",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/taobao.png",
        },
        {
          id: AUTH_LOGIN_TYPE.FACEBOOK,
          text: "Facebook 登录",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/facebook.png",
        },
        {
          id: AUTH_LOGIN_TYPE.ALIPAY,
          text: "支付宝登录",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/alipay.png",
        },
        {
          id: AUTH_LOGIN_TYPE.QQ,
          text: "QQ 登录",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/qq.png",
        },
        {
          id: AUTH_LOGIN_TYPE.GOOGLE,
          text: "Google 登录",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/google.png",
        },
        {
          id: AUTH_LOGIN_TYPE.DOUYIN,
          text: "抖音登录",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/douyin.png",
        },
        {
          id: AUTH_LOGIN_TYPE.SINAWEIBO,
          text: "新浪微博",
          logo: "/uni_modules/jasper-login/static/app-plus/jasper-fab-login/sinaweibo.png",
        },
        // #endif
      ],
      univerifyStyle: {
        fullScreen: true,
        backgroundColor: "#ffffff",
        buttons: {
          iconWidth: "45px",
          list: [],
        },
        closeIcon: {
          path: "static/images/unverifyClose.png",
        },
        otherLoginButton: {
          visible: true,
          textColor: "#656565",
          title: "短信验证码登录",
        },
        privacyTerms: {
          defaultCheckBoxState: false,
          textColor: "#BBBBBB",
          termsColor: "#5496E3",
          prefix: "我已阅读并同意",
          suffix: "并使用本机号码登录",
          privacyItems: [],
        },
      },
    };
  },
  async created() {
    let servicesList = this.servicesList;
    const loginTypes = config.loginTypes;
    const preLogin = await this.supportPreLogin();

    servicesList = servicesList.filter((item) => {
      // #ifndef APP
      if (item.id === AUTH_LOGIN_TYPE.APPLE) {
        return false;
      }
      // #endif

      // #ifdef APP
      if (item.id === AUTH_LOGIN_TYPE.APPLE && uni.getSystemInfoSync().osName !== "ios") {
        return false;
      }

      if (item.id === AUTH_LOGIN_TYPE.UNIVERIFY && !preLogin) {
        return false;
      }
      // #endif

      return loginTypes.includes(item.id);
    });

    if (loginTypes.includes(AUTH_LOGIN_TYPE.UNIVERIFY)) {
      this.univerifyStyle.privacyTerms.privacyItems = this.agreements;
      servicesList.forEach(({ id, logo, path }) => {
        if (id !== AUTH_LOGIN_TYPE.UNIVERIFY && id !== AUTH_LOGIN_TYPE.SMS_CODE) {
          this.univerifyStyle.buttons.list.push({
            iconPath: logo,
            provider: id,
            path,
          });
        }
      });
    }

    this.servicesList = servicesList.filter((item) => {
      const path = item.path ? item.path.split("?")[0] : "";
      return path !== this.getRoute(1);
    });
  },
  computed: {
    agreements() {
      if (!config.agreements) {
        return [];
      }

      const { serviceUrl, privacyUrl } = config.agreements;
      return [
        {
          url: serviceUrl,
          title: "用户服务协议",
        },
        {
          url: privacyUrl,
          title: "隐私政策条款",
        },
      ];
    },
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
    getRoute(n = 0) {
      const pages = getCurrentPages();
      if (n > pages.length) {
        return "";
      }

      // #ifdef APP-PLUS
      if (this.platform === "ios") {
        const currentWebview = pages[pages.length - n].$getAppWebview();
        currentWebview.setStyle({
          top: "600",
        });
      }
      // #endif

      return `/${pages[pages.length - n].route}`;
    },
    toPage(path, index = 0) {
      const type = ["navigateTo", "redirectTo"][index];

      if (
        this.getRoute(1) === path.split("?")[0] &&
        this.getRoute(1) === config.paths.login
      ) {
        const loginType = path.split("?")[1].split("=")[1];
        this.$emit("change", loginType);
      } else if (this.getRoute(2) === path) {
        uni.navigateBack();
      } else if (this.getRoute(1) !== path) {
        uni[type]({
          url: path,
          animationType: "slide-in-left",
          complete(e) {
            console.log(e);
          },
        });
      } else {
        console.log(`意外的页面跳转状态，path=${path}`);
      }
    },
    async supportPreLogin() {
      // #ifdef APP-PLUS
      return new Promise((resolve) => {
        uni.preLogin({
          provider: AUTH_LOGIN_TYPE.UNIVERIFY,
          success() {
            resolve(true);
          },
          fail(res) {
            console.error(res);
            resolve(false);
          },
        });
      });
      // #endif
    },
    async login_before(type, navigateBack = true, options = {}) {
      console.log(`当前登录方式=[${type}]`);

      const available = await hasNetwork();
      if (!available) {
        return uni.showToast({
          title: "网络异常，请检查网络连接后重试",
          icon: "none",
        });
      }

      // #ifdef APP
      let isAppExist = true;
      await new Promise((callback) => {
        plus.oauth.getServices(
          (oauthServices) => {
            const index = oauthServices.findIndex((e) => e.id === type);
            if (index !== -1) {
              isAppExist = oauthServices[index].nativeClient;
              callback();
            } else {
              this.toPage(config.paths.login, 1);
            }
          },
          (err) => {
            throw new Error(`获取服务供应商失败：${JSON.stringify(err)}`);
          }
        );
      });
      // #endif

      if (
        // #ifdef APP
        !isAppExist
        // #endif

        // #ifndef APP
        [AUTH_LOGIN_TYPE.UNIVERIFY, AUTH_LOGIN_TYPE.APPLE].includes(type)
        // #endif
      ) {
        this.toPage(config.paths.login, 1);
        return;
      }

      uni.showLoading({
        mask: true,
      });

      if (type === AUTH_LOGIN_TYPE.UNIVERIFY) {
        this.univerify();
      }

      if (type === AUTH_LOGIN_TYPE.WEIXIN_MOBILE) {
        return this.login_weixin(
          {
            code: options.code,
          },
          type
        );
      }
    },
    univerify() {
      const univerifyManager = uni.getUniverifyManager();
      let clickAnotherButtons = false;

      const onButtonsClickFn = async (res) => {
        console.log("点击了第三方登录，provider：", res, res.provider, this.univerifyStyle.buttons.list);
        clickAnotherButtons = true;

        let agree;
        const checkBoxState = await uni.getCheckBoxState();
        // #ifdef VUE2
        agree = checkBoxState[1].state;
        // #endif
        // #ifdef VUE3
        agree = checkBoxState.state;
        // #endif

        const { path } = this.univerifyStyle.buttons.list[res.index];
        if (path) {
          if (this.getRoute(1).includes(config.paths.login) && path.includes(config.paths.login)) {
            this.getParentComponent().showCurrentWebview();
          }
          this.toPage(path, 1);
          closeUniverify();
        } else if (agree) {
          closeUniverify();
          setTimeout(() => {
            this.login_before(res.provider);
          }, 500);
        } else {
          uni.showToast({
            title: "你未同意隐私政策协议",
            icon: "none",
            duration: 3000,
          });
        }
      };

      const closeUniverify = () => {
        uni.hideLoading();
        univerifyManager.close();
        univerifyManager.offButtonsClick(onButtonsClickFn);
      };

      univerifyManager.onButtonsClick(onButtonsClickFn);
      return univerifyManager.login({
        univerifyStyle: this.univerifyStyle,
        success: (res) => {
          console.log("[一键登录弹框成功]", res);
          const authResult = res?.authResult;
          if (!authResult) {
            uni.hideLoading();
            uni.showToast({
              title: "一键登录授权信息缺失",
              icon: "none",
            });
            return;
          }
          this.login(authResult, AUTH_LOGIN_TYPE.UNIVERIFY);
        },
        fail: (err) => {
          uni.hideLoading();
          if (!clickAnotherButtons) {
            console.log(err);
            this.toPage(config.paths.login, 1);
          }
        },
        complete: () => {
          uni.hideLoading();
          univerifyManager.offButtonsClick(onButtonsClickFn);
        },
      });
    },
    login(params, type) {
      const action = "loginBy" + type.trim().replace(type[0], type[0].toUpperCase());
      console.log("[一键登录获取联网校验中...]");

      const uniIdCo = uniCloud.importObject("uni-id-co", {
        customUI: true,
      });

      uniIdCo[action](params)
        .then(async (result) => {
          console.log("[一键登录成功]", result);
          uni.showToast({
            title: "登录成功",
            icon: "none",
            duration: 2000,
          });
          // #ifdef H5
          result.loginType = type;
          // #endif
          await this.login_After(result.phoneNumber, type);
        })
        .catch((e) => {
          uni.showModal({
            content: e.message,
            confirmText: "知道了",
            showCancel: false,
          });
        })
        .finally(() => {
          if (type === AUTH_LOGIN_TYPE.UNIVERIFY) {
            uni.closeAuthView();
          }
          uni.hideLoading();
        });
    },
    async login_weixin(params, type) {
      console.log(`当前登录方式login_weixin=[${type}]`);
      if (!params?.code) {
        return;
      }

      let phoneNumber = "";
      try {
        const res = await getPhoneInfoByCode({
          appid: config.appid.weixin.miniapp,
          code: params.code,
        });
        if (res.code === 200) {
          phoneNumber = res.data.phoneNumber;
        } else {
          console.error("Error fetching phone number:", res);
          return;
        }
      } catch (error) {
        console.error("Error fetching phone number:", error);
        uni.showToast({
          icon: "none",
          title: "获取手机号失败",
        });
        return;
      }

      this.login_After(phoneNumber, type);
    },
    async login_After(phoneNumber, type) {
      if (!phoneNumber) {
        return;
      }

      const verifyRes = await loginApi({
        phoneNumber,
        source: uni.getSystemInfoSync().platform,
        loginType: type,
      });

      /**
       * 登录方式组件只负责拿到登录结果，不直接决定后续落库和跳转。
       *
       * 当前事件由父页面接收：
       * - `pages/login/login-withoutpwd.vue -> handleLoginSuccess()`
       *
       * 这里把 `callback` 一并透传给父页面，父页面在真正完成
       * `loginFlow.handleLoginSuccess()` 后，会按需回调，
       * 用来统一收尾如 `uni.closeAuthView()`、`uni.hideLoading()`。
       */
      this.$emit("success", {
        res: verifyRes,
        phoneNumber,
        callback: () => {
          if (type === AUTH_LOGIN_TYPE.UNIVERIFY) {
            uni.closeAuthView();
          }
          uni.hideLoading();
        },
      });
    },
  },
};
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
