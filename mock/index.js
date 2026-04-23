// mock/index.js
// 统一出口：callMock()
// 兼容 vue-cli、HBuilderX 全端（H5 / 小程序 / APP）
// uni.showLoading / hideLoading 在 H5 和小程序下均可用

import mockData from './mock.js';

/**
 * 调用 mock 接口
 *
 * @param {string}  url         接口路径，如 '/api/query/list'
 * @param {string}  [method]    请求方法，默认 'get'
 * @param {object}  [query]     查询参数，如 { page: 1, size: 10 }
 * @param {boolean} [loading]   是否显示加载提示，默认 true
 * @returns {Promise<*>}
 *
 * @example
 *   import { callMock } from '@/mock/index.js';
 *   const res = await callMock('/api/query/list', 'get', { page: 1, size: 10 });
 */
export function callMock(url, method = 'get', query = {}, loading = true, showLog = true) {
  const matched = mockData.find(
    (item) => item.url === url && item.method.toLowerCase() === method.toLowerCase()
  );

  if (!matched) {
    console.warn(`[mock] 未匹配到接口: ${method.toUpperCase()} ${url}`);
    return Promise.resolve(null);
  }

  if (showLog) {
    console.log('%c\n----------请求开始--------', 'color:green;');
    console.info(`请求参数：${JSON.stringify(query)}`);
    console.log('%c----------请求结束--------\n', 'color:green;');
  }

  if (loading) {
    uni.showLoading({ title: '加载中...' });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      if (loading) uni.hideLoading();
      resolve(
        matched.response({
          query,
          body: {},
          headers: {},
          params: {},
        })
      );
    }, matched.timeout || 0);
  });
}
