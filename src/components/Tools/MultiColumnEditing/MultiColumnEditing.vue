<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import DetailHeader from '@/components/Layout/DetailHeader/DetailHeader.vue'
import ToolDetail from '@/components/Layout/ToolDetail/ToolDetail.vue'
import { copy as copyUtil } from '@/utils/string.ts';
import { Codemirror } from "vue-codemirror";
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'multi-column-editing-content'
const TIME_KEY = 'multi-column-editing-time'
const CACHE_EXPIRE_HOURS = 1

const getCachedContent = async (): Promise<{ content: string; time: string } | null> => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const savedTime = localStorage.getItem(TIME_KEY)
  if (saved && savedTime) {
    const savedDate = new Date(savedTime)
    const now = new Date()
    const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60)
    if (hoursDiff < CACHE_EXPIRE_HOURS) {
      return { content: saved, time: savedTime }
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TIME_KEY)
      return null
    }
  }
  return null
}

const saveToCache = async (content: string, timeStr: string) => {
  localStorage.setItem(STORAGE_KEY, content)
  localStorage.setItem(TIME_KEY, timeStr)
}

const restoreContent = async () => {
  const cached = await getCachedContent()
  if (cached) {
    info.inputText = cached.content
    info.lastSaveTime = cached.time
    ElMessage.success(`已恢复保存的数据：${cached.time}`)
  } else {
    ElMessage.warning('没有可恢复的缓存数据或已过期')
  }
}

const clearStorage = async () => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(TIME_KEY)
}

const saveText = async () => {
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  await saveToCache(info.inputText, timeStr)
  info.lastSaveTime = timeStr
  ElMessage.success('已保存到本地')
}

const info = reactive({
  title: "多列编辑",
  inputText: '',
  columnCount: 2,
  columnGap: 20,
  isParseErr: false,
  parseErr: '',
  splitSeparator: '',
  lastSaveTime: '',
})

onMounted(() => {
  setTimeout(() => {
    getCachedContent().then(cached => {
      if (cached) {
        info.inputText = cached.content
        info.lastSaveTime = cached.time
        ElMessage.success(`已从保存获取到数据：${cached.time}`)
      }
    })
  }, 0)
})

// 示例数据
const sampleText = `多列编辑工具示例文本
这是第一行内容
这是第二行内容
这是第三行内容
这是第四行内容
这是第五行内容
这是第六行内容
这是第七行内容
这是第八行内容
这是第九行内容
这是第十行内容
这是第十一行内容
这是第十二行内容
这是第十三行内容
这是第十四行内容
这是第十五行内容`





//清空输入框
const clear = () => {
  info.inputText = ''
}

// 复制原始文本
const copyText = async () => {
  if (!info.inputText) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  copyUtil(info.inputText)
  ElMessage.success('文本已复制')
}

// 填充示例数据
const loadSample = () => {
  info.inputText = sampleText
  ElMessage.success('示例数据已加载')
}

// 为文本添加序号
const addNumbers = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可添加序号的内容')
    return
  }

  const lines = info.inputText.split('\n')
  const numberedLines = lines.map((line, index) => {
    // 不为空行添加序号
    return line.trim() ? `${index + 1}. ${line}` : line
  })

  info.inputText = numberedLines.join('\n')
  ElMessage.success('序号已添加')
}

// 清除文本中的序号
const removeNumbers = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可清除序号的内容')
    return
  }

  const lines = info.inputText.split('\n')
  const unnumberedLines = lines.map(line => {
    if (!line.trim()) return line

    let processedLine = line

    // 移除各种序号格式：
    // 1.xx 或 1. xx (数字序号)
    // 一.xx 或 一. xx (中文数字带点序号)
    // 一xx (中文数字序号)
    // 1、xx 或 1、 xx (数字+顿号序号)
    // 一、xx 或 一、 xx (中文数字+顿号序号)
    processedLine = processedLine.replace(/^\d+\.\s*/, '')
    processedLine = processedLine.replace(/^[一二三四五六七八九十]+\.\s*/, '')
    processedLine = processedLine.replace(/^[一二三四五六七八九十]+/, '')
    processedLine = processedLine.replace(/^\d+、\s*/, '')
    processedLine = processedLine.replace(/^[一二三四五六七八九十]+、\s*/, '')

    return processedLine.trim()
  })

  info.inputText = unnumberedLines.join('\n')
  ElMessage.success('序号已清除')
}

// 转大写
const toUpperCase = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可转换的内容')
    return
  }
  info.inputText = info.inputText.toUpperCase()
  ElMessage.success('已转换为大写')
}

// 转小写
const toLowerCase = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可转换的内容')
    return
  }
  info.inputText = info.inputText.toLowerCase()
  ElMessage.success('已转换为小写')
}

// 转驼峰命名
const toCamelCase = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可转换的内容')
    return
  }
  const lines = info.inputText.split('\n')
  const convertedLines = lines.map(line => {
    return line.replace(/[-_ ]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
               .replace(/^[A-Z]/, c => c.toLowerCase())
  })
  info.inputText = convertedLines.join('\n')
  ElMessage.success('已转换为驼峰命名')
}

