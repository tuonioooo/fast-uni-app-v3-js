const DEFAULT_NAV_HEIGHT = 44;
const DEFAULT_GAP = 10;

export function getSystemInfoSync() {
  if (uni.$jasper?.getSystemInfoSync) {
    return uni.$jasper.getSystemInfoSync();
  }
  return uni.getSystemInfoSync();
}

export function createSystemInfoState() {
  return {
    systemInfo: getSystemInfoSync(),
    cssSafeAreaInsetBottom: -1,
    defaultNavHeight: DEFAULT_NAV_HEIGHT,
    gap: DEFAULT_GAP,
  };
}

export function getWindowTop(systemInfo, defaultNavHeight = DEFAULT_NAV_HEIGHT) {
  if (!systemInfo) return 0;
  const windowTop = systemInfo.windowTop || 0;
  return windowTop === 0 ? defaultNavHeight : windowTop;
}

export function getStatusBarHeight(systemInfo) {
  if (!systemInfo) return 0;
  return systemInfo?.statusBarHeight || 0;
}

export function getWindowNavAndStatusBarHeight(systemInfo, defaultNavHeight = DEFAULT_NAV_HEIGHT) {
  if (!systemInfo) return 0;
  return getWindowTop(systemInfo, defaultNavHeight) + getStatusBarHeight(systemInfo);
}

export function getSafeAreaTop(systemInfo) {
  if (!systemInfo) return 0;
  return systemInfo?.safeAreaInsets?.top || 0;
}

export function getSafeAreaBottom(systemInfo, cssSafeAreaInsetBottom = -1) {
  if (!systemInfo) return 0;

  // #ifdef APP-PLUS || MP-WEIXIN
  return systemInfo?.safeAreaInsets?.bottom || 0;
  // #endif

  // #ifndef APP-PLUS
  return Math.max(cssSafeAreaInsetBottom, 0);
  // #endif
}

export function getWindowWidth(systemInfo) {
  if (!systemInfo) return 0;
  return systemInfo.windowWidth || 0;
}

export function getWxMenuButtonBoundingInfo() {
  // #ifdef MP-WEIXIN
  return uni.getMenuButtonBoundingClientRect();
  // #endif

  // #ifndef MP-WEIXIN
  return null;
  // #endif
}

export function getWxMenuButtonBottomStyle(wxMenuButtonBoundingInfo) {
  const wxMenuButtonBottom = wxMenuButtonBoundingInfo?.bottom ?? 0;
  return {
    paddingTop: `${wxMenuButtonBottom}px`,
  };
}

export function getMainContentStyleUseGap(systemInfo, gap = DEFAULT_GAP, defaultNavHeight = DEFAULT_NAV_HEIGHT) {
  // #ifdef MP-WEIXIN
  const wxMenuButtonBottom = getWxMenuButtonBoundingInfo()?.bottom ?? 0;
  return {
    marginTop: `${wxMenuButtonBottom + gap}px`,
  };
  // #endif

  // #ifndef MP-WEIXIN
  return {
    marginTop: `${getWindowNavAndStatusBarHeight(systemInfo, defaultNavHeight)}px`,
  };
  // #endif
}

export function getMainContentStyle(systemInfo, defaultNavHeight = DEFAULT_NAV_HEIGHT) {
  // #ifdef MP-WEIXIN
  const wxMenuButtonBottom = getWxMenuButtonBoundingInfo()?.bottom ?? 0;
  return {
    marginTop: `${wxMenuButtonBottom}px`,
  };
  // #endif

  // #ifndef MP-WEIXIN
  return {
    marginTop: `${getWindowNavAndStatusBarHeight(systemInfo, defaultNavHeight)}px`,
  };
  // #endif
}

export function getMainContentContainNavStyle(systemInfo, defaultNavHeight = DEFAULT_NAV_HEIGHT) {
  // #ifdef MP-WEIXIN
  const wxMenuButtonBottom = getWxMenuButtonBoundingInfo()?.bottom ?? 0;
  const windowTop = getWindowTop(systemInfo, defaultNavHeight);
  return {
    marginTop: `${windowTop + wxMenuButtonBottom}px`,
  };
  // #endif

  // #ifndef MP-WEIXIN
  return {
    marginTop: `${getWindowNavAndStatusBarHeight(systemInfo, defaultNavHeight)}px`,
  };
  // #endif
}

export function getMainTop(systemInfo, defaultNavHeight = DEFAULT_NAV_HEIGHT) {
  // #ifdef MP-WEIXIN
  const wxMenuButtonBottom = getWxMenuButtonBoundingInfo()?.bottom ?? 0;
  return getWindowTop(systemInfo, defaultNavHeight) + wxMenuButtonBottom;
  // #endif

  // #ifndef MP-WEIXIN
  return getWindowNavAndStatusBarHeight(systemInfo, defaultNavHeight);
  // #endif
}
