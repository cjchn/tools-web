import type { ToolsReqData } from '@/components/Tools/tools.type.ts'

export interface ToolCate {
  id: number,
  title: string,
  icon?: string,
  img?: string,
  desc?: string,
  url?: string,
  cate?: string,
  list: ToolsInfo[],
  show?: number
}

export interface ToolsInfo {
  id: number,
  title: string,
  logo: string,
  desc: string,
  url: string,
  cateId: number,
  cate: string,
  show?: number
}

import { fetchRoutes } from '@/utils/api'
import { isShowValidated } from '@/utils/showStore'
import { loadDynamicRoutes } from '@/router'

async function updateStoreCates(cates: any[]) {
  const { useToolsStore } = await import('@/store/modules/tools')
  useToolsStore().updateCates(cates)
}

export async function getToolsCate(): Promise<ToolCate[]> {
  return getToolsCateWithCache()
}

function filterResult(result: ToolCate[]): ToolCate[] {
  const validated = isShowValidated()

  if (!validated) {
    return result.map(cate => {
      const cateShow = cate.show !== undefined ? cate.show : 1
      if (cateShow === 0) {
        return null
      }

      const filteredList = cate.list.filter(tool => {
        const toolShow = tool.show !== undefined ? tool.show : 1
        return toolShow !== 0
      })

      if (filteredList.length === 0) {
        return null
      }

      return {
        ...cate,
        list: filteredList
      }
    }).filter((cate): cate is ToolCate => cate !== null)
  }
  return result
}

async function getToolsCateWithCache(): Promise<ToolCate[]> {
  const filteredLocal = await filterResult(JSON.parse(JSON.stringify(localToolsCate)))

  fetchRoutes().then(async (response: any) => {
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      loadDynamicRoutes()
      const pageData = response.data

      const cateMap = new Map<string, typeof pageData>()
      pageData.forEach((item: any) => {
        const cateName = item.cate
        if (!cateMap.has(cateName)) {
          cateMap.set(cateName, [])
        }
        cateMap.get(cateName)?.push(item)
      })

      let mergedResult = await filterResult(JSON.parse(JSON.stringify(localToolsCate)))

      cateMap.forEach((items, cateName) => {
        const existingCate = mergedResult.find(cate => cate.title === cateName)

        if (existingCate) {
          const maxToolId = existingCate.list.length > 0
            ? Math.max(...existingCate.list.map(tool => tool.id))
            : 0

          items.forEach((item: any) => {
            const newToolId = maxToolId + 1
            existingCate.list.push({
              id: newToolId,
              title: item.title,
              logo: item.logo || '/images/logo/jump.jpg',
              desc: item.description,
              url: `/${item.code}/`,
              cateId: existingCate.id,
              cate: cateName,
              show: item.isShow
            })
          })
        } else {
          const newCateId = mergedResult.length > 0
            ? Math.max(...mergedResult.map(cate => cate.id)) + 1
            : 1

          mergedResult.push({
            id: newCateId,
            title: cateName,
            icon: '',
            list: items.map((item: any, index: number) => ({
              id: index + 1,
              title: item.title,
              logo: item.logo || '/images/logo/jump.jpg',
              desc: item.description,
              url: `/${item.code}/`,
              cateId: newCateId,
              cate: cateName,
              show: item.isShow
            }))
          })
        }
      })

      const filteredMergedResult = await filterResult(JSON.parse(JSON.stringify(mergedResult)))
      updateStoreCates(filteredMergedResult)
    } else {
      updateStoreCates(filteredLocal)
    }
  })

  return filteredLocal
}

