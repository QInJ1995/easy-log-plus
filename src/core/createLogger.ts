
import { LogLevel, LogOptions, TopWindowCfgProxyTarget } from '../types';
import { isBrowser, localConsoleLog, localConsoleWarn } from '../utils/common';
import { envs, } from '../utils/constant';
import { setGlobalLogger, } from '../utils/globals';
import Logger from './Logger';

/**
 * 创建日志实例
 * @param {string} namespace 命名空间
 * @param {LogOptions} options 日志选项
 * @returns {Logger} 日志实例
 */
const createLogger = (namespace?: string | null, options?: LogOptions): Logger => {
    const isInBrowser = isBrowser();
    // 兼容浏览器环境 默认关闭浏览器不支持样式
    if (options?.style) {
        options.style = {
            ...options.style,
            overline: isInBrowser ? false : options.style.overline,
            dim: isInBrowser ? false : options.style.dim,
            inverse: isInBrowser ? false : options.style.inverse
        }
    }
    const instance = new Logger(namespace, options);

    if (instance) {
        localConsoleLog(`EasyLogPlus${namespace ? ` - [${namespace}]` : ''} logger created successfully!`)
        // 生产环境下挂载 EasyLogPlus 到顶层 window 对象
        if (instance.env === envs.prod) {
            // 如果是生产环境，挂载到顶层 window 对象
            const topWindow = instance.topWindow

            const topWindowCfgProxyTarget: TopWindowCfgProxyTarget = {
                showLog: false,
                level: 'error',
            };
            // 如果 _EASY_LOG_PLUS_ 属性不存在，则创建一个空对象
            topWindow._EASY_LOG_PLUS_ = topWindow._EASY_LOG_PLUS_ || {};

            // 代理顶层 window._EASY_LOG_PLUS_[instance.uniqueKey.description!] 对象
            topWindow._EASY_LOG_PLUS_[instance.uniqueKey.description!] = new Proxy(topWindowCfgProxyTarget, {
                set(target, property, value, receiver) {
                    const allowedProperties = new Set(['showLog', 'level']);
                    // 检查属性是否在允许列表中
                    if (!allowedProperties.has(property as string)) {
                        localConsoleWarn(`[easy-log-plus]: Attempted to set unsupported property: ${String(property)}`);
                        return false; // 不允许设置不支持的属性
                    } else {
                        // 如果设置的是 showLog 属性，类型检查
                        if (property === 'showLog') {
                            if (typeof value !== 'boolean') {
                                localConsoleWarn('[easy-log-plus]: showLog must be a boolean');
                                return false;
                            }
                        }
                        // 如果设置的是 level 属性，则更新日志实例的 level 属性
                        if (property === 'level') {
                            if (typeof value !== 'string') {
                                localConsoleWarn('[easy-log-plus]: level must be a string');
                                return false;
                            }
                            if (!['debug', 'info', 'warn', 'error', 'silent'].includes(value)) {
                                localConsoleWarn('[easy-log-plus]: level must be one of debug, info, warn, error, silent');
                                return false;
                            }
                            instance.setOptions({
                                level: value as LogLevel,
                            })
                        }
                        return Reflect.set(target, property, value, receiver);
                    }

                }
            });
        }
    }

    // 挂载到全局对象上
    options?.isGlobal && setGlobalLogger(instance);

    // 代理处理 在node和浏览器环境时需要隐藏方法
    return new Proxy(instance, {
        get(target, prop, receiver) {
            // 如果在浏览器环境中，且目标属性是方法，则返回 undefined 来“隐藏”方法
            if (isInBrowser) {
                if (['overline', 'dim', 'inverse'].includes(prop as string)) {
                    throw new Error(`[easy-log-plus] \`${prop as string}\` is not supported in current environment`);
                };
            } else {
                if (['image',].includes(prop as string)) {
                    throw new Error(`[easy-log-plus] \`${prop as string}\` is not supported in current environment`);
                }
            }
            return Reflect.get(target, prop, receiver);
        }
    });
};

export default createLogger;