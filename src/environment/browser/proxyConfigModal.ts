import Modal from "../../core/Modal";
import { getTopGlobalThis, localConsoleWarn } from "../../utils/common";

export function _createConfigModal() {
    
    return new Modal({
        title: 'EasyLogPlus Config',
        content: `
        <div>
        
        </div>
      `,
        onConfirm: () => {
            const topGlobalThis = getTopGlobalThis()
            const configModal = topGlobalThis.__EASY_LOG_PLUS__?.configModal
            configModal && (configModal.isOpen = false)
            alert('点击了确认按钮');
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
