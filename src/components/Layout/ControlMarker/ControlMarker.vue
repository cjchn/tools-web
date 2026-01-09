<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  controlId: {
    type: [Number, String],
    required: true
  },
  controlName: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  }
})

const router = useRouter()

// 检查是否是外部跳转路由
const isExternalRedirect = (url: string) => {
  // 规范化URL，去掉末尾的斜杠和查询参数
  const normalizedUrl = url.replace(/\/$/, '').split('?')[0]
  
  // 获取所有路由（包括动态添加的）
  const allRoutes = router.getRoutes()
  
  // 查找匹配的路由
  const route = allRoutes.find(r => {
    const routePath = r.path.replace(/\/$/, '')
    return routePath === normalizedUrl
  })
  
  // 检查是否有beforeEnter守卫（通常是外部跳转）
  return route && route.beforeEnter
}

// 检查是否是本地工具（url以/开头，不是完整的http/https链接，且不是外部跳转路由）
const isLocalTool = computed(() => {
  // 如果url以/开头，说明是本地路由
  // 如果url是完整的http/https链接，说明是三方网页
  // 如果是外部跳转路由，也不是本地工具
  const isLocal = props.url && props.url.startsWith('/') && !props.url.startsWith('http') && !isExternalRedirect(props.url)
  return isLocal
})
</script>

<template>
  <div v-if="isLocalTool" class="tool-marker" :title="`本地工具: ${controlName ? controlName : ''}`">
    <el-tag size="small" type="success" effect="plain">本地</el-tag>
  </div>
</template>

<style scoped>
.tool-marker {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
}
</style>