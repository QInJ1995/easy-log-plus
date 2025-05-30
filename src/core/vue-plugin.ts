// vue插件

import { EasyLogVuePluginOptions, } from '../types/index'
import { globals } from '../utils/index';
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
        isWindow: false,
        enabled: true,
        ...options,
    };
    if (!options?.enabled) return; // 防止重复安装
    const logger = createLogger(options?.namespace, options)
    options?.isWindow && globals === typeof window && (globals.logger = logger);
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
const EasyLogVuePlugin: any = {
    install
};

export default EasyLogVuePlugin;