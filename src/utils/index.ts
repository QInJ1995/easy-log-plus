import { LogLevel, LogOptions, Colors } from '../types/index'

const globals: any = typeof window !== 'undefined' ? window : global;

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
    return levels.indexOf(level) >= levels.indexOf(options.level || 'info');
}


export function formatMessage(level: LogLevel, message: any[], options: LogOptions, colors: Colors): any[] {
    const fileName = options.isFileName ? theFileName() : ''
    const functionName = options.isFunctionName ? theFunctionName() : ''
    const lineNumber = options.isLineNumber ? theLineNumber() : ''
    const logTraceBar = options.isFileName || options.isFunctionName || options.isLineNumber ? ' |' : ''
    const logTrace = `${logTraceBar}${functionName}${fileName}${lineNumber}`
    const useArrow = message.length === 0 ? '' : '->'
    const timestamp = options.isTime ? `[${getCurrentTimeDate()}]` : '';
    const prefix = options.prefix ? `[${options.prefix}]` : '';
    const levelStr = options.isLevel ? `[${level.toUpperCase()}]` : '';
    const title = `${timestamp}${prefix}${levelStr}${logTrace} ${useArrow} `
    const color = options.isColor ? colors[level] : '#fff'
    // const background = options.isColor ? colors[level] : 'transparent'
    // const labelStyle = `background:${background};border:1px solid ${background}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`
    const stringStyle = `padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`
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
 * 获取当前文件名
 * @returns {string} - 返回当前文件名
 */
function theFileName(): string {
    // 获取调用栈信息中的文件名
    const filePath = globals.currentStack[2].getFileName();
    const filePathArray = filePath.split('/');
    const simpleFileName = filePathArray[filePathArray.length - 1];
    return ' ' + simpleFileName;
}

/**
 * 获取当前函数名
 * @returns {string} - 返回当前函数名
 */
function theFunctionName(): string {
    // 获取调用栈信息中的函数名
    return globals.currentStack[2].getFunctionName() ? ' ' + globals.currentStack[2].getFunctionName() + '()' : ' Top Level';
}

/**
 * 获取当前行号
 * @returns {string} - 返回当前行号
 */
function theLineNumber(): string {
    // 获取调用栈信息中的行号
    return ':' + globals.currentStack[2].getLineNumber();
}


// 定义全局变量 currentStack 以获取当前调用栈信息
// 确定全局对象

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

// Object.defineProperty(globals, 'currentStack', {
//     get: function () {
//         var orig = Error.prepareStackTrace;
//         Error.prepareStackTrace = function (_, stack) {
//             return stack;
//         };
//         var err = new Error;
//         Error.captureStackTrace(err, arguments.callee);
//         var stack = err.stack;
//         Error.prepareStackTrace = orig;
//         return stack;
//     }
// });
