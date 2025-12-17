<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DetailHeader from '@/components/Layout/DetailHeader/DetailHeader.vue'
import ToolDetail from '@/components/Layout/ToolDetail/ToolDetail.vue'

const info = ref({
  title: "在线尺子",
})

// 尺子配置
const rulerConfig = ref({
  showHorizontal: true,
  showVertical: true,
  unit: 'cm', // 'cm' or 'inch'
  scale: 100, // 默认100px代表1cm
})

// 计算设备像素比
const devicePixelRatio = ref(window.devicePixelRatio || 1)

// 获取尺子长度
const rulerLength = ref({
  horizontal: 0,
  vertical: 0
})

// 定义刻度类型
interface Tick {
  position: number
  isMajor: boolean
  value: string
}

// 计算刻度值
const getTickValue = (position: number) => {
  if (rulerConfig.value.unit === 'cm') {
    return (position / rulerConfig.value.scale).toFixed(1) + 'cm'
  } else {
    return (position / (rulerConfig.value.scale * 2.54)).toFixed(1) + 'inch'
  }
}

// 初始化尺子尺寸
const initRulerSize = () => {
  const container = document.querySelector('.ruler-container')
  if (container) {
    const rect = container.getBoundingClientRect()
    rulerLength.value.horizontal = rect.width
    rulerLength.value.vertical = rect.height
  }
}

// 生成刻度线
const generateTicks = (length: number) => {
  const ticks: Tick[] = []
  const majorTickInterval = rulerConfig.value.scale // 主刻度间隔
  const minorTickInterval = rulerConfig.value.scale / 10 // 次刻度间隔
  
  for (let i = 0; i <= length; i += minorTickInterval) {
    const isMajorTick = i % majorTickInterval === 0
    ticks.push({
      position: i,
      isMajor: isMajorTick,
      value: isMajorTick ? getTickValue(i) : ''
    })
  }
  return ticks
}

// 窗口大小变化时重新计算尺子尺寸
onMounted(() => {
  initRulerSize()
  window.addEventListener('resize', initRulerSize)
})
</script>

<template>
  <div class="flex flex-col mt-3 flex-1">
    <DetailHeader :title="info.title"></DetailHeader>

    <div class="ruler-container relative p-4 rounded-2xl bg-white overflow-hidden">
      <!-- 水平尺子 -->
      <div v-if="rulerConfig.showHorizontal" class="horizontal-ruler absolute top-0 left-0 w-full h-20 bg-gray-50 border-b border-gray-200">
        <div class="ruler-content h-full relative" :style="{ height: '100%' }">
          <div 
            v-for="tick in generateTicks(rulerLength.horizontal)" 
            :key="tick.position" 
            class="tick absolute bottom-0" 
            :class="{ 'major-tick': tick.isMajor }"
            :style="{
              left: `${tick.position / devicePixelRatio}px`,
              height: tick.isMajor ? '80%' : '40%',
              width: `${1 / devicePixelRatio}px`
            }"
          ></div>
          <div 
            v-for="tick in generateTicks(rulerLength.horizontal)" 
            :key="tick.position + '-label'" 
            class="tick-label absolute bottom-0 text-xs" 
            :style="{
              left: `${(tick.position / devicePixelRatio) - 10}px`,
              bottom: '5px',
              width: '20px',
              textAlign: 'center'
            }"
          >
            {{ tick.value }}
          </div>
        </div>
      </div>

      <!-- 垂直尺子 -->
      <div v-if="rulerConfig.showVertical" class="vertical-ruler absolute top-0 left-0 w-20 h-full bg-gray-50 border-r border-gray-200">
        <div class="ruler-content h-full relative" :style="{ width: '100%' }">
          <div 
            v-for="tick in generateTicks(rulerLength.vertical)" 
            :key="tick.position" 
            class="tick absolute right-0" 
            :class="{ 'major-tick': tick.isMajor }"
            :style="{
              top: `${tick.position / devicePixelRatio}px`,
              width: tick.isMajor ? '80%' : '40%',
              height: `${1 / devicePixelRatio}px`
            }"
          ></div>
          <div 
            v-for="tick in generateTicks(rulerLength.vertical)" 
            :key="tick.position + '-label'" 
            class="tick-label absolute right-0 text-xs transform -rotate-90 origin-right flex items-center"
            :style="{
              top: `${(tick.position / devicePixelRatio) + 5}px`,
              right: '25px',
              height: '20px'
            }"
          >
            {{ tick.value }}
          </div>
        </div>
      </div>

      <!-- 尺子内容区域 -->
      <div class="ruler-main-content ml-20 mt-20 p-4" :style="{ minHeight: '300px' }">
        <div class="bg-white border border-dashed border-gray-300 rounded w-full h-full flex items-center justify-center">
          <p class="text-gray-500">在此处放置需要测量的内容</p>
        </div>
      </div>
    </div>

    <!-- 控制区域 -->
    <div class="mt-4 p-4 rounded-2xl bg-white">
      <div class="flex items-center gap-4 overflow-x-auto">
        <div class="flex items-center gap-2 whitespace-nowrap">
          <el-checkbox v-model="rulerConfig.showHorizontal">显示水平尺子</el-checkbox>
        </div>
        <div class="flex items-center gap-2 whitespace-nowrap">
          <el-checkbox v-model="rulerConfig.showVertical">显示垂直尺子</el-checkbox>
        </div>
        <div class="flex items-center gap-2 whitespace-nowrap">
          <span>单位：</span>
          <el-select v-model="rulerConfig.unit" size="small" style="width: 120px;">
            <el-option label="厘米 (cm)" value="cm"></el-option>
            <el-option label="英寸 (inch)" value="inch"></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!-- desc -->
    <ToolDetail title="描述">
      <el-text>
        在线尺子工具可以帮助您在屏幕上进行简单的尺寸测量。尺子会显示在页面的边缘，支持水平和垂直方向测量。
        工具会自动适应您的设备像素比，确保在不同分辨率的设备上都能获得准确的测量结果。
        您可以根据需要选择显示或隐藏水平/垂直尺子，并切换厘米和英寸单位。
      </el-text> 
    </ToolDetail>

  </div>
</template>

<style scoped>
.ruler-container {
  position: relative;
  min-height: 400px;
}

.horizontal-ruler,
.vertical-ruler {
  position: absolute;
  background-color: #f3f4f6;
}

.ruler-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.tick {
  background-color: #333;
  position: absolute;
}

.tick.major-tick {
  background-color: #000;
}

.tick-label {
  color: #333;
  font-size: 12px;
  position: absolute;
  white-space: nowrap;
}

.ruler-main-content {
  position: relative;
}
</style>