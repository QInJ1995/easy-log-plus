import LocalForageService from './LocalForageService'

function registerLogStore(namespace: string) {
    // 初始化日志表
    return new LocalForageService({ storeName: `${namespace}${namespace ? '-' : ''}logs`, description: `${namespace || ''}日志表` })
}

// 配置存储单例，避免每次创建日志实例都打开新的 IndexedDB 连接
let configStoreInstance: LocalForageService | null = null;

function registerConfigStore() {
    // 初始化配置表（单例复用）
    configStoreInstance ??= new LocalForageService({ storeName: 'config', description: '配置表' })
    return configStoreInstance
}

export {
    registerLogStore,
    registerConfigStore,
}