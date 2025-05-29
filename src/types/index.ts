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