
import type { ILogOptions, TopWindowCfgProxyTarget } from '../types';
import { getTopWindow, isBrowser, localConsoleLog, localConsoleWarn } from '../utils/common';
import { defaultLevel, defaultNamespace, envs, } from '../utils/constant';
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
    const topWindow = getTopWindow() // 获取顶层 window 对象
    let logger

    // 初始化配置
    if (!topWindow.__EASY_LOG_PLUS__) {
        const topWindowCfgProxyTarget: TopWindowCfgProxyTarget = {
            showLog: (options?.env ?? envs.dev) !== envs.prod,
            level: options?.level ?? defaultLevel,
            createLogs: new Map(),
        };

        // 代理顶层 window 对象的 __EASY_LOG_PLUS__ 属性
        topWindow.__EASY_LOG_PLUS__ = new Proxy(topWindowCfgProxyTarget, {
            set(target, property, value, receiver) {
                const allowedProperties = new Set(['showLog', 'level']);
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
                        if (!['debug', 'info', 'warn', 'error', 'silent'].includes(value)) {
                            localConsoleWarn('[easy-log-plus]: level must be one of debug, info, warn, error, silent!');
                            return false;
                        }
                    }
                    return Reflect.set(target, property, value, receiver);
                }

            }
        });
    }

    // 如果顶层 window 对象存在 __EASY_LOG_PLUS__ 属性，则从该属性中获取日志实例
    if (topWindow.__EASY_LOG_PLUS__.createLogs.has(namespace || defaultNamespace)) {
        logger = topWindow.__EASY_LOG_PLUS__.createLogs.get(namespace || defaultNamespace)
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
        logger = new Logger(namespace, options);
        // 将日志实例存储在全局变量中
        topWindow.__EASY_LOG_PLUS__.createLogs.set(namespace || defaultNamespace, logger);
        localConsoleLog(`EasyLogPlus${namespace ? `|[${namespace}]` : ''} logger created successfully!`)
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