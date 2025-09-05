import chalk from "chalk";
import {
  LogLevel,
  CallStackInfo,
  PrintCustomStyle,
  PrintOptions,
  Language,
} from "../types/index";
import { defaultCallStackIndex, languageCfg } from "./constant";
import Logger from "../core/Logger";
import buildInfo from "../../build-info.json";

export function debugAlert(
  level: LogLevel,
  logger: Logger,
  options: PrintOptions
) {
  if (
    level === LogLevel.Debug &&
    logger.config?.isDebugLog &&
    checkIsBrowser()
  ) {
    const language = (logger?.config?.language ?? Language.EN)! as Language
    (globalThis as any)["al" + "ert"](`${(languageCfg as any)[language].time}: ${getCurrentTimeDate()}
${(languageCfg as any)[language].namespace}: ${options.namespace}
${(languageCfg as any)[language].label}: ${options.labels!.join("|") || ""}
${(languageCfg as any)[language].fileName}: ${options.callStackInfo.fileName}
${(languageCfg as any)[language].functionName}: ${options.callStackInfo.functionName}
${(languageCfg as any)[language].sourceCodeLocation}: ${options.callStackInfo.location}`);
  }
}

/**
 *
 * @param message 本地日志消息
 * @param color
 */
export function localConsoleLog(
  message: string,
  color: string = "#00bfff"
): void {
  (globalThis as any)["con" + "sole"]["log"](chalk.hex(color)(message));
}

/**
 * 本地警告日志
 * @param args
 */
export function localConsoleWarn(...args: any[]): void {
  (globalThis as any)["con" + "sole"]["warn"](...args);
}

/**
 * 本地错误日志
 * @param args
 */
export function localConsoleError(...args: any[]): void {
  (globalThis as any)["con" + "sole"]["error"](...args);
}

/**
 * 获取当前的日期和时间
 *
 * 此函数以字符串形式返回当前的日期和时间，格式为YYYY-MM-DD HH:MM:SS
 * 使用本地时间来确保正确的小时数
 *
 * @returns {string} 当前日期和时间的字符串表示
 */
