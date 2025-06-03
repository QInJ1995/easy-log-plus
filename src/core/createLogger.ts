
import { LogOptions } from '../types';
import Logger from './Logger';

/**
 * 创建日志实例
 * @param {string} namespace 命名空间
 * @param {LogOptions} options 日志选项
 * @returns {Logger} 日志实例
 */
const createLogger = (namespace?: string | null | undefined, options?: LogOptions): Logger => new Logger(namespace, options);


export default createLogger;