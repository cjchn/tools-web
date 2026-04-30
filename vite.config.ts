import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  let env = loadEnv(mode, process.cwd())
  
  const plugins = [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ]
  
  // 只在开发服务器模式下使用 seoperender 插件（避免 Jenkins 构建需要 Chrome）
  // 只有 command === 'serve' 时才是开发服务器模式
  if (command === 'serve') {
    try {
      const {seoperender} = require("./ssr.config")
      plugins.push(seoperender())
    } catch (e) {
      console.warn('seoperender plugin not available in this environment')
    }
  }
  
  return {
    define: {  
      'process.env.NODE_ENV': JSON.stringify('production'),
      'import.meta.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE || '在线工具'),
      'import.meta.env.VITE_APP_DESC': JSON.stringify(env.VITE_APP_DESC || '')
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve("./src")
      }
    },
    server: {
      host: env.VITE_HOST,
      proxy: {
        [env.VITE_APP_BASE_API] : {
          target: env.VITE_SERVE,
          changeOrigin: true,
        },
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'xlsx': ['xlsx'],
            'codemirror': ['codemirror', '@codemirror/autocomplete', '@codemirror/commands', '@codemirror/lang-javascript', '@codemirror/lang-json', '@codemirror/language', '@codemirror/lint', '@codemirror/search', '@codemirror/state', '@codemirror/theme-one-dark', '@codemirror/view'],
            'echarts': ['echarts'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            'wangeditor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
            'tui-image-editor': ['tui-image-editor'],
            'markdown': ['@kangc/v-md-editor', 'highlight.js', 'prismjs'],
          }
        }
      },
      chunkSizeWarningLimit: 1500
    }
  }
})
