export const AUTH_RESULT_CODE = {
  SUCCESS: 200,
  FAIL: 0,
};

export const AUTH_STORAGE_KEY = {
  SMS_INFO: 'smsInfo',
};

export const AUTH_DELAY = {
  SMS: 1000,
  LOGIN: 1000,
  WEIXIN_PHONE: 300,
  WEIXIN_LOGIN: 1000,
};

export const AUTH_LOGIN_TYPE = {
  // 开启用户名密码登录方式
  USERNAME: 'username',
  // 开启验证码登录方式
  SMS_CODE: 'smsCode',
  // 开启微信登录方式
  WEIXIN: 'weixin',
  // 开启微信手机号登录方式(含小程序登录方式)
  WEIXIN_MOBILE: 'weixinMobile',
  // 开启本机号码一键登录方式
  UNIVERIFY: 'univerify',
  // 开启 Apple 登录方式
  APPLE: 'apple',
  // 开启 QQ 登录方式
  QQ: 'qq',
  // 开启小米登录方式
  XIAOMI: 'xiaomi',
  // 开启新浪微博登录方式
  SINAWEIBO: 'sinaweibo',
  // 开启淘宝登录方式
  TAOBAO: 'taobao',
  // 开启 Facebook 登录方式
  FACEBOOK: 'facebook',
  // 开启 Google 登录方式
  GOOGLE: 'google',
  // 开启支付宝登录方式
  ALIPAY: 'alipay',
  // 开启抖音登录方式
  DOUYIN: 'douyin',
};

export const AUTH_MESSAGE = {
  LOGIN_FAIL: '登录失败',
  MISSING_CODE: '缺少 code',
};

export const AUTH_MOCK_DATA = {
  TOKEN: '123456789',
  PHONE_NUMBER: '13800138000',
  COUNTRY_CODE: '86',
  USER_INFO: {
    nickname: '模拟用户',
    avatar: 'https://www.uvui.cn/common/logo.png',
  },
};
