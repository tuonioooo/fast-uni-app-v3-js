// src/composables/usePagination.ts
import {ref} from 'vue';

interface PageData {
    list: any[];            //数据列表
    curPageLen: number;     //当前页数据长度
    totalPages: number;     //总页数
    isLastPage: boolean | undefined;    //是否最后一页
    total: number,          // 总记录数
    page: number;           //页码
    size: number;           //每页数据长度
}


/**
 * @description 一个公共分页hooks组件
 */

export function usePagination() {
    const defineData: PageData = {
        list: [],
        curPageLen: 0,      //当前页数据长度
        total: 0,           // 总记录数
        isLastPage: undefined,  // 默认 undefined
        totalPages: 0,      // 总页数
        page: 1,            // 当前页码 默认从1开始计算
        size: 10,           // 每页数据长度
    }
    const pageData = ref<PageData>({...defineData});
    const emptyPageData = {...defineData};
    const isLoading = ref<'loading' | 'noMore' | 'error' | 'more'>('noMore');
    const contentText = ref({
        contentdown: "上拉显示更多",
        contentrefresh: "正在加载...",
        contentnomore: "已显示全部数据",
    });
    const showLoadingModal = ref<boolean>(true); // 默认显示加载中弹窗
    const showLog = ref<boolean>(true); // 默认显示加载中弹窗

    async function queryPageData(fn: (params: any) => Promise<any>) {
        try {
            if (!pageData.value.page || !pageData.value.size) {
                return emptyPageData;
            }
            if (pageData.value.page < 0 || pageData.value.size <= 0) {
                return emptyPageData;
            }
            //如果是最后一页，则不请求数据
            if(pageData.value.isLastPage){
                console.info(`已经是最后一页了`)
                return;
            }

            if (isLoading.value === 'loading') {
                return;
            }

            isLoading.value = isLoading.value === 'error' ? 'error' : 'loading';

            //计算页数
            if(pageData.value.isLastPage != undefined){
                if (!pageData.value.isLastPage || pageData.value.totalPages > pageData.value.page) {
                    pageData.value.page++;
                }
            }
            if (showLog) {
                console.log('%c\n----------请求开始--------', 'color:green; font-weight:bold;');
                console.info(`请求参数：【page:${pageData.value.page},size:${pageData.value.size}】`)
            }
            if(showLoadingModal){
                uni.showLoading({
                    title: '加载中...'
                })
            }

            //回调接口 获取数据
            const res = await fn({
                page: pageData.value.page,
                size: pageData.value.size,
            });

            if (!res || !res.data || !res.data.list) {
                isLoading.value = 'noMore';
                return;
            }
            pageData.value.list = res.data.list ? pageData.value.list.concat(res.data.list) : pageData.value.list;
            pageData.value.curPageLen = res.data.list ? res.data.list.length : 0;
            pageData.value.totalPages = (res?.totalPages || res?.totalPage) ?? -1;
            pageData.value.isLastPage = pageData.value.curPageLen < pageData.value.size;

            isLoading.value = pageData.value.isLastPage ? 'noMore' : 'more';

            if (showLog) {
                console.log('%c----------请求结束--------\n', 'color:green; font-weight:bold;');
            }
        } catch (e) {
            console.error('Error in queryPageData:', e);
            isLoading.value = 'error';
        } finally {
            if(showLoadingModal){
                uni.hideLoading();
            }
        }
    }

    return {
        pageData,
        isLoading,
        contentText,
        queryPageData,
    };
}
