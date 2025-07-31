
import { Env, type ILogOptions, type TopCfgProxyTarget } from '../types';
import { getTopGlobalThis, isClient, printAsciiArt } from '../utils/common';
import { defaultNamespace, } from '../utils/constant';
import { setGlobalLogger, } from '../utils/globals';
import Logger from './Logger';
import getProxyLogger from '../utils/proxyLogger'
import getProxyTopCfg from '../utils/proxyTopCfg';

/**
 * 创建日志实例
 * @param {string} namespace 命名空间
 * @param {ILogOptions} options 日志选项
 * @returns {Logger} 日志实例
 */
const createLogger = (namespace?: string | null, options?: ILogOptions): Logger => {
    const isInClient = isClient(); // 判断是否在浏览器环境
    const topGlobalThis = getTopGlobalThis() // 获取顶层 window 对象
    let logger: Logger
    // 创建配置代理对象
    if (!topGlobalThis.__EASY_LOG_PLUS__) {
        // 创建代理对象
        const proxyTopCfg: TopCfgProxyTarget = getProxyTopCfg(options)
        topGlobalThis.__EASY_LOG_PLUS__ = proxyTopCfg
    }
    // 如果顶层 window 对象存在 __EASY_LOG_PLUS__ 属性，则从该属性中获取日志实例
    if (topGlobalThis?.__EASY_LOG_PLUS__ && topGlobalThis.__EASY_LOG_PLUS__.hasLogs.has(namespace || defaultNamespace)) {
        logger = topGlobalThis.__EASY_LOG_PLUS__.hasLogs.get(namespace || defaultNamespace)
    } else {
        // 兼容浏览器环境 默认关闭浏览器不支持样式
        if (options?.style) {
            options.style = {
                ...options.style,
                overline: isInClient ? false : options.style.overline,
                dim: isInClient ? false : options.style.dim,
                inverse: isInClient ? false : options.style.inverse
            }
        }
        // 创建日志实例
        logger = new Logger(namespace, options, topGlobalThis);
        // 将日志实例存储在全局变量中
        topGlobalThis.__EASY_LOG_PLUS__.hasLogs.set(namespace || defaultNamespace, logger);
        // 打印 ascii 艺术字
        (options?.env ?? Env.Dev) !== Env.Prod && printAsciiArt(namespace || '')
    }

    // 创建代理日志实例
    const proxyLogger: Logger = getProxyLogger(logger)

    // 挂载到全局对象上
    options?.isGlobal && setGlobalLogger(proxyLogger);

    return proxyLogger
};

export default createLogger;