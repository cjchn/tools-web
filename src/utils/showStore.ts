import { encrypt, decrypt } from './crypto'

/**
 * Show信息接口
 * 用于存储和传递Show验证相关的数据
 */
export interface ShowInfo {
  /** Show编码值 */
  show: string
  /** 过期时间，ISO格式时间戳 */
  expiresAt: string
  /** 功能特性列表 */
  features: string[]
}

/**
 * Show API响应数据结构
 */
export interface ShowResponseData {
  /** 响应状态码，0表示成功 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据，验证成功返回true或ShowInfo对象 */
  data: boolean | ShowInfo
}

/** Show验证通过状态，API返回true时标记 */
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
 * 获取本地存储的Show信息
 * 自动解密show字段，并检查是否过期
 * @returns 未过期返回ShowInfo对象，过期或不存在返回null
 */
export function getStoredShow(): ShowInfo | null {
  try {
    const show = localStorage.getItem('show')
    const expiresAt = localStorage.getItem('showExpires')
    const features = localStorage.getItem('showFeatures')

    if (show && expiresAt && features) {
      if (new Date(expiresAt) > new Date()) {
        return {
          show: decrypt(show),
          expiresAt,
          features: JSON.parse(features)
        }
      } else {
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
 * 加密存储show字段，其他字段保持明文
 * @param showInfo Show信息对象
 */
export function storeShow(showInfo: ShowInfo): void {
  localStorage.setItem('show', encrypt(showInfo.show))
  localStorage.setItem('showExpires', showInfo.expiresAt)
  localStorage.setItem('showFeatures', JSON.stringify(showInfo.features))
}

/**
 * 清除本地存储的Show信息
 * 包括show、showExpires、showFeatures三个字段
 */
export function clearStoredShow(): void {
  localStorage.removeItem('show')
  localStorage.removeItem('showExpires')
  localStorage.removeItem('showFeatures')
}

/**
 * 调用Show API验证并获取Show信息
 * @param code 字典编码
 * @param remark 字典备注，默认 tool_site_dynamic_key
 * @returns 验证成功返回ShowInfo对象，失败返回null
 */
export async function fetchShow(code: string, remark: string = 'tool_site_dynamic_key'): Promise<ShowInfo | null> {
  try {
    const endpoint = import.meta.env.VITE_SHOW_API_ENDPOINT || '/open/sys/dicts/code'
    const url = `${endpoint}/${remark}?remark=${code}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_KEY || ''
      }
    })

    const data: ShowResponseData = await response.json()

    if (data.code === 0 && data.data === true) {
      showValidated = true
      const showInfo: ShowInfo = {
        show: code,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        features: []
      }
      storeShow(showInfo)
      return showInfo
    }

    showValidated = false
    return null
  } catch (error) {
    return null
  }
}

/**
 * 清除Show信息
 * 重置验证状态并清除本地存储
 */
export function clearShow(): void {
  showValidated = false
  clearStoredShow()
}

/**
 * 验证缓存的Show信息
 * 从缓存获取后调用API验证，通过则保持验证状态，不通过则清除缓存
 * 用于页面加载时检查缓存是否仍然有效
 */
export async function validateCachedShow(): Promise<void> {
  const cachedShow = getStoredShow()
  if (cachedShow) {
    const result = await fetchShow(cachedShow.show)
    if (!result) {
      clearShow()
    }
  }
}

/**
 * 检查是否拥有某个功能的访问权限
 * @param feature 功能名称
 * @returns true-有权限，false-无权限
 */
export function hasFeatureAccess(feature: string): boolean {
  const showInfo = getStoredShow()
  return showInfo?.features.includes(feature) || false
}
