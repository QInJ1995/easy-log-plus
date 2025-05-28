export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  color?: boolean | string;
}

export interface EasyLogViteOptions {
  enabled?: boolean;
  config?: LogOptions;
}

export interface EasyLogWebpackOptions {
  enabled?: boolean;
  config?: LogOptions;
}