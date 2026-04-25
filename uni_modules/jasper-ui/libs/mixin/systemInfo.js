import {
    createSystemInfoState,
    getMainContentContainNavStyle,
    getMainContentStyle,
    getMainContentStyleUseGap,
    getMainTop,
    getSafeAreaBottom,
    getSafeAreaTop,
    getStatusBarHeight,
    getWindowNavAndStatusBarHeight,
    getWindowTop,
    getWindowWidth,
    getWxMenuButtonBottomStyle,
    getWxMenuButtonBoundingInfo
} from '../function/helpers/system-info-core.js';

/**
 * Options API 系统信息 mixin。
 *
 * 适用场景：
 * 1. 仍然使用 `data / computed / methods` 的页面或组件
 * 2. 不方便迁移到 `setup()` 的历史页面
 *
 * 暴露字段与 `libs/hooks/useSystemInfo.js` 保持一致，避免 Options API
 * 页面与 Composition API 页面在同一批系统信息字段上出现命名差异。
 */
export default {
    /**
     * 初始化系统信息状态。
     */
    data() {
        return createSystemInfoState();
    },
    computed: {
        // #ifdef MP-WEIXIN
        /**
         * 微信小程序胶囊按钮信息。
         */
        wxMenuButtonBoudingInfo() {
            return getWxMenuButtonBoundingInfo();
        },
        /**
         * 基于微信胶囊按钮生成的顶部 padding 样式。
         */
        wxMenuButtonBottomStyle() {
            return getWxMenuButtonBottomStyle(this.wxMenuButtonBoudingInfo);
        },
        // #endif
        /**
         * 主内容区域样式，微信小程序额外保留一个 gap 间距。
         */
        mainContentStyleUseGap() {
            return getMainContentStyleUseGap(this.systemInfo, this.gap, this.defaultNavHeight);
        },
        /**
         * 主内容区域样式。
         */
        mainContentStyle() {
            return getMainContentStyle(this.systemInfo, this.defaultNavHeight);
        },
        /**
         * 计算“内容区域包含导航栏”时的顶部样式。
         */
        mainContentContainNavStyle() {
            return getMainContentContainNavStyle(this.systemInfo, this.defaultNavHeight);
        },
        /**
         * 兼容不同平台的主内容顶部数值。
         */
        mainTop() {
            return getMainTop(this.systemInfo, this.defaultNavHeight);
        },
        /**
         * 顶部可用导航高度。
         *
         * 当平台没有返回 `windowTop` 时，会回退到默认导航高度。
         */
        windowTop() {
            return getWindowTop(this.systemInfo, this.defaultNavHeight);
        },
        /**
         * 状态栏高度。
         */
        statusBarHeight(){
            return getStatusBarHeight(this.systemInfo);
        },
        /**
         * 导航栏高度。
         *
         * 这里与 `windowTop` 保持一致，保留该字段是为了兼容历史调用方。
         */
        windowNavHeight() {
            return this.windowTop;
        },
        /**
         * 导航栏高度 + 状态栏高度。
         *
         * 大多数页面标题区、首屏内容区都会直接使用这个值做顶部偏移。
         */
        windowNavAndStatusBarHeight() {
            return getWindowNavAndStatusBarHeight(this.systemInfo, this.defaultNavHeight);
        },
        /**
         * 与 hook 保持一致的顶部内容高度别名。
         */
        windowContentTop() {
            return this.windowNavAndStatusBarHeight;
        },
        /**
         * 顶部安全区高度。
         */
        safeAreaTop() {
            return getSafeAreaTop(this.systemInfo);
        },
        /**
         * 顶部安全区样式对象。
         */
        safeAreaHeight(){
            return {
                height: this.safeAreaTop + 'px'
            }
        },
        /**
         * 底部安全区高度。
         *
         * App / 微信小程序优先读系统安全区，其它平台从页面测量值兜底。
         */
        safeAreaBottom() {
            return getSafeAreaBottom(this.systemInfo, this.cssSafeAreaInsetBottom);
        },
        /**
         * 可用窗口宽度。
         */
        windowWidth() {
            return getWindowWidth(this.systemInfo);
        }
    },
    mounted() {
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
