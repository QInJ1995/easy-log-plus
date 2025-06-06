import chalk from 'chalk';
import { LogLevel, LogOptions, CallStackInfo } from '../types/index'
import { emojis, colors, globals, } from './constant'
import { getCurrentTimeDate, formatString, removeEmptyBrackets, getLogTrace } from './common'

// https://www.npmjs.com/package/chalk


/**
 * 打印日志处理 避免打包被删除
 * @param {LogLevel} level 日志级别
 * @param {any[]} message 日志内容
 * @param {string} namespace 命名空间
 * @param {string} info 日志前缀
 * @param {CallStackInfo} callStackInfo 调用栈信息
 * @param {LogOptions} options 日志配置
 * @param {string} color 日志颜色 
 * @returns {void}
 */
export function print(
    type: string,
    message: any[] | string,
    color: string | undefined,
    level?: LogLevel,
    namespace?: string,
    info?: string,
    options?: LogOptions,
    callStackInfo?: CallStackInfo
): void {
    switch (type) {
        case 'time':
            globals['con' + 'sole']['time'](formatTime(message as string, color));
            break;
        case 'timeEnd':
            globals['con' + 'sole']['timeEnd'](formatTime(message as string, color));
            break;
        default:
            globals['con' + 'sole']['log'](...formatLog(level!, message as [], namespace!, info, options!, color, callStackInfo!));
            break;
    }
    // if (isBrowser()) {

    // } else {
    //     chalk.level = 2;
    //     const error = chalk.bold.red;
    //     const warning = chalk.hex('#FFA500'); // Orange color
    //     console.log(error('Error!'));
    //     console.log(warning('Warning!'));
    // }
}

function formatTime(message: string, color: string | undefined = colors.info): string {
    return chalk.hex(color!)(message)
}


/**
 * 格式化日志消息
 * @param {LogLevel} level 日志级别
 * @param {any[]} message 日志内容
 * @param {string} namespace 命名空间
 * @param {string} info 日志前缀
 * @param {CallStackInfo} callStackInfo 调用栈信息
 * @param {LogOptions} options 日志配置
 * @param {string} color 日志颜色 
 * @returns {any[]} 格式化后的日志消息
 */
export function formatLog(
    level: LogLevel, // 日志级别
    message: any[], // 日志消息
    namespace: string, // 命名空间
    info: string | undefined, // 前缀
    options: LogOptions, // 日志选项
    color: string | undefined, // 日志颜色
    callStackInfo: CallStackInfo // 跟踪信息
): any[] {
    let title = formatString(options.formatter!, {
        namespace: namespace || '',
        time: getCurrentTimeDate(),
        level: level !== 'silent' ? `${level.toUpperCase()}` : '',
        tracker: getLogTrace(callStackInfo.fileName, callStackInfo.functionName, callStackInfo.lineNumber) || '',
        info: info || '',
    })
    title = removeEmptyBrackets(title)
    options.isEmoji && (title = `${emojis[level] || emojis.rocket} ${title}`)
    color = options.isColor ? color || colors[level] : '#fff'
    // const name = 'Sindre';
    // console.log(chalk.green('Hello %s'), { a: 1, b: 2 });
    return [chalk.strikethrough.hex(color!)(title), ...message]
}

/**
 * 浏览器格式化日志消息
 * @param {LogLevel} level 日志级别
 * @param {any[]} message 日志内容
 * @param {string} namespace 命名空间
 * @param {string} info 日志前缀
 * @param {CallStackInfo} callStackInfo 调用栈信息
 * @param {LogOptions} options 日志配置
 * @param {string} color 日志颜色
 * @returns {any[]} 格式化后的日志消息
 */
// export function formatInBrowserLog(
//     level: LogLevel, // 日志级别
//     message: any[], // 日志消息
//     namespace: string, // 命名空间
//     info: string | undefined, // 前缀
//     options: LogOptions, // 日志选项
//     color: string | undefined, // 日志颜色
//     callStackInfo: CallStackInfo // 跟踪信息
// ): any[] {
//     let title = formatString(options.formatter!, {
//         namespace: namespace || '',
//         time: getCurrentTimeDate(),
//         level: level !== 'silent' ? `${level.toUpperCase()}` : '',
//         tracker: getLogTrace(callStackInfo.fileName, callStackInfo.functionName, callStackInfo.lineNumber) || '',
//         info: info || '',
//     })
//     title = removeEmptyBrackets(title)
//     options.isEmoji && (title = `${emojis[level] || emojis.rocket} ${title}`)
//     color = options.isColor ? color || colors[level] : '#fff'
//     const stringStyle = `padding: ${options.style?.padding || '5px'};  font-weight: ${options.style?.fontWeight || 500}; font-size: ${options.style?.fontSize || 12}px; color: ${color};`
//     message = message.map(item => typeof item === 'string' ? { label: `%c${item}`, style: stringStyle } : { label: '%o', value: item, });
//     message = [{ label: `%c${title}`, style: stringStyle }, ...message]
//     const { firstParam, params } = message.reduce((acc, cur, index) => {
//         let { firstParam, params } = acc;
//         const { label, style, value } = cur;
//         firstParam += ((firstParam && index > 1 ? ' ' : '') + label)
//         style && params.push(style)
//         value && params.push(value)
//         return { firstParam, params, }
//     }, { firstParam: '', params: [] })
//     return [firstParam, ...params]
// }

