<template>
  <view class="jasper-login-entry" @click="handleClick">
    <slot>
      <button class="jasper-login-entry__button" type="primary">{{ text }}</button>
    </slot>
  </view>
</template>

<script>
import config from "@/uni_modules/jasper-login/config.js";

export default {
  name: "jasper-login",
  props: {
    text: {
      type: String,
      default: "前往登录",
    },
    url: {
      type: String,
      default: config.paths.login,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    isLogin() {
      if (uni.$jasperLogin?.isLogin) {
        return uni.$jasperLogin.isLogin();
      }
      return false;
    },
    toLogin(url = this.url) {
      if (uni.$jasperLogin?.toLogin) {
        uni.$jasperLogin.toLogin(url);
        return;
      }
      uni.navigateTo({ url });
    },
    logout() {
      if (uni.$jasperLogin?.logout) {
        uni.$jasperLogin.logout();
      }
    },
    handleClick() {
      if (this.disabled) {
        return;
      }
      this.$emit("click");
      this.toLogin();
    },
  },
};
</script>

<style lang="scss" scoped>
.jasper-login-entry {
  display: block;
}

.jasper-login-entry__button {
  width: 100%;
}
</style>
