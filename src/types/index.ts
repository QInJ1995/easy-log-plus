export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogOptions {
  level?: LogLevel;
  prefix?: string;
  isTime?: boolean;
  isColor?: boolean
  isLevel?: boolean
  isFileName?: boolean
  isFunctionName?: boolean
  isLineNumber?: boolean
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
}