在开源项目<a href="https://github.com/naroat/tools-web" target="_blank">Tools-Web</a>基础上，添加了自己常用的一些工具。

### 手动部署

安装`pnpm`
```
npm install pnpm -g
```

克隆
```
git clone --depth=1 https://github.com/naroat/tools-web.git
```

安装
```
# 进入项目
cd tools-web

# 复制配置文件
cp .env.example .env.development

# 安装
pnpm install
```

启动
```
pnpm dev
```

打包
```
pnpm build
```

打包seo静态页面:复制`.env.development`文件，并将文件名修改为`.env.production`,将里面的`NODE_ENV`的值改为`productio`,然后运行下面打包命令
```
pnpm build:pro
```
