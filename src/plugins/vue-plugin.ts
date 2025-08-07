// vue插件

import type { IEasyLogPlusVuePluginOptions, IEasyLogPlusVuePlugin } from '../types/index'
import createLogger from '../core/createLogger';

/**
 * 插件安装函数
 * @param {any} app Vue 应用实例
 * @param {IEasyLogPlusVuePluginOptions} options 插件配置选项
 * @returns {void}
 */
// 插件安装函数
const install = (
    app: any,
    options?: IEasyLogPlusVuePluginOptions
): void => {
    options = {
        isVue: true,
        isProvide: false,
        enabled: true,
        ...options,
    };
    if (!options?.enabled) return;
    createLogger(options?.namespace, options).then((logger) => {
        if ('provide' in app) {
            // Vue 3 方式
            options?.isVue && (app.config.globalProperties.$logger = logger);
            options?.isProvide && (app.provide('$logger', logger));
        } else {
            // Vue 2 兼容方式
            options?.isVue && (app.prototype.$logger = logger);
        }
    })
};

// 插件对象
const EasyLogPlusVuePlugin: Readonly<IEasyLogPlusVuePlugin> = {
    install
};

export default EasyLogPlusVuePlugin;