import { ElMessage } from 'element-plus';
import clipboard3 from 'vue-clipboard3'

/**
 * 转义特殊字符
 * @param str 需处理的字符串
 * @param reg 需转义的特殊字符
 * @returns 转义后的字符串
 */
export function transferred(str: string, reg: string = "`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）;—|【】‘；：""'。，、？") {
    let pattern = new RegExp("[" + reg + "]");
    let res = '';
    Array.from(str).forEach((char: any) => {
      res += char.replace(pattern, `\\${char}`);
    });
    return res;
}

/**
 * 复制文本
 * @param resStr 文本内容
 * @returns 
 */
export function copy(resStr: string) {
  try {
    //check
    if (resStr == '') {
      ElMessage({
        message: "无可复制内容",
        type: "warning",
        duration: 1500
      })
      return
    }
    //copy
    const {toClipboard} = clipboard3()
    toClipboard(resStr)
    ElMessage({
      message: "复制成功",
      type: "success",
      duration: 1500
    })
  } catch (error) {
    ElMessage({
      message: "复制失败",
      type: "error",
      duration: 1500
    })
  }
}

/**
 * 按指定字符生成随机字符串(场景：生成随机密码)
 * @param chars 字符集合
 * @param length 字符串长度
 * @returns 生成的随机字符串
 */
export function genRandomStrByChars(chars: string, length: number): string {
  let password = '';  
  for (let i = 0; i < length; i++) {  
    const randomIndex = Math.floor(Math.random() * chars.length);  
    password += chars[randomIndex];  
  }  
  return password;  
}

/**
 * 数字转中文
 * @param num 
 * @returns 
 */
export function numberToChinese(num: number): string {
  // const units = ['', '拾', '佰', '仟', '万', '亿'];  
  const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '万'];  
  const chars = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];  
  let numStr = num.toString()
  let len = numStr.length
  if (len > 13) {
    ElMessage({
      message: "金额太大无法转换",
      type: "error",
      duration: 1500
    })
    return ''
  }
  let isZero = false;  
  let zeroCount = 0;  
  let chinese = ''

  for (let i = 0; i < len; i++) {  
    let n = parseInt(numStr[i]);  
    if (n === 0) {  
      isZero = true;  
      zeroCount++;  
    } else {  
      if (isZero) {  
        chinese += chars[0];  
      }  
      chinese += chars[n] + units[len - i - 1];  
      isZero = false;  
      zeroCount = 0;  
    }  
    // debugger
  }


  if (chinese.endsWith(chars[0])) {  
    chinese = chinese.substring(0, chinese.length - 1);  
  }  
  
  return chinese;  
}

/**
 * 删除右侧指定字符
 * @param str 原始字符串
 * @param char 指定字符（默认空格）
 * @returns 处理后的字符串
 */
export function rtrim(str: string, char = ' '): string {
    return str.replace(new RegExp('\\'+char+'+$', 'g'), '');
}

/**
 * 中文转拼音（简易版本）
 * @param str 中文字符串
 * @returns 拼音字符串
 */
export function chineseToPinyin(str: string): string {
  // 简易版中文转拼音，只处理常用汉字
  // 实际项目中可以使用更完善的拼音转换库
  const pinyinMap: Record<string, string> = {
    '多': 'duo', '列': 'lie', '编': 'bian', '辑': 'ji', '工': 'gong', '具': 'ju',
    '示': 'shi', '例': 'li', '文': 'wen', '本': 'ben', '这': 'zhe', '是': 'shi',
    '第': 'di', '一': 'yi', '行': 'hang', '内': 'nei', '容': 'rong', '二': 'er',
    '三': 'san', '四': 'si', '五': 'wu', '六': 'liu', '七': 'qi', '八': 'ba',
    '九': 'jiu', '十': 'shi', '上': 'shang', '下': 'xia', '左': 'zuo', '右': 'you',
    '中': 'zhong', '人': 'ren', '民': 'min', '共': 'gong', '和': 'he',
    '北': 'bei', '京': 'jing', '天': 'tian', '安': 'an', '门': 'men'
  };
  
  return Array.from(str).map(char => {
    // 如果是中文字符且在映射表中，返回对应的拼音
    if (/[\u4e00-\u9fa5]/.test(char) && pinyinMap[char]) {
      return pinyinMap[char];
    }
    // 否则返回原字符
    return char;
  }).join('');
}

/**
 * 转大写
 * @param str 字符串
 * @returns 大写字符串
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

/**
 * 转小写
 * @param str 字符串
 * @returns 小写字符串
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

/**
 * 转驼峰命名
 * @param str 字符串
 * @returns 驼峰命名字符串
 */
export function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * 转下划线分割
 * @param str 字符串
 * @returns 下划线分割字符串
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // 处理驼峰转下划线
    .replace(/[-\s]+/g, '_') // 处理空格和连字符
    .toLowerCase(); // 转小写
}

const StringUtils = {
  transferred,
  copy,
  genRandomStrByChars,
  numberToChinese,
  rtrim,
  chineseToPinyin,
  toUpperCase,
  toLowerCase,
  toCamelCase,
  toSnakeCase
}

export default StringUtils