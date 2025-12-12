<script setup lang="ts">
import { reactive, computed } from 'vue'
import DetailHeader from '@/components/Layout/DetailHeader/DetailHeader.vue'
import ToolDetail from '@/components/Layout/ToolDetail/ToolDetail.vue'
import { copy as copyUtil } from '@/utils/string.ts';
import { Codemirror } from "vue-codemirror";
import { keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import '@codemirror/search';
import { ElMessage } from 'element-plus'

const info = reactive({
  title: "多列编辑",
  inputText: '',
  columnCount: 2, // 默认2列
  columnGap: 20,  // 默认间距
  isParseErr: false,
  parseErr: '',
})

// CodeMirror扩展配置
const extensions = [
  history(),
  keymap.of([...defaultKeymap, ...historyKeymap])
]

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



// 计算多列HTML
const multiColumnHtml = computed(() => {
  if (!info.inputText) return ''

  // 生成HTML
  return `
    <div style="column-count: ${info.columnCount}; column-gap: ${info.columnGap}px;">
      ${info.inputText.split('\n').map(line => `<p>${line}</p>`).join('')}
    </div>
  `
})

//清空输入框
const clear = () => {
  info.inputText = ''
}

// 复制多列HTML
const copyHtml = async () => {
  if (!multiColumnHtml.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  copyUtil(multiColumnHtml.value)
  ElMessage.success('多列HTML已复制')
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
    processedLine = processedLine.replace(/^\d+\.\s*/, '')
    processedLine = processedLine.replace(/^[一二三四五六七八九十]+\.\s*/, '')
    processedLine = processedLine.replace(/^[一二三四五六七八九十]+/, '')
    
    return processedLine.trim()
  })
  
  info.inputText = unnumberedLines.join('\n')
  ElMessage.success('序号已清除')
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
          :style="{ height: '300px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tabSize="2"
          :extensions="extensions"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="mt-4 mb-6">
        <el-button type="primary" @click="copyHtml">复制</el-button>
        <el-button type="primary" @click="clear">清空</el-button>
        <el-button type="primary" @click="loadSample">示例</el-button>
        <el-button type="primary" @click="addNumbers">添加序号</el-button>
        <el-button type="primary" @click="removeNumbers">清除序号</el-button>
      </div>

      <div class="mt-3 min-h-md bg-red-100 p-3 mb-3" v-show="info.isParseErr">
        <el-text type="danger">{{ info.parseErr }}</el-text>
      </div>
    </div>

    <!-- desc -->
    <ToolDetail title="描述">
      <el-text>
        alt+左键实现多列编辑
      </el-text>
    </ToolDetail>

  </div>
</template>

<style scoped>
/* 预览区域的段落样式 */
:deep(p) {
  margin: 0 0 8px 0;
  text-align: justify;
}
</style>
