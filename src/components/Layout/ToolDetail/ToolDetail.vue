<script setup lang="ts">
import { onMounted } from 'vue';
import ControlMarker from '../ControlMarker/ControlMarker.vue';
const props = defineProps({
  title: {
    type: String,
    default: '描述'
  },
  controlId: {
    type: [Number, String],
    default: () => Math.random().toString(36).substr(2, 9)
  }
})

onMounted(() => {
})
</script>

<template>
  <!-- desc -->
  <div class="mt-3 rounded-2xl bg-white p-4">
    <div class="flex justify-between items-center mb-2">
      <el-divider content-position="left">{{ props.title }}</el-divider>
      <ControlMarker :controlId="controlId" :controlName="title" />
    </div>
    <div class="m-4">
      <slot></slot>
    </div> 
  </div>
</template>

<style scoped>

</style>