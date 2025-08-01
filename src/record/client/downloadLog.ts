import {
    getCurrentTimeDate, getTopGlobalThis, localConsoleError,
    localConsoleLog, localConsoleWarn
} from "../../utils/common";

export default async function (namespace: string) {
    if (!namespace) {
        localConsoleWarn("[easy-log-plus]: download logs failed! function parameter namespace is required!");
        return
    }
    const topGlobalThis = getTopGlobalThis()
    const logStore = topGlobalThis.__EASY_LOG_PLUS__?.hasLogs?.get(namespace)?.logStore
    try {
        if (!logStore) {
            localConsoleWarn(`[easy-log-plus]: download logs failed! ${namespace || ''} logStore is not initialized.`);
            return
        }
        const keys = await logStore?.keys()
        if (!keys || keys.length === 0) {
            localConsoleWarn(`[easy-log-plus]: download logs failed! ${namespace || ''} logStore is empty.`);
            return
        }
        let content = '';

        for (const key of keys) {
            const value = await logStore?.getItem(key);
            let { title, messages } = value
            messages = _serializeMessage(messages)
            content += `${title} -> ${messages}\n\n`;
        }
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8', })
        const link = topGlobalThis.document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `easy-log-plus_${namespace}_${getCurrentTimeDate(true)}.log`
        link.click()
        URL.revokeObjectURL(link.href) // 释放内存
        link.remove() // 移除链接
        logStore?.clear() // 清空存储
        localConsoleLog('[easy-log-plus]: download logs success!');
    } catch (error) {
        localConsoleError('[easy-log-plus]: download logs error!', error);
    }
}

function _serializeMessage(messages: any[]): string {
    // 创建一个Set用于跟踪已序列化的对象，处理循环引用
    const seen = new Set();
    // 安全的字符串化函数
    const safeStringify = (obj: any) => {
        return JSON.stringify(obj, (_key, value) => {
            // 处理循环引用
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular Reference]';
                }
                seen.add(value);
            }
            // 过滤掉全局对象
            if (value === window || value === document) {
                return '[Global Object]';
            }
            return value;
        }, 2);
    };

    // 将消息数组中的每个元素转换为字符串，并拼接成一个字符串
    return messages.reduce((prev, next,) => {
        if (typeof next === "string") {
            return `${prev}\n\n${next}`
        } else {
            // 使用安全的字符串化方法
            return `${prev}\n\n${safeStringify(next)}`
        }
    }, "");
}