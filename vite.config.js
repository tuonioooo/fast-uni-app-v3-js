import { defineConfig } from 'vite';
import process from 'node:process';
import uni from '@dcloudio/vite-plugin-uni';
// @ts-ignore
import postCssPxToViewPort from 'postcss-px-to-viewport';
import autoprefixer from 'autoprefixer';

const isH5 = process.env.UNI_PLATFORM === 'h5';

export default defineConfig(() => {
  return {
    plugins: [uni()],
    css: {
      postcss: {
        plugins: [
          postCssPxToViewPort({
            unitToConvert: 'rpx',
            viewportWidth: 200,
            unitPrecision: 6,
            viewportUnit: 'px',
            fontViewportUnit: 'px',
            propList: ['*'],
            selectorBlackList: ['.ignore'],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [],
            include: [],
            landscape: false,
          }),
          autoprefixer({
            env: 'h5',
            remove: isH5,
            supports: isH5,
            overrideBrowserslist: isH5
              ? ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
              : [],
          }),
        ],
      },
    },
  };
});
