const uniRouteList = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];

export default function ({ path, query }) {
  uniRouteList.forEach((item) => {
    //页面跳转时拦截
    uni.addInterceptor(item, {
      //拦截前
      async invoke(args) {
        //console.log(path, query);

        //其他拦截判断 todo something
        return args;
      },
      //成功回调拦截
      success(args) {
        //console.log('interceptor-success', args)
      },
      fail(err) {
        //console.log('interceptor-fail', err)
      },
      //完成回调拦截
      complete(res) {
        //console.log('interceptor-complete', res)
      },
    });
  });
}
