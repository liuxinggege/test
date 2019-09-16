# 落地页服务使用说明书

落地页服务，用来在服务器端生成混淆的落地页页面

- 落地页页面的服务器端渲染
- 落地页页面的混淆处理
- 落地页模版的自动添加

## 运行环境

- Node 10.X 
- MongoDB 4.X

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
   tsc
```

### 打包正式服

```shell
./build.sh
```

### 启动服务

>domain-guard
- 启动命令: node bin/app.js 