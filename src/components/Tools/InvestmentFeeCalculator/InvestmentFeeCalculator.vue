<template>
  <div>
    <iframe
        src="/html/InvestmentFeeCalculator.html"
        style="width: 100%; height: calc(100vh - 180px); border: none;"
        @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
// 如果你想监听 iframe 加载完成事件
const onIframeLoad = () => {
  console.log('iframe 加载完成');
};
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
