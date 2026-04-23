
/**
 * 通过H5+ api 获取设备的唯一标识, 如果错误就取 uni-app的deviceId
 */
async function getDeviceId() {
	// #ifdef APP-PLUS
	return new Promise((resolve, reject) => {
		plus.device.getInfo({
			success: function(e) {
				resolve(e.uuid);
			},
			fail: function(e) {
				console.log('plus.device.getInfo failed: ' + JSON.stringify(e));
				reject(uni.getDeviceInfo().deviceId);
			}
		});
	})
	// #endif

	// #ifdef H5
	uni.showModal({
		content: 'PC固定设备号为：pc-h5-1000'
	})
	return "pc-h5-1000"
	// #endif
}

/**
 * @description  获取设备信息 (设备信息+系统信息)
 */
async function getDeviceInfo() {
	const deviceId = await getDeviceId();
	const systemInfo = uni.getSystemInfoSync();
	return {
		...systemInfo,
		plus: {
			deviceId //设备唯一Id
		},
	}
}

/**
 * @description 查询媒体设备类型
 * @param {Number} width 屏幕宽度
 * @return {Object} name:媒体类型，minWidth宽度下限，maxWidth媒体宽度上限
 */
function getDeviceType(width){
	width = width || uni.getSystemInfoSync().windowWidth ;
	for(let device of devicesData){
		if ( width >= device.minWidth && width < device.maxWidth) {
			return { ...device } ;
		}
	}
}

/**
 * @description 判断是否是宽屏PC设备
 */
function isPc(){
	let device = getDeviceType();
	return ['pc' , 'landscapePc','smallPc'].indexOf(device.name) > -1 ;
}

/**
 * 设备公共存储目录
 * @type {{Pictures: string, Music: string, Documents: string, Downloads: string, Camera: string, Movies: string, DCIM: string, Ringtones: string}}
 */
const DEVICE_PUBLIC_DIRECTORY = {
	Downloads: 'file:///storage/emulated/0/Download',
	Documents: 'file:///storage/emulated/0/Documents',
	Pictures: 'file:///storage/emulated/0/Pictures',
	DCIM: 'file:///storage/emulated/0/DCIM',
	Camera: 'file:///storage/emulated/0/DCIM/Camera',
	Movies: 'file:///storage/emulated/0/Movies',
	Music: 'file:///storage/emulated/0/Music',
	Ringtones: 'file:///storage/emulated/0/Ringtones',
}

export {
	getDeviceInfo,
	getDeviceId,
	getDeviceType,
	isPc,
	DEVICE_PUBLIC_DIRECTORY
}