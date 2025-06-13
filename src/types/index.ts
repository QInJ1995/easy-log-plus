import Logger from "../core/Logger";

declare global {
  interface Window {
    logger: Logger;
  }

  namespace NodeJS {
    interface Global {
      logger: Logger;
    }
  }
}

/**
 * 日志级别
 * @description 日志级别
 * @enum {string}
 * @property {string} debug - 调试级别
 * @property {string} info - 信息级别
 * @property {string} warn - 警告级别
 * @property {string} error - 错误级别
 * @property {string} silent - 静默级别
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

/**
 * 打印选项
 * @description 打印选项
 * @property {LogLevel} level - 日志等级
 * @property {any[]} messages - 日志消息
 * @property {string} label - 标签
 * @property {string} namespace - 命名空间
 * @property {LogOptions} logOptions - 日志配置
 * @property {CallStackInfo} callStackInfo - 调用栈信息
 * @property {PrintCustomStyle} printCustomStyle - 打印自定义样式
 */
export interface PrintOptions {
  level?: LogLevel;
  messages: any[];
  namespace?: string;
  label?: string;
  logOptions: LogOptions;
  callStackInfo: CallStackInfo;
  printCustomStyle: PrintCustomStyle;
}

/**
 * @typedef {Object} PrintCustomStyle - 日志样式
 * @property {string} [color] - 日志颜色
 * @property {string} [bgColor] - 日志背景颜色
 * @property {boolean} [bold] - 是否加粗
 * @property {boolean} [italic] - 是否斜体
 * @property {boolean} [underline] - 是否下划线
 * @property {boolean} [strikethrough] - 是否删除线
 * @property {boolean} [reset] - 是否重置样式
 * @property {boolean} [overline] - 是否上划线 不支持浏览器
 * @property {boolean} [dim] - 是否变暗 不支持浏览器 
 * @property {boolean} [inverse] - 是否反转颜色 不支持浏览器
 */
export interface PrintCustomStyle {
  color?: string | BaseColors;
  bgColor?: string | BaseColors;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  overline?: boolean;
  strikethrough?: boolean;
  dim?: boolean;
  inverse?: boolean;
  reset?: boolean;
}

/**
 * 日志选项
 * @description 日志选项
 * @property {LogLevel} level - 日志级别
 * @property {boolean} isColor - 是否显示颜色
 * @property {boolean} isEmoji - 是否显示emoji
 * @property {boolean} isGlobal - 是否全局注入
 * @property {
 * * @property {string} [style.bgColor] - 日志背景颜色
 * * @property {boolean} [style.bold] - 是否显示粗体
 * * @property {boolean} [style.italic] - 是否显示斜体
 * * @property {boolean} [style.underline] - 是否显示下划线
 * * @property {boolean} [style.overline] - 是否显示上划线 不支持浏览器
 * * @property {boolean} [style.strikethrough] - 是否显示删除线
 * * @property {string} [style.color] - 日志颜色
 * * @property {string} [style.dim] - 是否变暗 不支持浏览器
 * * @property {string} [style.reset] - 重置样式
 * * @property {string} [style.inverse] - 反转颜色 不支持浏览器
 * } style - 日志样式
 * @property {Colors} colors - 日志颜色
 * @property {string} formatter - 日志格式
 * @property {number} depth - 日志深度
 * @property {string} env - 环境变量(默认：development)
 */
export interface LogOptions {
  env?: 'development' | 'production' | 'test'
  level?: LogLevel;
  isColor?: boolean
  isEmoji?: boolean;
  isGlobal?: boolean;
  style?: {
    color?: string | BaseColors;
    bgColor?: string | BaseColors;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    overline?: boolean;
    strikethrough?: boolean;
    dim?: boolean;
    inverse?: boolean;
  },
  colors?: Colors;
  formatter?: string
  depth?: number;
}

/**
 * 颜色配置
 * @property {string} debug - 调试日志颜色
 * @property {string} info - 信息日志颜色
 * @property {string} warn - 警告日志颜色
 * @property {string} error - 错误日志颜色
 * @property {string} log - 日志颜色
 */
export interface Colors {
  debug?: string;
  info?: string;
  warn?: string;
  error?: string;
  silent?: string;
}

/**
 * 表情配置
 * @property {string} debug - 调试日志表情
 * @property {string} info - 信息日志表情
 * @property {string} warn - 警告日志表情
 * @property {string} error - 错误日志表情
 * @property {string} silent - 静默日志表情
 * @property {string} rocket - 火箭
 * @property {string} success - 成功
 */
export interface Emojis {
  debug?: string;
  info?: string;
  warn?: string;
  error?: string;
  silent?: string;
  rocket?: string;
  success?: string;
  clock?: string;
  new?: string;
  image?: string;
  down?: string;
}

/**
 * vue插件配置项
 * @property {string} namespace - 命名空间
 * @property {boolean} isVue - 是否挂载到 Vue 实例
 * @property {boolean} isProvide - 是否使用 provide/inject 只支持vue3
 * @property {boolean} enabled - 是否启用插件
 * @extends  {LogOptions} - 日志选项
 */
export interface EasyLogVuePluginOptions extends LogOptions {
  namespace?: string; // 命名空间
  isVue?: boolean; // 是否 挂载到 Vue 实例
  isProvide?: boolean; // 是否使用 provide/inject 只支持vue3
  enabled?: boolean; // 是否启用插件
}

/**
 * 调用堆栈信息
 * @property {string} fileName - 文件名
 * @property {string} functionName - 函数名
 * @property {number} lineNumber - 行号
 */
export interface CallStackInfo {
  fileName?: string;
  functionName?: string;
  lineNumber?: string;
}

/**
 * easy-log-vue 插件接口
 * @interface
 * @property {Function} install - 安装方法
 */
export interface IEasyLogVuePlugin {
  install: (app: any, options?: EasyLogVuePluginOptions) => void;
}

/**
 * 基础颜色
 * @description 基础颜色
 * @enum {string}
 * @property {string} black - 黑色
 * @property {string} red - 红色
 * @property {string} green - 绿色
 * @property {string} yellow - 黄色
 * @property {string} blue - 蓝色
 * @property {string} magenta - 品红色
 * @property {string} cyan - 青色
 * @property {string} white - 白色
 * @property {string} blackBright - 暗黑色
 * @property {string} redBright - 亮红色
 * @property {string} greenBright - 亮绿色
 * @property {string} yellowBright - 亮黄色
 * @property {string} blueBright - 亮蓝色
 * @property {string} magentaBright - 亮品红色
 * @property {string} cyanBright - 亮青色
 * @property {string} whiteBright - 亮白色
 */
export type BaseColors = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'blackBright' | 'redBright' | 'greenBright' | 'yellowBright' | 'blueBright' | 'magentaBright' | 'cyanBright' | 'whiteBright'

