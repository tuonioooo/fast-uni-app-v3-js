# 微信开发者文档

官方文档：
[微信开发者小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

### 根据acckess_token凭证、code 获取手机号的一个完整前端流程

code 获取的过程

```vue
<template>
<button type="primary" open-type="getPhoneNumber" @getphonenumber="quickLogin"
        class="uni-btn">微信授权手机号登录</button>
</template>
<script>
  export default {
      methods:{
        async quickLogin(e) {
          let options = {}
          if (e.detail.errMsg === 'getPhoneNumber:ok') {
            // 登陆成功后获取code码
            options.code = e.detail.code

            //获取accessToken
            let accessToken;
            try {
              accessToken = await this.getAccessToken();
            } catch (error) {
              console.error('Error fetching access token:', error);
              uni.showToast({
                icon: 'none',
                title: '获取access token失败'
              });
              return;
            }

            //获取微信手机号
            let phoneNumber;
            try {
              phoneNumber = await this.getPhoneNumber(accessToken, options.code);
            } catch (error) {
              console.error('Error fetching phone number:', error);
              uni.showToast({
                icon: 'none',
                title: '获取手机号失败'
              });
              return;
            }

            if (phoneNumber) {
              // 可以拿手机号去后台登录去获取 token
              // 登录成功后在当前页面内直接处理结果，不再通过全局事件总线广播
              let res = await weixinLoginApi({
                phoneNumber,
                loginType: 'weixinMobile'
              });

              if (res.code === 200) {
                // 1. 写入本地登录状态
                // 2. 执行登录成功跳转
                // 3. 或返回上一页
                uni.navigateBack();
              } else {
                uni.showToast({
                  icon: 'none',
                  title: res.msg || '登录失败'
                });
              }
            }
            
          } else if (e.detail.errno === 1400001) {
            console.error('该功能使用次数已达当前小程序上限，暂时无法使用');
            uni.showToast({
              icon: 'none',
              title: '获取手机号次数已达当前小程序上限'
            });
          } else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
            console.error('您已拒绝登录');
            uni.showToast({
              icon: 'none',
              title: '您已拒绝登录'
            });
          } else {
            uni.showToast({
              icon: 'none',
              title: '获取手机号失败'
            });
            console.error('e', e);
          }
        },
        /**
         * 获取微信accessToken
         * @return {Promise<?>}
         */
        async getAccessToken() {
          return new Promise((resolve, reject) => {
            uni.request({
                  url: 'https://api.weixin.qq.com/cgi-bin/stable_token',
                  method: 'POST',
                  data: {
                    appid: 'wxc119f8aa174f8dac',
                    secret: '0bd870c44119698b8d2927729a4db416',
                    grant_type: 'client_credential'
                  },
                  success(res) {
                    if (res.statusCode === 200 && res.data.access_token) {
                      resolve(res.data.access_token);
                    } else {
                      reject(new Error('Failed to get access token'));
                    }
                  },
                  fail(err) {
                    console.error(err);
                    reject(err);
                  }
                }
            )
          });
        },
        /**
         * 获取手机号
         * @param accessToken
         * @param code
         * @return {Promise<?>}
         */
        async getPhoneNumber(accessToken, code) {
          return new Promise((resolve, reject)=>{
            uni.request({
              url: `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
              method: 'POST',
              data: {
                code,
                // openid: _this.openid (openid非必填，所以不需要先获取用户信息，再获取手机号)
              },
              success (res) {
                if(res.errMsg === 'request:ok'){
                  console.log('获取的用户手机号：', res.data.phone_info.phoneNumber)
                  resolve(res.data.phone_info.phoneNumber)
                } else {
                  reject(new Error('Failed to get user phone number'));
                }
              },
              fail(err){
                console.error('Error getting user phone number:', err);
                reject(err);
              }
            })
          })
        },
      }
  }
</script>
```
