<template>
  <view class="uni-content">
    <uv-navbar autoBack safeAreaInsetTop />

    <view class="login-logo">
      <image :src="logo"></image>
    </view>

    <text class="title" :style="`margin-top: ${windowNavAndStatusBarHeight}px`">账号登录</text>
    <text class="tip">请输入账号和密码完成登录</text>

    <view class="form-box">
      <uni-easyinput v-model.trim="form.username" class="input-box" :inputBorder="false" placeholder="请输入账号"
        primaryColor="#c0c4cc"></uni-easyinput>
      <uv-line height="2px" color="#000" :hairline="false"></uv-line>

      <uni-easyinput v-model="form.password" class="input-box jasper-mt15" :inputBorder="false" type="password"
        placeholder="请输入密码" primaryColor="#c0c4cc"></uni-easyinput>
      <uv-line height="2px" color="#000" :hairline="false"></uv-line>

      <button
        class="uni-btn jasper-rds20 jasper-mt20 login-btn"
        :class="{ 'login-btn--disabled': submitting }"
        :disabled="submitting"
        @tap.stop="submit"
      >
        {{ submitting ? "登录中..." : "登录" }}
      </button>

      <login-agreements ref="agreements" scope="login"></login-agreements>
    </view>

    <login-methods ref="uniFabLogin"></login-methods>
  </view>
</template>

<script>
import { passwordLoginApi } from "@/uni_modules/jasper-login/common/login-api";
import agreementsMixin from "@/uni_modules/jasper-login/common/login-agreements-mixin.js";
import { useLoginFlow } from "@/uni_modules/jasper-login/hooks/use-login-flow.js";
import { showJasperToast } from "@/uni_modules/jasper-login/utils/runtime-deps.js";
import useSystemInfo from "@/uni_modules/jasper-ui/libs/mixin/systemInfo";

export default {
  name: "login-password",
  mixins: [agreementsMixin, useSystemInfo],
  data() {
    return {
      logo: "/static/logo.png",
      submitting: false,
      form: {
        username: "",
        password: "",
      },
    };
  },
  created() {
    this.loginFlow = useLoginFlow({
      fallbackRedirect: () => this.back(),
    });
  },
  methods: {
    async submit() {
      const { username, password } = this.form;

      if (!username) {
        showJasperToast("请输入账号");
        return;
      }

      if (!password) {
        showJasperToast("请输入密码");
        return;
      }

      if (this.needAgreements && !this.agree) {
        this.$refs.agreements.popup(this.submit);
        return;
      }

      this.submitting = true;
      uni.showLoading({
        title: "登录中",
        mask: true,
      });

      try {
        const res = await passwordLoginApi({ username, password });
        const result = this.loginFlow.handleLoginSuccess({
          result: res,
        });
        if (!result.success) {
          return;
        }
      } finally {
        this.submitting = false;
        uni.hideLoading();
      }
    },
    back() {
      this.form.username = "";
      this.form.password = "";
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/uni_modules/jasper-login/common/login-page.scss";

.uni-content,
.form-box {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
}

.form-box {
  min-height: 360px;
}

.tip {
  margin-top: -15px;
  margin-bottom: 20px;
}

.login-btn {
  border: 0;
  background-color: $jasper-primary;
  color: $jasper-primary-inverse !important;
}

.login-btn::after {
  border: 0;
}

.login-btn--disabled {
  background-color: #f5f5f5 !important;
  color: #bbbbbb !important;
  border: 0 !important;
  opacity: 1;
}
</style>
