import { getTopGlobalThis } from '../../utils/common'
import LocalForageService from './LocalForageService'


let proxyLogStore: LocalForageService | null = null
let configStore: LocalForageService | null = null


function initLogStore() {
    if (proxyLogStore) return
    // 初始化日志表
    const logStore = new LocalForageService({ storeName: 'logs', description: '日志表' })
    // 代理日志表
    proxyLogStore = new Proxy(logStore, {
        get(target, propKey,) {
            if (['setItem', 'getItem', 'removeItem', 'clear', 'keys', 'length', 'iterate'].includes(propKey as string)) {
                const topGlobalThis = getTopGlobalThis();
                // 返回一个“包装函数”，在其中判断是否允许执行原方法
                return (...args: any[]) => {
                    if (topGlobalThis?.__EASY_LOG_PLUS__?.recordLog) {
                        // 允许执行：调用原始方法并返回结果
                        return (target as any)[propKey](...args);
                    } else {
                        return null;
                    }
                }
            }
        }
    })
    getTopGlobalThis().logStore = proxyLogStore
}

function initConfigStore() {
    if (configStore) return
    // 初始化配置表
    configStore = new LocalForageService({ storeName: 'config', description: '配置表' })
}


function clearStore() {
    proxyLogStore = null
    configStore = null
}

export {
    initLogStore,
    initConfigStore,
    clearStore,
    proxyLogStore as logStore,
    configStore
}