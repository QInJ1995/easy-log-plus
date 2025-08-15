import { LevelColors, Emojis, LogLevel } from '../types/index'

// chalk等级
export const chalkLevel = 3

// 调用栈索引
export const defaultCallStackIndex: number = 3

// 默认命名空间
export const defaultNamespace = 'Easy-Log-Plus'

// 默认日志等级
export const defaultLevel: LogLevel = LogLevel.Debug

// Emoji
export const emojis: Emojis = {
    debug: '🐞',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    rocket: '🚀',
    success: '✅',
    clock: '⏱️',
    new: '✨',
    image: '🖼️',
    down: '⬇️',
    performance: '⚡️',
};

// 日志level颜色
export const defaultLevelColors: LevelColors = {
    debug: '#87CEFA',
    info: '#90EE90',
    warn: '#FF7F00',
    error: '#ff0000',
    silent: '#A7B0C4',
};

// 替换字符
export const replaceCharacters: string[] = ['[]', '【】']


export const languageCfg = {
    'zh-CN': {
        language: '语言',
        logInstance: '日志实例',
        enableLog: '启用日志',
        level: '日志级别',
        debugLog: '调试日志',
        recordLog: '记录日志',
        downloadLog: '下载日志',
        clearLog: '清除日志',
        persistentConfig: '持久化配置',
        clearCache: '清除缓存',
        restConfig: '恢复默认配置',
        close: '关闭',
        all: '全部',
        modifyConfig: '修改配置',
        config: '配置',
    },
    'en-US': {
        language: 'Language',
        logInstance: 'Log Instance',
        enableLog: 'Enable Log',
        level: 'Log Level',
        debugLog: 'Debug Log',
        recordLog: 'Record Log',
        downloadLog: 'Download Log',
        clearLog: 'Clear Log',
        persistentConfig: 'Persistent Config',
        clearCache: 'Clear Cache',
        restConfig: 'Rest Config',
        close: 'Close',
        all: 'All',
        modifyConfig: 'Modify Config',
        config: 'Config',
    },
}
