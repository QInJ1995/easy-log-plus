import { LogLevel, LogOptions, CallStackInfo, PrintCustomStyle } from '../types/index'
import { globals, callStackIndex } from './constant'


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
 * 
 * @param {boolean} showLog 是否显示日志：true 显示日志，false 不显示日志
 * @returns {boolean} 显示日志
 */
export const isShowLog = function (showLog: boolean,): boolean {
    if (isBrowser()) {
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
        bold: printMap.get('bold'),
        italic: printMap.get('italic'),
        underline: printMap.get('underline'),
        strikethrough: printMap.get('strikethrough'),
    }
 }


/**
 * 从 Map 中删除指定 key 及其前面插入的所有键值对，并返回包含这些数据的新 Map
 *
 * @param map - 原始 Map
 * @param targetKey - 要匹配的目标 key
 * @returns {Map<K, V>} - 包含被删除数据的新 Map
 */
export function extractAndRemoveUpToKey<K, V>(map: Map<K, V>, targetKey: K): Map<K, V> {
    const deletedEntries = new Map<K, V>();
    const keys = map.keys();
    let currentKey: IteratorResult<K>;
    let found = false;

    while ((currentKey = keys.next()) && !currentKey.done) {
        const key = currentKey.value;
        const value = map.get(key)!;
        deletedEntries.set(key, value);

        if (key === targetKey) {
            found = true;
            break;
        }
    }

    // 如果找到了目标 key，才执行删除操作
    if (found) {
        for (const key of deletedEntries.keys()) {
            map.delete(key);
        }
    }

    return deletedEntries;
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

