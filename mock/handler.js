// mock/handler.js
// 公共工具函数：分页处理、响应包装
// 全端兼容（vue-cli / HBuilderX / H5 / 小程序 / APP）

/**
 * 标准响应包装
 * @param {*} data
 * @param {string} msg
 * @returns {{ code: number, msg: string, data: * }}
 */
export function success(data, msg = 'ok') {
  return { code: 200, msg, data };
}

/**
 * 分页切片
 * @param {Array}  list      完整数据集
 * @param {number} pageNo    页码，从 1 开始
 * @param {number} pageSize  每页条数
 * @returns {{ list: Array, total: number, hasNext: boolean }}
 */
export function paginate(list, pageNo, pageSize) {
  const no = Math.max(1, parseInt(pageNo) || 1);
  const size = Math.max(1, parseInt(pageSize) || 10);
  const start = (no - 1) * size;
  const slice = list.slice(start, start + size);
  return {
    list: slice,
    total: list.length,
    totalPage: Math.ceil(list.length / size),
    hasNext: start + size < list.length,
  };
}

/**
 * 生成通用列表项
 * @param {number} count   总条数
 * @param {number} type    类型标识（透传给 detail 字段）
 * @returns {Array}
 */
export function buildList(count, type = 0) {
  return Array.from({ length: count }, (_, i) => ({
    title: String(i + 1),
    detail: '测试信息' + type,
  }));
}

/**
 * 生成聊天列表项
 * @param {number} count
 * @param {string[]} newses  内容池，随机取
 * @returns {Array}
 */
export function buildChatList(count, newses = []) {
  return Array.from({ length: count }, () => ({
    name: '哆啦A梦',
    icon: '/static/duola.jpg',
    content: newses[Math.floor(Math.random() * newses.length)] || '',
    isMe: false,
  }));
}
