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

// 动态加载路由配置
export function loadDynamicRoutes() {
  const response = getCachedRoutesData()

  // API返回格式: { code: 0, data: [...] }
  if (response && response.code === 0 && response.data && Array.isArray(response.data)) {
    const existingRoutes = router.getRoutes()
    const existingRouteNames = new Set(existingRoutes.map(route => route.name))
    const existingRoutePaths = new Set(existingRoutes.map(route => route.path))

    const dynamicRoutes = response.data.map((item: any) => {
      const code = item.code
      const url = item.url

      const routerConfig: any = {
        path: `/${code}`,
        name: code,
        meta: { title: item.title }
      }

      if (url) {
        routerConfig.beforeEnter = () => {
          window.open(url, '_blank')
          return false
        }
      }

      return routerConfig
    })

    const newRoutes = dynamicRoutes.filter((route: any) => {
      const hasNameOrPath = route.name || route.path
      const existsByName = route.name && existingRouteNames.has(route.name)
      const existsByPath = route.path && existingRoutePaths.has(route.path)

      return hasNameOrPath && !existsByName && !existsByPath
    })

    newRoutes.forEach((route: any) => {
      router.addRoute(route)
    })

    // if (newRoutes.length > 0) {
    //   console.log(`动态路由加载成功，添加了${newRoutes.length}个新路由`)
    // }
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
