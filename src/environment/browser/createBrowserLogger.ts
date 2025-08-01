import { Env, type ILogOptions, type TopCfgProxyTarget } from '../../types';
import { getTopGlobalThis, printAsciiArt } from '../../utils/common';
import { defaultNamespace, } from '../../utils/constant';
import { setGlobalLogger, } from '../../utils/globals';
import Logger from '../../core/Logger';
import getProxyLogger from './proxyLogger'
import getProxyTopCfg from './proxyTopCfg';
export default function (namespace?: string | null, options?: ILogOptions): Logger {
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
                overline: false, // 禁用上划线
                dim: false, // 禁用 dim
                inverse: false, // 禁用 反转
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
}