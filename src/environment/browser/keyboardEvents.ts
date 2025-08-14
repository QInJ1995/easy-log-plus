// 注册监听键盘ctrl + shift + d 键盘事件

import { getTopGlobalThis, localConsoleLog, } from "../../utils/common";


function _registerKeyboardEvent(fn: (event: KeyboardEvent) => void) {
    globalThis.document.addEventListener('keydown', fn);
}
function _removeKeyboardEvent(fn: (event: KeyboardEvent) => void) {
    globalThis.document.removeEventListener('keydown', fn);
}



function openConfigModal(event: KeyboardEvent) {
    if (event.shiftKey && event.altKey && event.code === 'KeyL') {
        const topGlobalThis = getTopGlobalThis()
        const configModal = topGlobalThis.__EASY_LOG_PLUS__?.configModal
        // 创建并打开弹窗
        configModal && (configModal.isOpen = true)
    }

}



export function registerOpenConfigModalEvent() {
    _registerKeyboardEvent(openConfigModal)
    localConsoleLog('[easy-log-plus]: you can open config modal by press Alter(Option on Mac) + Shift + L')
}

// 移除监听
export function removeOpenConfigModalEvent() {
    _removeKeyboardEvent(openConfigModal)
}


