import LocalForageService from './LocalForageService'

function registerLogStore(namespace: string) {
    // 初始化日志表
    return new LocalForageService({ storeName: `${namespace}${namespace ? '-' : ''}logs`, description: `${namespace || ''}日志表` })
}

function registerConfigStore() {
    // 初始化配置表
    return new LocalForageService({ storeName: 'config', description: '配置表' })
}

function clearStores(stores: (LocalForageService | null)[]): Promise<void[]> {
    return Promise.all(stores.filter(store => store != null).map(store => store.clear()))
}

export {
    registerLogStore,
    registerConfigStore,
    clearStores
}