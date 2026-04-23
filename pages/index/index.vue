<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"/>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>

    <view style="width: 100%; margin-top: 20rpx;">
      <button @click="increment">增加</button>
    </view>
    <view style="width: 100%; margin-top: 20rpx;">
      <button @click="decrement">减少</button>
    </view>

    <view style="width: 100%; margin-top: 20rpx;" class="text-center">
      pinia状态值：{{ count }}  {{doubleCount}}
    </view>

    <view style="width: 100%; margin-top: 20rpx;" class="text-center plr">

      简单示例接口的值  ：
      <uv-textarea v-model="sampleRes" height="100"></uv-textarea>
    </view>

    <view style="width: 100%; margin-top: 20rpx;" class="text-center plr">

      加密方法：{{jiamiValue}}

    </view>

    <view style="width: 100%; margin-top: 20rpx;" class="text-center plr">

      时间：{{timeObj}}

    </view>

  </view>


</template>

<script setup>
import { useSampleStore } from '@/stores/sample'
import {onMounted, ref} from 'vue';
import {sampleApi} from '@/api/sample';
import { storeToRefs} from "pinia";
import UncTitle from "@/uni_modules/jasper-ui/components/jasper-title/jasper-title.vue";
import dayjs from "dayjs";
import  'dayjs/locale/de'; // 日文
const title = ref('Hello')

const jiamiValue = ref('');

const timeObj = ref({});

// 简单的pinia示例
const store = useSampleStore();
const { count, doubleCount } = storeToRefs(store)
//作为 action 的 increment 可以直接解构
const { increment, decrement } = store

//简单示例接口
const sampleRes = ref('');

const handleSample = async () => {
  sampleRes.value = JSON.stringify(await sampleApi())
}

onMounted(() => {
  handleSample();
  jiami();
  handleTime();
  console.log('%c\n【工具类测试】', 'color:green; font-weight:bold;');
  console.log(`uni.$uv.os()=${uni.$uv.os()}`)
  console.log(`uni.$uv.sys()=${uni.$uv.sys()}`)
  console.log(`uni.$uv.trim(\' abc \')=${uni.$uv.trim(' abc ')}`);	// 去除两端空格
  console.log(`uni.$uv.random(1, 3)=${uni.$uv.random(1, 3)}`); //获取随机数
  console.log(`uni.$unc.uuid(8)=${uni.$unc.uuid(8)}`);
})

const jiami = ()=>{

  jiamiValue.value = uni.$unc.encryptAES('12345678', '12345678', '12345678');
}

const handleTime = ()=>{
  const date = new Date()
  uni.$unc.timeByDayjs.setLocale('de');

  console.log(uni.$unc.timeByDayjs.getLocale());

  console.log(dayjs(date).format())

  timeObj.value = {
    '当前时间+1天': uni.$unc.calcDate(date, 1),
    '获取指定时间的星期几': uni.$unc.getWeek(date),
  '时间签名1': uni.$unc.formatDateToSign(new Date('2024-11-29')),
    '时间签名2': uni.$unc.timeByDayjs.getRelativeTime(new Date('2024-11-29'))
  }
}

</script>

<style lang="scss">

.t1 {
  height: calc(100vh - var(--window-top) - env(safe-area-inset-bottom));
}

.content {
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 16px;
  color: #8f8f94;
}
</style>
