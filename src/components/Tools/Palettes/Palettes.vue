<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import DetailHeader from '@/components/Layout/DetailHeader/DetailHeader.vue'
import ToolDetail from '@/components/Layout/ToolDetail/ToolDetail.vue'
import { copy } from '@/utils/string'
import { colord, extend } from 'colord'
import namesPlugin from 'colord/plugins/names'

// 扩展colord支持颜色名称
extend([namesPlugin])

const info = reactive({
  title: "色板",
  palettes: [
    {
      theme: 'last summer day',    // 
      item: ['#A7C5C5', '#DEE0D5', '#E2AC48', '#B96028', '#983C2D'],
    },
    {
      theme: 'Hazy Summer Afternoon',    // 
      item: ['#26C4A5', '#54D99F', '#ACE08C', '#E8E284', '#F2B652'],
    },
    {
      theme: 'Summering',    // 
      item: ['#FFBE4C', '#B33127', '#93EDFF', '#648FAD', '#FFFFFF'],
    },
    {
      theme: 'Bare August — Footcare Essentials',    // 
      item: ['#F2636F', '#F2858E', '#F2AEB4', '#F27999', '#F2D9D0'],
    },
    {
      theme: 'Big Vilnius Summer Loto',    // 
      item: ['#D90416', '#BF2A45', '#528C49', '#BF7B54', '#F28D8D'],
    },
    {
      theme: 'Illustration Design',    // 
      item: ['#D9D2D6', '#010326', '#4C5D73', '#808C65', '#F2E750'],
    },
    {
      theme: 'Beautiful tropical beach with blue sky and white clouds abstract texture background',    // 
      item: ['#04B2D9', '#CEECF2', '#04C4D9', '#15BFBF', '#D9D0C7'],
    },
  ]
})

// 颜色输入和预览功能
const colorInput = ref('#000000')
const previewColor = computed(() => {
  try {
    const color = colord(colorInput.value)
    if (color.isValid()) {
      return color.toHex()
    }
    return 'transparent'
  } catch (e) {
    return 'transparent'
  }
})

//copy
const copyRes = async (resStr: string) => {
  copy(resStr)
}
</script>

<template>
  <div class="flex flex-col mt-3 flex-1">
    <DetailHeader :title="info.title"></DetailHeader>

    <!-- 颜色输入和预览区域 -->
    <div class="mt-4 p-4 rounded-2xl bg-white">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span>颜色输入：</span>
          <el-input 
            v-model="colorInput" 
            placeholder="请输入颜色代码，如 #FF0000、white、rgb(255,0,0)"
            size="small"
            style="width: 300px;"
          ></el-input>
        </div>
        <div class="flex items-center gap-2">
          <span>颜色预览：</span>
          <div 
            class="w-20 h-10 rounded border-2 border-gray-300"
            :style="`background-color: ${previewColor}`"
          ></div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <div class="flex flex-col">
        <div v-for="(item, index) in info.palettes" :key="index" class="flex flex-col mb-3">
          <div class="flex h-28 rounded-lg overflow-hidden items-center">
            <span 
              v-for="(color, index) in item.item"
              :key="index" 
              class="w-1/5 h-full color-palette" 
              :style="'background-color:' + color + ';'" 
              @click="copyRes(color)" 
            >
              <div class="color-text hidden flex items-center justify-center h-full w-full" :style="'color:' + color + ';'" >{{ color }}</div>
            </span>
          </div>
          <el-divider v-if="index != item.item.length + 1"/>
        </div>
      </div>
    </div>

    <!-- desc -->
    <ToolDetail title="描述">
      <el-text>
        在线复制颜色，好看的颜色组合色板
      </el-text> 
    </ToolDetail>
  </div>
</template>

<style scoped>
.color-palette:hover .color-text{
  display: flex;
  filter: grayscale(1) contrast(999) invert(1)
}
</style>