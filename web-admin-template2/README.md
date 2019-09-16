## 主后台
>主后台前端资源

>Vue/Typescript项目


>安装依赖
```shell
npm i
```

>修改配置
```shell
    #本地测试资源地址
    cp ./config/config.json.bak ./config/config.json
```
>运行本地环境
```shell
npm run dev
```

>打包正式服
1. 调整 ./config/prod_apiList.json中配置的后台API线路 

2. 打包:
    ```shell
    git checkout master
    ./build.sh prod
    
>部署

    将 ./dist 的资源放到nginx下。