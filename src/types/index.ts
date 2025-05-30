
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
 * 全局对象
 * @description 全局对象
 */
export type Globals = typeof window | typeof global | any;

/**
 * 颜色配置
 * @description 颜色配置
 * @property {string} padding - 边距
 * @property {number} fontSize - 字体大小
 * @property {'normal' | 'bold' | 'lighter' | 'bolder' | number} fontWeight - 字体粗细
 */
export interface Style {
  padding?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number;
  fontSize?: number;
}

/**
 * 日志选项
 * @description 日志选项
 * @property {LogLevel} level - 日志级别
 * @property {boolean} isTime - 是否显示时间
 * @property {boolean} isColor - 是否显示颜色
 * @property {boolean} isLevel - 是否显示日志级别
 * @property {boolean} isFileName - 是否显示文件名
 * @property {boolean} isFunctionName - 是否显示函数名
 * @property {boolean} isLineNumber - 是否显示行号
 * @property {boolean} isEmoji - 是否显示emoji
 * @property {Style} style - 日志样式
 */
export interface LogOptions {
  level?: LogLevel;
  isTime?: boolean;
  isColor?: boolean
  isLevel?: boolean
  isFileName?: boolean
  isFunctionName?: boolean
  isLineNumber?: boolean,
  isEmoji?: boolean;
  style?: Style,
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
}

/**
 * vue插件配置项
 * @property {string} namespace - emoji配置
 * @property {boolean} isWindow - 日志颜色
 * @property {boolean} isVue - 是否显示时间
 * @property {boolean} isProvide - 是否显示颜色
 * @property {boolean} enabled - emoji
 * @property {LogLevel} level - 日志级别
 * @property {boolean} isTime - 是否显示时间
 * @property {boolean} isColor - 是否显示颜色
 * @property {boolean} isLevel - 是否显示日志级别
 * @property {boolean} isFileName - 是否显示文件名
 * @property {boolean} isFunctionName - 是否显示函数名
 * @property {boolean} isLineNumber - 是否显示行号
 * @property {boolean} isEmoji - 是否显示emoji
 * @property {Style} style - 日志样式
 */
export interface EasyLogVuePluginOptions extends LogOptions {
  namespace?: string; // 命名空间
  isWindow?: boolean; // 是否挂载到 window 对象
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