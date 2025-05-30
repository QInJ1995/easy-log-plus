import { LogLevel, LogOptions, Colors, TrackInfo } from '../types';
import { shouldLog, print, isShowLog, globals, namespaceLength, setNamespaceLength, defaultStyle, getTrackInfo } from '../utils';
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
        namespace = namespace || 'Easy-Log-Plus';
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
            isEmoji: options.isEmoji ?? true,
            style: options.style ? { ...defaultStyle, ...options.style } : defaultStyle,
        };
    }

    private print(level: LogLevel, prefix: string, color: string, trackInfo: TrackInfo, ...args: any[]) {
        if (isShowLog(this.showLog) && !shouldLog(level, this.options)) return
        print(level, args, this.namespace, prefix, this.options, color, this.colors, trackInfo)
    }

    log(...args: any[]) {
        const trackInfo = getTrackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('silent', prefix, color, trackInfo, ...args);
                    };
                } else {
                    _this.print('silent', prefix, '', trackInfo, ...args);
                }

            };
        } else {
            this.print('silent', '', '', trackInfo, ...args);
        }
    }



    debug(...args: any[]) {
        const trackInfo = getTrackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('debug', prefix, color, trackInfo, ...args);
                    };
                } else {
                    _this.print('debug', prefix, '', trackInfo, ...args);
                }

            };
        } else {
            this.print('debug', '', '', trackInfo, ...args);
        }
    }

    info(...args: any[]) {
        const trackInfo = getTrackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('info', prefix, color, trackInfo, ...args);
                    };
                } else {
                    _this.print('info', prefix, '', trackInfo, ...args);
                }

            };
        } else {
            this.print('info', '', '', trackInfo, ...args);
        }
    }

    warn(...args: any[]) {
        const trackInfo = getTrackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('warn', prefix, color, trackInfo, ...args);
                    };
                } else {
                    _this.print('warn', prefix, '', trackInfo, ...args);
                }

            };
        } else {
            this.print('warn', '', '', trackInfo, ...args);
        }
    }

    error(...args: any[]) {
        const trackInfo = getTrackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('error', prefix, color, trackInfo, ...args);
                    };
                } else {
                    _this.print('error', prefix, '', trackInfo, ...args);
                }

            };
        } else {
            this.print('error', '', '', trackInfo, ...args);
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