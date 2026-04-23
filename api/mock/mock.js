

/**
 * @description mock api
 */

/**
 * @example
 *  '''
 *  import { queryCatsMockApi } from '@/api/mock';
 *  const res = await queryCatsMockApi();
 *  '''
 * @param params
 */
const queryCatsMockApi = async (params = {}) => {
    return await uni.$uv.http.get('/api/query/cats', {
        params,
        custom: {ignoreCheck: true},
        baseURL: 'http://localhost:5173',
    })
}

const queryGoodsMockApi = async (params = {}) => {
    return await uni.$uv.http.get('/api/query/goods', {
        params,
        custom: {ignoreCheck: true},
        baseURL: 'http://localhost:5173',
    })
}


export {
    queryCatsMockApi,
    queryGoodsMockApi,
}