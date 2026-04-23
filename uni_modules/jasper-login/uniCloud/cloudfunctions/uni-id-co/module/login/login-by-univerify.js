const {
  getPhoneNumber
} = require('../../lib/utils/univerify')


/**
 * App端一键登录
 * @tutorial https://uniapp.dcloud.net.cn/uniCloud/uni-id-pages.html#login-by-univerify
 * @param {Object} params
 * @param {String} params.access_token  APP端一键登录返回的access_token
 * @param {String} params.openid        APP端一键登录返回的openid
 * @param {String} params.inviteCode    邀请码
 * @returns
 */
module.exports = async function (params = {}) {
  const schema = {
    access_token: 'string',
    openid: 'string',
    inviteCode: {
      required: false,
      type: 'string'
    }
  }
  this.middleware.validate(params, schema)
  const {
    // eslint-disable-next-line camelcase
    access_token,
    openid,
    inviteCode
  } = params

  let mobile
  try {
    console.log();
    const phoneInfo = await getPhoneNumber.call(this, {
      // eslint-disable-next-line camelcase
      access_token,
      openid
    })
    //云函数返回结果, phoneInfo = {"code":0,"errCode":0,"errMsg":"","success":true,"phoneNumber":"16270569395"}
	return phoneInfo;
  } catch (error) {
	console.err(error)
    throw error
  }
  
}
