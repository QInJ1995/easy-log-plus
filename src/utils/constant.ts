import { Colors, Emojis, } from '../types/index'

// 全局对象
export const globals: any = getGlobalContext()

// chalk等级
export const chalkLevel = 3

// 调用栈索引
export let callStackIndex: number = 5

// 环境
export const envs: Readonly<{ dev: string, prod: string, test: string }> = { dev: 'development', prod: 'production', test: 'test' }

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
    down:  '⬇️',
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

/**
 * 获取全局上下文
 * @returns {Globals} 全局上下文
 */
function getGlobalContext(): any {
    if (typeof window as any !== 'undefined') {
        return window;
    } else if (typeof global as any !== 'undefined') {
        return global;
    } else {
        throw new Error('无法识别的运行环境');
    }
}

