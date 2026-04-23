/**
 * @description 点击切换列表元素, 兼容Vue2 和 Vue3
 *
 * @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>场景<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * @1 用于点击切换列表元素 `activeColor` 触摸颜色
 * @2 开启自动翻页功能
 *
 * @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>注意<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * @注意： this.valueSync != value 比较时会进行类型转换, 比较宽泛, 而this.valueSync!==value 不会进行类型转换 类型必须严格

 * @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * @event    {Function}             onChange            切换状态
 * @event    {Function}             onRadioChange       点击切换raido
 *
 * @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * @property {Number|String|Boolean}       value               是否开启/激活           默认false
 * @property {Number|String|Boolean}       modalValue          是否开启/激活           默认false
 */

export default {
    props: {
        // 支持 Vue 2 的 v-model
        value: {
            type:  [Number, String, Boolean],
            default: ''
        },
        // 支持 Vue 3 的 v-model
        modelValue: {
            type: [Number, String, Boolean],
            default: ''
        }
    },
    watch:{
        // #ifdef VUE2
        value:{
            handler(value){
                if (this.valueSync != value) {
                    this.onChange({value});
                }
            },
            immediate : true
        },
        // #endif
        // #ifdef VUE3
        modelValue:{
            handler(value){
                if (this.valueSync != value) {
                    this.onChange({value});
                }
            },
            immediate : true
        }
        // #endif
    },
    data() {
        return {
            valueSync: '',
        };
    },
    methods:{
        onChange(e) {
            let value = e.value;
            this.valueSync = value;
            //兼容vue2
            this.$emit("input", value);
            //兼容vue3
            this.$emit('update:modelValue', value)
            // 因为watch是立即执行，value 初始化时为空
            if(this.cacheKey){
                uni.setStorageSync(this.cacheKey , value);
            }
        },
        /**
         * @param {string} name radio中指定的name属性
         * @param {string} key  列表中指定的属性
         */
        onRadioChange(name, key) {
            let value = this.list.filter(item=> item.name === name).map(item=> item[key]).pop(); // list 要跟使用的组件保持一致
            uni.setStorageSync(this.cacheKey+`-${key}` , value);
        }
    }
}
