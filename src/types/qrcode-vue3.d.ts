// 为 qrcode-vue3 内部依赖 qrcode 库提供完整的类型声明
declare module 'qrcode' {
  interface QRCodeFactory {
    default: (typeNumber: number, errorCorrectionLevel: number) => any;
    (typeNumber: number, errorCorrectionLevel: number): any;
  }
  
  const qr: QRCodeFactory;
  export default qr;
}

// 也可以使用 any 类型来绕过检查（如果上面的方法还不够）
declare module 'qrcode/lib/core/qrcode' {
  const QRCodeFactory: any;
  export default QRCodeFactory;
}

declare module 'qrcode-vue3' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<any>
  export default component
}