// 注册快捷键监听：
//   Alt(Option) + Shift + L  打开配置弹窗
//   Alt(Option) + Shift + O  打开新窗口（追加地址参数）
//   Esc                      关闭配置弹窗

import topGlobalThis from "../../utils/topGlobalThis";
import { Language } from "../../types";
import { languageCfg } from "../../utils/constant";

const shortcutKeyHandles = [
    _shiftAndAltAndLKey(() => _openConfigModal()),
    _shiftAndAltAndOKey(() => _openNewWindow()),
    _escKey(() => _closeConfigModal()),]

// 获取当前语言对应的文案
function _getLangText(key: 'inputUrlParams'): string {
    const logger = topGlobalThis?.__EASY_LOG_PLUS__?.hasLogs?.values()?.next()?.value
    const language = ((logger?.config?.language ?? Language.EN) as Language) ?? Language.EN
    return (languageCfg as any)[language]?.[key] ?? (languageCfg as any)[Language.EN][key]
}

// 打开新窗口
function _openNewWindow() {
    const urlParams = prompt(_getLangText('inputUrlParams'))
    if (urlParams === null) return
    const curUrl = globalThis.location.href
    const [baseUrl, query] = curUrl.split('?')
    const newParams = { ..._params2Obj(query), ..._params2Obj(urlParams), }
    const newParamsString = Object.entries(newParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
    const newUrl = `${baseUrl}${newParamsString ? '?' + newParamsString : ''}`
    globalThis.open(newUrl, '_blank')
}

function _params2Obj(urlParams: string = ''): Record<string, string> {
    return urlParams.split('&').reduce((acc: Record<string, string>, param) => {
        const [key, ...rest] = param.split('=')
        const value = rest.join('=')
        // 仅在参数缺失时跳过（保留空值与 '0' 值参数）
        if (key && value !== undefined) {
            acc[key] = decodeURIComponent(value)
        }
        return acc
    }, {} as Record<string, string>)
}

// 打开配置弹窗
function _openConfigModal() {
    topGlobalThis?.__EASY_LOG_PLUS__?.showConfigModal === false && (topGlobalThis.__EASY_LOG_PLUS__.showConfigModal = true)
}

// 
function _closeConfigModal() {
    topGlobalThis?.__EASY_LOG_PLUS__?.showConfigModal === true && (topGlobalThis.__EASY_LOG_PLUS__.showConfigModal = false)
}

// ESC
function _escKey(callback: () => void) {
    return (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
            event.preventDefault()
            callback()
        }
    }
}

// 事件目标是否为输入场景（输入框/文本域/下拉框/可编辑区域），
// 组合快捷键在输入场景中应放行给输入行为，不触发弹窗
function _isTypingTarget(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement | null
    if (!target) return false
    const tag = target.tagName
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable === true
}

// shift + alt + O
function _shiftAndAltAndOKey(callback: () => void) {
    return (event: KeyboardEvent) => {
        if (_isTypingTarget(event)) return
        if (event.shiftKey && event.altKey && event.code === 'KeyO') {
            event.preventDefault()
            callback()
        }
    }
}

// shift + alt + L
function _shiftAndAltAndLKey(callback: () => void) {
    return (event: KeyboardEvent) => {
        if (_isTypingTarget(event)) return
        if (event.shiftKey && event.altKey && event.code === 'KeyL') {
            event.preventDefault()
            callback()
        }
    }
}

// 注册快捷键
function _registerShortcutKeyEvents(handles: ((event: KeyboardEvent) => void)[]) {
    handles.forEach(fn => {
        globalThis.addEventListener('keydown', fn);
    });
}

// 移除快捷键
function _removeShortcutKeyEvents(handles: ((event: KeyboardEvent) => void)[]) {
    handles.forEach(fn => {
        globalThis.removeEventListener('keydown', fn);
    });
}


// 是否已注册快捷键，防止重复注册全局键盘监听
let isRegistered = false;

export function registerShortcutKeyEvents() {
    if (isRegistered) return
    _registerShortcutKeyEvents(shortcutKeyHandles)
    isRegistered = true
}

export function removeShortcutKeyEvents() {
    if (!isRegistered) return
    _removeShortcutKeyEvents(shortcutKeyHandles)
    isRegistered = false
}


