import { Colors, Emojis, Env } from '../types/index'
import { getGlobal } from './globals'

// 全局对象
export const globals: any = getGlobal()

// chalk等级
export const chalkLevel = 3

// 调用栈索引
export let callStackIndex: number = 3

// 环境
export const envs: Readonly<{ dev: Env, prod: Env, }> = { dev: 'development', prod: 'production', }

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
export const colors: Colors = {
    debug: '#87CEFA',
    info: '#90EE90',
    warn: '#FF7F00',
    error: '#ff0000',
    silent: '#A7B0C4',
};

// 替换字符
export const replaceCharacters: string[] = ['[]', '【】']

/**
 *  设置日志颜色
 * @param newColors 
 */
export function setColors(newColors: Colors): void {
    Object.assign(colors, newColors);
}

/**
 * 设置调用栈索引
 * @param depth 
 */
export function setCallStackIndex(depth: number): void {
    callStackIndex = callStackIndex + depth || 0
}
