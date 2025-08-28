import Logger from "../../core/Logger";
import Modal from "../../core/Modal";
import { ILoggerConfig, Language, LogLevel } from "../../types";
import { getTopGlobalThis, localConsoleError, localConsoleLog, localConsoleWarn } from "../../utils/common";
import { defaultLevel, languageCfg } from "../../utils/constant";
import downloadLog from './downloadLog'

function _getModalConfigValues(modal: Modal): ILoggerConfig {
    // 获取复选框的选中状态（布尔值）
    const isEnableLog = (modal.body!.querySelector('#enableLog') as HTMLInputElement).checked
    const isDebugLog = (modal.body!.querySelector('#debugLog') as HTMLInputElement).checked
    const isRecordLog = (modal.body!.querySelector('#recordLog') as HTMLInputElement).checked
    const isPersistentConfig = (modal.body!.querySelector('#persistentConfig') as HTMLInputElement).checked
    const isSourceCodeLocation = (modal.body!.querySelector('#sourceCodeLocation') as HTMLInputElement).checked

    // 获取级别选择下拉框的值
    const level = (modal.body!.querySelector('#level') as HTMLSelectElement).value as LogLevel;

    // 返回所有值的对象
    return {
        isEnableLog,
        isDebugLog,
        isRecordLog,
        isPersistentConfig,
        level,
        isSourceCodeLocation
    };
}

function _getLogInstanceCallback(modal: Modal, callback: (logInstanceName: string) => void) {
    const logInstanceName = (modal.body!.querySelector('#logInstance') as HTMLInputElement).value
    callback(logInstanceName)
}

// function _registerCheckboxEvent(
//     id: string,
//     modal: Modal,
//     options: {
//         onchange?: (e: Event) => void
//     }
// ) {
//     const checkboxDom = (modal.body!.querySelector(`#${id}`) as HTMLInputElement)
//     checkboxDom.onchange = (e: Event) => {
//         options.onchange && options.onchange(e)
//     }
// }

function _registerSelectEvent(
    id: string,
    modal: Modal,
    options: {
        onchange?: (e: Event) => void
    }) {
    const selectDom = (modal.body!.querySelector(`#${id}`) as HTMLSelectElement)
    selectDom.onchange = (e: Event) => {
        options.onchange && options.onchange(e)
    }
}

function _registerBtnEvent(
    id: string,
    modal: Modal,
    options: {
        onclick?: () => void
        allCallback?: () => void,
        singleCallback?: (logInstanceName: string) => void
    }) {
    const btnDom = (modal.body!.querySelector(`#${id}`) as HTMLButtonElement)
    btnDom.onclick = () => {
        options.onclick && options.onclick()
        _getLogInstanceCallback(modal, (logInstanceName) => {
            if (logInstanceName === 'all') {
                options.allCallback && options.allCallback()
            } else {
                options.singleCallback && options.singleCallback(logInstanceName)
            }
        })
    }
}

function _createConfigModal() {
    return new Modal({
        title: 'EasyLogPlus Config',
        onConfirm: (modal: Modal) => {
            const topGlobalThis = getTopGlobalThis()
            const { hasLogs, configModal } = topGlobalThis.__EASY_LOG_PLUS__ || {}
            if (hasLogs) {
                const configValues = _getModalConfigValues(modal);
                _getLogInstanceCallback(modal, (logInstanceName) => {
                    if (logInstanceName === 'all') {
                        hasLogs.forEach((logger: Logger) => {
                            logger.setConfig(configValues)
                        })
                    } else {
                        const logger = hasLogs.get(logInstanceName)
                        logger.setConfig(configValues)
                    }
                })
            }
            configModal && (configModal.isOpen = false)
        },
        onCancel: () => {
            const topGlobalThis = getTopGlobalThis()
            const configModal = topGlobalThis.__EASY_LOG_PLUS__?.configModal
            configModal && (configModal.isOpen = false)
        }
    });
}

