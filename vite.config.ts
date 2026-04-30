import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(async ({command, mode}) => {
  let env = loadEnv(mode, process.cwd())
  
  // 根据命令决定是否使用 seoperender 插件
  const plugins = [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ]
  
  // 只在开发模式下使用 seoperender 插件（避免 Jenkins 构建需要 Chrome）
  if (command === 'serve') {
    const {seoperender} = await import("./ssr.config")
    plugins.push(seoperender())
  }
  
  return {
    define: {  
      'process.env.NODE_ENV': JSON.stringify('production')  
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
