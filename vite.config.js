import { defineConfig, loadEnv } from "vite";
import process from 'node:process'
import uni from "@dcloudio/vite-plugin-uni";
//@ts-ignore
import postCssPxToViewPort from 'postcss-px-to-viewport';
import autoprefixer from 'autoprefixer'
import { viteMockServe } from "vite-plugin-mock";
import path from 'node:path'

const isH5 = process.env.UNI_PLATFORM === 'h5'
const isApp = process.env.UNI_PLATFORM === 'app'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); //载入环境变量
  return {
    plugins: [
      uni(),
      viteMockServe({
        mockPath: 'mock', // mock文件存放的路径，默认是根目录下的mock文件夹
        enable: env.VITE_USE_MOCK === 'on'
      }),
    ],
    css: {
      postcss: {
        plugins: [
          //https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md
          postCssPxToViewPort({ // 自适应，px>rem转换
            // 要转化的单位
            unitToConvert: 'rpx',
            // UI设计稿的大小
            viewportWidth: 200,
            // 转换后的精度
            unitPrecision: 6,
            // 转换后的单位
            viewportUnit: 'px',
            // 字体转换后的单位
            fontViewportUnit: 'px',
            // 能转换的属性，*表示所有属性，!border表示border不转
            propList: ['*'],
            // 指定不转换为视窗单位的类名，
            selectorBlackList: ['.ignore'],
            // 最小转换的值，小于等于1不转
            minPixelValue: 1,
            // 是否在媒体查询的css代码中也进行转换，默认false
            mediaQuery: false,
            // 是否转换后直接更换属性值
            replace: true,
            // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
            exclude: [],
            // 包含那些文件或者特定文件
            include: [],
            // 是否处理横屏情况
            landscape: false
          }),
          autoprefixer({ // 自动添加前缀
            env: 'h5',
            remove: isH5,   //仅支持h5
            supports: isH5, //仅支持h5
            //在nvue环境下 不编译前缀
            overrideBrowserslist: isH5
              ? [
                "Android 4.1",
                "iOS 7.1",
                "Chrome > 31",
                "ff > 31",
                "ie >= 8"
              ]
              : [],
          })
        ]
      },
    }
  }
});
