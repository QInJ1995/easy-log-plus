import type { LogLevel, ILogOptions, PrintOptions, Env, } from '../types';
import { shouldLog, getCallStackInfo, getPrintCustomStyle, mergeObjects, isEnable, getTopGlobalThis } from '../utils/common';
import { envs, chalkLevel, defaultNamespace, defaultLevel, defaultLevelColors } from '../utils/constant';
import { print } from '../utils/print';
import chalk from 'chalk';

/**
 * 日志记录器类，用于按命名空间输出结构化日志。
 *
 * @class Logger
 * @constructor
 * @param {string} [namespace='Easy-Log-Plus'] - 命名空间名称
 * @param {ILogOptions} [options] - 日志配置选项
 */
export default class Logger {

    /**
     * 顶层全局对象
     */
    public topGlobalThis: any;

    /**
     * 当前环境
     */
    public env: Env = envs.dev;

    /**
     * 当前命名空间，默认为 Easy-Log-Plus
     *
     * @type {string}
     */
    public namespace: string;

    /**
     * 日志配置选项
     *
     * @type {Required<ILogOptions>}
     */
    public options: ILogOptions = {};

    /**
     * 存储打印样式的 Map 对象
     *
     * @type {Map<string, any>}
     */
    private printMap: Map<string, any> = new Map();

    constructor(namespace?: string | null, options: ILogOptions = {}, topGlobalThis?: any) {
        chalk.level = chalkLevel;
        this.namespace = namespace ?? defaultNamespace
        this.topGlobalThis = topGlobalThis ?? getTopGlobalThis()
        this.env = options.env ?? envs.dev
        this.options = {
            level: options.level || defaultLevel,
            levelColors: options.levelColors ? { ...defaultLevelColors, ...options.levelColors! } : defaultLevelColors,
            isColor: options.isColor ?? true,
            isEmoji: options.isEmoji ?? true,
            style: options.style ?? {},
            depth: typeof options.depth === 'number' && options.depth >= 0 ? options.depth : 0,
            formatter: options.formatter || '[$namespace$] [$time$] [$level$] [$tracker$] [$label$]',
        }
    }

    /**
     * 
     * @param {any[]} messages 日志参数
     * @param {LogLevel} level 日志级别
     * @returns {void}
     */
    private print(type: string, level: LogLevel, messages?: any[],): void {
        if (type === 'log' && !shouldLog(this, level)) return
        const printCustomStyle = mergeObjects(this.options.style!, getPrintCustomStyle(this.printMap))
        const label = this.printMap.get('label')
        const callStackInfo = getCallStackInfo(this.options.depth)
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
            case 'time':
                print('time', printOptions)
                break;
            case 'timeEnd':
                print('timeEnd', printOptions)
                break;
            case 'image':
                print('image', printOptions)
                break;
            case 'table':
                print('table', printOptions)
                break;
            default:
                print('log', printOptions)
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
        isEnable(this) && this.printMap.set('color', color)
        return this
    }

    /**
     * 输出日志背景颜色
     * 
     * @param color 颜色
     * @returns 
     */
    bgColor(color: string): Logger {
        isEnable(this) && this.printMap.set('bgColor', color)
        return this
    }

    /**
     * 输出日志自定义信息
     * 
     * @param info 信息
     * @returns 
     */
    label(label: string): Logger {
        isEnable(this) && this.printMap.set('label', label)
        return this
    }

    /**
     * 输出日志删除线
     * 
     * @returns 
     */
    get strikethrough(): Logger {
        isEnable(this) && this.printMap.set('strikethrough', true)
        return this
    }

    /**
     * 输出日志下划线
     * 
     * @returns 
     */
    get underline(): Logger {
        isEnable(this) && this.printMap.set('underline', true)
        return this
    }

    /**
     * 输出日志上划线
     * 
     * @returns 
     */
    get overline(): Logger {
        isEnable(this) && this.printMap.set('overline', true)
        return this
    }

    /**
     * 输出日志倾斜
     * 
     * @returns 
     */
    get italic(): Logger {
        isEnable(this) && this.printMap.set('italic', true)
        return this
    }

    /**
     * 输出日志加粗
     * 
     * @returns 
     */
    get bold(): Logger {
        isEnable(this) && this.printMap.set('bold', true)
        return this
    }

    /**
     * 输出日志文本的不透明度降低
     * 
     * @returns 
     */
    dim(): Logger {
        isEnable(this) && this.printMap.set('dim', true)
        return this
    }
    /**
    * 输出日志文本反转颜色
    * 
    * @returns 
    */
    get inverse(): Logger {
        isEnable(this) && this.printMap.set('inverse', true)
        return this
    }

    /**
     * 输出日志文本重置样式
     * 
     * @returns 
     */
    get reset(): Logger {
        isEnable(this) && this.printMap.set('reset', true)
        return this
    }

    /**
     * 通用日志
     * 
     * @param {any[]} args 日志参数
     * @returns {void | Function}
     */
    log(...args: any[]): Logger {
        isEnable(this) && this.print('log', 'silent', args,)
        return this
    }

    /**
     * debug日志
     * 
     * @param args debug日志参数
     * @returns {Logger}
     */
    debug(...args: any[]): Logger {
        isEnable(this) && this.print('log', 'debug', args,)
        return this
    }

    /**
     * info日志
     * 
     * @param args info日志参数
     * @returns {Logger}
     */
    info(...args: any[]): Logger {
        isEnable(this) && this.print('log', 'info', args,)
        return this
    }

    /**
     * warn日志
     * 
     * @param args warn日志参数
     * @returns {Logger}
     */
    warn(...args: any[]): Logger {
        isEnable(this) && this.print('log', 'warn', args,)
        return this
    }

    /**
     * error日志
     * 
     * @param args error日志参数
     * @returns {Logger}
     */
    error(...args: any[]): Logger {
        isEnable(this) && this.print('log', 'error', args,)
        return this
    }

    /**
     * 开始计时日志
     * 
     * @returns {Logger}
     */
    time(): Logger {
        isEnable(this) && this.print('time', 'silent',)
        return this
    }

    /**
     * 结束计时日志
     *
     * @returns {Logger}
     */
    timeEnd(): Logger {
        isEnable(this) && this.print('timeEnd', 'silent',)
        return this
    }

    /**
     *  图片日志
     *
     * @param {string} url - 图片地址
     * @param {number} scale - 图片缩放比例 0-1
     * @returns {void}
     */
    image(url: string, scale: number = 0.1): Logger {
        isEnable(this) && this.print('image', 'silent', [{ url, scale }])
        return this
    }

    /**
     * 表格日志
     *
     * @param {Object | Array<any>} obj - 需要打印的对象或数组
     * @returns {void}
     */
    table(obj: Object | Array<any>): Logger {
        isEnable(this) && this.print('table', 'silent', [obj])
        return this
    }
}