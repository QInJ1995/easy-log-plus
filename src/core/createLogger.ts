
import { Env, LogLevel, type ILogOptions, type TopWindowCfgProxyTarget } from '../types';
import { getTopGlobalThis, isBrowser, localConsoleWarn, printAsciiArt } from '../utils/common';
import { defaultLevel, defaultNamespace, } from '../utils/constant';
import { setGlobalLogger, } from '../utils/globals';
import Logger from './Logger';

/**
 * 创建日志实例
 * @param {string} namespace 命名空间
 * @param {ILogOptions} options 日志选项
 * @returns {Logger} 日志实例
 */
const createLogger = (namespace?: string | null, options?: ILogOptions): Logger => {
    const isInBrowser = isBrowser(); // 判断是否在浏览器环境
    const topGlobalThis = getTopGlobalThis() // 获取顶层 window 对象
    let logger

    // 初始化配置
    if (!topGlobalThis.__EASY_LOG_PLUS__) {
        const topWindowCfgProxyTarget: TopWindowCfgProxyTarget = {
            showLog: (options?.env ?? Env.Dev) !== Env.Prod,
            level: options?.level ?? defaultLevel,
            hasLogs: new Map(),
        };
        isInBrowser && (topWindowCfgProxyTarget.isDebug = false)
        // 代理顶层 window 对象的 __EASY_LOG_PLUS__ 属性
        topGlobalThis.__EASY_LOG_PLUS__ = new Proxy(topWindowCfgProxyTarget, {
            set(target, property, value, receiver) {
                const allowedProperties = new Set(['showLog', 'level']);
                isInBrowser && allowedProperties.add('isDebug')
                // 检查属性是否在允许列表中
                if (!allowedProperties.has(property as string)) {
                    localConsoleWarn(`[easy-log-plus]: Attempted to set unsupported property: ${String(property)}!`);
                    return false; // 不允许设置不支持的属性
                } else {
                    // 如果设置的是 showLog 属性，类型检查
                    if (property === 'showLog') {
                        if (typeof value !== 'boolean') {
                            localConsoleWarn('[easy-log-plus]: showLog must be a boolean!');
                            return false;
                        }
                    }
                    // 如果设置的是 level 属性，则更新日志实例的 level 属性
                    if (property === 'level') {
                        if (typeof value !== 'string') {
                            localConsoleWarn('[easy-log-plus]: level must be a string!');
                            return false;
                        }
                        if (![LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Silent].includes(value as LogLevel)) {
                            localConsoleWarn(`[easy-log-plus]: level must be one of ${LogLevel.Debug}, ${LogLevel.Info}, ${LogLevel.Warn}, ${LogLevel.Error}, ${LogLevel.Silent}!`);
                            return false;
                        }
                    }
                    // 如果设置的是 isDebug 属性，类型检查
                    if (property === 'isDebug') {
                        if (typeof value !== 'boolean') {
                            localConsoleWarn('[easy-log-plus]: isDebug must be a boolean!');
                            return false;
                        }
                    }
                    return Reflect.set(target, property, value, receiver);
                }

            }
        });
    }

    // 如果顶层 window 对象存在 __EASY_LOG_PLUS__ 属性，则从该属性中获取日志实例
    if (topGlobalThis.__EASY_LOG_PLUS__.hasLogs.has(namespace || defaultNamespace)) {
        logger = topGlobalThis.__EASY_LOG_PLUS__.hasLogs.get(namespace || defaultNamespace)
    } else {
        // 兼容浏览器环境 默认关闭浏览器不支持样式
        if (options?.style) {
            options.style = {
                ...options.style,
                overline: isInBrowser ? false : options.style.overline,
                dim: isInBrowser ? false : options.style.dim,
                inverse: isInBrowser ? false : options.style.inverse
            }
        }
        // 创建日志实例
        logger = new Logger(namespace, options, topGlobalThis);
        // 将日志实例存储在全局变量中
        topGlobalThis.__EASY_LOG_PLUS__.hasLogs.set(namespace || defaultNamespace, logger);
        // 打印 ascii 艺术字
        (options?.env ?? Env.Dev) !== Env.Prod && printAsciiArt(namespace || '')
    }

    // 代理处理 在node和浏览器环境时需要隐藏方法
    const proxyLogger: Logger = new Proxy(logger, {
        get(target, prop, receiver) {
            // 如果在浏览器环境中，且目标属性是方法，则返回 undefined 来“隐藏”方法
            if (isInBrowser) {
                if (['overline', 'dim', 'inverse'].includes(prop as string)) {
                    localConsoleWarn(`[easy-log-plus]: \`${prop as string}\` is not supported in current environment!`);
                };
            } else {
                if (['image',].includes(prop as string)) {
                    localConsoleWarn(`[easy-log-plus]: \`${prop as string}\` is not supported in current environment!`);
                }
            }
            return Reflect.get(target, prop, receiver);
        }
    });

    // 挂载到全局对象上
    options?.isGlobal && setGlobalLogger(proxyLogger);

    return proxyLogger
};

export default createLogger;