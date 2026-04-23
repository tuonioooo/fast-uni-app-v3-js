<script setup>
import {useSampleStore} from '@/stores/sample'
import {storeToRefs} from "pinia";
import {onMounted, reactive, ref} from "vue";
import {queryCatsMockApi} from "@/api/mock/mock";

// 简单的pinia示例
const store = useSampleStore();
const {count, doubleCount} = storeToRefs(store)
let cats = ref('');

onMounted(async () => {
  const res = await queryCatsMockApi();
  cats.value = JSON.stringify(res.data)
})

</script>
<template>
  <view style="display: flex; justify-content: center; align-items: center; margin-top: 50px;">
    pinia状态值：{{ count }} {{ doubleCount }}
  </view>
  <view style="width: 100%; margin-top: 20rpx;" class="text-center  plr">
    简单mock接口的值：
    <uv-textarea v-model="cats" class="clip" height="100"></uv-textarea>
  </view>
</template>
<style>
</style>