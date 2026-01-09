export interface ToolsReqData {
  cateId: number,
  title: string,
  route: string,
}

//tools
export interface ToolsInfo {
  id: number,
  title: string,
  logo: string,
  desc: string,
  url: string,
  cate: string,
  show?: number,
  sortOrder?: number
}

//tools cate
export interface ToolCate {
  id: number,
  title: string,
  img: string,
  desc: string,
  url: string,
  cate: string,
  list: ToolsInfo[],
  show?: number
}

export interface CollectReqData {
  toolId: number
}

//tools list response
export interface ToolsResponseData {
  data: ToolsInfo[]
}

// API响应数据包装器
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页数据结构
export interface PagedData<T> {
  total: number
  pageData: T[]
}

// 从API获取的工具项
export interface ApiToolItem {
  id: string
  cate: string
  code: string
  title: string
  logo: string
  description: string
  url: string
  sortOrder: number
  isShow: number
}

// 工具分类响应数据
export interface ToolCateResponseData {
  data: PagedData<ApiToolItem>
}

//tools recommend response
export interface ToolRecommendResponseData{
  data: ToolsInfo[]
}