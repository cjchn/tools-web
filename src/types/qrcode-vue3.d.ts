// 为 qrcode-vue3 及其依赖提供完整的类型声明，解决 Jenkins 编译错误

// 为 qrcode 库提供类型声明，确保 QRCodeFactory 包含 default 属性
declare module 'qrcode' {
  interface QRCodeFactory {
    (typeNumber: number, errorCorrectionLevel: number): any;
    default: (typeNumber: number, errorCorrectionLevel: number) => any;
    create: (options: any) => any;
    toCanvas: (canvas: any, text: string, options?: any) => Promise<void>;
    toDataURL: (text: string, options?: any) => Promise<string>;
    toString: (text: string, options?: any) => Promise<string>;
  }
  
  const qr: QRCodeFactory;
  export default qr;
}

// 为 qrcode 库的子模块提供类型声明
declare module 'qrcode/lib/core/qrcode' {
  interface QRCodeFactory {
    (typeNumber: number, errorCorrectionLevel: number): any;
    default: (typeNumber: number, errorCorrectionLevel: number) => any;
  }
  
  const QRCodeFactory: QRCodeFactory;
  export default QRCodeFactory;
}

declare module 'qrcode/lib/core/qrcodegen' {
  const content: any;
  export default content;
}

declare module 'qrcode/lib/renderer/utils' {
  const content: any;
  export default content;
}

declare module 'qrcode/lib/renderer' {
  const content: any;
  export default content;
}

declare module 'qrcode/lib/browser/browser' {
  const content: any;
  export default content;
}

// 为 qrcode-vue3 提供完整的类型声明
declare module 'qrcode-vue3' {
  import { DefineComponent } from 'vue';
  
  interface QRCodeStylingOptions {
    width?: number;
    height?: number;
    value?: string;
    margin?: number;
    qrOptions?: {
      typeNumber?: number;
      mode?: string;
      errorCorrectionLevel?: string;
    };
    imageOptions?: {
      hideBackgroundDots?: boolean;
      imageSize?: number;
      margin?: number;
      crossOrigin?: string;
    };
    dotsOptions?: {
      type?: string;
      color?: string;
      gradient?: {
        type?: string;
        rotation?: number;
        colorStops?: Array<{ offset: number; color: string }>;
      };
    };
    cornersSquareOptions?: {
      type?: string;
      color?: string;
      gradient?: {
        type?: string;
        rotation?: number;
        colorStops?: Array<{ offset: number; color: string }>;
      };
    };
    cornersDotOptions?: {
      type?: string;
      color?: string;
      gradient?: {
        type?: string;
        rotation?: number;
        colorStops?: Array<{ offset: number; color: string }>;
      };
    };
    backgroundOptions?: {
      color?: string;
      gradient?: {
        type?: string;
        rotation?: number;
        colorStops?: Array<{ offset: number; color: string }>;
      };
    };
    image?: string | File;
  }
  
  const component: DefineComponent<QRCodeStylingOptions>;
  export default component;
}

// 为 qrcode-vue3 的子模块提供类型声明
declare module 'qrcode-vue3/src/core/QRCodeStyling' {
  class QRCodeStyling {
    constructor(options?: any);
    append(canvas: HTMLElement): void;
    getRawData(type: string): Promise<string>;
    update(options: any): void;
    clear(): void;
  }
  export default QRCodeStyling;
}

declare module 'qrcode-vue3/src/utils' {
  const content: any;
  export default content;
}