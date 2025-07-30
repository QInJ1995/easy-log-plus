import {
  getCurrentTimeDate,
  getTopGlobalThis,
  localConsoleError,
  localConsoleLog,
  localConsoleWarn,
} from "./common";

let recordFile: any = null; // 文件句柄
let recordList: string[] = []; // 记录列表，用于批量写入文件
let timer: any = null; // 定时器

// 导出一个异步函数，用于选择记录文件
export async function openRecordFile() {
  if (!(globalThis as any)?.showSaveFilePicker) {
    localConsoleWarn(
      `[easy-log-plus]: Your browser does not support the File System Access API.`
    );
    return;
  }
  // 如果已经选择了文件，则直接返回
  if (recordFile) {
    return;
  }
  try {
    // 打开文件选择对话框，让用户选择已有文件
    recordFile = await (globalThis as any).showSaveFilePicker({
      suggestedName: `EasyLogPlus_${getCurrentTimeDate(true)}.txt`, // 默认文件名
      types: [
        {
          description: "文本文件",
          accept: { "text/plain": [".txt", ".text", ".log"] }, // 根据实际文件类型调整
        },
      ],
      excludeAcceptAllOption: true, // 不显示所有文件选项
    });
    localConsoleLog(`[easy-log-plus]: ${recordFile.name} create successfully!`);
  } catch (err) {
    localConsoleError(`[easy-log-plus]: file create failed!`, err);
  }
}

export function closeRecordFile() {
  recordFile = null;
  recordList = [];
  timer && clearTimeout(timer);
  timer = null;
}

// 导出一个函数，用于将内容追加到文件中
export function appendToFile(content: string) {
  const topGlobalThis = getTopGlobalThis();
  if (!topGlobalThis?.__EASY_LOG_PLUS__?.isRecord) {
    return;
  }
  // 如果recordFile不存在，则直接返回
  if (!recordFile) return;
  // 将内容添加到recordList中
  recordList.push(content);
  if (timer) {
    return;
  }
  // 使用setTimeout异步执行以下代码
  timer = setTimeout(async () => {
    try {
      // 创建一个可写的文件
      const writable = await recordFile.createWritable({
        keepExistingData: true, // 保留现有的数据
      });
      // 创建一个文本编码器
      const encoder = new TextEncoder();
      // 遍历recordList，将内容写入文件
      for (let i = 0; i < recordList.length; i++) {
        const prefix = i === 0 ? "\ufeff" : "";
        const encodedContent = encoder.encode(`${prefix}${recordList[i]}\n`);
        await writable.write(encodedContent);
      }
      // 关闭文件
      await writable.close();
      // 清空recordList
      recordList = [];
      // 清除定时器
      timer = null;
    } catch (err) {
      // 如果发生错误，将recordFile设置为null
      timer && clearInterval(timer);
      recordList = [];
      recordFile = null;
      timer = null;
      // 打印错误信息
      localConsoleError(
        `[easy-log-plus]: logger record append to file failed!`
      );
    }
  }, 300);
}
