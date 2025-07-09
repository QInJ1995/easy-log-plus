import type { LevelColors, Emojis, Env, LogLevel } from '../types/index'

// chalk等级
export const chalkLevel = 3

// 调用栈索引
export const defaultCallStackIndex: number = 3

// 环境
export const envs: Readonly<{ dev: Env, prod: Env, }> = { dev: 'development', prod: 'production', }

// 默认命名空间
export const defaultNamespace = 'Easy-Log-Plus'

// 默认日志等级
export const defaultLevel: LogLevel = 'debug'

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
