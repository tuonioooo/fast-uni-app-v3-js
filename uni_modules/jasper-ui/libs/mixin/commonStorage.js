import {calcDate} from "../function/helpers/src/time.js";

/**
 * @description
 * 场景：设置缓存key的过期时间
 */
export default {
	methods: {
		/**
		 * 设置保存缓存的过期时间
		 * @param {Object} key		缓存Key
		 * @param {Object} value	缓存value
		 * @param {Object} expiredMilliseconds	过期时间  默认是15天后过期
		 */
		setStorageSyncByExpired(key, value, expiredMilliseconds) {
			if (!expiredMilliseconds) {
				expiredMilliseconds = calcDate(new Date(), 15).getTime() //默认过期时间是 15天后过期
			}
			uni.setStorageSync(key, value) //存储键值对
			uni.setStorageSync(key + "-expired", expiredMilliseconds) //存储Key的过期时间
		},
		/**
		 * 获取指定key的缓存内容
		 * @param {Object} key
		 */
		getStorageSyncByExpired(key) {
			let expiredMilliseconds = uni.getStorageInfoSync(key + "-expired")
			if (expiredMilliseconds < Date.now()) { //已过期
				this.removeStorageSyncByExpired(key)
			}
			return uni.getStorageSync(key)
		},
		removeStorageSyncByExpired(key){
			uni.removeStorageSync(key)
			uni.removeStorageSync(key + "-expired")
		}
	}

}
