// useSystemInfo.js/ts
import { ref, computed, onMounted } from 'vue';
import { getCurrentInstance } from 'vue';

// 定义一个自定义 hooks
export function useSystemInfo() {

    const systemInfo: any = uni.getSystemInfoSync();
    const cssSafeAreaInsetBottom = ref<number>(-1);
    const defaultNavHeight = 44;    //默认导航的高度

    //保存微信小程序胶囊的底部位置
    const gap = 15;

    // 在组件挂载时获取系统信息
    onMounted(()=>{
        const instance = getCurrentInstance();
        const query = uni.createSelectorQuery().in(instance?.proxy);
        query
            .select("jasper-abs-safe-area-inset-bottom")
            .boundingClientRect((data: any) => {
                // console.log("得到布局位置信息" + JSON.stringify(data));
                // console.log("节点离页面顶部的距离为" + data.top);
                cssSafeAreaInsetBottom.value = data?.height || 0;
            })
            .exec();


    })

    // #ifdef MP-WEIXIN
    // 获取微信胶囊的信息配置
    const wxMenuButtonBoudingInfo = computed(()=>{
        return uni.getMenuButtonBoundingClientRect();
    })

    // 创建一个微信胶囊bottom位置style, gap=15是设置的与胶囊的间隙
    const wxMenuButtonBottomStyle = computed(() => {
        const wxMenuButtonBottom = wxMenuButtonBoudingInfo?.value?.bottom ?? 0;
        return {
            paddingTop: `${wxMenuButtonBottom}px`
        };
    });

    // #endif

    // 创建一个包含安全导航的内容区域Top的style
    const mainContentStyleUseGap = computed(() => {
        // #ifdef MP-WEIXIN
        const wxMenuButtonBottom = wxMenuButtonBoudingInfo?.value?.bottom ?? 0;
        console.log(`初始化小程序胶囊bottom=[${wxMenuButtonBottom}]`, `导航bottom=[${windowContentTop.value}]`);
        return {
            marginTop: `${wxMenuButtonBottom + gap}px`
        };
        // #endif
        // #ifndef MP-WEIXIN
        return {
            marginTop: `${windowContentTop.value}px`
        };
        // #endif
    });

    const mainContentStyle = computed(() => {
        // #ifdef MP-WEIXIN
        const wxMenuButtonBottom = wxMenuButtonBoudingInfo?.value?.bottom ?? 0;
        console.log(`初始化小程序胶囊bottom=[${wxMenuButtonBottom}]`, `导航bottom=[${windowContentTop.value}]`);
        return {
            marginTop: `${wxMenuButtonBottom}px`
        };
        // #endif
        // #ifndef MP-WEIXIN
        return {
            marginTop: `${windowContentTop.value}px`
        };
        // #endif
    });

    const mainContentContainNavStyle = computed(() => {
        // #ifdef MP-WEIXIN
        const wxMenuButtonBottom = wxMenuButtonBoudingInfo?.value?.bottom ?? 0;
        console.log(`初始化小程序胶囊bottom=[${wxMenuButtonBottom}]`, `导航bottom=[${windowContentTop.value}]`);
        return {
            marginTop: `${windowNavHeight.value + wxMenuButtonBottom}px`
        };
        // #endif
        // #ifndef MP-WEIXIN
        return {
            marginTop: `${windowContentTop.value}px`
        };
        // #endif
    });

    const mainTop = computed(()=>{
        // #ifdef MP-WEIXIN
        const wxMenuButtonBottom = wxMenuButtonBoudingInfo?.value?.bottom ?? 0;
        console.log(`初始化小程序胶囊bottom=[${wxMenuButtonBottom}]`, `导航bottom=[${windowContentTop.value}]`);
        return windowNavHeight.value + wxMenuButtonBottom;
        // #endif
        // #ifndef MP-WEIXIN
        return windowContentTop.value;
        // #endif
    })



    //获取顶部可用距离(通常是原生导航栏的高度)
    const windowTop = computed(() => {
        if (!systemInfo) return 0;
        // 暂时修复vue3中隐藏系统导航栏后windowTop获取不正确的问题，具体bug详见https://ask.dcloud.net.cn/question/141634
        // 感谢litangyu！！https://github.com/SmileZXLee/uni-z-paging/issues/25
        // 2024-07-18 貌似已经修复了
        // #ifdef VUE3 && H5
        const pageHeadNode = document.getElementsByTagName("uni-page-head");
        if (!pageHeadNode.length) return 0;
        // #endif
        return systemInfo.windowTop || 0
    });


    // 获取导航的高度
    const windowNavHeight = computed(() => {
        if (!systemInfo) return 0;
        return windowTop.value == 0 ? defaultNavHeight : windowTop.value;
    })

    /**
     * 获取顶部可用的内容距离：顶部可用距离（原生导航栏高度/自定义导航栏高度）+状态栏高度
     */
    const windowContentTop = computed(() => {
        if (!systemInfo) return 0;
        return windowNavHeight.value + systemInfo?.statusBarHeight || 0;
    })

    const safeAreaTop = computed(() => {
        if (!systemInfo) return 0;
        let safeAreaBottom = 0;
        safeAreaBottom = systemInfo?.safeAreaInsets?.top || 0 ;
        return safeAreaBottom;

    })

    // 底部安全区域高度
    const safeAreaBottom = computed(() => {
        if (!systemInfo) return 0;
        let safeAreaBottom = 0;
        // #ifdef APP-PLUS
        safeAreaBottom = systemInfo?.safeAreaInsets?.bottom || 0 ;
        // #endif
        // #ifndef APP-PLUS
        safeAreaBottom = Math.max(cssSafeAreaInsetBottom.value, 0);
        // #endif
        return safeAreaBottom;
    });

    //可使用窗口的宽度
    const windowWidth = computed(()=>{
        if (!systemInfo) return 0;
        return systemInfo.windowWidth;
    })

    // 返回响应式数据和计算属性，以便在组件中使用
    return {
        systemInfo,
        windowTop,
        windowWidth,
        windowContentTop,
        safeAreaTop,
        safeAreaBottom,
        cssSafeAreaInsetBottom,
        // #ifdef MP-WEIXIN
        wxMenuButtonBoudingInfo,
        wxMenuButtonBottomStyle,
        // #endif
        mainContentStyle,
        mainContentContainNavStyle,
        mainTop,
        mainContentStyleUseGap
    };
}