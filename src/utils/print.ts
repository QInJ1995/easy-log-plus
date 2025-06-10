import chalk from 'chalk';
import { PrintOptions } from '../types/index'
import { emojis, colors, globals, } from './constant'
import { getCurrentTimeDate, formatString, removeEmptyBrackets, getLogTrace, } from './common'

// https://www.npmjs.com/package/chalk


/**
 * 打印日志处理 避免打包被删除
 * 
 * @param {string} type 日志类型
 * @param {PrintOptions} options 打印参数
 */
export function print(
    type: string,
    options: PrintOptions
): void {
    switch (type) {
        case 'time':
            globals['con' + 'sole']['time'](formatTime(options));
            break;
        case 'timeEnd':
            globals['con' + 'sole']['timeEnd'](formatTime(options));
            break;
        default:
            globals['con' + 'sole']['log'](...formatLog(options));
            break;
    }
}

function formatTime(options: PrintOptions): string {
    const color = options.printCustomStyle.color
    return chalk.hex(color!)(options.messages[0])
}


/**
 * 格式化日志消息
 * @param {PrintOptions} options 日志参数
 * @param options.level 日志级别
 * @param options.messages 日志消息
 * @param options.namespace 命名空间
 * @param options.info 日志信息
 * @param options.logOptions 日志选项
 * @param options.color 日志颜色
 * @param options.callStackInfo 调用堆栈信息
 * @returns
 */
export function formatLog(options: PrintOptions): any[] {
    let { level, messages, namespace, label, logOptions, callStackInfo, printCustomStyle } = options;
    let color = printCustomStyle.color
    let title = formatString(logOptions.formatter!, {
        namespace: namespace || '',
        time: getCurrentTimeDate(),
        level: level !== 'silent' ? `${level!.toUpperCase()}` : '',
        tracker: getLogTrace(callStackInfo.fileName, callStackInfo.functionName, callStackInfo.lineNumber) || '',
        label: label || '',
    })
    const placeHolder = messages.map(item => typeof item === 'string' ? '%s' : '%o').join(' ')
    title = removeEmptyBrackets(title)
    logOptions.isEmoji && (title = `${emojis[level] || emojis.rocket} ${title}`)
    title = `${title} ${placeHolder}`
    color = logOptions.isColor ? color || colors[level] : '#fff'
    return [Reflect.has(chalk, color!) ? Reflect.get(chalk, color!).strikethrough(title) :
        chalk.hex(color!).strikethrough(title), ...messages]
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

