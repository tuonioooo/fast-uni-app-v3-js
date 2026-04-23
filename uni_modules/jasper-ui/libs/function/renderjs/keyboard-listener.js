
/**
 * @description 用于监听页面键盘输入事件，使用场景：在组件中，禁止输入一些特殊的字符限定，比如：手机号、邮箱等
 * 事件顺序：keydown->keypress->keyup
 * 说明：由于keyup 在过滤字符时，会出现闪缩再删除，因此用keypress事件代替
 * @example 
    
	逻辑层引入:
	<script module="keyboard" lang="renderjs">
		export {default} from "@/uni_modules/jasper-ui/libs/renderjs/keyboard-listener.js" ;
	</script>
	
	逻辑层顶一个方法接受键盘输入内容:
	methods:{
		onKeyEvent(data){
			console.log(data, "---onKeyEvent---");
		},
	}
 */
const names = ['keydown', 'keyup', 'keypress']
export default {
  mounted () {
    names.forEach(name => {
      document.addEventListener(name, this.onKey)
    })
  },
  destoryed(){
	  names.forEach(name => {
	    document.removeEventListener(name, this.onKey)
	  })
  },
  methods:{
	onKey(event){
		//事件顺序：keydown->keypress->keyup 所以采用keydown
		if(event.key != 'Backspace'){
			if(event.type==='keydown' || event.type==='keypress' || event.type==='keyup'){
				if(event.target.value && /[\u4E00-\u9FA5]/g.test(event.target.value)){
					//如果输入中文、将阻止默认行为 并将内容置空
					event.target.value = "";
					event.preventDefault();
					return;
				}
				if(/[^0-9\s]/g.test(event.target.value)){
					//如果输入非数字字符（忽略空格字符）、将阻止默认行为 并将内容置空
					event.target.value = "";
					event.preventDefault();
					return;
				}
			}
		}
		const keys1 = ['type', 'timeStamp']
		const keys2 = ['altKey', 'code', 'ctrlKey', 'isComposing', 'key', 'location', 'metaKey', 'repeat', 'shiftKey']
		const keys3 = ['char', 'charCode', 'keyCode', 'keyIdentifier', 'keyLocation', 'which']
		const data = {}
		keys1.concat(keys2, keys3).forEach(key => data[key] = event[key])
		this.$ownerInstance.callMethod('onKeyEvent', data)
	}
  }
}