import { LogLevel, LogOptions, Colors, Emojis, Style, Globals, CallStackInfo } from '../types/index'

// 全局对象
export const globals: Globals = getGlobalContext()
// 命名空间长度
export let namespaceLength = 0;
// 默认样式
export const defaultStyle: Style = {
    padding: '5px',
    fontWeight: 500,
    fontSize: 12,
};
// Emoji
const emojis: Emojis = {
    debug: '🐞',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    rocket: '🚀',
    success: '✅',
};

/**
 * 设置命名空间长度
 * @param {number} length 命名空间长度
 * @returns {void}
 */
export function setNamespaceLength(length: number): void {
    namespaceLength = length;
}

/**
 * 获取当前的日期和时间
 * 
 * 此函数以字符串形式返回当前的日期和时间，格式为YYYY-MM-DD HH:MM:SS
 * 使用UTC时间来确保全球范围的时间一致性
 * 
 * @returns {string} 当前日期和时间的字符串表示
 */
export function getCurrentTimeDate(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 根据命名空间生成随机颜色
 * @param {string} namespace - 命名空间字符串
 * @returns {string} - 返回16进制颜色代码（如 #FF0000）
 */
export function getColor(namespace: string = ''): string {
    // 使用 djb2 哈希算法
    let hash = 5381;
    for (let i = 0; i < namespace.length; i++) {
        hash = ((hash << 5) + hash) + namespace.charCodeAt(i);
    }

    // 生成一个随机的颜色代码并转换为16进制
    const color = Math.abs(hash) % 16777216;
    return `#${color.toString(16).padStart(6, '0')}`;
}

/**
 * 检查给定的日志级别是否应该被记录
 * @param {LogLevel} level - 要检查的日志级别
 * @param {LogOptions} options - 日志选项
 * @returns {boolean} - 如果日志级别应该被记录，则返回true，否则返回false
 */
export function shouldLog(level: LogLevel, options: LogOptions): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return level === 'silent' ? true : levels.indexOf(level) >= levels.indexOf(options.level || 'info');
}

/**
 * 格式化日志消息
 * @param {LogLevel} level 日志级别
 * @param {any[]} message 日志内容
 * @param {string} namespace 命名空间
 * @param {string} prefix 日志前缀
 * @param {CallStackInfo} callStackInfo 调用栈信息
 * @param {LogOptions} options 日志配置
 * @param {Colors} colors 日志颜色
 * @param {string} color 日志颜色 
 * @returns {any[]} 格式化后的日志消息
 */
export function formatMessage(
    level: LogLevel, // 日志级别
    message: any[], // 日志消息
    namespace: string, // 命名空间
    prefix: string, // 前缀
    options: LogOptions, // 日志选项
    color: string | undefined, // 日志颜色
    colors: Colors, // 颜色配置
    callStackInfo: CallStackInfo // 跟踪信息
): any[] {
    namespace.length > namespaceLength && setNamespaceLength(namespace.length);
    namespace = namespace.toString().padStart(namespaceLength, ' ')
    namespace = namespace.length !== 0 ? `${namespace} | ` : '';
    prefix = prefix ? `[${prefix}]` : '';;
    const timestamp = options.isTime ? `[${getCurrentTimeDate()}]` : '';
    const levelStr = options.isLevel && level !== 'silent' ? `[${level.toUpperCase()}]` : '';
    prefix = `${namespace}${timestamp}${prefix}${levelStr}`;
    const fileName = options.isFileName ? callStackInfo.fileName : ''
    const functionName = options.isFunctionName ? callStackInfo.functionName : ''
    const lineNumber = options.isLineNumber ? callStackInfo.lineNumber : ''
    const logTraceBar = options.isFileName || options.isFunctionName || options.isLineNumber ? ' |' : ''
    const logTrace = `${logTraceBar}${functionName}${fileName}${lineNumber}`
    const useArrow = message.length === 0 ? '' : ` ${options.isEmoji ? emojis[level] || emojis.rocket : ''} → `;
    const title = `${prefix}${logTrace}${useArrow}`
    color = options.isColor ? color || colors[level] || getColor(namespace) : '#fff'
    const stringStyle = `padding: ${options.style?.padding || '5px'};  font-weight: ${options.style?.fontWeight || 500}; font-size: ${options.style?.fontSize || 12}px; color: ${color};`
    message = message.map(item => typeof item === 'string' ? { label: `%c${item}`, style: stringStyle } : { label: '%o', value: item, });
    message = [{ label: `%c${title}`, style: stringStyle }, ...message]
    const { firstParam, params } = message.reduce((acc, cur, index) => {
        let { firstParam, params } = acc;
        const { label, style, value } = cur;
        firstParam += ((firstParam && index > 1 ? ' ' : '') + label)
        style && params.push(style)
        value && params.push(value)
        return { firstParam, params, }
    }, { firstParam: '', params: [] })
    return [firstParam, ...params]
}

