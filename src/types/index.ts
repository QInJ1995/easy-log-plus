export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LogOptions {
  level?: LogLevel; // 日志级别
  isTime?: boolean; // 是否显示时间戳
  isColor?: boolean // 是否启用颜色
  isLevel?: boolean // 是否显示日志级别
  isFileName?: boolean // 是否显示文件名
  isFunctionName?: boolean // 是否显示函数名
  isLineNumber?: boolean, // 是否显示行号
}

export interface EasyLogViteOptions {
  enabled?: boolean;
  config?: LogOptions;
}

export interface EasyLogWebpackOptions {
  enabled?: boolean;
  config?: LogOptions;
}

export interface Colors {
  debug?: string;
  info?: string;
  warn?: string;
  error?: string;
  silent?: string;
}

export interface Emojis {
  debug?: string;
  info?: string;
  warn?: string;
  error?: string;
  silent?: string;
  rocket?: string;
  success?: string;
}

export interface EasyLogVuePluginOptions extends LogOptions {
  namespace?: string; // 命名空间
  isWindow?: boolean; // 是否挂载到 window 对象
  isVue?: boolean; // 是否 挂载到 Vue 实例
  isProvide?: boolean; // 是否使用 provide/inject 只支持vue3
  enabled?: boolean; // 是否启用插件
}