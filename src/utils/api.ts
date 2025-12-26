import type { ToolCateResponseData } from '@/components/Tools/tools.type.ts'

// API基础路径（可配置）
const API_BASE_URL = ''

// 路由数据缓存
let cachedRoutesData: any = null
let routesDataLoaded = false

// Show验证通过状态（API返回true时标记）
let showValidated = false

/**
 * 判断Show验证是否已通过
 * 用于控制隐藏工具的显示权限
 * @returns true-验证通过，显示所有工具；false-未验证，隐藏标记为show:0的工具
 */
export function isShowValidated(): boolean {
  return showValidated
}

/**
 * Show信息类型定义
 */
export interface ShowInfo {
  show: string
  expiresAt: string
  features: string[]
}

/**
 * Show响应数据类型 - 验证成功返回布尔值
 */
export interface ShowResponseData {
  code: number
  message: string
  data: boolean | ShowInfo
}

/**
 * 获取本地存储的Show信息
 */
export function getStoredShow(): ShowInfo | null {
  try {
    const show = localStorage.getItem('show')
    const expiresAt = localStorage.getItem('showExpires')
    const features = localStorage.getItem('showFeatures')

    if (show && expiresAt && features) {
      // 检查Show是否过期
      if (new Date(expiresAt) > new Date()) {
        return {
          show,
          expiresAt,
          features: JSON.parse(features)
        }
      } else {
        // Show已过期，清除本地存储
        clearStoredShow()
        return null
      }
    }
    return null
  } catch (error) {
    clearStoredShow()
    return null
  }
}

/**
 * 存储Show信息到本地
 */
function storeShow(showInfo: ShowInfo): void {
  localStorage.setItem('show', showInfo.show)
  localStorage.setItem('showExpires', showInfo.expiresAt)
  localStorage.setItem('showFeatures', JSON.stringify(showInfo.features))
}

/**
 * 清除本地存储的Show信息
 */
function clearStoredShow(): void {
  localStorage.removeItem('show')
  localStorage.removeItem('showExpires')
  localStorage.removeItem('showFeatures')
}

/**
 * 通用请求函数
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let fullUrl = `${API_BASE_URL}${url}`

  // 构建查询参数
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
    
    // 获取本地存储的Show（如果有且未过期）
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
      // 接口失败时返回统一的成功格式，保持与正常响应一致的数据结构
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
    // 错误时不打印日志，实现无感处理
    // 返回统一的成功格式，保持与正常响应一致的数据结构
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

/**
 * 本地工具分类数据（作为API失败时的回退）
 */
const localToolsCateData: ToolCateResponseData = {
  data: {
    total: 0,
    pageData: []
  }
}

/**
 * 获取工具分类和工具列表
 */
export async function fetchToolsCate(): Promise<ToolCateResponseData> {
  try {
    // 使用配置的端点获取工具数据
    const response = await request<ToolCateResponseData>(import.meta.env.VITE_ROUTES_API_ENDPOINT || '/open/tool/site/bookmarks')

    // 返回响应数据（即使为空）
    return response
  } catch (error) {
    // 即使发生错误也不抛出，返回本地回退数据
    return localToolsCateData
  }
}

/**
 * 本地路由配置数据（作为API失败时的回退）
 */
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
    },
    {
      path: '/timetran',
      component: 'TimeTran',
      name: 'timetran',
      meta: {
        title: "时间戳转换",
        keywords: '时间,日期转换时间戳,Unix时间戳',
        description: 'Unix时间戳转换可以把Unix时间转成北京时间。',
      }
    },
    {
      name: 'webnote',
      path: '/webnote',
      beforeEnter: true
    },
    {
      name: 'news',
      path: '/news',
      beforeEnter: true
    },
    {
      name: 'filetransfer',
      path: '/filetransfer',
      beforeEnter: true
    }
  ]
}

/**
 * 获取功能访问密钥(Show)
 * @param code 字典编码
 * @param remark 字典备注，默认 tool_site_dynamic_key
 */
export async function fetchShow(code: string, remark: string = 'tool_site_dynamic_key'): Promise<ShowInfo | null> {
  try {
    const endpoint = import.meta.env.VITE_SHOW_API_ENDPOINT || '/open/sys/dicts/code'
    const url = `${endpoint}/${remark}?remark=${code}`
    
    const response = await request<ShowResponseData>(url)

    if (response.code === 0 && response.data === true) {
      showValidated = true
      storeShow({
        show: code,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        features: []
      })
      return {
        show: code,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        features: []
      }
    }

    if (response.data && typeof response.data === 'object' && 'show' in response.data) {
      storeShow(response.data as ShowInfo)
      return response.data as ShowInfo
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * 获取路由配置（带缓存）
 * 从API获取动态路由配置，支持缓存避免重复请求
 * @returns Promise路由响应数据，格式: { code: 0, data: [...] }
 *         如果API失败或已缓存，返回缓存数据或本地回退数据
 */
export async function fetchRoutes(): Promise<any> {
  // 如果已有缓存数据，直接返回缓存
  if (routesDataLoaded && cachedRoutesData) {
    return cachedRoutesData
  }
  
  try {
    // 调用API获取路由数据，接口地址: /open/tool/site/bookmarks
    const response = await request<any>(import.meta.env.VITE_ROUTES_API_ENDPOINT || '/open/tool/site/bookmarks', {
      method: 'GET'
    })

    // API返回格式: { code: 0, data: [...] }
    if (response.code === 0 && response.data && Array.isArray(response.data)) {
      // 缓存有效的路由数据
      cachedRoutesData = response
      routesDataLoaded = true
    }
    
    return response
  } catch (error) {
    // API请求失败时返回本地回退数据
    return localRoutesData
  }
}

/**
 * 获取缓存的路由数据
 */
export function getCachedRoutesData(): any {
  return cachedRoutesData
}

/**
 * 检查是否有权限访问某个功能
 */
export function hasFeatureAccess(feature: string): boolean {
  const showInfo = getStoredShow()
  return showInfo?.features.includes(feature) || false
}

/**
 * 清除Show信息
 */
export function clearShow(): void {
  clearStoredShow()
}
