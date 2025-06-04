import { Colors, Emojis, Style, } from '../types/index'

// 全局对象
export const globals: any = getGlobalContext()

// 调用栈索引
export const callStackIndex: number = 4

// Emoji
export const emojis: Emojis = {
    debug: '🐞',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    rocket: '🚀',
    success: '✅',
};

// 默认样式
export const defaultStyle: Style = {
    padding: '5px',
    fontWeight: 500,
    fontSize: 12,
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

