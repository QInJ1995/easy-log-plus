import { Env, ILogOptions, LogLevel, TopCfgProxyTarget } from "../types";
import { getTopGlobalThis, isClient, localConsoleWarn } from "./common";
import { defaultLevel } from "./constant";
import { initLogStore, logStore } from '../record/client/initStore';
import { registerDownloadLogEvent, removeDownloadLogEvent } from "../record/client/keyboardEvents";


export default (options?: ILogOptions) => {
    const topGlobalThis = getTopGlobalThis() // 获取顶层 window 对象
    const isInClient = isClient(); // 判断是否在浏览器环境
    if (!topGlobalThis.__EASY_LOG_PLUS__) {
        const topCfgProxyTarget: TopCfgProxyTarget = {
            showLog: (options?.env ?? Env.Dev) !== Env.Prod,
            level: options?.level ?? defaultLevel,
            hasLogs: new Map(),
        };
        if (isInClient) {
            topCfgProxyTarget.debugLog = false
            topCfgProxyTarget.recordLog = false
        }
        // 代理顶层 window 对象的 __EASY_LOG_PLUS__ 属性 
        return new Proxy(topCfgProxyTarget, {
            set(target, property, value, receiver) {
                const allowedProperties = new Set(['showLog', 'level']);
                if (isInClient) {
                    allowedProperties.add('debugLog')
                    allowedProperties.add('recordLog')
                }
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
                        if (value) {
                            initLogStore(); // 初始化日志存储
                            registerDownloadLogEvent(); // 注册下载日志事件
                        } else {
                            logStore && logStore.clear(); // 清空日志存储
                            removeDownloadLogEvent(); // 移除下载日志事件
                        }
                    }
                    return Reflect.set(target, property, value, receiver);
                }

            }
        });
    } else {
        return topGlobalThis.__EASY_LOG_PLUS__
    }
}