/**
 * 打印日志处理 避免打包被删除
 * @param {LogLevel} level 日志级别
 * @param {any[]} message 日志内容
 * @param {string} namespace 命名空间
 * @param {string} prefix 日志前缀
 * @param {CallStackInfo} callStackInfo 调用栈信息
 * @param {LogOptions} options 日志配置
 * @param {Colors} colors 日志颜色
 * @param {string} color 日志颜色 
 * @returns {void}
 */
export function print(
    level: LogLevel,
    message: any[],
    namespace: string,
    prefix: string,
    options: LogOptions,
    color: string,
    colors: Colors,
    callStackInfo: CallStackInfo
): void {
    const logParams = formatMessage(level, message, namespace, prefix, options, color, colors, callStackInfo);
    globals['con' + 'sole']['log'](...logParams);
}

/**
 * 
 * @param {boolean} showLog 是否显示日志：true 显示日志，false 不显示日志
 * @returns {boolean} 显示日志
 */
export const isShowLog = function (showLog: boolean,): boolean {
    if (globals === typeof window) {
        if (!showLog) {
            let curWindow = globals
            while (!curWindow.showLog && curWindow !== curWindow.parent) {
                curWindow = curWindow.parent
            }
            return curWindow.showLog
        } else {
            return showLog
        }
    } else {
        return true
    }

}

/**
 * 获取当追踪信息
 * @returns {CallStackInfo}
 */
export function getCallStackInfo(): CallStackInfo {
    const fileName = theFileName()
    const functionName = theFunctionName()
    const lineNumber = theLineNumber()
    return {
        fileName,
        functionName,
        lineNumber,
    }
}

/**
 * 获取当前文件名
 * @returns {string} - 返回当前文件名
 */
function theFileName(): string {
    // 获取调用栈信息中的文件名
    if (!globals.currentStack || !globals.currentStack.length) return ''
    const filePath = globals.currentStack[4].getFileName();
    if (!filePath) return ''
    const filePathArray = filePath.split('/');
    const simpleFileName = filePathArray[filePathArray.length - 1];
    return ' ' + simpleFileName;
}

/**
 * 获取当前函数名
 * @returns {string} - 返回当前函数名
 */
function theFunctionName(): string {
    if (!globals.currentStack || !globals.currentStack.length) return ''
    const functionName = globals.currentStack[4].getFunctionName();
    // 获取调用栈信息中的函数名
    return functionName ? ' ' + functionName + '()' : ' Top Level';
}

/**
 * 获取当前行号
 * @returns {string} - 返回当前行号
 */
function theLineNumber(): string {
    if (!globals.currentStack || !globals.currentStack.length) return ''
    const lineNumber = globals.currentStack[4].getLineNumber()
    if ([undefined, ''].includes(lineNumber)) return ''
    // 获取调用栈信息中的行号
    return ':' + lineNumber;
}

/**
 * 获取全局上下文
 * @returns {Globals} 全局上下文
 */
export function getGlobalContext(): Globals {
    if (typeof window !== 'undefined') {
        return window;
    } else if (typeof global !== 'undefined') {
        return global;
    } else {
        throw new Error('无法识别的运行环境');
    }
}

// 定义全局变量 currentStack 以获取当前调用栈信息
Object.defineProperty(globals, 'currentStack', {
    get: function () {
        const orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };
        const err = new Error();
        // 获取当前函数引用，不使用 arguments.callee
        const currentFunction = this.get;
        Error.captureStackTrace(err, currentFunction);
        const stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

