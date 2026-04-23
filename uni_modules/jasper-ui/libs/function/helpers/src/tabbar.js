/**
 * @description tabBar 跨平台控制显示、隐藏
 *  一、目的：区分H5版本与APP-PLUS、小程序版本
 *  二、避免出现如下提示：
 *      -   1.hideTabBar:fail not TabBar page
 *      -   2. showTabBar:fail not TabBar page
 * @see https://ask.dcloud.net.cn/question/194607
 */

function showTabBar(){

    // H5隐藏或删除DOM
    // #ifdef H5
    const el = document.querySelector('.uni-tabbar-bottom');
    if (el) {
        el.style.display = ''; // 显示
    }
    // #endif

    // #ifdef APP-PLUS
    uni.showTabBar();
    // #endif
}

function hideTabBar(){
    // H5隐藏或删除DOM
    // #ifdef H5
    const el = document.querySelector('.uni-tabbar-bottom');
    if (el) {
        el.style.display = 'none'; // 隐藏
    }
    // #endif

    // #ifdef APP-PLUS
    uni.hideTabBar();
    // #endif
}

export {
    showTabBar,
    hideTabBar
}