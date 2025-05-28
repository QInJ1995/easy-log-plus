import { LogLevel, LogOptions, Colors } from '../types';
import { getColor, shouldLog, formatMessage } from '../utils';
export default class Logger {
    private options: Required<LogOptions>;
    private colors: Colors = {
        debug: '#95a5a6',
        info: '#2ecc71',
        warn: '#e67e22',
        error: '#ff0000',
    };

    constructor(options: LogOptions = {}) {
        // this.namespace = namespace;
        this.options = {
            level: options.level || 'info',
            prefix: options.prefix || '',
            timestamp: options.timestamp ?? true,
            color: options.color ?? true
        };
    }

    private log(level: LogLevel, ...args: any[]) {
        if (!shouldLog(level, this.options)) return
        const message = formatMessage(level, args, this.options);
        if (this.options.color) {
            console.log(`%c${message}`, `color: ${typeof this.options.color === 'string' ? this.options.color === 'auto' ? getColor(level) : this.options.color : this.colors[level]} `);
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

    setColors(colors: Colors) {
        this.colors = {
            ...this.colors,
            ...colors
        };
    }
}