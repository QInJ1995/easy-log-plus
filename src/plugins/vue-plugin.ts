// vue插件

import type { IEasyLogPlusVuePluginOptions, IEasyLogPlusVuePlugin } from '../types/index'
import createLogger from '../core/createLogger';
import Logger from '../core/Logger';

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
    // 同步注入占位代理：应用挂载（mount）先于异步的 logger 初始化完成，
    // 首屏渲染访问 $logger 时调用会被暂存，logger 就绪后透传并回放
    let readyLogger: Logger | null = null;
    const pendingCalls: { prop: string; args: any[] }[] = [];
    const $logger: any = new Proxy({} as any, {
        get(_target, prop) {
            if (readyLogger) return Reflect.get(readyLogger, prop);
            // logger 就绪前暂存调用（$logger 仅以方法调用方式使用）
            return (...args: any[]) => { pendingCalls.push({ prop: String(prop), args }); };
        }
    });
    // 注入必须同步完成（app.mount 之前），provide 在挂载后调用将无法被组件 inject
    if ('provide' in app) {
        // Vue 3 方式
        options?.isVue && (app.config.globalProperties.$logger = $logger);
        options?.isProvide && (app.provide('$logger', $logger));
    } else {
        // Vue 2 兼容方式
        options?.isVue && (app.prototype.$logger = $logger);
    }
    // createLogger 在浏览器环境返回 Promise，在 Node/SSR 环境同步返回 Logger，
    // 统一用 Promise.resolve 包装，避免 SSR 下对非 Promise 调用 .then 崩溃
    Promise.resolve(createLogger(options?.namespace, options) as Promise<Logger> | Logger).then((logger: Logger) => {
        readyLogger = logger;
        // 回放就绪前暂存的调用
        for (const { prop, args } of pendingCalls.splice(0)) {
            const fn = (readyLogger as any)[prop];
            typeof fn === 'function' && fn.apply(readyLogger, args);
        }
    });
};

// 插件对象
const EasyLogPlusVuePlugin: Readonly<IEasyLogPlusVuePlugin> = {
    install
};

export default EasyLogPlusVuePlugin;