<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { queryChatList } from '@/api/sample';
import { useSampleStore } from '@/stores/sample';

const store = useSampleStore();
const { count, doubleCount } = storeToRefs(store);
const cats = ref('');

onMounted(async () => {
  const res = await queryChatList();
  cats.value = JSON.stringify(res);
});
</script>

<template>
  <view style="display: flex; justify-content: center; align-items: center; margin-top: 50px">
    pinia状态值：{{ count }} {{ doubleCount }}
  </view>
  <view style="width: 100%; margin-top: 20rpx" class="text-center plr">
    简单mock接口的值：
    <uv-textarea v-model="cats" class="clip" height="100">
      {{ cats }}
    </uv-textarea>
  </view>
</template>

<style></style>
