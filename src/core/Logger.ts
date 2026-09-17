import LocalForageService from '../environment/browser/LocalForageService';
import { LogLevel, ILogOptions, PrintOptions, Env, ILoggerConfig, PrintCustomStyle, CallStackInfo } from '../types';
import { shouldLog, getCallStackInfo, getPrintCustomStyle, mergeObjects, isEnable, debugAlert, checkIsBrowser, localConsoleError, EMPTY_PRINT_STYLE, EMPTY_CALL_STACK_INFO } from '../utils/common';
import { chalkLevel, defaultNamespace, defaultLevelColors, defaultMaxLogCount } from '../utils/constant';
import { printSync, printAsync } from '../utils/print';
import registerBrowser from '../environment/browser/registerBrowser'
import registerServer from '../environment/server/registerServer'
import { removeShortcutKeyEvents } from '../environment/browser/shortcutKeyEvents'
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import topGlobalThis from '../utils/topGlobalThis'

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
     * 日志存储器
     */
    public logStore?: LocalForageService;

    /**
     * 配置存储器
     */
    public configStore?: LocalForageService;

    /**
     * 日志配置
     */
    public config?: ILoggerConfig;

    /**
     * 默认配置
     */
    public defaultConfig?: ILoggerConfig;

    /**
     * 当前环境
     */
    public env: Env = Env.Dev;

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

    /**
     * 基础打印样式（构造时由用户配置计算，冻结复用，
     * 热路径无链式自定义样式时直接引用，避免每条日志重复构造对象）
     */
    private basePrintStyle: PrintCustomStyle = EMPTY_PRINT_STYLE;

    /**
     * 日志修剪检查计数器（每 100 条日志检查一次存储上限，
     * 避免每条日志都向 IndexedDB 发起 length 查询）
     */
    private _pruneCounter: number = 0;

    constructor(namespace?: string | null, options: ILogOptions = {}) {
        const isBrowser = checkIsBrowser();
        chalk.level = chalkLevel;
        this.namespace = namespace ?? defaultNamespace
        this.topGlobalThis = topGlobalThis
        this.env = options.env ?? Env.Dev
        this.options = {
            levelColors: options.levelColors ? { ...defaultLevelColors, ...options.levelColors! } : defaultLevelColors,
            isColor: options.isColor ?? true,
            isEmoji: options.isEmoji ?? true,
            style: options.style ?? {},
            depth: typeof options.depth === 'number' && options.depth >= 0 ? options.depth : 0,
            formatter: options.formatter || '[$namespace$] [$time$] [$level$] [$tracker$] [$label$]',
        }
        // 预计算基础打印样式（冻结复用，热路径直接引用）
        this.basePrintStyle = Object.freeze(mergeObjects(this.options.style! as PrintCustomStyle, EMPTY_PRINT_STYLE))
        // 注册不同环境注册
        isBrowser ? registerBrowser(this) : registerServer()
    }

    /**
     *
     * @param {any[]} messages 日志参数
     * @param {LogLevel} level 日志级别
     * @returns {void | Promise<any>}
     */
    private print(type: string, level: LogLevel, messages?: any[],): void | Promise<any> {
        if (type === 'log' && !shouldLog(this, level)) {
            // 级别过滤时同样清空链式样式，避免残留泄漏到下一条日志
            this.printMap.clear()
            return
        }
        // 快路径：无链式自定义样式时直接复用冻结的基础样式，避免每条日志重复构造对象
        const printCustomStyle = this.printMap.size === 0
            ? this.basePrintStyle
            : mergeObjects(this.basePrintStyle, getPrintCustomStyle(this.printMap))
        const labels: string[] = this.printMap.get('labels') || []
        // 仅在需要展示调用追踪信息时才捕获堆栈（堆栈捕获约 25μs，是单条日志输出的最大开销）
        const callStackInfo: CallStackInfo = this._isTraceEnabled() ? getCallStackInfo(this.options.depth) : EMPTY_CALL_STACK_INFO
        const printOptions: PrintOptions = {
            level,
            namespace: this.namespace,
            labels,
            messages: messages || [],
            logOptions: this.options,
            callStackInfo,
            printCustomStyle,
            logger: this
        }
        this.printMap.clear()
        switch (type) {
            case 'performance':
                // performance 需要 await 用户任务，保持异步链
                return printAsync('performance', printOptions).then(({ title, taskFnResult, messages }) => {
                    if (this.config?.isRecordLog) {
                        this.logStore?.setItem(uuidv4(), { title, messages, timestamp: Date.now() })
                        this._pruneLogStore() // 异步修剪超限日志，不阻塞日志输出
                    }
                    return taskFnResult
                })
            case 'image':
                return printAsync('image', printOptions)
            case 'time':
            case 'timeEnd':
            case 'table':
                printSync(type, printOptions)
                break;
            default:
                {
                    const title = printSync('log', printOptions) as string
                    if (this.config?.isRecordLog) {
                        this.logStore?.setItem(uuidv4(), { title, messages, timestamp: Date.now() })
                        this._pruneLogStore() // 异步修剪超限日志，不阻塞日志输出
                    }
                    debugAlert(level, this, printOptions)
                }
                break;
        }
    }

    /**
     * 当前配置是否需要解析调用堆栈
     * 堆栈捕获（约 25μs/次）仅应服务于 $tracker$ 占位符、源码位置显示或调试弹窗信息
     *
     * @returns {boolean}
     */
    private _isTraceEnabled(): boolean {
        const formatter = this.options.formatter || ''
        return formatter.includes('$tracker$') || !!this.config?.isSourceCodeLocation || !!this.config?.isDebugLog
    }

    /**
     * 修剪日志存储（带节流）
     * 每 100 条日志才向存储发起一次 length 查询，避免每条日志都产生额外的存储请求
     *
     * @returns {void}
     */
    private _pruneLogStore(): void {
        if (++this._pruneCounter < 100) return
        this._pruneCounter = 0
        this._pruneLogStoreNow()
    }

    /**
     * 执行修剪：超过最大记录条数时淘汰最旧的日志
     * 淘汰到最大条数的 90%，避免每写入一条都触发全量遍历
     *
     * @returns {Promise<void>}
     */
    private async _pruneLogStoreNow(): Promise<void> {
        try {
            const maxLogCount = this.config?.maxLogCount ?? defaultMaxLogCount
            if (!this.logStore || maxLogCount <= 0) return
            const length = await this.logStore.length()
            if (typeof length !== 'number' || length <= maxLogCount) return
            // 收集所有日志的 key 与时间戳，按时间排序淘汰最旧的
            const entries: { key: string; timestamp: number }[] = []
            await this.logStore.iterate((value: any, key: string) => {
                entries.push({ key, timestamp: value?.timestamp ?? 0 })
            })
            entries.sort((a, b) => a.timestamp - b.timestamp)
            const removeCount = entries.length - Math.floor(maxLogCount * 0.9)
            for (let i = 0; i < removeCount; i++) {
                await this.logStore.removeItem(entries[i].key)
            }
        } catch (error) {
            localConsoleError('[easy-log-plus]: prune log store failed!', error);
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
        if (isEnable(this)) {
            const labels = this.printMap.get('labels') || []
            labels.push(label)
            this.printMap.set('labels', labels)
        }
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
        const isBrowser = checkIsBrowser();
        !isBrowser && isEnable(this) && this.printMap.set('overline', true)
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
        const isBrowser = checkIsBrowser();
        !isBrowser && isEnable(this) && this.printMap.set('dim', true)
        return this
    }
    /**
    * 输出日志文本反转颜色
    * 
    * @returns 
    */
    get inverse(): Logger {
        const isBrowser = checkIsBrowser();
        !isBrowser && isEnable(this) && this.printMap.set('inverse', true)
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
        isEnable(this) && this.print('log', LogLevel.Silent, args,)
        return this
    }

    /**
     * debug日志
     * 
     * @param args debug日志参数
     * @returns {Logger}
     */
    debug(...args: any[]): Logger {
        isEnable(this) && this.print('log', LogLevel.Debug, args,)
        return this
    }

    /**
     * info日志
     * 
     * @param args info日志参数
     * @returns {Logger}
     */
    info(...args: any[]): Logger {
        isEnable(this) && this.print('log', LogLevel.Info, args,)
        return this
    }

    /**
     * warn日志
     * 
     * @param args warn日志参数
     * @returns {Logger}
     */
    warn(...args: any[]): Logger {
        isEnable(this) && this.print('log', LogLevel.Warn, args,)
        return this
    }

    /**
     * error日志
     * 
     * @param args error日志参数
     * @returns {Logger}
     */
    error(...args: any[]): Logger {
        isEnable(this) && this.print('log', LogLevel.Error, args,)
        return this
    }

    /**
     * 开始计时日志
     * 
     * @returns {Logger}
     */
    time(): Logger {
        isEnable(this) && this.print('time', LogLevel.Silent,)
        return this
    }

    /**
     * 结束计时日志
     *
     * @returns {Logger}
     */
    timeEnd(): Logger {
        isEnable(this) && this.print('timeEnd', LogLevel.Silent,)
        return this
    }

    /**
     * 性能日志
     * 
     * @returns {Logger}
     */
    performance(taskFn: Function): any | void {
        const isBrowser = checkIsBrowser();
        if (isBrowser && isEnable(this)) {
            return this.print('performance', LogLevel.Silent, [taskFn])
        }
    }

    /**
     *  图片日志
     *
     * @param {string} url - 图片地址
     * @param {number} scale - 图片缩放比例 0-1
     * @returns {void}
     */
    image(url: string, scale: number = 0.1): Logger {
        const isBrowser = checkIsBrowser();
        isBrowser && isEnable(this) && this.print('image', LogLevel.Silent, [{ url, scale }])
        return this
    }

    /**
     * 表格日志
     *
     * @param {Object | Array<any>} obj - 需要打印的对象或数组
     * @returns {void}
     */
    table(obj: Object | Array<any>): Logger {
        isEnable(this) && this.print('table', LogLevel.Silent, [obj])
        return this
    }

    /**
     * 设置日志配置
     * @param config
     * @returns
     */
    setConfig(config?: ILoggerConfig): void {
        this.config = { ...(this.config || {}), ...(config || this.defaultConfig || {} as ILoggerConfig) }
        // 兼容旧版本持久化配置中缺失的 maxLogCount 字段
        this.config.maxLogCount = this.config.maxLogCount ?? this.defaultConfig?.maxLogCount
        if (this.config.isPersistentConfig) {
            this.configStore?.setItem(this.namespace || defaultNamespace, this.config)
        } else {
            this.configStore?.removeItem(this.namespace || defaultNamespace)
        }
        if (!this.config.isRecordLog) {
            this.logStore?.clear()
        }
    }

    /**
     * 销毁日志实例
     * 从顶层全局对象的日志实例表中移除当前实例并释放存储引用，
     * 避免 iframe / 微前端等场景下实例被顶层 window 持有导致无法回收
     *
     * @param {boolean} [isClearData=false] - 是否同时清空已记录的日志数据与持久化配置
     * @returns {void}
     */
    destroy(isClearData: boolean = false): void {
        const hasLogs = this.topGlobalThis?.__EASY_LOG_PLUS__?.hasLogs
        hasLogs?.delete(this.namespace || defaultNamespace)
        if (isClearData) {
            this.logStore?.clear()
            this.configStore?.removeItem(this.namespace || defaultNamespace)
        }
        this.logStore = undefined
        this.configStore = undefined
        this.printMap.clear()
        // 清理挂载在全局对象上的日志引用
        const globalLogger = (globalThis as any).logger
        if (globalLogger && (globalLogger === this || globalLogger.namespace === this.namespace)) {
            (globalThis as any).logger = undefined
        }
        // 所有日志实例销毁后移除全局快捷键监听
        if (!hasLogs || hasLogs.size === 0) {
            removeShortcutKeyEvents()
        }
    }

}