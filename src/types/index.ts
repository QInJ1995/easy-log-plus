export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
} 