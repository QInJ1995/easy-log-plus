import { LogLevel, LogOptions, Colors } from '../types';
import { shouldLog, formatMessage } from '../utils';
export default class Logger {
    private options: Required<LogOptions>;
    private colors: Colors = {
        debug: '#95a5a6',
        info: '#2ecc71',
        warn: '#e67e22',
        error: '#ff0000',
    };

    constructor(options: LogOptions = {}) {
        this.options = {
            level: options.level || 'info',
            prefix: options.prefix || '',
            isTime: options.isTime ?? true,
            isColor: options.isColor ?? true,
            isLevel: options.isLevel ?? true,
            isFileName: options.isFileName ?? true,
            isFunctionName: options.isFunctionName ?? true,
            isLineNumber: options.isLineNumber ?? true,
        };
    }

    private log(level: LogLevel, ...args: any[]) {
        if (!shouldLog(level, this.options)) return

        const logParams = formatMessage(level, args, this.options, this.colors);
        console.log(...logParams)
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