# 代理后台前端资源使用说明书

代理后台的前端资源，用来实现各种代理后台功能的前端展示

## 编译环境

- Vue
- tsc 3.x

## 如何安装和启动服务

### 安装基本组件

>安装依赖
```shell
npm i
```

### 修改配置

```shell
    cp ./config/config.json.bak ./config/config.json
```
### 编译

```shell
   npm run build
```

### 打包正式服

1. 调整 ./config/prod_apiList.json中配置的后台API线路 

2. 打包:
    ```shell
    git checkout master
    ./build.sh prod

### 部署   

    将 ./dist 的资源放到nginx下。