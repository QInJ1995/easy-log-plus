// 注册监听键盘ctrl + shift + d 键盘事件

import { getTopGlobalThis, } from "../../utils/common";

const shortcutKeyHandles = [_shiftAndAltAndLKey(() => _openConfigModal()), _shiftAndAltAndWKey(() => _openNewWindow())]

// 打开新窗口
function _openNewWindow() {
    const urlParams = prompt('请输入地址参数')
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
        const [key, value] = param.split('=')
        key && value && (acc[key] = decodeURIComponent(value))
        return acc
    }, {} as Record<string, string>)
}

// 打开配置弹窗
function _openConfigModal() {
    const topGlobalThis = getTopGlobalThis()
    topGlobalThis?.__EASY_LOG_PLUS__ && (topGlobalThis.__EASY_LOG_PLUS__.showConfigModal = true)
}

// shift + alt + W
function _shiftAndAltAndWKey(callback: () => void) {
    return (event: KeyboardEvent) => {
        if (event.shiftKey && event.altKey && event.code === 'KeyO') {
            event.preventDefault()
            callback()
        }
    }
}

// shift + alt + L
function _shiftAndAltAndLKey(callback: () => void) {
    return (event: KeyboardEvent) => {
        if (event.shiftKey && event.altKey && event.code === 'KeyL') {
            event.preventDefault()
            callback()
        }
    }
}

// 注册快捷键
function _registerShortcutKeyEvents(handles: ((event: KeyboardEvent) => void)[]) {
    handles.forEach(fn => {
        globalThis.document.addEventListener('keydown', fn);
    });
}

// 移除快捷键
function _removeShortcutKeyEvents(handles: ((event: KeyboardEvent) => void)[]) {
    handles.forEach(fn => {
        globalThis.document.removeEventListener('keydown', fn);
    });
}


export function registerShortcutKeyEvents() {
    _registerShortcutKeyEvents(shortcutKeyHandles)
}

export function removeShortcutKeyEvents() {
    _removeShortcutKeyEvents(shortcutKeyHandles)
}