// 转下划线分割
const toSnakeCase = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可转换的内容')
    return
  }
  const lines = info.inputText.split('\n')
  const convertedLines = lines.map(line => {
    return line.replace(/([A-Z])/g, '_$1')
               .replace(/[- ]+/g, '_')
               .replace(/^_/, '')
               .toLowerCase()
  })
  info.inputText = convertedLines.join('\n')
  ElMessage.success('已转换为下划线分割')
}

// 转空格分割
const toSpaceCase = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可转换的内容')
    return
  }
  const lines = info.inputText.split('\n')
  const convertedLines = lines.map(line => {
    return line.replace(/([A-Z])/g, ' $1')
               .replace(/[-_]+/g, ' ')
               .replace(/\s+/g, ' ')
               .trim()
               .toLowerCase()
  })
  info.inputText = convertedLines.join('\n')
  ElMessage.success('已转换为空格分割')
}

// 驼峰转回空格分割
const fromCamelCase = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可转换的内容')
    return
  }
  const lines = info.inputText.split('\n')
  const convertedLines = lines.map(line => {
    return line.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
               .replace(/([a-z])([A-Z])/g, '$1 $2')
               .toLowerCase()
  })
  info.inputText = convertedLines.join('\n')
  ElMessage.success('已转换为空格分割')
}

// 按分隔符分割
const splitBySeparator = () => {
  if (!info.inputText) {
    ElMessage.warning('没有可分割的内容')
    return
  }

  const lines = info.inputText.split('\n')
  const convertedLines = lines.map(line => {
    if (!info.splitSeparator) {
      return line.replace(/[-_]+/g, '\n').split('\n').filter(Boolean).join('\n')
    } else {
      return line.replace(/[-_ ]+/g, info.splitSeparator).replace(new RegExp(info.splitSeparator + '+$'), '')
    }
  })
  info.inputText = convertedLines.join('\n')

  if (!info.splitSeparator) {
    ElMessage.success('已转换为换行分割')
  } else {
    ElMessage.success('已替换为指定分隔符')
  }
}
</script>

<template>
  <div class="flex flex-col mt-3 flex-1">
    <DetailHeader :title="info.title"></DetailHeader>

    <div class="p-4 rounded-2xl bg-white ">
      <!-- 输入区域 -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">输入文本</h3>
        <codemirror
          v-model="info.inputText"
          placeholder="请输入要进行多列编辑的文本..."
          :style="{ height: '500px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tabSize="2"
        />
      </div>

      <!-- 操作按钮 - 第一行 -->
      <div class="mt-4 mb-2 flex items-center gap-2">
        <el-button type="primary" @click="copyText" title="hello world → 复制到剪贴板">复制</el-button>
        <el-button type="danger" @click="clear" title="清空输入框内容">清空</el-button>
        <el-button type="primary" @click="loadSample" title="hello world → 加载示例文本">示例</el-button>
        <el-button type="warning" @click="saveText" title="保存内容到本地内存">保存</el-button>
        <el-tag v-if="info.lastSaveTime" type="success" size="small">{{ info.lastSaveTime }} 已保存</el-tag>
        <el-button v-if="info.lastSaveTime" type="success" @click="restoreContent" title="从缓存恢复内容">恢复</el-button>
        <el-button v-if="info.lastSaveTime" type="danger" @click="clearStorage" title="清除保存的内存数据">清除</el-button>
      </div>

      <!-- 操作按钮 - 序号大小写 -->
      <div class="mt-1 mb-2 flex items-center gap-2">
        <span class="text-gray-500 font-medium">序号/大小写</span>
        <el-button type="primary" @click="addNumbers" title="abc\ndef → 1. abc\n2. def">添加序号</el-button>
        <el-button type="primary" @click="removeNumbers" title="1. abc → abc">清除序号</el-button>
        <el-button type="primary" @click="toUpperCase" title="hello world → HELLO WORLD">转大写</el-button>
        <el-button type="primary" @click="toLowerCase" title="HELLO WORLD → hello world">转小写</el-button>
      </div>

      <!-- 操作按钮 - 英文处理 -->
      <div class="mt-1 mb-6 flex items-center gap-2">
        <span class="text-gray-500 font-medium">英文处理</span>
        <el-button type="primary" @click="toSnakeCase" title="helloWorld → hello_world">转_分割</el-button>
        <el-button type="primary" @click="toSpaceCase" title="helloWorld → hello world">转空格</el-button>
        <el-input
            v-model="info.splitSeparator"
            placeholder="输入分割符"
            style="width: 120px"
            @keydown.enter.prevent="splitBySeparator"
        />
        <el-button type="primary" @click="splitBySeparator" title="hello_world → 换行/hello-world → 替换">按输入分割</el-button>
        <el-button type="primary" @click="toCamelCase" title="hello_world → helloWorld">转驼峰</el-button>
        <el-button type="primary" @click="fromCamelCase" title="helloWorld → hello world">驼峰转回</el-button>
      </div>

      <div class="mt-3 min-h-md bg-red-100 p-3 mb-3" v-show="info.isParseErr">
        <el-text type="danger">{{ info.parseErr }}</el-text>
      </div>
    </div>

    <!-- desc -->
    <ToolDetail title="描述">
      <el-text>
        1. alt+左键实现多列编辑<br/>
        2. 按钮title有提示
      </el-text>
    </ToolDetail>

  </div>
</template>

<style scoped>
:deep(p) {
  margin: 0 0 8px 0;
  text-align: justify;
}
</style>

