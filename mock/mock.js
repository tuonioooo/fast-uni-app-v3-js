// mock/mock.js
// 接口路由表：只负责定义 url、method、timeout 和 response
// 工具函数统一从 handler.js 引入，数据从 data/index.js 引入

import { success, paginate, buildList, buildChatList } from './handler.js';
import { newsList, catList, userInfo } from './data/index.js';

export default [
  // ─── 用户信息 ───────────────────────────────────────────
  {
    url: '/api/user',
    method: 'get',
    response: () => success(userInfo),
  },

  // ─── 猫咪列表 ───────────────────────────────────────────
  {
    url: '/api/query/cats',
    method: 'get',
    response: () => success(catList),
  },

  // ─── 通用分页列表 ────────────────────────────────────────
  {
    url: '/api/query/list',
    method: 'get',
    timeout: 500,
    response: ({ query }) => {
      const { page = 1, size = 10, type = 0 } = query;
      const all = buildList(24, type);
      return success(paginate(all, page, size));
    },
  },

  // ─── 聊天记录列表 ────────────────────────────────────────
  {
    url: '/api/query/chat',
    method: 'get',
    timeout: 500,
    response: ({ query }) => {
      const { page = 1, size = 10 } = query;
      const all = buildChatList(24, newsList);
      return success(paginate(all, page, size));
    },
  },

  // ─── 商品列表 ────────────────────────────────────────────
  {
    url: '/api/query/goods',
    method: 'get',
    timeout: 500,
    response: ({ query }) => {
      const { page = 1, size = 10 } = query;
      // 按需引入商品数据，避免 goods 数据量过大时影响首屏
      const { default: goods } = require('./data/index.js');
      return success(paginate(goods, page, size));
    },
  },

  // ─── 新闻列表 ────────────────────────────────────────────
  {
    url: '/api/query/news',
    method: 'get',
    timeout: 500,
    response: ({ query }) => {
      const { page = 1, size = 10 } = query;
      const items = newsList.map((content, i) => ({
        id: i + 1,
        title: content.slice(0, 20) + '...',
        content,
      }));
      return success(paginate(items, page, size));
    },
  },
];
