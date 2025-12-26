import { getStoredShow } from './showStore'
import type { ToolCateResponseData } from '@/components/Tools/tools.type.ts'

/** API基础路径，可通过配置覆盖 */
const API_BASE_URL = ''

/** 缓存的路由数据 */
let cachedRoutesData: any = null
/** 路由数据是否已加载 */
let routesDataLoaded = false

/**
 * 通用请求函数
 * 自动处理查询参数、API密钥、错误回退
 * @param url 请求路径
 * @param options fetch请求选项
 * @returns 统一格式的响应数据
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let fullUrl = `${API_BASE_URL}${url}`

  const params = new URLSearchParams()

  const routesEndpoint = import.meta.env.VITE_ROUTES_API_ENDPOINT || '/open/tool/site/bookmarks'
  if (url === routesEndpoint) {
    params.append('platform', 'tools_web')
    fullUrl = `${fullUrl}${url.includes('?') ? '&' : '?'}${params}`
  } else {
    params.append('platform', 'tools_web')
    if (url.includes('tools') || url.includes('routes')) {
      params.append('type', url.includes('tools') ? 'tools' : 'routes')
    }

    const showInfo = getStoredShow()
    if (showInfo && (url.includes('tools') || url.includes('routes'))) {
      params.append('show', showInfo.show)
    }

    fullUrl = `${fullUrl}${url.includes('?') ? '&' : '?'}${params}`
  }

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_KEY || '',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      return {
        code: 200,
        message: 'success',
        data: {
          total: 0,
          pageData: []
        }
      } as unknown as T
    }

    return await response.json() as T
  } catch (error) {
    return {
      code: 200,
      message: 'success',
      data: {
        total: 0,
        pageData: []
      }
    } as unknown as T
  }
}

/** 本地工具分类数据，API失败时的回退 */
const localToolsCateData: ToolCateResponseData = {
  data: {
    total: 0,
    pageData: []
  }
}

/**
 * 获取工具分类和工具列表
 * @returns 工具分类响应数据
 */
export async function fetchToolsCate(): Promise<ToolCateResponseData> {
  try {
    const response = await request<ToolCateResponseData>(import.meta.env.VITE_ROUTES_API_ENDPOINT || '/open/tool/site/bookmarks')
    return response
  } catch (error) {
    return localToolsCateData
  }
}

/** 本地路由配置数据，API失败时的回退 */
const localRoutesData = {
  code: 200,
  message: 'success',
  data: [
    {
      path: '/',
      component: 'Home',
      name: 'home',
      meta: {
        keywords: 'tools-web,在线工具,开发人员工具,时间戳转换,加密,解密,md5,进制转换,二维码,正则表达式,json格式化,照片处理,字数统计',
        description: 'tools-web,在线工具,在线工具大全,开发人员工具,日常生活工具,办公助手,时间戳转换,加密,解密,md5,进制转换,二维码,正则表达式,json格式化,照片处理,字数统计',
      }
    }
  ]
}

/**
 * 获取路由配置
 * 带缓存机制，避免重复请求
 * @returns 路由响应数据
 */
export async function fetchRoutes(): Promise<any> {
  if (routesDataLoaded && cachedRoutesData) {
    return cachedRoutesData
  }

  try {
    const response = await request<any>(import.meta.env.VITE_ROUTES_API_ENDPOINT || '/open/tool/site/bookmarks', {
      method: 'GET'
    })

    if (response.code === 0 && response.data && Array.isArray(response.data)) {
      cachedRoutesData = response
      routesDataLoaded = true
    }

    return response
  } catch (error) {
    return localRoutesData
  }
}

/**
 * 获取缓存的路由数据
 * @returns 缓存的路由数据，若未加载则返回null
 */
export function getCachedRoutesData(): any {
  return cachedRoutesData
}