function _updateConfigModal(modal: Modal, logger: Logger, language?: string) {
    const topGlobalThis = getTopGlobalThis()
    const { hasLogs, configModal } = topGlobalThis.__EASY_LOG_PLUS__ || {}
    language = ((language || configModal?.language) ?? Language.CN)! as Language
    const isEnableLog = logger?.config?.isEnableLog ?? false
    const level = logger?.config?.level ?? defaultLevel
    const isDebugLog = logger?.config?.isDebugLog ?? false
    const isRecordLog = logger?.config?.isRecordLog ?? false
    const isPersistentConfig = logger?.config?.isPersistentConfig ?? false
    const isSourceCodeLocation = logger?.config?.isSourceCodeLocation ?? false

    const logInstanceEntries = hasLogs.entries().toArray() || []
    const content = `
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px;">
                <div style="display: flex; align-items: center;">
                    <label for="language">${(languageCfg as any)[language].language}</label>
                    <select id="language" style="margin-left: 10px;">
                        <option value="${Language.CN}" ${language === Language.CN ? 'selected' : ''}>中文</option>
                        <option value="${Language.EN}" ${language === Language.EN ? 'selected' : ''}>English</option>
                    </select> 
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="logInstance">${(languageCfg as any)[language].logInstance}</label>
                    <select id="logInstance" style="margin-left: 10px;">
                        ${logInstanceEntries.map((item: [string, Logger]) => `<option value="${item[0]}" ${item[1] === logger ? 'selected' : ''}>${item[0]}</option>`).join('')}
                        <option value="all" ${!logger ? 'selected' : ''}>${(languageCfg as any)[language].all}</option>
                    </select> 
                </div>
            </div>
            <div style="display: grid; grid-template: 30px 30px / auto auto auto; border-top: 1px solid #ccc; padding: 10px 0;">
                <div style="display: flex; align-items: center;">
                    <label for="enableLog" style="text-align: center">${(languageCfg as any)[language].enableLog}</label>
                    <input type="checkbox" ${isEnableLog ? ' checked' : ''}  value="${isEnableLog}" id="enableLog" style="margin-left: 10px;">
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="level" style="text-align: center">${(languageCfg as any)[language].level}</label>
                    <select id="level" style="margin-left: 10px;">
                        <option value="debug" ${level === 'debug' ? 'selected' : ''}>debug</option>
                        <option value="info" ${level === 'info' ? 'selected' : ''}>info</option>
                        <option value="warn" ${level === 'warn' ? 'selected' : ''}>warn</option>
                        <option value="error" ${level === 'error' ? 'selected' : ''}>error</option>
                        <option value="silent" ${level === 'silent' ? 'selected' : ''}>silent</option>
                    </select>
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="sourceCodeLocation" style="text-align: center">${(languageCfg as any)[language].sourceCodeLocation}</label>
                    <input type="checkbox" ${isSourceCodeLocation ? ' checked' : ''} id="sourceCodeLocation" style="margin-left: 10px;">
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="debugLog" style="text-align: center">${(languageCfg as any)[language].debugLog}</label>
                    <input type="checkbox" ${isDebugLog ? ' checked' : ''} id="debugLog" style="margin-left: 10px;">
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="recordLog" style="text-align: center">${(languageCfg as any)[language].recordLog}</label>
                    <input type="checkbox" ${isRecordLog ? ' checked' : ''} id="recordLog" style="margin-left: 10px;">
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="persistentConfig" style="text-align: center">${(languageCfg as any)[language].persistentConfig}</label>
                    <input type="checkbox" ${isPersistentConfig ? ' checked' : ''} id="persistentConfig" style="margin-left: 10px;">
                </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #ccc; padding-top: 10px;">
                <button id="downloadLog">${(languageCfg as any)[language].downloadLog}</button>
                <button id="clearLog">${(languageCfg as any)[language].clearLog}</button>
                <button id="restConfig">${(languageCfg as any)[language].restConfig}</button>
                <button id="clearCache">${(languageCfg as any)[language].clearCache}</button>
            </div>
        </div>
 
      `
    modal.title && (modal.title.textContent = `EasyLogPlus ${(languageCfg as any)[language].config}`)
    modal.body && (modal.body.innerHTML = content)
    modal.confirmBtn && (modal.confirmBtn.textContent = (languageCfg as any)[language].modifyConfig)
    modal.cancelBtn && (modal.cancelBtn.textContent = (languageCfg as any)[language].close)

    // 语言选择
    _registerSelectEvent('language', modal, {
        onchange: (e: Event) => {
            const language = (e.target! as HTMLSelectElement).value
            language && configModal && (configModal.language = language)
            _updateConfigModal(modal, logger, language)
        }
    })

    // 日志实例选择
    _registerSelectEvent('logInstance', modal, {
        onchange: (e: Event) => {
            const logInstanceName = (e.target! as HTMLSelectElement).value
            logger = logInstanceName && logInstanceName !== 'all' ? hasLogs.get(logInstanceName) : null
            _updateConfigModal(modal, logger)
        }
    })

    // 重置默认配置
    _registerBtnEvent('restConfig', modal, {
        allCallback: () => {
            hasLogs.forEach((logger: Logger) => {
                logger && logger.setConfig()
            })
            modal && modal.destroy()
        },
        singleCallback: (logInstanceName) => {
            const logger = hasLogs.get(logInstanceName) as Logger
            logger && logger.setConfig()
            modal && modal.destroy()
        }
    })

    // 下载日志
    _registerBtnEvent('downloadLog', modal, {
        allCallback: () => {
            hasLogs.forEach((logger: Logger) => {
                downloadLog(logger)
            })
        },
        singleCallback: (logInstanceName) => {
            const logger = hasLogs.get(logInstanceName) as Logger
            downloadLog(logger)
        }
    })

    // 清除日志
    _registerBtnEvent('clearLog', modal, {
        allCallback: () => {
            hasLogs.forEach((logger: Logger) => {
                logger.logStore?.clear()
            })
        },
        singleCallback: (logInstanceName) => {
            const logger = hasLogs.get(logInstanceName) as Logger
            logger.logStore?.clear()
        }
    })

    // 清除缓存
    _registerBtnEvent('clearCache', modal, {
        onclick: () => {
            const request = indexedDB.deleteDatabase('EasyLogPlus');
            request.onsuccess = () => {
                localConsoleLog('[easy-log-plus]: Clear cache success!');
                modal && modal.destroy()
            };
            request.onerror = () => {
                localConsoleError('[easy-log-plus]: Clear cache error!');
            };
            request.onblocked = () => {
                localConsoleError('[easy-log-plus]: Clear cache blocked!');
            };
        }
    })

}

export default function () {
    const configModal = {
        isOpen: false, // 是否打开配置弹窗
        language: Language.CN, // 当前语言
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
            const allowedProperties = new Set(['isOpen', 'language']);
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
                        const topGlobalThis = getTopGlobalThis()
                        const { hasLogs } = topGlobalThis.__EASY_LOG_PLUS__ || {}
                        const logInstances = hasLogs.values().toArray() || []
                        _updateConfigModal(proxyConfigModal.modal, logInstances[0])
                    } else {
                        proxyConfigModal.modal.destroy();
                    }
                }
                if (property === 'language') {
                    if (typeof value !== 'string') {
                        localConsoleWarn('[easy-log-plus]: language must be a string!')
                        return false
                    }
                    if (!Object.values(Language).includes(value as Language)) {
                        localConsoleWarn('[easy-log-plus]: language must be one of the following: ' + Object.values(Language).join(', '))
                        return false
                    }
                }
                return Reflect.set(_target, property, value, receiver);
            }
        }
    })

    return proxyConfigModal
}
