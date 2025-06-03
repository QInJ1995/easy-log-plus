import { LogLevel, LogOptions, Colors, CallStackInfo } from '../types';
import { shouldLog, isShowLog, getCallStackInfo } from '../utils/common';
import { globals, defaultStyle, setColors } from '../utils/constant';
import { print } from '../utils/print';

/**
 * 日志记录器类，用于按命名空间输出结构化日志。
 *
 * @class Logger
 * @constructor
 * @param {string} [namespace='Easy-Log-Plus'] - 命名空间名称
 * @param {LogOptions} [options] - 日志配置选项
 */
export default class Logger {
    /**
     * 当前命名空间，默认为 Easy-Log-Plus
     *
     * @type {string}
     */
    private namespace: string;

    /**
     * 日志配置选项
     *
     * @type {Required<LogOptions>}
     */
    private options: LogOptions;

    /**
     * 是否显示日志，默认在非生产环境下显示
     *
     * @type {boolean}
     */
    private showLog: boolean = !globals.process || (globals.process && globals.process.env.NODE_ENV !== 'production') ? true : false;


    constructor(namespace: string | null | undefined, options: LogOptions = {}) {
        namespace = namespace == null ? 'Easy-Log-Plus' : namespace;
        this.namespace = namespace as string;
        options.colors && setColors(options.colors);
        this.options = {
            level: options.level || 'debug',
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

    /**
     * 
     * @param {LogLevel} level 日志级别
     * @param {string} prefix 前缀
     * @param {string} color 日志颜色
     * @param {CallStackInfo} callStackInfo 调用栈信息
     * @param {any[]} args 日志参数
     * @returns {void}
     */
    private print(level: LogLevel, prefix: string, color: string, callStackInfo: CallStackInfo, ...args: any[]): void {
        if (isShowLog(this.showLog) && !shouldLog(level, this.options)) return
        print(level, args, this.namespace, prefix, this.options, color, callStackInfo)
    }

    /**
     * 输出日志
     * @param {any[]} args 日志参数
     * @returns {void | Function}
     */
    log(...args: any[]): void | Function {
        const callStackInfo = getCallStackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('silent', prefix, color, callStackInfo, ...args);
                    };
                } else {
                    _this.print('silent', prefix, '', callStackInfo, ...args);
                }

            };
        } else {
            this.print('silent', '', '', callStackInfo, ...args);
        }
    }

    /**
     * 
     * @param args debug日志参数
     * @returns {void | Function}
     */
    debug(...args: any[]): void | Function {
        const callStackInfo = getCallStackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('debug', prefix, color, callStackInfo, ...args);
                    };
                } else {
                    _this.print('debug', prefix, '', callStackInfo, ...args);
                }

            };
        } else {
            this.print('debug', '', '', callStackInfo, ...args);
        }
    }

    /**
     * 
     * @param args info日志参数
     * @returns {void | Function}
     */
    info(...args: any[]): void | Function {
        const callStackInfo = getCallStackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('info', prefix, color, callStackInfo, ...args);
                    };
                } else {
                    _this.print('info', prefix, '', callStackInfo, ...args);
                }

            };
        } else {
            this.print('info', '', '', callStackInfo, ...args);
        }
    }

    /**
     * 
     * @param args warn日志参数
     * @returns {void | Function}
     */
    warn(...args: any[]): void | Function {
        const callStackInfo = getCallStackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('warn', prefix, color, callStackInfo, ...args);
                    };
                } else {
                    _this.print('warn', prefix, '', callStackInfo, ...args);
                }

            };
        } else {
            this.print('warn', '', '', callStackInfo, ...args);
        }
    }

    /**
     * 
     * @param args error日志参数
     * @returns {void | Function}
     */
    error(...args: any[]): void | Function {
        const callStackInfo = getCallStackInfo()
        if (arguments.length === 0) {
            const _this = this;
            return function (prefix: string, ...args: any[]) {
                if (arguments.length === 0) {
                    return function (prefix: string, color: string, ...args: any[]) {
                        _this.print('error', prefix, color, callStackInfo, ...args);
                    };
                } else {
                    _this.print('error', prefix, '', callStackInfo, ...args);
                }

            };
        } else {
            this.print('error', '', '', callStackInfo, ...args);
        }
    }

    /**
     * 设置日志配置选项
     *
     * @param {LogOptions} options - 需要更新的日志选项
     * @returns {void}
     */
    setOptions(options: LogOptions): void {
        Object.assign(this.options, options);
    }

    /**
     * 设置颜色
     *
     * @param {Colors} colors - 需要更新的颜色选项
     * @returns {void}
     */
    setColors(colors: Colors): void {
        setColors(colors);
    }
}