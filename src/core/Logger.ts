import { LogLevel, LogOptions, Colors } from '../types';
import { shouldLog, print, isShowLog, globals, namespaceLength, setNamespaceLength } from '../utils';
export default class Logger {
    private namespace: string = ''; // 命名空间
    private options: Required<LogOptions>; // 日志选项
    private showLog: boolean = !globals.process || (globals.process && globals.process.env.NODE_ENV !== 'production') ? true : false; // 是否显示日志，默认在非生产环境下显示
    private colors: Colors = {
        debug: '#95a5a6',
        info: '#2ecc71',
        warn: '#e67e22',
        error: '#ff0000',
    };

    constructor(namespace: string = '', options: LogOptions = {}) {
        namespace = namespace || '';
        namespace.length > namespaceLength && setNamespaceLength(namespace.length);
        this.namespace = namespace;
        this.options = {
            level: options.level || 'info',
            isTime: options.isTime ?? true,
            isColor: options.isColor ?? true,
            isLevel: options.isLevel ?? true,
            isFileName: options.isFileName ?? true,
            isFunctionName: options.isFunctionName ?? true,
            isLineNumber: options.isLineNumber ?? true,
        };
    }

    private print(level: LogLevel, prefix: string, color: string, ...args: any[]) {
        if (isShowLog(this.showLog) && !shouldLog(level, this.options)) return
        print(level, args, this.namespace, prefix, this.options, color, this.colors)
    }

    log(...args: any[]) {
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('silent', prefix, color, ...args);
                    };
                } else {
                    _this.print('silent', prefix, '', ...args);
                }

            };
        } else {
            this.print('silent', '', '', ...args);
        }
    }



    debug(...args: any[]) {
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('debug', prefix, color, ...args);
                    };
                } else {
                    _this.print('debug', prefix, '', ...args);
                }

            };
        } else {
            this.print('debug', '', '', ...args);
        }
    }

    info(...args: any[]) {
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('info', prefix, color, ...args);
                    };
                } else {
                    _this.print('info', prefix, '', ...args);
                }

            };
        } else {
            this.print('info', '', '', ...args);
        }
    }

    warn(...args: any[]) {
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('warn', prefix, color, ...args);
                    };
                } else {
                    _this.print('warn', prefix, '', ...args);
                }

            };
        } else {
            this.print('warn', '', '', ...args);
        }
    }

    error(...args: any[]) {
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('error', prefix, color, ...args);
                    };
                } else {
                    _this.print('error', prefix, '', ...args);
                }

            };
        } else {
            this.print('error', '', '', ...args);
        }
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