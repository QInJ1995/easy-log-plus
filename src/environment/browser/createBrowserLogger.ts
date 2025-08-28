import { Env, type ILogOptions, type TopCfgProxyTarget } from '../../types';
import { getTopGlobalThis, printAsciiArt } from '../../utils/common';
import { defaultLevel, defaultNamespace, } from '../../utils/constant';
import { setGlobalLogger, } from '../../utils/globals';
import Logger from '../../core/Logger';
import getProxyLogger from './proxyLogger'
import getProxyTopCfg from './proxyTopCfg';
import { registerShortcutKeyEvents } from './shortcutKeyEvents';
import { registerConfigStore } from './store';
export default async function (namespace?: string | null, options?: ILogOptions): Promise<Logger> {
    const topGlobalThis = getTopGlobalThis() // 获取顶层 window 对象
    let logger: Logger
    // 创建配置代理对象
    if (!topGlobalThis.__EASY_LOG_PLUS__) {
        // 创建代理对象
        const proxyTopCfg: TopCfgProxyTarget = getProxyTopCfg()
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
    // 注册快捷键事件
    registerShortcutKeyEvents()

    // 创建代理日志实例
    const proxyLogger: Logger = getProxyLogger(logger)


    // 挂载到全局对象上
    options?.isGlobal && setGlobalLogger(proxyLogger);


    // 创建配置存储对象
    const configStore = registerConfigStore()
    // 获取缓存配置
    const config = await configStore.getItem(namespace || defaultNamespace);

    // 默认配置
    proxyLogger.defaultConfig = {
        isEnableLog: options?.isEnable ?? (options?.env ?? Env.Dev) !== Env.Prod, // 生产环境禁用日志
        level: options?.level || defaultLevel, // 默认日志级别
        isRecordLog: options?.isRecord ?? false, // 是否记录日志
        isPersistentConfig: options?.isPersistentConfig ?? false, // 是否持久化配置
        isSourceCodeLocation: options?.isSourceCodeLocation ?? false, // 是否显示源代码位置
        isDebugLog: false, // 是否调试日志
    }
    // 设置缓存配置
    proxyLogger.setConfig(config)

    return proxyLogger
}