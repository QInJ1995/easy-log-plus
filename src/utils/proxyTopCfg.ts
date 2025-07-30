import { Env, ILogOptions, LogLevel, TopCfgProxyTarget } from "../types";
import { openRecordFile, closeRecordFile } from "./clientRecord";
import { getTopGlobalThis, isClient, localConsoleWarn } from "./common";
import { defaultLevel } from "./constant";


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
            topCfgProxyTarget.isDebug = false
            topCfgProxyTarget.isRecord = false
        }
        // 代理顶层 window 对象的 __EASY_LOG_PLUS__ 属性 
        return new Proxy(topCfgProxyTarget, {
            set(target, property, value, receiver) {
                const allowedProperties = new Set(['showLog', 'level']);
                if (isInClient) {
                    allowedProperties.add('isDebug')
                    allowedProperties.add('isRecord')
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
                    // 如果设置的是 isDebug 属性，类型检查
                    if (property === 'isDebug') {
                        if (typeof value !== 'boolean') {
                            localConsoleWarn('[easy-log-plus]: isDebug must be a boolean!');
                            return false;
                        }
                    }
                    // 如果设置的是 isDebug 属性，类型检查
                    if (property === 'isRecord') {
                        if (typeof value !== 'boolean') {
                            localConsoleWarn('[easy-log-plus]: isRecord must be a boolean!');
                            return false;
                        }
                        value ? openRecordFile() : closeRecordFile();
                    }
                    return Reflect.set(target, property, value, receiver);
                }

            }
        });
    } else {
        return topGlobalThis.__EASY_LOG_PLUS__
    }
}