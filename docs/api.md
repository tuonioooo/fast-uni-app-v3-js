### 接口参数配置说明

默认全局接口校验规则：
	
1）、校验接口错误逻辑  2）、返回响应的data部分
    
请求参数 “custom” 说明
	
```
custom:{
	auth: boolean  			代表请求接口,  true: 需要携带token, false: 不需要携带token
	body: boolean			接口响应结果， true: 返回全部响应信息	false: 只返回结果
	ignoreCheck: boolean	接口响应结果错误处理, true: 返回全部响应信息且不走全局抛出错误提示 false: 抛出错误提示
}
```

接口调用

```vue
<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { sampleApi } from '@/api/sample';

const handleSample = async () =>{
	const res = await sampleApi();
	console.log(res);
}

onMounted(()=>{
	handleSample();
})
```