export function getCurrentTimeDate(recordLog?: boolean): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return recordLog
    ? `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`
    : `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 检查给定的日志级别是否应该被记录
 * @param {LogLevel} level - 要检查的日志级别
 * @param {LogOptions} options - 日志选项
 * @returns {boolean} - 如果日志级别应该被记录，则返回true，否则返回false
 */
export function shouldLog(logger: Logger, level?: LogLevel): boolean {
  const levels: LogLevel[] = [
    LogLevel.Debug,
    LogLevel.Info,
    LogLevel.Warn,
    LogLevel.Error,
  ];
  return !level || level === LogLevel.Silent
    ? true
    : levels.indexOf(level) >=
    levels.indexOf(logger.config?.level || LogLevel.Debug);
}

/**
 * 是否启用日志
 * @returns {boolean} - 如果启用日志，则返回true，否则返回false
 */
export function isEnable(logger: Logger): boolean {
  return logger.config?.isEnableLog ?? true;
}

/**
 * 获取顶层 Window
 * @returns
 */
export function getTopGlobalThis(): any {
  if (!checkIsBrowser()) {
    return globalThis;
  }
  let top = globalThis as any;
  // 优先使用 top 属性
  if (globalThis.top) {
    top = globalThis.top;
  } else {
    while (top.parent && top !== top.parent) {
      top = top.parent;
    }
  }
  // 跨域访问顶层属性会抛出错误，此时返回 globalThis
  try {
    top?.__EASY_LOG_PLUS__
    return top;
  } catch (_error) {
    return globalThis;
  }
}

/**
 *  检查当前环境是否为浏览器
 *
 */
export function checkIsBrowser(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof navigator !== "undefined"
  );
}

/**
 * 获取日志追踪信息
 * @param {CallStackInfo} callStackInfo - 调用堆栈信息对象
 * @returns {string} - 返回日志追踪信息
 */
export function formatTrace(callStackInfo: CallStackInfo, logger: Logger): string {
  const { fileName, functionName, lineNumber, location } = callStackInfo;
  let tracker = ''
  if (functionName && fileName && lineNumber) {
    tracker = `${functionName ? functionName + "()" : ""} ${fileName}${lineNumber ? ":" + lineNumber : ""
      }`;
  } else if (!functionName && fileName && lineNumber) {
    tracker = `${fileName}${lineNumber ? ":" + lineNumber : ""}`;
  } else if (functionName && !fileName && lineNumber) {
    tracker = `${functionName ? functionName + "()" : ""}${lineNumber ? ":" + lineNumber : ""
      }`;
  }
  return logger.config?.isSourceCodeLocation ? `${tracker} | ${location}` : `${tracker}`;
}

/**
 * 格式化字符串
 * @param {string} template - 模板字符串
 * @param {object} replacements - 替换项
 * @returns {string} - 格式化后的字符串
 */
export function formatString(
  template: string,
  replacements: { [key: string]: any }
): string {
  return template.replace(/\$(\w+)\$/g, (_, key) => {
    return key in replacements ? replacements[key] : `$${key}$`;
  });
}

/**
 * 移除空方括号和包含占位符的方括号
 * @param {string} str - 待处理的字符串
 * @returns {string} - 处理后的字符串
 */
export function removeEmptyBrackets(str: string): string {
  // 正则表达式匹配空的方括号或包含占位符的方括号
  return str
    .replace(/\[\s*\]|【\s*】/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 获取自定义打印样式
 * @param {Map<string, any>} printMap - 打印样式映射表
 * @returns {PrintCustomStyle} - 打印样式对象
 */
export function getPrintCustomStyle(
  printMap: Map<string, any>
): PrintCustomStyle {
  return {
    color: printMap.get("color"),
    bgColor: printMap.get("bgColor"),
    bold: printMap.get("bold"),
    italic: printMap.get("italic"),
    underline: printMap.get("underline"),
    overline: printMap.get("overline"),
    strikethrough: printMap.get("strikethrough"),
    dim: printMap.get("dim"),
    inverse: printMap.get("inverse"),
    reset: printMap.get("reset"),
  };
}

/**
 * 获取 chalk 实例
 * @param {PrintCustomStyle} printCustomStyle - 打印样式对象
 * @returns {Function} - chalk 实例
 */
export function getChalk(printCustomStyle: PrintCustomStyle): Function {
  return Object.entries(printCustomStyle).reduce((acc, cur) => {
    let [key, value] = cur;
    const isColor = ["color", "bgColor"].includes(key);
    const curKey = isColor
      ? capitalizeFirstLetter(value as string, false)
      : key;
    if (value) {
      if (Reflect.has(acc, curKey)) {
        if (key === "bgColor") {
          return Reflect.get(acc, "bg" + capitalizeFirstLetter(curKey));
        }
        return Reflect.get(acc, curKey);
      } else {
        if (isColor) {
          switch (key) {
            case "color":
              return acc.hex(value as string);
            default:
              return acc.bgHex(value as string);
          }
        }
      }
    }
    return acc;
  }, chalk.reset);
}

/**
 * 合并对象
 * @param target
 * @param source
 * @returns
 */
export function mergeObjects<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  return Object.entries(source).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        (acc as any)[key] = value;
      }
      return acc;
    },
    { ...target }
  ) as T & U;
}

/**
 * 将字符串的首字母转为大写或小写
 * @param {string} str - 输入字符串
 * @param {boolean} isUpperCase - 是否转为大写，默认 true
 * @returns {string} 首字母处理后的字符串
 */
function capitalizeFirstLetter(
  str: string,
  isUpperCase: boolean = true
): string {
  if (!str) return str; // 处理空字符串
  const firstChar = isUpperCase
    ? str.charAt(0).toUpperCase()
    : str.charAt(0).toLowerCase();
  return firstChar + str.slice(1);
}

/**
 * 获取调用堆栈信息
 *
 * @param {number} depth - 堆栈深度，默认为 0
 */

export function getCallStackInfo(depth: number = 0): CallStackInfo {
  const callStackIndex = defaultCallStackIndex + depth;
  try {
    throw new Error();
  } catch (e: any) {
    // 解析调用栈信息
    const stack = e.stack.split("\n").slice(1); // 去掉第一行"Error"信息
    if (callStackIndex >= stack.length) {
      return {
        functionName: "",
        fileName: "",
        lineNumber: "",
        location: ''
      };
    }
    const stackLine = stack[callStackIndex]; // 获取指定深度的调用栈行
    let functionName = "";
    let fileName = "";
    let lineNumber = "";
    let location = '';
    // 统一的正则表达式，兼容浏览器和Node.js
    // 浏览器格式: "at functionName (http://127.0.0.1:5500/test.html:15:9)"
    // Node.js格式: "at functionName (/path/to/file.js:15:9)"
    const namedFunctionMatch = stackLine.match(
      /at\s+([^\s(]+)\s+\((.+):(\d+):(\d+)\)/
    );
    if (namedFunctionMatch) {
      functionName = namedFunctionMatch[1];
      const fullPath = namedFunctionMatch[2];
      lineNumber = namedFunctionMatch[3];
      // 提取文件名
      fileName = _extractFileName(fullPath);
      location = `${fullPath}:${lineNumber}:${namedFunctionMatch[4]}`
    } else {
      // 匹配匿名函数的情况
      // 浏览器: "at http://127.0.0.1:5500/test.html:15:9"
      // Node.js: "at /path/to/file.js:15:9"
      const anonymousFunctionMatch = stackLine.match(/at\s+(.+):(\d+):(\d+)/);
      if (anonymousFunctionMatch) {
        const fullPath = anonymousFunctionMatch[1];
        lineNumber = anonymousFunctionMatch[2];
        fileName = _extractFileName(fullPath);
        functionName = "";
        location = `${fullPath}:${lineNumber}:${anonymousFunctionMatch[3]}`;
      }
    }
    return {
      functionName,
      fileName,
      lineNumber,
      location
    };
  }
}

export function delayExecute(callback: () => void, delay: number) {
  const start = performance.now();
  let animationFrameId: number;

  function checkTime(currentTime: number) {
    if (currentTime - start >= delay) {
      callback();
      // 清理引用
      clear();
    } else {
      animationFrameId = requestAnimationFrame(checkTime);
    }
  }
  animationFrameId = requestAnimationFrame(checkTime);
  function clear() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }
  }

  // 返回一个清理函数
  return clear
}


/**
 * 打印 ASCII 艺术字
 */
export function printAsciiArt(namespace: string = "") {
  const isBrowser = checkIsBrowser()
  localConsoleLog(`
