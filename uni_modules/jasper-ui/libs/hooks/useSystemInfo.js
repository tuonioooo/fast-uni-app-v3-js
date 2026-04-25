import { computed, getCurrentInstance, onMounted, ref } from 'vue';
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
  getWxMenuButtonBoundingInfo,
} from '../function/helpers/system-info-core.js';

/**
 * 组合式系统信息 hook。
 *
 * 适用场景：
 * 1. Vue 3 `setup()` / `<script setup>`
 * 2. 需要显式拿到响应式系统信息字段的组件
 *
 * 返回字段会与 `libs/mixin/systemInfo.js` 保持一致，避免同一批页面在
 * hook / mixin 之间切换时出现字段名不一致的问题。
 */
export function useSystemInfo() {
  const initialState = createSystemInfoState();
  const systemInfo = ref(initialState.systemInfo);
  const cssSafeAreaInsetBottom = ref(initialState.cssSafeAreaInsetBottom);
  const defaultNavHeight = ref(initialState.defaultNavHeight);
  const gap = ref(initialState.gap);

  /**
   * 顶部可用导航高度。
   *
   * 当平台没有返回 `windowTop` 时，会回退到默认导航高度。
   */
  const windowTop = computed(() => getWindowTop(systemInfo.value, defaultNavHeight.value));

  /**
   * 状态栏高度。
   */
  const statusBarHeight = computed(() => getStatusBarHeight(systemInfo.value));

  /**
   * 导航栏高度。
   *
   * 这里和 `windowTop` 保持一致，保留这个字段是为了兼容历史调用方。
   */
  const windowNavHeight = computed(() => windowTop.value);

  /**
   * 导航栏高度 + 状态栏高度。
   *
   * 大多数页面标题区、首屏内容区都会直接使用这个值做顶部偏移。
   */
  const windowNavAndStatusBarHeight = computed(() => {
    return getWindowNavAndStatusBarHeight(systemInfo.value, defaultNavHeight.value);
  });

  /**
   * 与 mixin 保持一致的顶部内容高度别名。
   */
  const windowContentTop = computed(() => windowNavAndStatusBarHeight.value);

  /**
   * 顶部安全区高度。
   */
  const safeAreaTop = computed(() => getSafeAreaTop(systemInfo.value));

  /**
   * 顶部安全区样式对象。
   */
  const safeAreaHeight = computed(() => ({ height: `${safeAreaTop.value}px` }));

  /**
   * 底部安全区高度。
   *
   * App / 微信小程序优先读系统安全区，其它平台从页面测量值兜底。
   */
  const safeAreaBottom = computed(() => {
    return getSafeAreaBottom(systemInfo.value, cssSafeAreaInsetBottom.value);
  });

  /**
   * 可用窗口宽度。
   */
  const windowWidth = computed(() => getWindowWidth(systemInfo.value));

  // #ifdef MP-WEIXIN
  /**
   * 微信小程序胶囊按钮信息。
   */
  const wxMenuButtonBoudingInfo = computed(() => getWxMenuButtonBoundingInfo());

  /**
   * 基于微信胶囊按钮生成的顶部 padding 样式。
   */
  const wxMenuButtonBottomStyle = computed(() => {
    return getWxMenuButtonBottomStyle(wxMenuButtonBoudingInfo.value);
  });
  // #endif

  /**
   * 主内容区域样式，微信小程序额外保留一个 gap 间距。
   */
  const mainContentStyleUseGap = computed(() => {
    return getMainContentStyleUseGap(systemInfo.value, gap.value, defaultNavHeight.value);
  });

  /**
   * 主内容区域样式。
   */
  const mainContentStyle = computed(() => {
    return getMainContentStyle(systemInfo.value, defaultNavHeight.value);
  });

  /**
   * 计算“内容区域包含导航栏”时的顶部样式。
   */
  const mainContentContainNavStyle = computed(() => {
    return getMainContentContainNavStyle(systemInfo.value, defaultNavHeight.value);
  });

  /**
   * 兼容不同平台的主内容顶部数值。
   */
  const mainTop = computed(() => getMainTop(systemInfo.value, defaultNavHeight.value));

  onMounted(() => {
    const instance = getCurrentInstance();
    const query = uni.createSelectorQuery().in(instance?.proxy);
    query
      .select('.jasper-abs-safe-area-inset-bottom')
      .boundingClientRect((data) => {
        cssSafeAreaInsetBottom.value = data?.height || 0;
      })
      .exec();
  });

  return {
    systemInfo,
    cssSafeAreaInsetBottom,
    defaultNavHeight,
    gap,
    windowTop,
    statusBarHeight,
    windowNavHeight,
    windowNavAndStatusBarHeight,
    windowContentTop,
    safeAreaTop,
    safeAreaHeight,
    safeAreaBottom,
    windowWidth,
    // #ifdef MP-WEIXIN
    wxMenuButtonBoudingInfo,
    wxMenuButtonBottomStyle,
    // #endif
    mainContentStyleUseGap,
    mainContentStyle,
    mainContentContainNavStyle,
    mainTop,
  };
}

export default useSystemInfo;
