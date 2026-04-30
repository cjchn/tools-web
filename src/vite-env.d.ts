/// <reference types="vite/client" />

// 为 qrcode-vue3 提供完整的类型声明
declare module 'qrcode-vue3' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<any>
  export default component
}

// 为 qrcode 库提供类型声明，解决 QRCodeFactory 类型问题
declare module 'qrcode' {
  const qr: any
  export default qr
}

// 为 qrcode-vue3 内部依赖提供声明，完全规避类型检查
declare module 'qrcode/lib/core/qrcode' {
  const QRCodeFactory: any
  export default QRCodeFactory
}

declare module 'qrcode/lib/core/qrcodegen' {
  const content: any
  export default content
}

declare module 'qrcode/lib/renderer/utils' {
  const content: any
  export default content
}
