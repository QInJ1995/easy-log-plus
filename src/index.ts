import { LogLevel, LogOptions } from './types';

class Logger {
    private options: Required<LogOptions>;
    private colors = {
        debug: '#7f8c8d',
        info: '#3498db',
        warn: '#f1c40f',
        error: '#e74c3c',
        reset: '#ffffff'
    };

    constructor(options: LogOptions = {}) {
        this.options = {
            level: options.level || 'info',
            prefix: options.prefix || '',
            timestamp: options.timestamp ?? true,
            colors: options.colors ?? true
        };
    }

    private formatMessage(level: LogLevel, message: any[]): string {
        const timestamp = this.options.timestamp ? `[${new Date().toISOString()}]` : '';
        const prefix = this.options.prefix ? `[${this.options.prefix}]` : '';
        const levelStr = `[${level.toUpperCase()}]`;
        return `${timestamp}${prefix}${levelStr} ${message.join(' ')}`;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.options.level);
    }

    private log(level: LogLevel, ...args: any[]) {
        if (!this.shouldLog(level)) return;

        const message = this.formatMessage(level, args);
        if (this.options.colors) {
            console.log(`%c${message}`, `color: ${this.colors[level]}`);
        } else {
            console.log(message);
        }
    }

    debug(...args: any[]) {
        this.log('debug', ...args);
    }

    info(...args: any[]) {
        this.log('info', ...args);
    }

    warn(...args: any[]) {
        this.log('warn', ...args);
    }

    error(...args: any[]) {
        this.log('error', ...args);
    }

    setOptions(options: LogOptions) {
        this.options = {
            ...this.options,
            ...options
        };
    }
}

export const createLogger = (options?: LogOptions) => new Logger(options);

// 默认导出
export default createLogger; 