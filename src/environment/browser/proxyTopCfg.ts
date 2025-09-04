import { TopCfgProxyTarget } from "../../types";
import { getTopGlobalThis, localConsoleWarn } from "../../utils/common";

export default () => {
    const topGlobalThis = getTopGlobalThis() // 获取顶层 window 对象
    if (!topGlobalThis.__EASY_LOG_PLUS__) {
        const topCfgProxyTarget: TopCfgProxyTarget = {

        };
        // 定义一个不可枚举、不可写、不可配置的属性 hasLogs
        Object.defineProperty(topCfgProxyTarget, 'hasLogs', {
            value: new Map(),
            enumerable: false, // 不可枚举
            writable: false, // 不可写
            configurable: false // 不可配置
        });

        // 代理顶层 window 对象的 __EASY_LOG_PLUS__ 属性 
        const proxyTopCfg = new Proxy(topCfgProxyTarget, {
            // 拦截属性的删除
            deleteProperty(_target, property) {
                localConsoleWarn(`[easy-log-plus]: Not allow to delete property: ${String(property)}!`);
                return false; // 不允许删除属性
            },
            // 拦截属性的获取
            get(target, property, receiver) {
                return Reflect.get(target, property, receiver);;
            },
            // 拦截属性的设置
            set(target, property, value, receiver) {
                const allowedProperties = new Set<string>([]);
                // 检查属性是否在允许列表中
                if (!allowedProperties.has(property as string)) {
                    localConsoleWarn(`[easy-log-plus]: Not allow to set unsupported property: ${String(property)}!`);
                    return false; // 不允许设置不支持的属性
                } else {
                    return Reflect.set(target, property, value, receiver);
                }

            }
        });
        return proxyTopCfg
    } else {
        return topGlobalThis.__EASY_LOG_PLUS__
    }
}