/**
 * @description 跳转第三方应用 如：微信、QQ、微博等 公共组件
 */
export default {
    data() {
        return {
            romName: '',
            launchApps: [{
                id: 'wechat',
                name: '微信',
                pname: 'com.tencent.mm',
                openURL: 'https://weixin.qq.com/',
                action: 'weixin://'
            },
                {
                    id: 'qq',
                    name: 'QQ',
                    pname: 'com.tencent.mobileqq',
                    openURL: 'https://weixin.qq.com/',
                    action: 'mqq://'
                },
                {
                    id: 'taobao',
                    name: '淘宝',
                    pname: 'com.taobao.taobao',
                    openURL: 'https://market.m.taobao.com/app/fdilab/download-page/main/index.html',
                    action: 'taobao://' //指定关键字搜索 taobao://s.taobao.com/search?q=uni-app
                },
                {
                    id: 'jd',
                    name: '京东',
                    pname: 'com.jingdong.app.mall',
                    openURL: 'https://app.jd.com/',
                    action: 'openApp.jdMobile://'
                },
                {
                    id: 'weibo',
                    name: '新浪微博',
                    pname: 'com.sina.weibo',
                    openURL: 'https://c.weibo.cn/',
                    action: 'sinaweibo://'
                },
                {
                    id: 'youku',
                    name: '优酷',
                    pname: 'com.youku.phone',
                    openURL: 'https://youku.com/product/index',
                    action: 'youku://'
                },
                {
                    id: 'ios_photo',
                    name: 'IOS照片',
                    pname: '',
                    action: 'photos-redirect://'
                },
                {
                    id: 'miui_photo',
                    name: '小米相册',
                    pname: 'com.miui.gallery',
                    action: ''
                },
                {
                    id: 'google_photo',
                    name: 'Google相册',
                    pname: 'com.google.android.apps.photos',
                    action: ''
                },
                {
                    id: 'emui_photo',
                    name: '华为相册',
                    pname: 'com.android.gallery3d',
                    action: ''
                },
                {
                    id: 'gallery3d_photo',
                    name: '三星相册',
                    pname: 'com.android.gallery3d',
                    action: ''
                },
                {
                    id: 'oppo_photo',
                    name: 'oppo相册',
                    pname: 'com.oppo.gallery',
                    action: ''
                },
                {
                    id: 'vivo_photo',
                    name: 'vivo相册',
                    pname: 'com.vivo.gallery',
                    action: ''
                },
            ]
        }
    },
    mounted() {
        let platform = uni.getSystemInfoSync().platform;
        if (platform == 'ios') {
            this.romName = 'ios'; //https://uniapp.dcloud.net.cn/api/system/info.html#romname
        } else {
            this.romName = uni.getSystemInfoSync().romName; //https://uniapp.dcloud.net.cn/api/system/info.html#romname
        }
    },
    methods: {
        goLaunchApp(launchId, title = '正在跳转第三方应用...') {
            try {

                // 打开微信扫一扫功能
                // let Intent = plus.android.importClass('android.content.Intent')
                // let ComponentName = plus.android.importClass('android.content.ComponentName')
                // let intent = new Intent()
                // intent.setComponent(new ComponentName('com.tencent.mm', 'com.tencent.mm.ui.LauncherUI'))
                // intent.putExtra('LauncherUI.From.Scaner.Shortcut', true)
                // intent.setFlags(335544320)
                // intent.setAction('android.intent.action.VIEW')
                // let main = plus.android.runtimeMainActivity()
                // main.startActivity(intent)

                // const androidNativeOpenLaunch = (action) => {
                // 	var Intent = plus.android.importClass("android.content.Intent");
                // 	var Uri = plus.android.importClass("android.net.Uri");
                // 	// 导入后可以使用new方法创建类的实例对象
                // 	var main = plus.android.runtimeMainActivity();
                // 	// 相当于常量 Intent.ACTION_VIEW = "android.intent.action.VIEW"
                // 	var intent = new Intent(Intent.ACTION_VIEW, Uri.parse(action)); // "snssdk1112://xx?xx=xx"
                // 	main.startActivity(intent)
                // }

                if (launchId != 'photo') {
                    uni.showToast({
                        title,
                        icon: 'none',
                    })
                }

                const getLocalAppId = (app_suffix) => {
                    let romName = this.romName;
                    if (!romName) return undefined
                    return romName.toLowerCase().concat("_").concat(app_suffix)
                }

                const getLaunchApp = (launchId) => {
                    switch (launchId) {
                        case 'photo' :
                            return this.launchApps.find(a => a.id == getLocalAppId('photo'))
                        default:
                            return this.launchApps.find(a => a.id == launchId)
                    }
                }

                const failCall = (error, openURL = '') => {
                    console.log(error)
                    if (openURL) {
                        showModal(openURL)
                    }
                }

                const showModal = (openURL) => {
                    uni.showModal({
                        title: '提示',
                        content: '您还没有此APP,去下载',
                        success: function (res) {
                            if (res.confirm) {
                                plus.runtime.openURL(
                                    openURL,
                                    failCall);
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                }

                let launchApp = getLaunchApp(launchId)
                console.log(launchApp, "======launchApp=====")
                if (plus.os.name == 'Android') { //安卓
                    //查看安卓系统手机是否下载这款app
                    if (plus.runtime.isApplicationExist({
                        pname: launchApp.pname
                    })) {
                        //已安装 打开第三方应用
                        plus.runtime.launchApplication({
                                pname: launchApp.pname
                            },
                            failCall);
                    } else {
                        //未安装app 提示去下载
                        showModal(launchApp.openURL);
                    }
                } else if (plus.os.name == 'iOS') { //苹果
                    // 因为ios查不到B款app在ios系统手机里面，其实下载了，也是检测不到，所以就不检测了
                    // 直接打开微信app，微信pp没有的话，会进入回调报错，我们在回调去打开下载链接
                    plus.runtime.launchApplication({
                            action: launchApp.action
                        },
                        (error) => failCall(error, launchApp.openURL));
                }

            } catch (e) {
                console.error("goLaunchApp", e)
                uni.showToast({
                    title: '启动应用异常',
                    icon: 'none'
                })
            }
        }
    }

}
