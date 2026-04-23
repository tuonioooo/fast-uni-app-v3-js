export function parseByType( key , value , valueType ){
	if (uni.$unc.isNull(valueType)) {
		return value ;
	}
	
	//转换函数
	if (uni.$unc.isFn(valueType)) {
		return valueType.call( uni.$unc.getRoot() , value , key );
	}
	
	//空值
	if (uni.$unc.isNull(value)) {
		if (valueType == 'object') {
			return {} ;
		}
		if (valueType == 'array') {
			return [] ;
		}
		return "" ;
	}
	
	if (valueType == 'int') {
		return parseInt(value);
	}
	if (valueType == 'float') {
		return parseFloat(value);
	}
	if ( (valueType == 'boolean' || valueType == 'bool') && uni.$unc.isBoolean(value)) {
		return uni.$unc.isTrue(value) ;
	}
	if ( ( (valueType == 'object' || valueType == 'json') && uni.$unc.isJsonStr(value) ) || (valueType == 'array' && uni.$unc.isArrayStr(value) ) ) {
		return JSON.parse(value) ;
	}
	if (valueType.toLowerCase().indexOf("time") > -1) {
		let v = uni.$unc.parseDate(value) ;
		if (!uni.$unc.isDate(v)) {
			return value ;
		}
		if ( valueType == 'timestamp' ) {
			return v.getTime() ;
		}
		if ( valueType == 'startTimestamp' ) {
			return v.setHours(0,0,0,0) ;
		}
		if ( valueType == 'endTimestamp' ) {
			return v.setHours(23,59,59,999) ;
		}
		if ( valueType == 'startTime' ) {
			v.setHours(0,0,0,0) ;
			return uni.$unc.format( v , "seconds" ) ;
		}
		if ( valueType == 'endTime' ) {
			v.setHours(23,59,59,999) ;
			return uni.$unc.format( v , "seconds" ) ;
		}
	}
	
	if( valueType == 'string'){
		return uni.$unc.isArray(value) || uni.$unc.isObject(value) ? JSON.stringify(value) : value + '' ;
	}
	return value ;
}