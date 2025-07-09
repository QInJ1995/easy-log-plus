import chalk from 'chalk';
import type { LogLevel, CallStackInfo, PrintCustomStyle, } from '../types/index';
import { defaultCallStackIndex, envs, } from './constant';
import Logger from '../core/Logger';

/**
 * 
 * @param message 本地日志消息
 * @param color 
 */
export function localConsoleLog(message: string, color: string = '#00bfff'): void {
    (globalThis as any)['con' + 'sole']['log'](chalk.hex(color)(message));
}

/**
 * 本地警告日志
 * @param message 错误消息
 * @param color 错误颜色
 */
export function localConsoleWarn(message: string): void {
    (globalThis as any)['con' + 'sole']['warn'](message);
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
export function shouldLog(logger: Logger, level?: LogLevel,): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    if (logger.env === envs.prod) {
        const topWindow = getTopWindow()
        logger.options.level = topWindow.__EASY_LOG_PLUS__?.level
    }
    return !level || level === 'silent' ? true : levels.indexOf(level) >= levels.indexOf(logger.options.level || 'debug');
}

/**
 * 是否启用日志
 * @returns {boolean} - 如果启用日志，则返回true，否则返回false
 */
export function isEnable(logger: Logger): boolean {
    if (logger.env === envs.prod) {
        const topWindow = getTopWindow()
        return topWindow.__EASY_LOG_PLUS__?.showLog;
    }
    return true
}

/**
 * 获取顶层 Window
 * @returns 
 */
export function getTopWindow() {
    let curWindow = globalThis as any
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
        const curKey = isColor ? capitalizeFirstLetter(value as string, false) : key
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
                            return acc.hex(value as string)
                        default:
                            return acc.bgHex(value as string)
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

/**
 * 获取调用堆栈信息
 * 
 * @param {number} depth - 堆栈深度，默认为 0
 */

export function getCallStackInfo(depth: number = 0): CallStackInfo {
    const callStackIndex = defaultCallStackIndex + depth;
    try {
        throw new Error();
    } catch (e: any) {
        // 解析调用栈信息
        const stack = e.stack.split('\n').slice(1); // 去掉第一行"Error"信息
        if (callStackIndex >= stack.length) {
            return {
                functionName: '',
                fileName: '',
                lineNumber: ''
            };
        }
        const stackLine = stack[callStackIndex]; // 获取指定深度的调用栈行
        let functionName = '';
        let fileName = '';
        let lineNumber = '';
        // 统一的正则表达式，兼容浏览器和Node.js
        // 浏览器格式: "at functionName (http://127.0.0.1:5500/test.html:15:9)"
        // Node.js格式: "at functionName (/path/to/file.js:15:9)"
        const namedFunctionMatch = stackLine.match(/at\s+([^\s(]+)\s+\((.+):(\d+):(\d+)\)/);
        if (namedFunctionMatch) {
            functionName = namedFunctionMatch[1];
            const fullPath = namedFunctionMatch[2];
            lineNumber = namedFunctionMatch[3];
            // 提取文件名
            fileName = _extractFileName(fullPath);
        } else {
            // 匹配匿名函数的情况
            // 浏览器: "at http://127.0.0.1:5500/test.html:15:9"
            // Node.js: "at /path/to/file.js:15:9"
            const anonymousFunctionMatch = stackLine.match(/at\s+(.+):(\d+):(\d+)/);
            if (anonymousFunctionMatch) {
                const fullPath = anonymousFunctionMatch[1];
                lineNumber = anonymousFunctionMatch[2];
                fileName = _extractFileName(fullPath);
                functionName = '';
            }
        }
        return {
            functionName,
            fileName,
            lineNumber
        };
    }
}

/**
    * 提取文件名，兼容浏览器URL和Node.js文件路径
    * @param {string} fullPath - 完整路径
    * @returns {string} 文件名
    */
function _extractFileName(fullPath: string): string {
    if (!fullPath || fullPath === '') {
        return '';
    }

    try {
        // 处理浏览器URL格式 (http://127.0.0.1:5500/test.html)
        if (fullPath.startsWith('http://') || fullPath.startsWith('https://') || fullPath.startsWith('file://')) {
            const url = new URL(fullPath);
            const pathname = url.pathname;
            return pathname.split('/').pop() || '';
        }

        // 处理Node.js文件路径
        // 检查是否在Node.js环境
        if (typeof require !== 'undefined') {
            try {
                const path = require('path');
                return path.basename(fullPath);
            } catch (error) {
                return '';
            }
        }

        // 通用处理方法（适用于各种路径格式）
        // 处理Windows路径 (C:\path\to\file.js) 和 Unix路径 (/path/to/file.js)
        const fileName = fullPath.split(/[\/\\]/).pop();
        return fileName || '';

    } catch (error) {
        console.warn('提取文件名失败:', error);
        // 降级处理：简单的字符串分割
        return fullPath.split(/[\/\\]/).pop() || '';
    }
}

