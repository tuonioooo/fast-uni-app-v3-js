export default {
    data() {
        return {
            systemInfo: uni.$jasper.getSystemInfoSync(),
            cssSafeAreaInsetBottom: -1,
            defaultNavHeight: 44,
            gap: 10,
        };
    },
    computed: {
        // #ifdef MP-WEIXIN
        wxMenuButtonBoudingInfo() {
            return uni.getMenuButtonBoundingClientRect();
        },
        wxMenuButtonBottomStyle() {
            const wxMenuButtonBottom = this.wxMenuButtonBoudingInfo?.bottom ?? 0;
            return {
                paddingTop: `${wxMenuButtonBottom}px`
            };
        },
        // #endif
        // 中心内容区域高度含间隙值Style
        mainContentStyleUseGap() {
            // #ifdef MP-WEIXIN
            const wxMenuButtonBottom = this.wxMenuButtonBoudingInfo?.bottom ?? 0;
            return {
                marginTop: `${wxMenuButtonBottom + this.gap}px`
            };
            // #endif
            // #ifndef MP-WEIXIN
            return {
                marginTop: `${this.windowNavAndStatusBarHeight}px`
            };
            // #endif
        },
        // 中心内容区域高度Style
        mainContentStyle() {
            // #ifdef MP-WEIXIN
            const wxMenuButtonBottom = this.wxMenuButtonBoudingInfo?.bottom ?? 0;
            return {
                marginTop: `${wxMenuButtonBottom}px`
            };
            // #endif
            // #ifndef MP-WEIXIN
            return {
                marginTop: `${this.windowNavAndStatusBarHeight}px`
            };
            // #endif
        },
        mainContentContainNavStyle() {
            // #ifdef MP-WEIXIN
            const wxMenuButtonBottom = this.wxMenuButtonBoudingInfo?.bottom ?? 0;
            return {
                marginTop: `${this.windowNavHeight + wxMenuButtonBottom}px`
            };
            // #endif
            // #ifndef MP-WEIXIN
            return {
                marginTop: `${this.windowNavAndStatusBarHeight}px`
            };
            // #endif
        },
        // 兼容平台内容的top值
        mainTop() {
            // #ifdef MP-WEIXIN
            const wxMenuButtonBottom = this.wxMenuButtonBoudingInfo?.bottom ?? 0;
            return this.windowNavHeight + wxMenuButtonBottom;
            // #endif
            // #ifndef MP-WEIXIN
            return this.windowNavAndStatusBarHeight;
            // #endif
        },
        // 计算导航高度
        windowTop() {
            if (!this.systemInfo) return 0;
            // 暂时修复vue3中隐藏系统导航栏后windowTop获取不正确的问题，具体bug详见https://ask.dcloud.net.cn/question/141634
            // 感谢litangyu！！https://github.com/SmileZXLee/uni-z-paging/issues/25
            // 2024-07-18 貌似已经修复了
            // #ifdef VUE3 && H5
            const pageHeadNode = document.getElementsByTagName("uni-page-head");
            if (!pageHeadNode.length) return 0;
            // #endif
            return this.systemInfo.windowTop || 0;
        },
        statusBarHeight(){
            if (!this.systemInfo) return 0;
            return this.systemInfo?.statusBarHeight || 0;
        },
        // 导航栏高度
        windowNavHeight() {
            if (!this.systemInfo) return 0;
            return this.windowTop == 0 ? this.defaultNavHeight : this.windowTop;
        },
        // 导航高度+状态栏高度
        windowNavAndStatusBarHeight() {
            if (!this.systemInfo) return 0;
            return this.windowNavHeight + this.statusBarHeight;
        },
        safeAreaTop() {
            // 如果没有刘海的设备，safeAreaTop = statusBarHeight，否则 safeAreaTop > statusBarHeight
            if (!this.systemInfo) return 0;
            let safeAreaTop = 0;
            safeAreaTop = this.systemInfo.safeAreaInsets.top || 0;
            return safeAreaTop;
        },
        safeAreaHeight(){
            return {
                height: this.safeAreaTop + 'px'
            }
        },
        safeAreaBottom() {
            if (!this.systemInfo) return 0;
            let safeAreaBottom = 0;
            // #ifdef APP-PLUS || MP-WEIXIN
            safeAreaBottom = this.systemInfo.safeAreaInsets.bottom || 0;
            // #endif
            // #ifndef APP-PLUS
            safeAreaBottom = Math.max(this.cssSafeAreaInsetBottom, 0);
            // #endif
            return safeAreaBottom;
        }
    },
    mounted() {
        if (!this.systemInfo) this.systemInfo = uni.$jasper.getSystemInfoSync(); // 注意：uni.$jasper.getSystemInfoSync() 是 UniApp 的 API
        //#ifdef MP-WEIXIN
        console.log(`[安全区域top=${this.safeAreaTop},导航高度=${this.windowNavHeight},状态栏高度=${this.statusBarHeight},微信胶囊信息=${JSON.stringify(this.wxMenuButtonBoudingInfo)}]`)
        //#endif
        //#ifndef MP-WEIXIN
        console.log(`[安全区域top=${this.safeAreaTop},导航高度=${this.windowNavHeight},状态栏高度=${this.statusBarHeight}]`)
        //#endif
        this.$nextTick(() => {
            const query = uni.createSelectorQuery().in(this);
            query
                .select(".jasper-abs-safe-area-inset-bottom")
                .boundingClientRect((data) => {
                    // console.log("得到布局位置信息" + JSON.stringify(data));
                    // console.log("节点离页面顶部的距离为" + data.top);
                    this.cssSafeAreaInsetBottom = data?.height || 0;
                })
                .exec();
        });
    }
};
