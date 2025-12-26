import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
//入口文件main.ts全局安装element-plus,element-plus默认支持语言英语设置为中文
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//vite-plugin-svg-icons
import 'virtual:svg-icons-register'
//router
import router from './router'
//styles
import './styles/tailwind.css'
//element-plus css
import 'element-plus/dist/index.css'
//pinia
import pinia from './store'
//v-md-editor
import { setupMdEditor } from './plugins/v-md-editor'
//default-passive-events
import 'default-passive-events'
//API
import { fetchShow } from './utils/api'


const app = createApp(App)
//安装仓库
app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})
setupMdEditor(app)

// 通过URL参数key触发Show API
const urlParams = new URLSearchParams(window.location.search)
const key = urlParams.get('key')
if (key) {
  fetchShow(key).catch(error => {
    console.error('Show API调用失败:', error)
  })
}

app.mount('#app')

const originalWarn = console.warn
console.warn = function (...args) {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Unable to preventDefault')) {
    return
  }
  originalWarn.apply(console, args)
}
