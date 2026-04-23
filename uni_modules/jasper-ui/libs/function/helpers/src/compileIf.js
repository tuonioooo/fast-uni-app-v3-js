//#ifdef VUE3
import {computed} from "vue";
const isWeixinMP = computed(()=> {
    // 使用条件编译确定当前平台是否为微信小程序
    //#ifdef MP-WEIXIN
    return true;
    //#endif
    //#ifndef MP-WEIXIN
    return false;
    //#endif
});
//#endif

// #ifndef VUE3
const isWeixinMP = {
    get value() {
        // #ifdef MP-WEIXIN
        return true;
        // #endif
        // #ifndef MP-WEIXIN
        return false;
        // #endif
    }
};
// #endif

export { isWeixinMP };
