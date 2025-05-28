import { LogLevel, LogOptions } from '../types';
import { getCurrentTimeDate } from '../utils';

export default class Logger {
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
            color: options.color ?? true
        };
    }

    private formatMessage(level: LogLevel, message: any[]): string {
        const timestamp = this.options.timestamp ? `[${getCurrentTimeDate()}]` : '';
        const prefix = this.options.prefix ? `[${this.options.prefix}]` : '';
        const levelStr = `[${level.toUpperCase()}]`;
        return `${timestamp}${prefix}${levelStr} -> ${message.join(' ')}`;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.options.level);
    }

    private log(level: LogLevel, ...args: any[]) {
        if (!this.shouldLog(level)) {
            return new Error(`【Easy-Log-Plus】- ${level} level is not allowed to log, debug < info < warn < error. `); // 
        };

        const message = this.formatMessage(level, args);
        if (this.options.color) {
            console.log(`%c${message}`, `color: ${typeof this.options.color === 'string' ? this.options.color : this.colors[level]} `);
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