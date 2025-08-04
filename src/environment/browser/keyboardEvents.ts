// 注册监听键盘ctrl + shift + d 键盘事件

import { getTopGlobalThis, localConsoleLog, } from "../../utils/common";
import Modal from "./Modal";


function _registerKeyboardEvent(fn: (event: KeyboardEvent) => void) {
    const topGlobalThis = getTopGlobalThis()
    topGlobalThis.document.addEventListener('keydown', fn);
}
function _removeKeyboardEvent(fn: (event: KeyboardEvent) => void) {
    const topGlobalThis = getTopGlobalThis()
    topGlobalThis.document.removeEventListener('keydown', fn);
}

function _setTopGlobalThisIsShowConfigModal(isShow: boolean) {
    const topGlobalThis = getTopGlobalThis()
    topGlobalThis.isShowConfigModal = isShow
    !isShow && delete topGlobalThis.isShowConfigModal
}

function openConfigModal(event: KeyboardEvent) {
    if (event.shiftKey && event.altKey && event.code === 'KeyD') {
        const topGlobalThis = getTopGlobalThis()
        // const __EASY_LOG_PLUS__ = topGlobalThis.__EASY_LOG_PLUS__
        // 创建并打开弹窗
        if (topGlobalThis.isShowConfigModal) return
        const modal = new Modal({
            title: 'EasyLogPlus Config',
            content: `
        <p>这是一个完全由JavaScript生成的弹窗</p>
        <p>可以包含任意HTML内容</p>
        <input type="text" style="width:100%;padding:8px;margin-top:10px;border:1px solid #ddd;border-radius:4px;" placeholder="请输入内容">
      `,
            onConfirm: () => {
                alert('点击了确认按钮');
                _setTopGlobalThisIsShowConfigModal(false)
            },
            onCancel: () => {
                console.log('点击了取消按钮');
                _setTopGlobalThisIsShowConfigModal(false)
            }
        });
        modal.open();
        _setTopGlobalThisIsShowConfigModal(true)
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