// 本地数据备份，用于API不可用时的回退
const localToolsCate: ToolCate[] = [
  {
    id: 0,
    title: '开发运维',
    icon: '',
    list: [
        {
          id: 1,
          title: '随机密码生成',
          logo: '/images/logo/keywords.png',
          desc: '密码生成器、随机字符串生成,批量生成',
          url: '/randompassword/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 2,
          title: 'URL编码/解码',
          logo: '/images/logo/url.png',
          desc: 'URL在线编码解码工具（UrlEncode编码 和 UrlDecode解码）',
          url: '/urlencode/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 3,
          title: 'UUID生成器',
          logo: '/images/logo/uuid.png',
          desc: '批量生成UUID',
          url: '/uuid/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 4,
          title: '时间戳转换',
          logo: '/images/logo/Time.png',
          desc: '在线时间戳转换工具以及获取当前时间戳',
          url: '/timetran/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 5,
          title: 'MD5在线加密',
          logo: '/images/logo/md5.png',
          desc: 'MD5在线加密,长度包含32位、16位',
          url: '/md5/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 6,
          title: 'Json在线转换',
          logo: '/images/logo/json.png',
          desc: '提供实时编辑和预览JSON 数据，语法高亮、校验、格式化、转义，去转义、压缩等功能，可以提高阅读修改的效率和准确性',
          url: '/json/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 7,
          title: '正则测试工具',
          logo: '/images/logo/reg.png',
          desc: '正则表达式测试工具, 常用正则表达式',
          url: '/reg/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 8,
          title: 'Unicode转中文',
          logo: '/images/logo/union.png',
          desc: 'Unicode和中文的相互转换',
          url: '/unicode/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 9,
          title: 'HTTP状态码',
          logo: '/images/logo/http_code.png',
          desc: 'http状态对应的名称和含义解释',
          url: '/httpstatuscode/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 10,
          title: 'JWT解析',
          logo: '/images/logo/jwt_parse.png',
          desc: '解析和解码JSON Web Token（jwt）',
          url: '/jwt/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 11,
          title: 'html实体转义',
          logo: '/images/logo/HtmlEntity.png',
          desc: 'html实体转义，实体转义成html',
          url: '/htmlentity/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 12,
          title: 'js代码格式化/压缩',
          logo: '/images/logo/JSForamt.png',
          desc: 'JS格式化/压缩工具,提供在线JS格式化、JS压缩、JS混淆、JS解密',
          url: '/jsforamt/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 13,
          title: 'Html代码格式化',
          logo: '/images/logo/HtmlFormat.png',
          desc: '提供在线html、xml格式化',
          url: '/htmlformat/',
          cateId: 0,
          cate: '开发运维',
        },
        {
          id: 14,
          title: 'Css代码格式化/压缩',
          logo: '/images/logo/CssFormat.png',
          desc: 'css格式化/压缩工具,提供在线css格式化、css压缩',
          url: '/cssformat/',
          cateId: 0,
          cate: '开发运维',
        },
      ]
    },
    {
      id: 1,
      title: '文本处理',
      icon: '',
      list: [
        {
          id: 1,
          title: '文本对比',
          logo: '/images/logo/diff.png',
          desc: '文本差异比对支持中文、英文、代码比对',
          url: '/diff/',
          cateId: 1,
          cate: '文本处理'
        },
        {
          id: 2,
          title: 'markdown编辑器',
          logo: '/images/logo/file-markdown-fill.png',
          desc: '在线创建或编辑markdown, 实时预览，导出markdown',
          url: '/markdown/',
          cateId: 1,
          cate: '文本处理'
        },
        {
          id: 3,
          title: '字数统计',
          logo: '/images/logo/wordCount.png',
          desc: '在线统计字符串的字数、段落、标点符号数量',
          url: '/wordcount/',
          cateId: 1,
          cate: '文本处理',
        },
        {
          id: 4,
          title: '文本去重',
          logo: '/images/logo/textRemoveDuplicate.png',
          desc: '可以删除或去除文本或字符串中的重复行',
          url: '/textremoveduplicate/',
          cateId: 1,
          cate: '文本处理',
        },
        {
          id: 5,
          title: 'ASCII字形生成器',
          logo: '/images/logo/ascii_word_pic.png',
          desc: '在线生成字形ASCII画',
          url: '/asciiwordpic/',
          cateId: 1,
          cate: '文本处理',
        },
        {
          id: 6,
          title: '在线文本编辑/HTML获取',
          logo: '/images/logo/richtextEditor.png',
          desc: '在线富文本编辑, html实时预览，在线编辑文本，文本编辑获取html',
          url: '/textedit/',
          cateId: 1,
          cate: '文本处理'
        },
        {
          id: 7,
          title: '多列编辑',
          logo: '/images/logo/richtextEditor.png',
          desc: 'alt+鼠标左键，多列编辑',
          url: '/multicolumnediting/',
          cateId: 1,
          cate: '文本处理'
        },
      ]
    },
    {
      id: 2,
      title: '教育学术',
      icon: '',
      list: [
        {
          id: 1,
          title: '在线尺子',
          logo: '/images/logo/unit.png',
          desc: '在线尺子',
          url: '/onlineruler/',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 2,
          title: '单位换算',
          logo: '/images/logo/unit.png',
          desc: '在线重量、长度、面积、时间、角度、速度、温度、压力、热量、功率等换算',
          url: '/unit/',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 3,
          title: '摩斯电码',
          logo: '/images/logo/medium.png',
          desc: '支持中文的摩斯电码编码解码',
          url: '/morse/',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 4,
          title: '常用进制转换',
          logo: '/images/logo/scaletran.png',
          desc: '在线进制转换工具,可在2到64进制之间相互转换',
          url: '/scaletran/',
          cateId: 2,
          cate: '教育学术',
        },
        {
          id: 5,
          title: 'ASCII码表',
          logo: '/images/logo/ascii.png',
          desc: 'ASCII码表,控制代码、标准ASCII字符和非标准ASCII字符对照表',
          url: '/ascii/',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 6,
          title: '长度单位转换',
          logo: '/images/logo/length.png',
          desc: '长度转换工具-支持国际长度单位，中国传统长度单位，英制长度单位',
          url: '/unit/?active=length',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 7,
          title: '面积单位转换',
          logo: '/images/logo/area.png',
          desc: '面积转换工具-支持国际面积单位，中国传统面积单位，英制面积单位',
          url: '/unit/?active=area',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 8,
          title: '重量单位转换',
          logo: '/images/logo/weight.png',
          desc: '重量转换工具-支持国际重量单位，中国传统重量单位，英制重量单位(常衡制和金衡制)',
          url: '/unit/?active=weight',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 9,
          title: '时间单位转换',
          logo: '/images/logo/time_unit.png',
          desc: '时间单位转换工具-支持国际时间单位',
          url: '/unit/?active=time',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 10,
          title: '温度单位转换',
          logo: '/images/logo/temperature.png',
          desc: '温度单位转换工具-支持国际温度单位',
          url: '/unit/?active=temperature',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 11,
          title: '压力单位转换',
          logo: '/images/logo/pressure.png',
          desc: '压力单位转换工具-Pa/kPa/hPa/MPa/bar/torr/psi等',
          url: '/unit/?active=pressure',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 12,
          title: '热量单位转换',
          logo: '/images/logo/heat.png',
          desc: '热量单位转换工具-Wh/mWh/kWh/MWh/J/kJ等',
          url: '/unit/?active=heat',
          cateId: 2,
          cate: '教育学术'
        },
        {
          id: 13,
          title: '功率单位转换',
          logo: '/images/logo/power.png',
          desc: '功率单位转换工具-W/mW/kW/MW/GW等',
          url: '/unit/?active=power',
          cateId: 2,
          cate: '教育学术'
        },
      ]
    },
    {
      id: 3,
      title: '图片处理',
      icon: '',
      list: [
        {
          id: 1,
          title: '二维码生成',
          logo: '/images/logo/qrcode.png',
          desc: '在线生成带logo、透明、艺术的二维码',
          url: '/qrcode/',
          cateId: 3,
          cate: '图片处理'
        },
        {
          id: 2,
          title: '在线图片处理',
          logo: '/images/logo/img.png',
          desc: '在线图片裁剪，图片标注，图片滤镜，图片画笔、图片旋转、图片文字等操作',
          url: '/signimage/',
          cateId: 3,
          cate: '图片处理',
        },
        {
          id: 3,
          title: '文本转图片',
          logo: '/images/logo/text_to_img.png',
          desc: '把文本转换成图片，生成长图，具有超多个性文字排版',
          url: '/texttoimg/',
          cateId: 3,
          cate: '图片处理'
        },
        {
          id: 4,
          title: '图片分割',
          logo: '/images/logo/imgCut.png',
          desc: '将图片分割成四宫格、九宫格、十六宫格，支持自定义行与列',
          url: '/imgcut/',
          cateId: 3,
          cate: '图片处理',
        },
      ]
    },
    {
      id: 4,
      title: '数据图表',
      icon: '',
      list: [
        {
          id: 1,
          title: '柱状图',
          logo: '/images/logo/bar.png',
          desc: '在线制作柱状图，像做表格一样制作可视化图表，支持导出静态或动态图表',
          url: '/bar/',
          cateId: 4,
          cate: '数据图表',
        },{
          id: 2,
          title: '折线图',
          logo: '/images/logo/line.png',
          desc: '在线制作折线图，像做表格一样制作可视化图表，支持导出静态或动态图表',
          url: '/line/',
          cateId: 4,
          cate: '数据图表',
        },
        {
          id: 3,
          title: '饼图',
          logo: '/images/logo/pie.png',
          desc: '在线制作饼图，像做表格一样制作可视化图表，支持导出静态或动态图表',
          url: '/pie/',
          cateId: 4,
          cate: '数据图表',
        },
        {
          id: 4,
          title: '散点图',
          logo: '/images/logo/scatter.png',
          desc: '在线制作散点图，像做表格一样制作可视化图表，支持导出静态或动态图表',
          url: '/scatter/',
          cateId: 4,
          cate: '数据图表',
        }
      ]
    },
    {
      id: 5,
      title: '选择随机',
      icon: '',
      list: [
        {
          id: 1,
          title: '生成随机数',
          logo: '/images/logo/random.png',
          desc: '可定制范围内进行随机数字，可用于抽奖、点名等用途',
          url: '/random/',
          cateId: 5,
          cate: '选择随机'
        },
        {
          id: 2,
          title: '帮我决定',
          logo: '/images/logo/choose.png',
          desc: '选择困难，难以决定，今天吃什么，现在做什么，自定义选项都给你安排的明明白白',
          url: '/decision/',
          cateId: 5,
          cate: '选择随机'
        },
        {
          id: 3,
          title: '抛硬币',
          logo: '/images/logo/coin.png',
          desc: '在线抛硬币，选择困难那么交给硬币来帮你选择吧',
          url: '/coin/',
          cateId: 5,
          cate: '选择随机',
        },
        {
          id: 4,
          title: '投骰子',
          logo: '/images/logo/dice.png',
          desc: '在线投骰子，可自定义骰子数量，简单好用的骰子工具',
          url: '/dice/',
          cateId: 5,
          cate: '选择随机',
        },
      ]
    },
    {
      id: 6,
      title: '金融工具',
      icon: '',
      list: [
        {
          id: 1,
          title: '投资手续费计算器',
          logo: '/images/logo/investmentFeeCalculator.jpg',
          desc: '私人投资手续费计算器',
          url: '/investmentfeecalculator/',
          cateId: 6,
          cate: '金融工具'
        },
      ]
    },
    {
      id: 7,
      title: '其他工具',
      icon: '',
      list: [
        {
          id: 1,
          title: '数字转金额大写',
          logo: '/images/logo/numberToChinese.png',
          desc: '在线数字一键转换成人民币大写，中文大写转换数字',
          url: '/numbertochinese/',
          cateId: 7,
          cate: '其他工具'
        },
        {
          id: 2,
          title: '手持弹幕',
          logo: '/images/logo/dm.png',
          desc: '手持滚动弹幕',
          url: '/barrage/',
          cateId: 7,
          cate: '其他工具',
        },
        {
          id: 3,
          title: '色板',
          logo: '/images/logo/palettes.png',
          desc: '包含纯色、渐变与阶梯色和常用色彩组合',
          url: '/palettes/',
          cateId: 7,
          cate: '其他工具'
        },
        {
          id: 4,
          title: 'Color选择器',
          logo: '/images/logo/color_picker.png',
          desc: '颜色选择器、在各种颜色空间如十六进制、rgb、hsl、css等等之间转换颜色',
          url: '/colorpicker/',
          cateId: 7,
          cate: '其他工具'
        }
      ]
    },
    {
      id: 8,
      title: '自用',
      icon: '',
      list: [
        {
          id: 1,
          title: '个人',
          logo: 'http://oocj.cn/images/icon/logo.png',
          desc: '个人小站',
          url: '/our/',
          show: 0,
          cateId: 8,
          cate: '自用'
        }
      ]
    }
  ]

