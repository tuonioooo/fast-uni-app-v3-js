/**
 * 动态生成meta标签
 */
const createMate = () => {
    let meta = document.createElement("meta");
    meta.content = "no-referrer";
    meta.name = "referrer";
    document.getElementsByTagName("head")[0].appendChild(meta);
}


export {
    createMate,
}