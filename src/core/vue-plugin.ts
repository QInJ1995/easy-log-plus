// vue插件

import { EasyLogVuePluginOptions, IEasyLogVuePlugin } from '../types/index'
import createLogger from './createLogger';

/**
 * 插件安装函数
 * @param {any} app Vue 应用实例
 * @param {EasyLogVuePluginOptions} options 插件配置选项
 * @returns {void}
 */
// 插件安装函数
const install = (
    app: any,
    options?: EasyLogVuePluginOptions
): void => {
    options = {
        isVue: true,
        isProvide: false,
        enabled: true,
        ...options,
    };
    if (!options?.enabled) return;
    const logger = createLogger(options?.namespace, options)
    if ('provide' in app) {
        // Vue 3 方式
        options?.isVue && (app.config.globalProperties.$logger = logger);
        options?.isProvide && (app.provide('$logger', logger));
    } else {
        // Vue 2 兼容方式
        options?.isVue && (app.prototype.$logger = logger);
    }
};

// 插件对象
const EasyLogVuePlugin: Readonly<IEasyLogVuePlugin> = {
    install
};

export default EasyLogVuePlugin;