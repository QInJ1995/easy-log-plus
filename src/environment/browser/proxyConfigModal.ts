import Modal from "../../core/Modal";
import { getTopGlobalThis, localConsoleWarn } from "../../utils/common";
import { zh } from "../../utils/constant";


function _createConfigModal() {
    return new Modal({
        title: 'EasyLogPlus Config',
        onConfirm: (formValues: any) => {
            console.log("🚀 ~ _createConfigModal ~ formValues:", formValues)
            const topGlobalThis = getTopGlobalThis()
            const configModal = topGlobalThis.__EASY_LOG_PLUS__?.configModal
            // configModal && (configModal.isOpen = false)
        },
        onCancel: () => {
            const topGlobalThis = getTopGlobalThis()
            const configModal = topGlobalThis.__EASY_LOG_PLUS__?.configModal
            console.log("🚀 ~ createConfigModal ~ configModal:", configModal)
            configModal && (configModal.isOpen = false)
            console.log('点击了取消按钮');
        }
    });
}

function _createContent() {
    const language = Modal.language
    const topGlobalThis = getTopGlobalThis()
    const { showLog = false, level = 'debug', debugLog = false, recordLog = false, persistentConfig = false } = topGlobalThis.__EASY_LOG_PLUS__ || {}
    console.log("🚀 ~ _createConfigModal ~ showLog:", showLog)
    return `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div>
                <label for="language">Language</label>
                <select id="language" style="margin-left: 10px;">
                    <option value="cn">中文</option>
                    <option value="en">English</option>
                </select> 
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                    <label for="showLog" style="text-align: center">${(zh as any)[language].showLog}</label>
                    <input type="checkbox" ${showLog ? ' checked' : ''}  value="${showLog}" id="showLog" style="margin-left: 10px;">
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="level" style="text-align: center">${(zh as any)[language].level}</label>
                    <select id="level" style="margin-left: 10px;">
                        <option value="debug" ${level === 'debug' ? 'selected' : ''}>debug</option>
                        <option value="info" ${level === 'info' ? 'selected' : ''}>info</option>
                        <option value="warn" ${level === 'warn' ? 'selected' : ''}>warn</option>
                        <option value="error" ${level === 'error' ? 'selected' : ''}>error</option>
                        <option value="silent" ${level === 'silent' ? 'selected' : ''}>silent</option>
                    </select>
                </div>
                  <div style="display: flex; align-items: center;">
                    <label for="debugLog" style="text-align: center">${(zh as any)[language].debugLog}</label>
                    <input type="checkbox" ${debugLog ? ' checked' : ''} id="debugLog" style="margin-left: 10px;">
                </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                    <label for="recordLog" style="text-align: center">${(zh as any)[language].recordLog}</label>
                    <input type="checkbox" ${recordLog ? ' checked' : ''} id="recordLog" style="margin-left: 10px;">
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="downloadLog" style="text-align: center">${(zh as any)[language].downloadLog}</label>
                    <select id="downloadLog" style="margin-left: 10px;">
                        <option value="debug">debug</option>
                        <option value="info">info</option>
                        <option value="warn">warn</option>
                        <option value="error">error</option>
                        <option value="silent">silent</option>
                    </select>
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="persistentConfig" style="text-align: center">${(zh as any)[language].persistentConfig}</label>
                    <input type="checkbox" ${persistentConfig ? ' checked' : ''} value="${persistentConfig}" id="persistentConfig" style="margin-left: 10px;">
                </div>
            </div>
        </div>
 
      `
}

export default function () {
    const configModal = {
        isOpen: false, // 是否打开配置弹窗
        modal: _createConfigModal(), // 配置弹窗实例
    }
    const proxyConfigModal = new Proxy(configModal, {
        // 拦截属性的删除
        deleteProperty(_target, property) {
            localConsoleWarn(`[easy-log-plus]: Not allow to delete property: ${String(property)}!`);
            return false; // 不允许删除属性
        },

        // 拦截属性的设置
        set(_target, property, value, receiver) {
            const allowedProperties = new Set(['isOpen',]);
            if (!allowedProperties.has(property as string)) {
                localConsoleWarn(`[easy-log-plus]: Not allow to set unsupported property: ${String(property)}!`);
                return false; // 不允许设置不支持的属性
            } else {
                // 如果设置的是 isOpen 属性，则更新弹窗的 isOpen 属性
                if (property === 'isOpen') {
                    if (typeof value !== 'boolean') {
                        localConsoleWarn('[easy-log-plus]: isOpen must be a boolean!');
                        return false;
                    }
                    if (value) {
                        proxyConfigModal.modal.open();
                        proxyConfigModal.modal.updateContent(_createContent())
                    } else {
                        proxyConfigModal.modal.destroy();
                    }
                }
                return Reflect.set(_target, property, value, receiver);
            }
        }
    })

    return proxyConfigModal
}
