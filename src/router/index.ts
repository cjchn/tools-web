//通过vue-router插件实现模板路由配置
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoute } from './router'
import { getCachedRoutesData } from '@/utils/api'

//创建路由器
const router = createRouter({
  //路由模式hash
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes: constantRoute,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

/**
 * 动态加载路由配置
 * 根据API返回的工具数据，动态注册路由到vue-router
 * 
 * 工作流程:
 * 1. 从缓存获取API返回的路由数据
 * 2. 解析数据生成路由配置对象
 * 3. 过滤掉已存在的路由（避免重复注册）
 * 4. 将新路由添加到router
 * 
 * 路由数据格式:
 * {
 *   code: '路由代码',      // 用于生成路径 /code
 *   title: '工具标题',     // 用于meta.title
 *   url: '外部链接',       // 如果有值，使用beforeEnter打开外部链接
 * }
 */
export function loadDynamicRoutes() {
  // 从缓存获取API返回的路由数据
  const response = getCachedRoutesData()

  // API返回格式: { code: 0, data: [...] }
  if (response && response.code === 0 && response.data && Array.isArray(response.data)) {
    // 获取已存在的路由名称和路径集合，用于去重
    const existingRoutes = router.getRoutes()
    const existingRouteNames = new Set(existingRoutes.map(route => route.name))
    const existingRoutePaths = new Set(existingRoutes.map(route => route.path))

    // 将API数据转换为路由配置对象
    const dynamicRoutes = response.data.map((item: any) => {
      const code = item.code
      const url = item.url

      const routerConfig: any = {
        path: `/${code}`,           // 路径格式: /code
        name: code,                 // 路由名称
        meta: { title: item.title } // 元信息
      }

      // 如果有url字段，添加导航守卫打开外部链接
      if (url) {
        routerConfig.beforeEnter = () => {
          window.open(url, '_blank')
          return false
        }
      }

      return routerConfig
    })

    // 过滤出需要新增的路由（不重复的）
    const newRoutes = dynamicRoutes.filter((route: any) => {
      const hasNameOrPath = route.name || route.path
      const existsByName = route.name && existingRouteNames.has(route.name)
      const existsByPath = route.path && existingRoutePaths.has(route.path)

      return hasNameOrPath && !existsByName && !existsByPath
    })

    // 动态添加新路由到router
    newRoutes.forEach((route: any) => {
      router.addRoute(route)
    })
  }
}

// _form: '_'表示占位变量，可以不被使用
router.beforeEach((to, _from, next) => {
  if (to.meta.title && to.meta.title != '') {
    let oldTitle = document.title
    document.title = <string>to.meta.title + '-' + oldTitle
  }
  next()
})
//路由后置卫士
router.afterEach((to) => {
  //填充mate元信息
  const { title , keywords, description } = to.meta
  //详情页标题
  const detailTitle = title
  //设置title
  if (detailTitle) {
    document.title = detailTitle + '-' + import.meta.env.VITE_APP_TITLE
  } else {
    document.title = import.meta.env.VITE_APP_TITLE + '-' + import.meta.env.VITE_APP_DESC
  }

  //设置meta
  document.querySelector('meta[name="keywords"]')?.setAttribute("content", `${keywords}`)
  document.querySelector('meta[name="description"]')?.setAttribute("content", `${description}`)
  //设置meta og
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${document.title}`)
  document.querySelector('meta[property="og:site_name"]')?.setAttribute("content", `${document.title}`)
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", `${description}`)
})
export default router
