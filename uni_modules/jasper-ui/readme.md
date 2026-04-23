# jasper-ui

setup

```
npm i jasper-ui

```

uni-app easycom config

```json
{
    //...
    "easycom": {
        // 采用了vue-cli 方式来安装 uv-ui
        "autoscan": true,
            "custom": {
            "^jasper-(.*)": "jasper-ui/components/jasper-$1/jasper-$1.vue"
        }
    }
}
```

