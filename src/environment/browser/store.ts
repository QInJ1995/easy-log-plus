import { getTopGlobalThis } from '../../utils/common'
import LocalForageService from './LocalForageService'

function registerLogStore(namespace: string) {
    // 初始化日志表
    const logStore = new LocalForageService({ storeName: `${namespace}${namespace ? '-' : ''}logs`, description: `${namespace || ''}日志表` })
    // 代理日志表
    return new Proxy(logStore, {
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
}

function registerConfigStore(namespace: string) {
    // 初始化配置表
    return new LocalForageService({ storeName: `${namespace}${namespace ? '-' : ''}config`, description: `${namespace || ''}配置表` })
}

function clearStores(stores: (LocalForageService | null)[]): Promise<void[]> {
    return Promise.all(stores.filter(store => store != null).map(store => store.clear()))
}

export {
    registerLogStore,
    registerConfigStore,
    clearStores
}