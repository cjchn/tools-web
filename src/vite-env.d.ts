/// <reference types="vite/client" />

// 为 qrcode-vue3 及其依赖提供类型声明
// 详细的类型声明在 src/types/qrcode-vue3.d.ts 中

declare module 'qrcode-vue3' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<any>
  export default component
}

declare module 'qrcode' {
  const qr: any
  export default qr
}

// 为 qrcode-vue3 内部依赖提供声明
declare module 'qrcode/lib/core/qrcode' {
  const QRCodeFactory: any
  export default QRCodeFactory
}

declare module 'qrcode-vue3/src/core/QRCodeStyling' {
  class QRCodeStyling {
    constructor(options?: any)
    append(canvas: HTMLElement): void
    getRawData(type: string): Promise<string>
    update(options: any): void
    clear(): void
  }
  export default QRCodeStyling
}