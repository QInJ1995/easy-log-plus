import chalk from 'chalk';
import { LogLevel, LogOptions, CallStackInfo, PrintCustomStyle } from '../types/index';
import { globals, callStackIndex, envs, } from './constant';
import Logger from '../core/Logger';

/**
 * 
 * @param message 本地日志消息
 * @param color 
 */
export function localConsoleLog(message: string, color: string = '#00bfff'): void {
    globals['con' + 'sole']['log'](chalk.hex(color)(message));
}

/**
 * 本地警告日志
 * @param message 错误消息
 * @param color 错误颜色
 */
export function localConsoleWarn(message: string): void {
    globals['con' + 'sole']['warn'](message);
}

/**
 * 获取当前的日期和时间
 * 
 * 此函数以字符串形式返回当前的日期和时间，格式为YYYY-MM-DD HH:MM:SS
 * 使用本地时间来确保正确的小时数
 * 
 * @returns {string} 当前日期和时间的字符串表示
 */
export function getCurrentTimeDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 检查给定的日志级别是否应该被记录
 * @param {LogLevel} level - 要检查的日志级别
 * @param {LogOptions} options - 日志选项
 * @returns {boolean} - 如果日志级别应该被记录，则返回true，否则返回false
 */
export function shouldLog(level?: LogLevel, options?: LogOptions): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return !level || level === 'silent' ? true : levels.indexOf(level) >= levels.indexOf(options?.level || 'debug');
}

/**
 * 是否启用日志
 * @returns {boolean} - 如果启用日志，则返回true，否则返回false
 */
export function isEnable(logger: Logger): boolean {
    if (logger.env === envs.prod) {
        return logger.topWindow._EASY_LOG_PLUS_[logger.uniqueKey.description!]?.showLog;
    }
    return true
}

/**
 * 获取顶层 Window
 * @returns 
 */
export function getTopWindow() {
    let curWindow = globals
    if (isBrowser()) {
        while (curWindow && curWindow.parent && curWindow !== curWindow.parent) {
            curWindow = curWindow.parent
        }
    }
    return curWindow
}

/**
 *  检查当前环境是否为浏览器
 * 
 */
