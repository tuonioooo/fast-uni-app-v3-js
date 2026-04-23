const uniIdCommon = require('uni-id-common')
const {
  getType,
  checkIdCard
} = require('./common/utils')
const {
  checkClientInfo,
  Validator
} = require('./common/validator')
const ConfigUtils = require('./lib/utils/config')
const {
  isUniIdError,
  ERROR
} = require('./common/error')
const middleware = require('./middleware/index')
const universal = require('./common/universal')

const {
  loginByUniverify,
} = require('./module/login/index')


module.exports = {
  async _before () {
    // 支持 callFunction 与 URL化
    universal.call(this)
    // 获取客户端信息
    const clientInfo = this.getUniversalClientInfo()
    /**
     * 检查clientInfo，无appId和uniPlatform时本云对象无法正常运行
     * 此外需要保证用到的clientInfo字段均经过类型检查
     * clientInfo由客户端上传并非完全可信，clientInfo内除clientIP、userAgent、source外均为客户端上传参数
     * 否则可能会出现一些意料外的情况
     */
    checkClientInfo(clientInfo)
    let clientPlatform = clientInfo.uniPlatform
    // 统一platform名称
    switch (clientPlatform) {
      case 'app':
      case 'app-plus':
        clientPlatform = 'app'
        break
      case 'web':
      case 'h5':
        clientPlatform = 'web'
        break
      default:
        break
    }

    this.clientPlatform = clientPlatform

    // 挂载uni-id实例到this上，方便后续调用
    this.uniIdCommon = uniIdCommon.createInstance({
      clientInfo
    })

    // 包含uni-id配置合并等功能的工具集
    this.configUtils = new ConfigUtils({
      context: this
    })
    this.config = this.configUtils.getPlatformConfig()
    this.hooks = this.configUtils.getHooks()

    this.validator = new Validator({
      passwordStrength: this.config.passwordStrength
    })

    // 挂载中间件
    this.middleware = {}
    for (const mwName in middleware) {
      this.middleware[mwName] = middleware[mwName].bind(this)
    }

    // 国际化
    const i18n = uniCloud.initI18n({
      locale: clientInfo.locale,
      fallbackLocale: 'zh-Hans',
      messages: require('./lang/index')
    })
    this.t = i18n.t.bind(i18n)

    this.response = {}
  },
  _after (error, result) {
    if (error) {
      // 处理中间件内抛出的标准响应对象
      if (error.errCode && getType(error) === 'object') {
        const errCode = error.errCode
        if (!isUniIdError(errCode)) {
          return error
        }
        return {
          errCode,
          errMsg: error.errMsg || this.t(errCode, error.errMsgValue)
        }
      }
      throw error
    }
    return Object.assign(this.response, result)
  },
  /**
   * App端一键登录
   * @tutorial https://uniapp.dcloud.net.cn/uniCloud/uni-id-pages.html#login-by-univerify
   * @param {Object} params
   * @param {String} params.access_token  APP端一键登录返回的access_token
   * @param {String} params.openid        APP端一键登录返回的openid
   * @param {String} params.inviteCode    邀请码
   * @returns
   */
  loginByUniverify,
}
