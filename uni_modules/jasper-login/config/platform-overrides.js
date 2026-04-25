import { AUTH_LOGIN_TYPE } from '../constants/auth.js';

/**
 * 平台覆盖配置。
 *
 * 这里专门承载条件编译相关的登录方式开关，避免把平台差异和基础配置写在同一个文件里。
 * 当前仍然沿用 uni-app 的条件编译能力，但结构上已经拆成：
 * 1. base config
 * 2. platform overrides
 * 3. runtime normalization
 */
const loginTypes = [
  // #ifdef APP
  AUTH_LOGIN_TYPE.UNIVERIFY,
  // #endif

  // #ifdef MP-WEIXIN
  AUTH_LOGIN_TYPE.WEIXIN_MOBILE,
  // #endif

];

const platformOverrides = {
  loginTypes,
};

export default platformOverrides;
