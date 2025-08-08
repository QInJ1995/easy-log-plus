
import { type ILogOptions, } from '../types';
import { checkIsBrowser, } from '../utils/common';
import Logger from './Logger';
import initBrowser from '../environment/browser/createBrowserLogger'
import initServer from '../environment/server/createServerLogger'

/**
 * 创建日志实例
 * @param {string} namespace 命名空间
 * @param {ILogOptions} options 日志选项
 * @returns {Logger} 日志实例
 */
const createLogger = (namespace?: string | null, options?: ILogOptions): Promise<Logger> | Logger => {
    const isBrowser = checkIsBrowser(); // 判断是否在浏览器环境
    return isBrowser ? initBrowser(namespace, options) : initServer(namespace, options);
};

export default createLogger;