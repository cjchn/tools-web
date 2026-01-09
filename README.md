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

### 怎么增加新功能

1. 添加菜单：[tools.ts](src/components/Tools/tools.ts)
2. 修改图片：[logo](public/images/logo/)
3. 添加路由：[router.ts](src/router/router.ts)
4. 创建组件：[src/components/Tools/New/New.vue](src/components/Tools/)

### 接口获取添加动态目录和路由
动态目录就是跳转到三方站点的菜单，因为不想手动配，就写了一个接口。
接口对接的有个管理端，可以配置，可以参考接口返回内容自己定义表。
```
# 路由配置API端点，动态目录和路由
VITE_ROUTES_API_ENDPOINT = 'http://localhost:8085/open/tool/site/bookmarks'
# Show字典API端点，菜单隐藏显示
VITE_SHOW_API_ENDPOINT = 'http://localhost:8085/open/sys/dicts/code'
```
返回接口示例
```jsonc
{
  "code": 0,
  "message": "OK",
  "data": [
    {
      "cate": "搜索工具",
      "code": "baidu",
      "title": "百度",
      "logo": "",
      "description": "百度",
      "url": "http://www.baidu.com/",
      "isShow": 1
    }
  ]
}
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| cate | string | 分类 |
| code | string | 菜单，用来组装目录和路由，不能和已有配置相同，否则无法实现跳转 |
| title | string | 功能名称 |
| logo | string | 图表，不指定默认使用 `/images/logo/jump.jpg` |
| description | string | 功能描述 |
| url | string | 功能链接 |
| isShow | number | 是否显示，1显示，0隐藏，其他默认显示 |
更多处理逻辑可以查看[src/api/tools.ts](src/api/tools.ts).getToolsCate

### 分类方式

分类按照数字前缀进行排序，具体分类方式如下：

| 数字前缀 | 分类名称 |
|---------|------|
| 0 | 自用   |
| 1 | 搜索   |
| 2 | 学习   |
| 3 | 文本   |
| 4 | 图片   |
| 5 | 音乐   |
| 6 | 视频   |
| 7 | 建站   |
| 8 | 金融   |
| 9 | 其他   |

### 本地工具配置

本地工具配置在[src/components/Tools/tools.ts](src/components/Tools/tools.ts)文件中，包含了所有工具的详细信息和分类。
