// api/sample.js
// 业务 API 层：直接调用 callMock，不再包含任何 mock 实现细节

import { callMock } from '@/mock/index.js';

/**
 * 查询通用分页列表
 * @param {{ page?: number, size?: number, type?: number }} params
 */
export const queryList = (params = {}) => callMock('/api/query/list', 'get', params);

/**
 * 查询聊天记录列表
 * @param {{ page?: number, size?: number }} params
 */
export const queryChatList = (params = {}) => callMock('/api/query/chat', 'get', params);

/**
 * 查询商品列表
 * @param {{ page?: number, size?: number }} params
 */
export const queryGoods = (params = {}) => callMock('/api/query/goods', 'get', params);

/**
 * 查询新闻列表
 * @param {{ page?: number, size?: number }} params
 */
export const queryNews = (params = {}) => callMock('/api/query/news', 'get', params);

/**
 * 查询猫咪列表
 */
export const queryCats = (params = {}) => callMock('/api/query/cats', 'get', params);

/**
 * 查询用户信息
 */
export const queryUser = () => callMock('/api/user', 'get');

/**
 * 自定义baseURL，忽略检测
 * @param {*} params
 * @returns
 */
export const sampleApi = async (params = {}) => {
  return await uni.$uv.http.get('/api', {
    ...params,
    custom: { ignoreCheck: true },
    baseURL: 'https://yesno.wtf',
  });
};
