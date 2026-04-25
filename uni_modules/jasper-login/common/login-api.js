import { getJasperLoginRegistry } from '../services/service-registry.js';

/**
 * 验证码短信发送参数。
 *
 * @typedef {Object} SendSmsParams
 * @property {string} phoneNumber 手机号
 */

/**
 * 短信验证码校验参数。
 *
 * @typedef {Object} VerifySmsParams
 * @property {string} phoneNumber 手机号
 * @property {string} verificationCode 验证码
 */

/**
 * 登录请求参数。
 *
 * @typedef {Object} LoginParams
 * @property {string} phoneNumber 手机号
 * @property {string} loginType 登录方式，通常取自 `AUTH_LOGIN_TYPE`
 * @property {string} [verificationCode] 短信验证码，短信登录时必传
 * @property {string} [source] 来源平台标识
 */

/**
 * 账号密码登录参数。
 *
 * @typedef {Object} PasswordLoginParams
 * @property {string} username 登录账号
 * @property {string} password 登录密码
 */

/**
 * 微信手机号换取参数。
 *
 * @typedef {Object} GetPhoneInfoByCodeParams
 * @property {string} appid 微信应用或小程序 appid
 * @property {string} code 微信手机号授权 code
 */

/**
 * 统一响应结构。
 *
 * @template T
 * @typedef {Object} ApiResult
 * @property {number} code 业务状态码
 * @property {T} data 响应数据
 */

/**
 * 登录返回的用户信息。
 *
 * @typedef {Object} LoginUserInfo
 * @property {string} [nickname] 用户昵称
 * @property {string} [avatar] 用户头像
 */

/**
 * 登录成功后的结果结构。
 *
 * @typedef {Object} LoginResult
 * @property {string} token 登录令牌
 * @property {string|number|Date|Object} tokenExpired token 过期时间
 * @property {LoginUserInfo} userInfo 用户信息
 * @property {string} [accountId] 业务账号 ID
 */

/**
 * 微信手机号授权换取结果。
 *
 * @typedef {Object} PhoneInfoResult
 * @property {string} appid 当前请求的 appid
 * @property {string} phoneNumber 完整手机号
 * @property {string} purePhoneNumber 去区号手机号
 * @property {string} countryCode 国家区号
 */

/**
 * 发送短信验证码。
 *
 * 当前为本地 mock 实现，生产环境应替换为真实短信发送接口。
 *
 * @param {SendSmsParams} params 短信发送参数
 * @returns {Promise<ApiResult<string>>} 返回本次生成的验证码
 */
export function sendSmsApi(params) {
  return getJasperLoginRegistry().services.sms.sendSms(params);
}

/**
 * 校验短信验证码。
 *
 * 当前为本地 mock 实现，生产环境应替换为真实验证码校验接口。
 *
 * @param {VerifySmsParams} params 验证码校验参数
 * @returns {Promise<ApiResult<boolean>>} 返回验证码是否匹配
 */
export function smsCheckApi(params) {
  return getJasperLoginRegistry().services.sms.verifySms(params);
}

/**
 * 执行手机号登录。
 *
 * 支持验证码登录、一键登录、微信手机号登录等场景。
 * 当前为本地 mock 实现，生产环境应替换为真实登录接口。
 *
 * @param {LoginParams} params 登录参数
 * @returns {Promise<ApiResult<LoginResult>>} 返回登录结果
 */
export function loginApi(params) {
  return getJasperLoginRegistry().services.auth.loginByPhone(params);
}

/**
 * 执行账号密码登录。
 *
 * 当前为本地 mock 实现，生产环境应替换为真实账号密码登录接口。
 *
 * @param {PasswordLoginParams} params 账号密码登录参数
 * @returns {Promise<ApiResult<LoginResult>>} 返回登录结果
 */
export function passwordLoginApi(params) {
  return getJasperLoginRegistry().services.auth.loginByPassword(params);
}

/**
 * 通过微信手机号授权 code 获取手机号信息。
 *
 * 当前为本地 mock 实现，生产环境应替换为真实微信服务端接口。
 *
 * @param {GetPhoneInfoByCodeParams} params 微信手机号授权参数
 * @returns {Promise<ApiResult<PhoneInfoResult>>} 返回解析后的手机号信息
 */
export function getPhoneInfoByCode(params) {
  return getJasperLoginRegistry().services.weixin.getPhoneInfoByCode(params);
}

/**
 * 微信登录预留接口。
 *
 * 当前用于兼容旧逻辑占位，生产环境可按实际微信登录流程替换。
 *
 * @returns {Promise<ApiResult<boolean>>} 返回登录结果
 */
export function weixinLoginApi(params) {
  return getJasperLoginRegistry().services.weixin.loginByWeixin(params);
}
