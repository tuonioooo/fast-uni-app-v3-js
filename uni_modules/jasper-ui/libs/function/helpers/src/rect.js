
/**
 * @description 查询节点信息
 */
function queryRect(selector , vm , method ){
    return new Promise((resolve, reject)=>{
        // #ifdef APP-NVUE
        const dom = uni.requireNativePlugin('dom')
        // #endif

        const ref = this.$refs[selector];
        dom.getComponentRect(ref, res => {
            resolve(res.size)
        })
    });
}


function select(selector , vm){
    return queryRect(selector , vm , "select");
}

function selectAll(selector , vm){
    return queryRect(selector , vm , "selectAll");
}

export {
    select ,
    selectAll
}