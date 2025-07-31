// 注册监听键盘ctrl + shift + d 键盘事件

import { getCurrentTimeDate, localConsoleError, localConsoleLog, localConsoleWarn } from "../../utils/common";
import { logStore } from "./initStore";


function _registerKeyboardEvent(fn: (event: KeyboardEvent) => void) {
    globalThis.document.addEventListener('keydown', fn);
}
function _removeKeyboardEvent(fn: (event: KeyboardEvent) => void) {
    globalThis.document.removeEventListener('keydown', fn);
}

async function downloadLogEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.altKey && event.code === 'KeyD') {
        try {
            if (!logStore) {
                localConsoleWarn("[easy-log-plus]: download logs failed! logStore is not initialized.");
                return
            }
            const keys = await logStore?.keys()
            if (!keys || keys.length === 0) {
                localConsoleWarn("[easy-log-plus]: download logs failed! logStore is empty.");
                return
            }
            let content = '';
            for (const key of keys) {
                const value = await logStore?.getItem(key);
                content += value + "\n\n";
            }
            // const jsonString = JSON.stringify(content, null, 2)
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8', })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `EasyLogPlus_${getCurrentTimeDate(true)}.log`
            link.click()
            URL.revokeObjectURL(link.href) // 释放内存
            link.remove() // 移除链接
            logStore?.clear() // 清空存储
            localConsoleLog('[easy-log-plus]: download logs success!');
        } catch (error) {
            localConsoleError('[easy-log-plus]: download logs error!', error);
        }
    }
}

export function registerDownloadLogEvent() {
    _registerKeyboardEvent(downloadLogEvent)
    localConsoleLog('[easy-log-plus]: you can download logs by press Alter(Option on Mac) + Shift + D !')
}

// 移除监听
export function removeDownloadLogEvent() {
    _removeKeyboardEvent(downloadLogEvent)
    localConsoleLog('[easy-log-plus]: you can not download logs by press Alter(Option on Mac) + Shift + D !')
}

