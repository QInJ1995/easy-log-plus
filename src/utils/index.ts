import { LogLevel, LogOptions } from '../types/index'

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


export function formatMessage(level: LogLevel, message: any[], options: LogOptions): string {
    const timestamp = options.timestamp ? `[${getCurrentTimeDate()}]` : '';
    const prefix = options.prefix ? `[${options.prefix}]` : '';
    const levelStr = `[${level.toUpperCase()}]`;
    message = message.map(item => {
        if (typeof item === 'object') {
            return JSON.stringify(item);
        }
        return item;
    });
    return `${timestamp}${prefix}${levelStr} ==> ${message.join(' ')}`;
}
