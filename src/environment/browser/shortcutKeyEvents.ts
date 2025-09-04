// 注册监听键盘ctrl + shift + d 键盘事件

import Logger from "../../core/Logger";

let logger: Logger

const shortcutKeyHandles = [
    _shiftAndAltAndLKey(() => _openConfigModal()),
    _shiftAndAltAndWKey(() => _openNewWindow()),
    _escKey(() => _closeConfigModal())
]

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
    if (logger._isOpenConfigModal === false) {
        logger._openConfigModal(logger)
        logger._isOpenConfigModal = true
    }
}

// 关闭配置弹窗
function _closeConfigModal() {
    if (logger._isOpenConfigModal === true) {
        const modal = logger._getConfigModalInstance()
        modal && modal.close()
        logger._clearConfigModalInstance()
        logger._isOpenConfigModal = false
    }
}

// ESC键关闭
function _escKey(callback: () => void) {
    return (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
            event.preventDefault()
            callback()
        }
    }
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
        globalThis.addEventListener('keydown', fn);
    });
}

// 移除快捷键
function _removeShortcutKeyEvents(handles: ((event: KeyboardEvent) => void)[]) {
    handles.forEach(fn => {
        globalThis.removeEventListener('keydown', fn);
    });
}


export function registerShortcutKeyEvents(_logger: Logger) {
    logger = _logger
    _registerShortcutKeyEvents(shortcutKeyHandles)
}

export function removeShortcutKeyEvents() {
    _removeShortcutKeyEvents(shortcutKeyHandles)
}


