import Logger from "../../core/Logger";
import Modal from "../../core/Modal";
import { ILoggerConfig, Language, LogLevel } from "../../types";
import { getTopGlobalThis, localConsoleWarn } from "../../utils/common";
import { defaultLevel, languageCfg } from "../../utils/constant";


function _getModalConfigValues(modal: Modal): ILoggerConfig {
    // 获取复选框的选中状态（布尔值）
    const isEnableLog = (modal.body!.querySelector('#enableLog') as HTMLInputElement).checked
    const isDebugLog = (modal.body!.querySelector('#debugLog') as HTMLInputElement).checked
    const isRecordLog = (modal.body!.querySelector('#recordLog') as HTMLInputElement).checked
    const isPersistentConfig = (modal.body!.querySelector('#persistentConfig') as HTMLInputElement).checked

    // 获取级别选择下拉框的值
    const level = (modal.body!.querySelector('#level') as HTMLSelectElement).value as LogLevel;
    const language = (modal.body!.querySelector('#language') as HTMLSelectElement).value

    // 返回所有值的对象
    return {
        isEnableLog,
        isDebugLog,
        isRecordLog,
        isPersistentConfig,
        level,
        language
    };
}

function _createConfigModal() {
    return new Modal({
        title: 'EasyLogPlus Config',
        onConfirm: (modal: Modal) => {
            const topGlobalThis = getTopGlobalThis()
            const { hasLogs, configModal } = topGlobalThis.__EASY_LOG_PLUS__ || {}
            if (hasLogs) {
                const configValues = _getModalConfigValues(modal);
                const logInstanceName = (modal.body!.querySelector('#logInstance') as HTMLInputElement).value
                if (logInstanceName === 'all') {
                    hasLogs.forEach((logger: Logger) => {
                        logger.setConfig(configValues)
                    })
                } else {
                    const logger = hasLogs.get(logInstanceName)
                    logger.setConfig(configValues)
                }
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

function _updateConfigModal(modal: Modal, logger: Logger | null, language?: string) {
    language = language || (logger?.config?.language ?? Language.CN)
    const isEnableLog = logger?.config?.isEnableLog ?? false
    const level = logger?.config?.level ?? defaultLevel
    const isDebugLog = logger?.config?.isDebugLog ?? false
    const isRecordLog = logger?.config?.isRecordLog ?? false
    const isPersistentConfig = logger?.config?.isPersistentConfig ?? false
    const topGlobalThis = getTopGlobalThis()
    const { hasLogs } = topGlobalThis.__EASY_LOG_PLUS__ || {}
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
                <button id="restConfig">${(languageCfg as any)[language].restConfig}</button>
                <button id="downloadLog">${(languageCfg as any)[language].downloadLog}</button>
                <button id="clearLog">${(languageCfg as any)[language].clearLog}</button>
                <button id="clearCache">${(languageCfg as any)[language].clearCache}</button>
            </div>
        </div>
 
      `
    modal.title && (modal.title.textContent = `EasyLogPlus ${(languageCfg as any)[language].config}`)
    modal.body && (modal.body.innerHTML = content)
    modal.confirmBtn && (modal.confirmBtn.textContent = (languageCfg as any)[language].modifyConfig)
    modal.cancelBtn && (modal.cancelBtn.textContent = (languageCfg as any)[language].close)

    // 语言选择
    const languageDom = (modal.body!.querySelector('#language') as HTMLSelectElement)
    languageDom.onchange = (e: Event) => {
        const language = (e.target! as HTMLSelectElement).value
        e && logger && (logger.config.language = language)
        _updateConfigModal(modal, logger, language)
    }
    const logInstanceDom = (modal.body!.querySelector('#logInstance') as HTMLSelectElement)
    logInstanceDom.onchange = (e: Event) => {
        const logInstanceName = (e.target! as HTMLSelectElement).value
        logger = logInstanceName && logInstanceName !== 'all' ? hasLogs.get(logInstanceName) : null
        _updateConfigModal(modal, logger)
    }
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
                        const topGlobalThis = getTopGlobalThis()
                        const { hasLogs } = topGlobalThis.__EASY_LOG_PLUS__ || {}
                        const logInstances = hasLogs.values().toArray() || []
                        _updateConfigModal(proxyConfigModal.modal, logInstances[0])
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
