import { LogLevel, LogOptions, Colors, PrintOptions, } from '../types';
import { shouldLog, isShowLog, getCallStackInfo, getPrintCustomStyle, mergeObjects } from '../utils/common';
import { envs, setColors, chalkLevel, setCallStackIndex } from '../utils/constant';
import { print } from '../utils/print';
import chalk from 'chalk';

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
    private showLog: boolean = true;

    private printMap: Map<string, any> = new Map();


    constructor(namespace?: string | null, options: LogOptions = {}) {
        chalk.level = chalkLevel;
        this.namespace = namespace ?? 'Easy-Log-Plus';
        options.colors && setColors(options.colors);
        this.showLog = options.env !== envs.prod ? true : false;
        typeof options.depth === 'number' && setCallStackIndex(options.depth);
        this.options = {
            level: options.level || 'debug',
            isColor: options.isColor ?? true,
            isEmoji: options.isEmoji ?? true,
            style: options.style ?? {},
            formatter: options.formatter || '[$namespace$] [$time$] [$level$] [$tracker$] [$label$]',
        };
    }

    /**
     * 
     * @param {any[]} messages 日志参数
     * @param {LogLevel} level 日志级别
     * @returns {void}
     */
    private print(type: string, level: LogLevel, messages?: any[],): void {
        if (!isShowLog(this.showLog)) return
        const printCustomStyle = mergeObjects(this.options.style!, getPrintCustomStyle(this.printMap))
        const label = this.printMap.get('label')
        const callStackInfo = getCallStackInfo()
        const printOptions: PrintOptions = {
            level,
            namespace: this.namespace,
            label,
            messages: messages || [],
            logOptions: this.options,
            callStackInfo,
            printCustomStyle
        }
        this.printMap.clear()
        switch (type) {
            case 'log':
                if (!shouldLog(level, this.options)) return
                print('log', printOptions)
                break;
            case 'time':
                print('time', printOptions)
                break;
            case 'timeEnd':
                print('timeEnd', printOptions)
                break;
            default:
                break;
        }
    }

    /**
     * 输出日志自定义颜色
     * 
     * @param color 颜色
     * @returns 
     */
    color(color: string): Logger {
        this.printMap.set('color', color)
        return this
    }

    /**
     * 输出日志背景颜色
     * 
     * @param color 颜色
     * @returns 
     */
    bgColor(color: string): Logger {
        this.printMap.set('bgColor', color)
        return this
    }

    /**
     * 输出日志自定义信息
     * 
     * @param info 信息
     * @returns 
     */
    label(label: string): Logger {
        this.printMap.set('label', label)
        return this
    }

    /**
     * 输出日志删除线
     * 
     * @returns 
     */
    get strikethrough(): Logger {
        this.printMap.set('strikethrough', true)
        return this
    }

    /**
     * 输出日志下划线
     * 
     * @returns 
     */
    get underline(): Logger {
        this.printMap.set('underline', true)
        return this
    }

    /**
     * 输出日志上划线
     * 
     * @returns 
     */
    get overline(): Logger {
        this.printMap.set('overline', true)
        return this
    }

    /**
     * 输出日志倾斜
     * 
     * @returns 
     */
    get italic(): Logger {
        this.printMap.set('italic', true)
        return this
    }

    /**
     * 输出日志加粗
     * 
     * @returns 
     */
    get bold(): Logger {
        this.printMap.set('bold', true)
        return this
    }

    /**
     * 输出日志文本的不透明度降低
     * 
     * @returns 
     */
    get dim(): Logger {
        this.printMap.set('dim', true)
        return this
    }
    /**
    * 输出日志文本反转颜色
    * 
    * @returns 
    */
    get inverse(): Logger {
        this.printMap.set('inverse', true)
        return this
    }

    /**
     * 输出日志文本重置样式
     * 
     * @returns 
     */
    get reset(): Logger {
        this.printMap.set('reset', true)
        return this
    }

    /**
     * 输出日志
     * @param {any[]} args 日志参数
     * @returns {void | Function}
     */
    log(...args: any[]): Logger {
        this.print('log', 'silent', args,)
        return this;
    }

    /**
     * 
     * @param args debug日志参数
     * @returns {Logger}
     */
    debug(...args: any[]): Logger {
        this.print('log', 'debug', args,)
        return this;
    }

    /**
     * 
     * @param args info日志参数
     * @returns {Logger}
     */
    info(...args: any[]): Logger {
        this.print('log', 'info', args,)
        return this;
    }

    /**
     * 
     * @param args warn日志参数
     * @returns {Logger}
     */
    warn(...args: any[]): Logger {
        this.print('log', 'warn', args,)
        return this;
    }

    /**
     * 
     * @param args error日志参数
     * @returns {Logger}
     */
    error(...args: any[]): Logger {
        this.print('log', 'error', args,)
        return this;
    }

    /**
     * 计时
     * 
     * @returns {Logger}
     */
    time(): Logger {
        this.print('time', 'silent',)
        return this;
    }

    /**
     * 结束计时
     *
     * @returns {Logger}
     */
    timeEnd(): Logger {
        this.print('timeEnd', 'silent',)
        return this;
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