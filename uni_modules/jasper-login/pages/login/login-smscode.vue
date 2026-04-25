<template>
  <view :class="pageClass">
    <uv-navbar autoBack safeAreaInsetTop />

    <view class="jasper-mlr45" :style="`margin-top: ${windowNavAndStatusBarHeight}px`">
      <jasper-title type="h1" title="验证码登录"></jasper-title>
      <jasper-title type="h3" :title="subTitle"></jasper-title>

      <view class="jasper-mt15">
        <uv-code-input
          v-model="code"
          mode="line"
          maxlength="4"
          size="48"
          :focus="true"
          space="20"
          hairline
          borderColor="#606266"
        ></uv-code-input>
      </view>

      <view class="jasper-mt30">
        <text class="error jasper-fz16">{{ error }}</text>
        <text class="mock-code jasper-fz16">{{ mockCodeText }}</text>
        <view class="jasper-mt15 sms-tips" :class="{ 'sms-tips--disabled': resendDisabled }" @tap="sendCode">
          <text class="jasper-fz16">{{ smsTips }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import useSystemInfo from "@/uni_modules/jasper-ui/libs/mixin/systemInfo";
import { loginApi, sendSmsApi } from "@/uni_modules/jasper-login/common/login-api";
import { AUTH_LOGIN_TYPE } from "@/uni_modules/jasper-login/constants/auth";
import { useLoginFlow } from "@/uni_modules/jasper-login/hooks/use-login-flow.js";
import { useSmsLogin } from "@/uni_modules/jasper-login/hooks/use-sms-login.js";
import { getResultSuccessCode, showJasperToast } from "@/uni_modules/jasper-login/utils/runtime-deps.js";

const SMS_COUNTDOWN_SECONDS = 10;
const smsLogin = useSmsLogin();

export default {
  name: "login-sms-code",
  mixins: [useSystemInfo],
  data() {
    return {
      phone: "",
      code: "",
      error: "",
      countdown: 0,
      timer: null,
      submitting: false,
      mockCode: "",
      autoSend: false,
    };
  },
  created() {
    this.loginFlow = useLoginFlow({
      fallbackRedirect: () => this.back(),
    });
  },
  onLoad(options) {
    this.phone = options.phone || "";
    this.autoSend = options.autoSend === "1";
  },
  async onReady() {
    if (!this.rightPhone) {
      showJasperToast("手机号不正确");
      this.back();
      return;
    }

    if (this.autoSend) {
      await this.sendCode();
    }
  },
  onUnload() {
    this.clearTimer();
  },
  computed: {
    pageClass() {
      // #ifdef APP-VUE || H5
      return "jasper-abs jasper-plr15 jasper-w100p jasper-h100p whiteBg";
      // #endif

      // #ifdef APP-NVUE
      return "jasper-plr15 page whiteBg";
      // #endif
    },
    rightPhone() {
      return smsLogin.validatePhone(this.phone, { silent: true }).valid;
    },
    customPhone() {
      let customPhone = "";
      for (let i = 0; i < this.phone.length; i++) {
        if (i >= 3 && i <= 6) {
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
    resendDisabled() {
      return this.countdown > 0 || this.submitting;
    },
    smsTips() {
      if (this.submitting) {
        return "正在登录...";
      }
      if (this.countdown > 0) {
        return `${this.countdown} 秒后重新获取`;
      }
      return "重新获取验证码";
    },
    mockCodeText() {
      return this.mockCode ? `演示环境验证码：${this.mockCode}` : "";
    },
  },
  watch: {
    code(value) {
      if (value) {
        this.error = "";
      }
      if (/^\d{4}$/.test(value) && !this.submitting) {
        this.loginWithCode();
      }
    },
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    startCountdown() {
      this.clearTimer();
      this.countdown = SMS_COUNTDOWN_SECONDS;
      this.timer = setInterval(() => {
        if (this.countdown <= 1) {
          this.countdown = 0;
          this.clearTimer();
          return;
        }
        this.countdown -= 1;
      }, 1000);
    },
    /**
     * 当前页自己负责发送验证码。
     *
     * 这样短信页不需要再依赖上一页通过全局事件“远程触发发码”，
     * 页面打开后发生的事情都可以在本页内直接看清楚：
     * 进入页面 -> 发码 -> 倒计时 -> 输入验证码 -> 登录。
     */
    async sendCode() {
      if (this.resendDisabled) {
        return;
      }

      if (!this.rightPhone) {
        showJasperToast("手机号不正确");
        return;
      }

      const available = await smsLogin.ensureNetworkReady();
      if (!available.ready) {
        showJasperToast("网络异常，请检查网络连接后重试");
        return;
      }

      uni.showLoading({
        title: "正在获取验证码",
      });

      try {
        const res = await sendSmsApi({
          phoneNumber: this.phone,
        });

        if (res?.code !== getResultSuccessCode()) {
          showJasperToast(res?.msg || "验证码发送失败");
          return;
        }

        this.mockCode = res.data || "";
        this.startCountdown();
        showJasperToast("验证码已发送");
      } finally {
        uni.hideLoading();
      }
    },
    clearCode() {
      this.code = "";
      this.error = "";
    },
    back() {
      this.clearCode();
      uni.navigateBack();
    },
    /**
     * 直接使用验证码执行登录。
     *
     * 旧实现会先通过事件回到上一页，再由上一页处理登录结果。
     * 现在流程收敛到本页后，登录成功与失败都能在本页直接闭环处理。
     */
    async loginWithCode() {
      if (!this.rightPhone) {
        showJasperToast("手机号不正确");
        return;
      }

      if (!/^\d{4}$/.test(this.code)) {
        showJasperToast("短信验证码必须是 4 位数字");
        return;
      }

      this.submitting = true;
      uni.showLoading({
        title: "登录中",
        mask: true,
      });

      try {
        const result = await loginApi({
          phoneNumber: this.phone,
          verificationCode: this.code,
          loginType: AUTH_LOGIN_TYPE.SMS_CODE,
        });

        const loginState = this.loginFlow.handleLoginSuccess({
          result,
          phoneNumber: this.phone,
        });

        if (!loginState.success) {
          this.error = loginState.message || "验证码错误，请重新输入";
          this.code = "";
          return;
        }
      } finally {
        this.submitting = false;
        uni.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss">
.error {
  color: #ff846c;
  display: block;
  min-height: 24px;
}

.mock-code {
  color: blue;
  display: block;
  min-height: 24px;
}

.sms-tips {
  color: $jasper-primary;
}

.sms-tips--disabled {
  color: #c5c5c5;
}
</style>
