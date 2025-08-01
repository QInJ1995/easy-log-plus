
import { type ILogOptions, } from '../types';
import { checkIsBrowser, } from '../utils/common';
import Logger from './Logger';
import initBrowser from '../environment/browser/initBrowser'
import initServer from '../environment/server/initServer'



/**
 * 创建日志实例
 * @param {string} namespace 命名空间
 * @param {ILogOptions} options 日志选项
 * @returns {Logger} 日志实例
 */
const createLogger = (namespace?: string | null, options?: ILogOptions): Logger => {
    const isBrowser = checkIsBrowser(); // 判断是否在浏览器环境
    return isBrowser ? initBrowser(namespace, options) : initServer(namespace, options);
};

export default createLogger;