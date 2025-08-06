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


export const zh = {
    cn: {
        showLog: '显示日志',
        level: '日志级别',
        debugLog: '调试日志',
        recordLog: '记录日志',
        downloadLog: '下载日志',
        persistentConfig: '持久化配置',
    },
    en: {
        showLog: 'Show Log',
        level: 'Log Level',
        debugLog: 'Debug Log',
        recordLog: 'Record Log',
        downloadLog: 'Download Record',
        persistentConfig: 'Persistent Config',
    },
}
