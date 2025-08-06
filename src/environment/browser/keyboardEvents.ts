// 注册监听键盘ctrl + shift + d 键盘事件

import { getTopGlobalThis, localConsoleLog, } from "../../utils/common";


function _registerKeyboardEvent(fn: (event: KeyboardEvent) => void) {
    const topGlobalThis = getTopGlobalThis()
    topGlobalThis.document.addEventListener('keydown', fn);
}
function _removeKeyboardEvent(fn: (event: KeyboardEvent) => void) {
    const topGlobalThis = getTopGlobalThis()
    topGlobalThis.document.removeEventListener('keydown', fn);
}



function openConfigModal(event: KeyboardEvent) {
    if (event.shiftKey && event.altKey && event.code === 'KeyD') {
        const topGlobalThis = getTopGlobalThis()
        const configModal = topGlobalThis.__EASY_LOG_PLUS__?.configModal
        // 创建并打开弹窗
        configModal && (configModal.isOpen = true)
    }

}



export function registerOpenConfigModalEvent() {
    _registerKeyboardEvent(openConfigModal)
    localConsoleLog('[easy-log-plus]: you can open config modal by press Alter(Option on Mac) + Shift + D')
}

// 移除监听
export function removeOpenConfigModalEvent() {
    _removeKeyboardEvent(openConfigModal)
    localConsoleLog('[easy-log-plus]: cancel Alter(Option on Mac) + Shift + D keyboard event.')
}