//工具list
export async function toolsList() {
  let list = [] as any[]
  let toolsCate = await getToolsCate()
  for (let item in toolsCate) {
    for (let _item in toolsCate[item].list) {
      list.push(toolsCate[item].list[_item])
    }
  }
  return list
}

/**
 * url为键名的工具list map
 * @returns
 */
export function urlKeyMap() {
  // let toolsMapByUrlKey = new Map()
  // let list = toolsList()
  // for (let item in list) {
  //   toolsMapByUrlKey.set(list[item].url, list[item])
  // }
  // return toolsMapByUrlKey
}

//获取工具
export async function getTools(data: ToolsReqData) {
  //接收参数
  const { cateId, title } = data
  //获取工具list
  let list = await toolsList()
  //标题筛选
  if (title != '') {
    list = list.filter(item => {
      let tmpValue = item.title.toLowerCase()
      let tmpDesc = item.desc.toLowerCase()
      // console.log(tmpValue.indexOf(title.toLowerCase()))
      return tmpValue.indexOf(title.toLowerCase()) !== -1 || tmpDesc.indexOf(title.toLowerCase()) !== -1;
    });
  }
  //分类筛选
  if (cateId > 0) {
    list = list.filter(item => {
      return item.cateId == cateId;
    });
  }
  return list
}

const ToolsExport = {
  getTools,
  getToolsCate,
  toolsList,
};

export default ToolsExport;
