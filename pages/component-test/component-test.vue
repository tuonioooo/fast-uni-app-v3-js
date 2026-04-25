<script setup>
import { ref } from 'vue';

const testCards = ref([
  {
    key: 'jasper-login',
    title: 'jasper-login 登录组件',
    description: '进入优化后的登录页面，测试短信登录、账号密码登录、三方登录入口和协议流程。',
    buttonText: '开始测试',
    action() {
      uni.navigateTo({
        url: '/uni_modules/jasper-login/pages/login/login-withoutpwd',
      });
    },
  },
  {
    key: 'login-password',
    title: '账号密码登录页',
    description: '直接进入账号密码登录页，单独验证账号密码登录表单和登录成功后的跳转行为。',
    buttonText: '测试账号密码页',
    action() {
      uni.navigateTo({
        url: '/uni_modules/jasper-login/pages/login/login-withpwd',
      });
    },
  },
]);
</script>

<template>
  <view class="page">
    <view class="page__header">
      <view class="page__title">组件与页面测试</view>
      <view class="page__desc">
        这里集中放置可单独验证的组件或页面入口，后续新增测试项可以继续追加卡片。
      </view>
    </view>

    <view class="card-list">
      <view v-for="item in testCards" :key="item.key" class="card">
        <view class="card__title">{{ item.title }}</view>
        <view class="card__desc">{{ item.description }}</view>
        <button class="card__button" type="primary" @click="item.action()">
          {{ item.buttonText }}
        </button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  background: #f7f8fa;
}

.page__header {
  margin-bottom: 24rpx;
}

.page__title {
  font-size: 40rpx;
  font-weight: 700;
  color: #111827;
}

.page__desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  line-height: 1.6;
  color: #6b7280;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.card {
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.06);
}

.card__title {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
}

.card__desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: #4b5563;
}

.card__button {
  margin-top: 24rpx;
}
</style>
