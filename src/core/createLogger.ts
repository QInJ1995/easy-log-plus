
import { LogOptions } from '../types';
import { isBrowser } from '../utils/common';
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