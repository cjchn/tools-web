<script setup lang="ts">
import Header from '@/components/Layout/Header/Header.vue'
import Left from '@/components/Layout/Left/Left.vue'
import Floor from '@/components/Layout/Floor/Floor.vue'
// import Right from '@/components/Layout/Right/Right.vue'
import { useComponentStore } from '@/store/modules/component'
import { onMounted, onUnmounted } from 'vue'

//store
const componentStore = useComponentStore()

// 触摸事件相关变量
let touchStartX = 0
let touchEndX = 0
const minSwipeDistance = 50 // 最小滑动距离

// 触摸开始事件
const handleTouchStart = (event: TouchEvent) => {
  touchStartX = event.changedTouches[0].screenX
}

// 触摸结束事件
const handleTouchEnd = (event: TouchEvent) => {
  touchEndX = event.changedTouches[0].screenX
  handleSwipe()
}

// 处理滑动逻辑
const handleSwipe = () => {
  const swipeDistance = touchEndX - touchStartX
  
  // 右滑，显示左侧抽屉
  if (swipeDistance > minSwipeDistance) {
    componentStore.setleftComDrawerStatus(true)
  }
  
  // 左滑，隐藏左侧抽屉
  if (swipeDistance < -minSwipeDistance) {
    componentStore.setleftComDrawerStatus(false)
  }
}

// 添加触摸事件监听器
onMounted(() => {
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
})

// 移除触摸事件监听器
onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <el-container>
    <!-- left -->
    <el-aside class="fixed top-0 left-0 h-full z-10 c-md:block c-sm:hidden c-xs:hidden" width="240px" v-show="!componentStore.leftCom">
        <Left></Left>
    </el-aside>
    <el-drawer 
      show-close
      size="240px" 
      :with-header="false" 
      v-model="componentStore.leftComDrawer" 
      direction="ltr"
      >
      <Left></Left>
    </el-drawer>

    <!-- right -->
    <el-container  :class="!componentStore.leftCom ? 'c-md:ml-[240px]' : ''">
      <el-header>
        <Header/>
      </el-header>
      <el-main>
        <router-view v-slot="{ Component, route }">
          <transition name="animation" mode="out-in">
            <component :is="Component" :key="route.path"></component>
          </transition>
        </router-view>
      </el-main>
      <el-footer class="md:mb-6 mt-12 c-xs:mb-12">
        <Floor />
      </el-footer>
    </el-container>

  </el-container>
</template>

<style scoped>
/* 过度动画配置代码 */
.animation-enter-from,
.animation-leave-to {
	transform: translateX(20px);
	opacity: 0;
}
.animation-enter-to,
.animation-leave-from {
	opacity: 1;
}
.animation-enter-active {
	transition: all 0.7s ease;
}
.animation-leave-active {
	transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
}
</style>
