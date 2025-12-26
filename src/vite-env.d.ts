/// <reference types="vite/client" />

declare module 'qrcode-vue3' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{
    value?: string
    size?: number
    color?: string
    bgColor?: string
    logo?: string
    logoWidth?: number
    logoHeight?: number
    logoStyle?: object
    correctLevel?: number
    onValue?: (e: any) => void
    onQRCodeClick?: (e: any) => void
  }>
  export default component
}

declare module 'qrcode' {
  interface QRCodeFactory {
    (typeNumber: number, errorCorrectionLevel: number): any
    default?: (typeNumber: number, errorCorrectionLevel: number) => any
  }
  const qr: QRCodeFactory
  export default qr
}
