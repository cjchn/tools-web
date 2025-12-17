<script setup lang="ts">
import { reactive } from 'vue'
import DetailHeader from '@/components/Layout/DetailHeader/DetailHeader.vue'
import ToolDetail from '@/components/Layout/ToolDetail/ToolDetail.vue'
import { ElMessage, ElButton } from 'element-plus'
import { copy } from '@/utils/string'
const info = reactive({
  title: "在线markdown编辑器",
  content: '',
})

// 复制内容
const copyRes = async () => {
  if (!info.content) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  copy(info.content)
  ElMessage.success('内容已复制')
}

// 取消所有加粗
const removeBold = () => {
  if (!info.content) {
    ElMessage.warning('没有可处理的内容')
    return
  }
  // 移除所有 **加粗** 格式
  info.content = info.content.replace(/\*\*(.*?)\*\*/g, '$1')
  // 移除所有 __加粗__ 格式
  info.content = info.content.replace(/__(.*?)__/g, '$1')
  ElMessage.success('已取消所有加粗格式')
}

// 加载示例文本
const loadSample = () => {
  // 暂时简化示例文本，避免复杂的字符串处理
  const sample = '# Markdown 示例\n\n这是一个**加粗**的文本\n这是一个*斜体*的文本\n\n- 列表项1\n- 列表项2\n- 列表项3';

  info.content = sample;
  ElMessage.success('示例文本已加载');
}
</script>

<template>
  <div class="flex flex-col mt-3 flex-1">
    <DetailHeader :title="info.title"></DetailHeader>

    <div class="p-4 rounded-2xl bg-white">
      <v-md-editor v-model="info.content" height="500px"></v-md-editor>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-4 flex gap-2">
      <el-button type="primary" @click="loadSample">示例</el-button>
      <el-button type="primary" @click="copyRes">复制</el-button>
      <el-button type="primary" @click="removeBold">取消加粗</el-button>
    </div>

    <!-- desc -->
    <ToolDetail title="描述">
      <el-text>
        在线编辑markdown
      </el-text>
    </ToolDetail>

  </div>
</template>

<style scoped>

</style>
