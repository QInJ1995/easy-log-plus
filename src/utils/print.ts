import { PrintOptions } from '../types/index'
import { emojis, colors, globals, } from './constant'
import { getCurrentTimeDate, formatString, removeEmptyBrackets, getLogTrace, getChalk } from './common'



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

/**
 * 格式化输出时间
 * @param options
 * @returns string
 */
function formatTime(options: PrintOptions): string {
    const { level, namespace, label, logOptions, printCustomStyle, } = options;
    let color = options.printCustomStyle.color
    let title = formatString('[$namespace$] [$label$]', {
        namespace: namespace || '',
        label: label || '',
    })
    title = removeEmptyBrackets(title)
    logOptions.isEmoji && (title = `${emojis.new} ${title} ${emojis.clock}`)
    title = `${title} -> `
    color = logOptions.isColor ? color || colors[level!] : '#fff'
    printCustomStyle.color = color
    return getChalk(printCustomStyle)(title)
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
    logOptions.isEmoji && (title = `${emojis.new} ${title} ${emojis[level!] || emojis.rocket}`)
    title = `${title} -> ${placeHolder}`
    color = logOptions.isColor ? color || colors[level!] : '#fff'
    printCustomStyle.color = color
    return [getChalk(printCustomStyle)(title), ...messages]
}

