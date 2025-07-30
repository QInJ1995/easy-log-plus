import { getTopGlobalThis, localConsoleError, localConsoleLog, localConsoleWarn } from "./common";

let recordFile: any = null;

// 步骤1：让用户选择已存在的文件，获取句柄
export async function selectRecordFile() {
    if (recordFile) {
        return;
    }
    try {
        // 打开文件选择对话框，让用户选择已有文件
        const [fileHandle] = await (globalThis as any).showOpenFilePicker({
            types: [
                {
                    description: "文本文件",
                    accept: { "text/plain": [".txt", ".log"] }, // 根据实际文件类型调整
                },
            ],
            multiple: false, // 只选一个文件
        });

        // 验证是否为文件（非目录）
        if (fileHandle.kind === "file") {
            recordFile = fileHandle;
            const fileName = await fileHandle.getFile().then((f: { name: string }) => f.name)

            localConsoleLog(`[easy-log-plus]: file selected: ${fileName}`)
        } else {
            localConsoleWarn(`[easy-log-plus]: please select a file!`)
        }
    } catch (err) {
        localConsoleError(`[easy-log-plus]: file selection failed!`, err)
    }
}

// 步骤2：持续追加内容到文件（保留原有内容）
export async function appendToFile(content: string) {
    const topGlobalThis = getTopGlobalThis()
    if (!topGlobalThis?.__EASY_LOG_PLUS__?.isRecord && !recordFile) {
        return;
    }
    try {
        // 创建可写流，配置为追加模式（关键：keepExistingData: true）
        const writable = await recordFile.createWritable({
            keepExistingData: true, // 保留原有内容，新内容追加到末尾
        });

        // 将内容编码为UTF-8格式
        const encoder = new TextEncoder();
        const encodedContent = encoder.encode(`${content}\n`);
        await writable.write(encodedContent);
        await writable.close();
    } catch (err) {
        recordFile = null;
        localConsoleError(`[easy-log-plus]: logger record append to file failed!`)
    }
}

getTopGlobalThis().appendToFile = appendToFile

// 步骤3：覆盖文件内容（清空原有内容）
export async function overwriteFile(content: string) {
    const topGlobalThis = getTopGlobalThis()
    if (!topGlobalThis?.__EASY_LOG_PLUS__?.isRecord && !recordFile) {
        return;
    }
    try {
        // 创建可写流，配置为覆盖模式（默认keepExistingData: false）
        const writable = await recordFile.createWritable();
        // 将内容编码为UTF-8格式
        const encoder = new TextEncoder();
        const encodedContent = encoder.encode(content);
        await writable.write(encodedContent); // 直接覆盖原有内容
        await writable.close();
    } catch (err) {
        recordFile = null;
        localConsoleError(`[easy-log-plus]: logger record overwrite file failed!`)
    }
}

// 绑定按钮事件（实际使用时需通过用户交互触发）
// document.getElementById("selectBtn").addEventListener("click", selectRecordFile);
// document.getElementById("appendBtn").addEventListener("click", () => {
//     appendToExistingFile("这是新追加的内容"); // 多次点击可持续追加
// });
// document.getElementById("overwriteBtn").addEventListener("click", () => {
//     overwriteExistingFile("这是覆盖后的全新内容");
// });
