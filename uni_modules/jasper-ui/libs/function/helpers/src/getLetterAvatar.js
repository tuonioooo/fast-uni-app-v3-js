import {getCurrentInstance} from "vue";

/**
 * @description 函数作用
 * 这个函数ioLetterAvatar根据给定的文本生成一个包含该文本首字母的彩色头像图像。它创建一个canvas元素，
 * 使用不同的颜色和图案填充背景，并在中央显示首字母，最后返回图像的Base64编码URL。
 * @example ioLetterAvatar('灵力', 98); 返回一个Base64编码的URL，可以直接在网页上使用。
 * @param text
 * @param size
 * @param customColor
 */
const ioLetterAvatar = (text, size, customColor) => {
    //#ifdef H5

    text = text || "";
    size = size || 60;

    const colors = [
        "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#3fe95e", "#16a085",
        "#27ae60", "#2980b9", "#8e44ad", "#fc3e50", "#f1c40f", "#e67e22",
        "#e74c3c", "#00bcd4", "#95aa36", "#f39c12", "#d35400", "#c0392b",
        "#b2df1e", "#7ffc8d"
    ];

    const initial = text.toUpperCase().charAt(0) || "?";
    const pixelRatio = window.devicePixelRatio || 1;
    size = size * pixelRatio;

    const code = initial === "?" ? 72 : initial.charCodeAt(0);
    const index = code % colors.length;
    const color = customColor || colors[index];
    const nextColor = colors[(index + 1) % colors.length];
    const prevColor = colors[(index - 1 + colors.length) % colors.length];

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    if (context) {
        context.fillStyle = color;
        context.fillRect(0, 0, size, size);

        context.beginPath();
        context.arc((code * 180) % size, (code * 150) % size, (code / 120) % size, 0, 2 * Math.PI);
        context.fillStyle = nextColor;
        context.globalAlpha = 0.6;
        context.fill();
        context.save();

        context.beginPath();
        context.arc((code * 20) % size, (code * 50) % size, (99999 - code) % size / 80, 0, 2 * Math.PI);
        context.fillStyle = prevColor;
        context.globalAlpha = 0.4;
        context.fill();
        context.restore();

        context.font = `${Math.round(size / 2)}px 'Microsoft Yahei'`;
        context.textAlign = "center";
        context.fillStyle = "#fff";
        context.globalAlpha = 1;
        context.fillText(initial, size / 2, size / 1.5);
    }

    return canvas.toDataURL();
    //#endif

};

const getFirstCharacter = (text) => {
    text = text || "";
    const initial = text.toUpperCase().charAt(0) || "?";
    return initial;
}


const ioLetterAvatarApp = (text, size, canvasId, customColor) => {
    //#ifndef H5

    text = text || "";
    const originSize = size;
    size = size || 60;
    const colors = [
        "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#3fe95e", "#16a085",
        "#27ae60", "#2980b9", "#8e44ad", "#fc3e50", "#f1c40f", "#e67e22",
        "#e74c3c", "#00bcd4", "#95aa36", "#f39c12", "#d35400", "#c0392b",
        "#b2df1e", "#7ffc8d"
    ];

    const initial = text.toUpperCase().charAt(0) || "?";

    const pixelRatio = uni.getWindowInfo().pixelRatio;


    size = size * pixelRatio;


    const code = initial === "?" ? 72 : initial.charCodeAt(0);
    const index = code % colors.length;
    const color = customColor || colors[index];
    const nextColor = colors[(index + 1) % colors.length];
    const prevColor = colors[(index - 1 + colors.length) % colors.length];


    //需要在页面创建一个不直接显示在页面上     <canvas canvas-id="offscreenCanvas" id="offscreenCanvas" style="width: 100%; height: 100%; top: -1000px"></canvas>
    //创建离屏画布上下文
    //const canvasId = `offscreenCanvas-${sort}`;
    console.log(canvasId, "000000000", initial);

    const instance = getCurrentInstance();
    const ctx = uni.createCanvasContext(canvasId, instance);

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);


    ctx.beginPath();
    ctx.arc((code * 180) % size, (code * 150) % size, (code / 120) % size, 0, 2 * Math.PI);
    ctx.fillStyle = nextColor;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.save();

    ctx.beginPath();
    ctx.arc((code * 20) % size, (code * 50) % size, (99999 - code) % size / 80, 0, 2 * Math.PI);
    ctx.fillStyle = prevColor;
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.restore();


    ctx.setFontSize(Math.round(size / 2))
    ctx.setTextAlign('center');
    ctx.setFillStyle('#fff');
    ctx.globalAlpha = 1;
    ctx.fillText(initial, size / 2, size / 1.5, size);

    return new Promise((resolve, reject) => {
        /**
         * draw(reserve: boolean)
         * reserve: boolean：
         * false：表示不保留之前的绘图内容，默认值。如果 reserve 设置为 false，每次调用 draw() 时都会清除画布上的所有内容，并重新绘制当前的内容。
         * true：表示保留之前的绘图内容。如果 reserve 设置为 true，新绘制的内容会叠加在已有的画布内容上，不会清除之前的内容。
         */
        ctx.draw(false, () => {
            uni.canvasToTempFilePath({
                canvasId,
                width: size,
                height: size,
                destWidth: originSize,  //设置输出画布的大小
                destHeight: originSize, //设置输出画布的大小
                success: (res) => {
                    //console.log("ioLetterAvatarApp获取canvas临时头像本地路径成功=", res.tempFilePath)
                    // resolve({
                    //     sort, //排序的位置
                    //     path: res.tempFilePath
                    // });
                    resolve(res.tempFilePath);
                },
                fail: (err) => {
                    //console.error('ioLetterAvatarApp = ', err)
                    reject(err);
                }
            }, instance);
        });
    });
    //#endif
}

export {
    ioLetterAvatar,
    ioLetterAvatarApp,
    getFirstCharacter
}