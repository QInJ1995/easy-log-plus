import { Env, ILogOptions, LogLevel, TopCfgProxyTarget } from "../../types";
import { getTopGlobalThis, localConsoleError, localConsoleLog, localConsoleWarn } from "../../utils/common";
import { defaultLevel } from "../../utils/constant";
import downloadLog from './downloadLog'
import { clearStores } from "./store";
import proxyConfigModal from './proxyConfigModal'


export default (options?: ILogOptions) => {
    const topGlobalThis = getTopGlobalThis() // 获取顶层 window 对象
    if (!topGlobalThis.__EASY_LOG_PLUS__) {
        const topCfgProxyTarget: TopCfgProxyTarget = {
            showLog: (options?.env ?? Env.Dev) !== Env.Prod,
            level: options?.level ?? defaultLevel,
            debugLog: false,
            recordLog: false,
            persistentConfig: false,
            configModal: proxyConfigModal(),
            execExportLog: (namespace: string) => { downloadLog(namespace) } // 导出日志
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
            // 拦截属性的设置
            set(target, property, value, receiver) {
                const allowedProperties = new Set(['showLog', 'level', 'debugLog', 'recordLog', 'isOpenConfigModal']);
                // 检查属性是否在允许列表中
                if (!allowedProperties.has(property as string)) {
                    localConsoleWarn(`[easy-log-plus]: Not allow to set unsupported property: ${String(property)}!`);
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
                    // 如果设置的是 debugLog 属性，类型检查
                    if (property === 'debugLog') {
                        if (typeof value !== 'boolean') {
                            localConsoleWarn('[easy-log-plus]: debugLog must be a boolean!');
                            return false;
                        }
                    }
                    // 如果设置的是 debugLog 属性，类型检查
                    if (property === 'recordLog') {
                        if (typeof value !== 'boolean') {
                            localConsoleWarn('[easy-log-plus]: recordLog must be a boolean!');
                            return false;
                        }
                        if (!value) {
                            clearStores(Array.from(topCfgProxyTarget?.hasLogs?.values() || []).map(item => item.logStore))
                                .then(() => localConsoleLog('[easy-log-plus]: all logs cleared!'))
                                .catch(err => localConsoleError('[easy-log-plus]: clear all logs failed!', err));
                        }
                    }
                    return Reflect.set(target, property, value, receiver);
                }

            }
        });
        return proxyTopCfg
    } else {
        return topGlobalThis.__EASY_LOG_PLUS__
    }
}