.----------------------------------------------------------.
${_getTextLine((namespace ? namespace + " | " : "") + "Created Successfully!")}
|                                                          |
|     ░█▀▀░█▀█░█▀▀░█░█░░░█░░░█▀█░█▀▀░░░█▀█░█░░░█░█░█▀▀     |
|     ░█▀▀░█▀█░▀▀█░░█░░░░█░░░█░█░█░█░░░█▀▀░█░░░█░█░▀▀█     |
|     ░▀▀▀░▀░▀░▀▀▀░░▀░░░░▀▀▀░▀▀▀░▀▀▀░░░▀░░░▀▀▀░▀▀▀░▀▀▀     |
|                                                          |
${_getTextLine("v" + buildInfo.version)}
'----------------------------------------------------------'
`);

  isBrowser && localConsoleLog('[easy-log-plus]: you can open config modal by press Alter(Option on Mac) + Shift + L')

  function _getTextLine(text: string = "") {
    const blankNumber = 60 - 2 - text.length;
    const startBlank = [...Array(Math.floor(blankNumber / 2))]
      .map(() => " ")
      .join("");
    const endBlank = [...Array(Math.ceil(blankNumber / 2))]
      .map(() => " ")
      .join("");
    return `|${startBlank}${text}${endBlank}|`;
  }
}

/**
 * 提取文件名，兼容浏览器URL和Node.js文件路径
 * @param {string} fullPath - 完整路径
 * @returns {string} 文件名
 */
function _extractFileName(fullPath: string): string {
  if (!fullPath || fullPath === "") {
    return "";
  }

  try {
    // 处理浏览器URL格式 (http://127.0.0.1:5500/test.html)
    if (
      fullPath.startsWith("http://") ||
      fullPath.startsWith("https://") ||
      fullPath.startsWith("file://")
    ) {
      const url = new URL(fullPath);
      const pathname = url.pathname;
      return pathname.split("/").pop() || "";
    }

    // 处理Node.js文件路径
    // 检查是否在Node.js环境
    if (typeof require !== "undefined") {
      try {
        const path = require("path");
        return path.basename(fullPath);
      } catch (error) {
        return "";
      }
    }

    // 通用处理方法（适用于各种路径格式）
    // 处理Windows路径 (C:\path\to\file.js) 和 Unix路径 (/path/to/file.js)
    const fileName = fullPath.split(/[\/\\]/).pop();
    return fileName || "";
  } catch (error) {
    localConsoleError(
      "[easy-log-plus] Error when extracting file name from path: ",
      error
    );
    // 降级处理：简单的字符串分割
    return fullPath.split(/[\/\\]/).pop() || "";
  }
}
