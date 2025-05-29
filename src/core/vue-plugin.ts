// vue插件

import { LogOptions } from '../types/index'
import createLogger from './createLogger';

// 插件安装函数
const install = (
    app: any,
    options?: LogOptions
): void => {
    const logger = createLogger('', options)
    if ('provide' in app) {
        // Vue 3 方式
        app.config.globalProperties.$logger = logger;
        app.provide('$test', logger);
    } else {
        // Vue 2 兼容方式
        app.prototype.$logger = logger;

    }
};

// 插件对象
const EasyLogVuePlugin: any = {
    install
};

export default EasyLogVuePlugin;