export function isBrowser(): boolean {
    return typeof window as any !== 'undefined'
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
 * 获取日志追踪信息
 * @param {string} fileName - 文件名
 * @param {string} functionName - 函数名
 * @param {string} lineNumber - 行号
 * @returns {string} - 返回日志追踪信息
 */
export function getLogTrace(fileName: string | undefined, functionName: string | undefined, lineNumber: string | undefined): string {
    if (functionName && fileName && lineNumber) {
        return `${functionName ? functionName + '()' : ''} ${fileName}${lineNumber ? ':' + lineNumber : ''}`
    } else if (!functionName && fileName && lineNumber) {
        return `${fileName}${lineNumber ? ':' + lineNumber : ''}`
    } else if (functionName && !fileName && lineNumber) {
        return `${functionName ? functionName + '()' : ''}${lineNumber ? ':' + lineNumber : ''}`
    } else {
        return ''
    }
}

/**
 * 获取当前文件名
 * @returns {string} - 返回当前文件名
 */
function theFileName(): string {
    // 获取调用栈信息中的文件名
    if (!globals.currentStack || !globals.currentStack.length) return ''
    let filePath = null
    let curCallStackIndex: number = callStackIndex
    while (!filePath && curCallStackIndex < globals.currentStack.length) {
        filePath = globals.currentStack[curCallStackIndex]?.getFileName();
        curCallStackIndex++
    }
    if (!filePath) return ''
    const filePathArray = filePath.split('/');
    const simpleFileName = filePathArray[filePathArray.length - 1];
    return simpleFileName || '';
}

/**
 * 获取当前函数名
 * @returns {string} - 返回当前函数名
 */
function theFunctionName(): string {
    if (!globals.currentStack || !globals.currentStack.length) return ''
    let functionName = null
    let curCallStackIndex: number = callStackIndex
    while (!functionName && curCallStackIndex < globals.currentStack.length) {
        functionName = globals.currentStack[curCallStackIndex]?.getFunctionName();
        curCallStackIndex++
    }
    // 获取调用栈信息中的函数名
    return functionName || '';
}

/**
 * 获取当前行号
 * @returns {string} - 返回当前行号
 */
function theLineNumber(): string {
    if (!globals.currentStack || !globals.currentStack.length) return ''
    let lineNumber
    let curCallStackIndex: number = callStackIndex
    while (!lineNumber && curCallStackIndex < globals.currentStack.length) {
        lineNumber = globals.currentStack[curCallStackIndex]?.getLineNumber();
        curCallStackIndex++
    }
    if ([undefined, null, ''].includes(lineNumber)) return ''
    // 获取调用栈信息中的行号
    return lineNumber + '';
}

/**
 * 格式化字符串
 * @param {string} template - 模板字符串
 * @param {object} replacements - 替换项
 * @returns {string} - 格式化后的字符串
 */
export function formatString(
    template: string,
    replacements: { [key: string]: any }
): string {
    return template.replace(/\$(\w+)\$/g, (_, key) => {
        return key in replacements ? replacements[key] : `$${key}$`;
    });
};

/**
 * 移除空方括号和包含占位符的方括号
 * @param {string} str - 待处理的字符串
 * @returns {string} - 处理后的字符串
 */
export function removeEmptyBrackets(str: string): string {
    // 正则表达式匹配空的方括号或包含占位符的方括号
    return str.replace(/\[\s*\]|【\s*】/g, '').replace(/\s+/g, ' ').trim();
}


/**
 * 获取自定义打印样式
 * @param {Map<string, any>} printMap - 打印样式映射表
 * @returns {PrintCustomStyle} - 打印样式对象
 */
export function getPrintCustomStyle(printMap: Map<string, any>): PrintCustomStyle {
    return {
        color: printMap.get('color'),
        bgColor: printMap.get('bgColor'),
        bold: printMap.get('bold'),
        italic: printMap.get('italic'),
        underline: printMap.get('underline'),
        overline: printMap.get('overline'),
        strikethrough: printMap.get('strikethrough'),
        dim: printMap.get('dim'),
        inverse: printMap.get('inverse'),
        reset: printMap.get('reset'),
    }
}


/**
 * 获取 chalk 实例
 * @param {PrintCustomStyle} printCustomStyle - 打印样式对象
 * @returns {Function} - chalk 实例
 */
export function getChalk(printCustomStyle: PrintCustomStyle): Function {
    return Object.entries(printCustomStyle).reduce((acc, cur) => {
        let [key, value] = cur
        const isColor = ['color', 'bgColor'].includes(key)
        const curKey = isColor ? capitalizeFirstLetter(value, false) : key
        if (value) {
            if (Reflect.has(acc, curKey)) {
                if (key === 'bgColor') {
                    return Reflect.get(acc, 'bg' + capitalizeFirstLetter(curKey))
                }
                return Reflect.get(acc, curKey)
            } else {
                if (isColor) {
                    switch (key) {
                        case 'color':
                            return acc.hex(value)
                        default:
                            return acc.bgHex(value)
                    }
                }
            }
        }
        return acc
    }, chalk.reset)
}

/**
 * 合并对象
 * @param target
 * @param source
 * @returns
 */
export function mergeObjects<T extends object, U extends object>(target: T, source: U): T & U {
    return Object.entries(source).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            (acc as any)[key] = value;
        }
        return acc;
    }, { ...target }) as T & U;
}

/**
 * 将字符串的首字母转为大写或小写
 * @param {string} str - 输入字符串
 * @param {boolean} isUpperCase - 是否转为大写，默认 true
 * @returns {string} 首字母处理后的字符串
 */
function capitalizeFirstLetter(str: string, isUpperCase: boolean = true): string {
    if (!str) return str; // 处理空字符串
    const firstChar = isUpperCase
        ? str.charAt(0).toUpperCase()
        : str.charAt(0).toLowerCase();
    return firstChar + str.slice(1);
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

