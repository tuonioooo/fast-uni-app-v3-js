/**
 * 提供简单的模拟登录接口
 */
import dayjs from "dayjs";
/**
 * 模拟发送验证码
 * @param phoneNumber
 * @return {Promise<unknown>}
 */
export function sendSmsApi({phoneNumber}){
    return new Promise((resolute, reject)=>{
        //延时一秒,模拟联网
        setTimeout(function() {
            try {
                const smsCode = uni.$jasper.randomDigitString(4);
                uni.setStorageSync('smsInfo', {
                    smsCode,
                    phoneNumber
                });
                //模拟接口请求成功
                resolute({
                    code: 200,
                    data: smsCode
                });
            } catch (e) {
                //模拟接口请求失败
                reject(e);
            }
        }, 1000)
    })
}

/**
 * 模拟校验验证码接口
 * @param phoneNumber
 * @param smsCode
 * @return {Promise<unknown>}
 */

export function smsCheckApi({phoneNumber, verificationCode}){
    return new Promise((resolve, reject)=>{
        //延时一秒,模拟联网
        setTimeout(function() {
            try {
                const smsInfo = uni.getStorageSync('smsInfo');
                const { smsCode: smsCodeStorage, phoneNumber: phoneNumberStorage  } = smsInfo
                const checkResult = smsCodeStorage == verificationCode && phoneNumberStorage == phoneNumber;
                //模拟接口请求成功
                resolve({
                    code: 200,
                    data: checkResult
                });
            } catch (e) {
                //模拟接口请求失败
                reject(e);
            }
        }, 1000)
    })
}

/**
 * 模拟登录接口
 * @param phoneNumber
 * @param verificationCode
 * @param loginType
 * @return {Promise<unknown>}
 */
export function uncLoginApi(params){
    return new Promise((resolve, reject)=>{
        //延时一秒,模拟联网
        setTimeout(function() {
            try {
                let checkResult = false;
                if(params.loginType == 'sms'){
                    //短信登录
                    const smsInfo = uni.getStorageSync('smsInfo');
                    const { smsCode: smsCodeStorage, phoneNumber: phoneNumberStorage  } = smsInfo
                    const {phoneNumber, verificationCode, loginType} = params;
                    checkResult = smsCodeStorage == verificationCode && phoneNumberStorage == phoneNumber && loginType=='sms';
                    if(checkResult){
                        uni.removeStorageSync('smsInfo'); //清空模拟短信验证码
                    }
                }else if(params.loginType === 'univerify' || params.loginType === 'weixinMobile'){
                    //手机号登录 三方授权 如：微信、QQ、Github等
                    checkResult = true;
                }

                if(checkResult){
                    const now = dayjs();
                    //模拟接口请求成功
                    resolve({
                        code: 200,
                        data: {
                            token: '123456789',
                            tokenExpired: now.add(5, 'day'),
                            userInfo: {
                                nickname: '模拟用户',
                                avatar: 'https://www.uvui.cn/common/logo.png'
                            }
                        }
                    });
                }else{
                    //模拟接口请求成功
                    reject({
                        code: 0,
                        msg: '登录失败'
                    });
                }

            } catch (e) {
                //模拟接口请求失败
                reject(e);
            }
        }, 1000)
    })
}


export function weixinLoginApi({phoneNumber, loginType}){
    return new Promise((resolve, reject)=>{
        //延时一秒,模拟联网
        setTimeout(function() {
            try {
                //模拟接口请求成功
                resolve({
                    code: 200,
                    data: true
                });
                uni.removeStorageSync('smsInfo'); //清空模拟短信验证码
            } catch (e) {
                //模拟接口请求失败
                reject(e);
            }
        }, 1000)
    })
}


