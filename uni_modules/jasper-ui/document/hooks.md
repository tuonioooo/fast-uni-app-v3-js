# jasper-ui 组件中 hooks 的使用示例教程


### usePagination 示例教程

```vue
<script setup>
import {queryGoodsMockApi} from "@/api/mock/mock";
import {usePagination} from "@/uni_modules/jasper-ui/libs/hooks/usePagination";
import {onMounted} from "vue";

const pagination = usePagination();
const {pageData} = pagination;
const loadMore = () => {
  pagination.queryPageData(async (params: any) =>
      queryGoodsMockApi({ //传递一个api回调函数 这里传递的参数会自动合并到params中
        ...params,
        type: 'ALL'
      })
  )
}

onMounted(()=>{
  loadMore();
})

</script>
<template>
  <view class="uv-page">
    <!-- 普通颜色 -->
    <uv-navbar title="个人中心" bgColor="#c0c4cc" safeAreaInsetTop></uv-navbar>

    <scroll-view class="pt45" enableBackToTop="true" scroll-y @scrolltolower="loadMore" style="height: 600px; ">
      <!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
      <view class="item" v-for="(item,index) in pageData.list" :key="index">
        <view class="item-title">{{ item.title }}</view>
        <view class="item-detail">{{ item.detail }}</view>
        <view class="uv-list-item__content uv-list-item__content&#45;&#45;center">
          <text v-if="item.title" class="uv-list-item__content-title clip">{{ item.title }}</text>
          <text class="uv-list-item__content-note">列表描述信息</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<style lang="scss">
  /* #ifndef APP-NVUE */
  page {
    background-color: $uv-bg-color;
  }

  /* #endif */
  .uv-page {
    padding: 0;
    //flex: 1;
    background-color: $uv-bg-color;

    &__item {

      &__title {
        color: $uv-tips-color;
        background-color: $uv-bg-color;
        padding: 15px;
        font-size: 15px;

        &__slot-title {
          color: $uv-primary;
          font-size: 14px;
        }
      }
    }
  }
  .item-wrap {
    @include flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    background-color: #FFFFFF;
    margin-top: 10px;
  }

  .item {
    position: relative;
    height: 150rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0rpx 30rpx;
  }

  .item-detail {
    padding: 5rpx 15rpx;
    border-radius: 10rpx;
    font-size: 28rpx;
    color: white;
    background-color: #007AFF;
  }

  .item-line {
    position: absolute;
    bottom: 0rpx;
    left: 0rpx;
    height: 1px;
    width: 100%;
    background-color: #eeeeee;
  }
</style>
```