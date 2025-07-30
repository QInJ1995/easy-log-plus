import { type PrintOptions } from "../types/index";
import { emojis } from "./constant";
import {
    getCurrentTimeDate,
    formatString,
    removeEmptyBrackets,
    getLogTrace,
    getChalk,
} from "./common";

/**
 * 打印日志处理 避免打包被删除
 *
 * @param {string} type 日志类型
 * @param {PrintOptions} options 打印参数
 */
export async function print(
    type: string,
    options: PrintOptions
): Promise<string | void> {
    switch (type) {
        case "time":
            (globalThis as any)["con" + "sole"]["time"](formatTime(options));
            break;
        case "timeEnd":
            (globalThis as any)["con" + "sole"]["timeEnd"](formatTime(options));
            break;
        case "image":
            (globalThis as any)["con" + "sole"]["log"](
                ...(await formatImage(options))
            );
            break;
        case "table":
            const { table, groupCollapsed } = formatTable(options);
            (globalThis as any)["con" + "sole"]["groupCollapsed"](groupCollapsed);
            (globalThis as any)["con" + "sole"]["table"](table);
            (globalThis as any)["con" + "sole"]["groupEnd"]();
            break;
        default:
            const { printString, printLog } = formatLog(options);
            (globalThis as any)["con" + "sole"]["log"](...printLog);
            return printString;
    }
}

/**
 * 格式化表格打印
 * @param options
 * @returns
 */
function formatTable(options: PrintOptions): {
    table: any;
    groupCollapsed: any;
} {
    let {
        level,
        messages,
        namespace,
        labels,
        logOptions,
        callStackInfo,
        printCustomStyle,
    } = options;
    const table = messages[0] ?? {};
    let color = printCustomStyle.color;
    let title = formatString(logOptions.formatter!, {
        namespace: namespace || "",
        time: getCurrentTimeDate(),
        level: level !== "silent" ? `${level!.toUpperCase()}` : "",
        tracker:
            getLogTrace(
                callStackInfo.fileName,
                callStackInfo.functionName,
                callStackInfo.lineNumber
            ) || "",
        label: labels!.join("|") || "",
    });
    title = removeEmptyBrackets(title);
    logOptions.isEmoji && (title = `${emojis.new} ${title} ${emojis.down}`);
    title = `${title}`;
    color = logOptions.isColor
        ? color || logOptions.levelColors![level!]
        : "#fff";
    printCustomStyle.color = color;
    return { table, groupCollapsed: getChalk(printCustomStyle)(title) };
}

/**
 * 格式化图片打印
 * @param options
 * @returns
 */
function formatImage(options: PrintOptions): Promise<any[]> {
    return new Promise((resolve) => {
        const {
            messages,
            labels,
            logOptions,
            namespace,
            level,
            callStackInfo,
            printCustomStyle,
        } = options;
        const { url, scale } = messages[0];
        let title = formatString(logOptions.formatter!, {
            namespace: namespace || "",
            time: getCurrentTimeDate(),
            level: "",
            tracker:
                getLogTrace(
                    callStackInfo.fileName,
                    callStackInfo.functionName,
                    callStackInfo.lineNumber
                ) || "",
            label: labels!.join("|") || "",
        });
        title = removeEmptyBrackets(title);
        logOptions.isEmoji && (title = `${emojis.new} ${title} ${emojis.image}`);
        title = `${title} -> `;
        let color = printCustomStyle.color;
        color = logOptions.isColor
            ? color || logOptions.levelColors![level!]
            : "#fff";
        let img: HTMLImageElement | null = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = img!.width;
                canvas.height = img!.height;
                ctx.fillStyle = "red";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img!, 0, 0);
                const dataUrl = canvas.toDataURL("image/png");
                resolve([
                    `%c${title}%c sup?`,
                    `background: ${printCustomStyle.bgColor}; 
                        border:1px solid ${printCustomStyle.bgColor}; 
                        padding: 1px; 
                        border-radius: 2px 0 0 2px;
                        color: ${color};
                        font-weight: ${printCustomStyle.bold ? "bold" : "normal"
                    };
                        text-decoration: ${printCustomStyle.underline ? "underline" : "none"
                    };
                        font-style: ${printCustomStyle.italic ? "italic" : "normal"
                    };
                        `,
                    `font-size: 1px;
                        padding: ${Math.floor(
                        (img!.height * scale) / 2
                    )}px ${Math.floor((img!.width * scale) / 2)}px;
                        background-image: url(${dataUrl});
                        background-repeat: no-repeat;
                        background-size: ${img!.width * scale}px ${img!.height * scale
                    }px;
                        color: transparent;
                    `,
                ]);
                img = null;
            }
        };
        img.src = url;
    });
}

/**
 * 格式化时间打印
 * @param options
 * @returns string
 */
function formatTime(options: PrintOptions): string {
    const { level, namespace, labels, logOptions, printCustomStyle } = options;
    let color = options.printCustomStyle.color;
    let title = formatString(logOptions.formatter!, {
        namespace: namespace || "",
        time: "",
        level: "",
        label: labels!.join("|") || "",
        tracker: "",
    });
    title = removeEmptyBrackets(title);
    logOptions.isEmoji && (title = `${emojis.new} ${title} ${emojis.clock}`);
    title = `${title} -> `;
    color = logOptions.isColor
        ? color || logOptions.levelColors![level!]
        : "#fff";
    printCustomStyle.color = color;
    return getChalk(printCustomStyle)(title);
}

/**
 * 格式化常用日志打印
 * @param {PrintOptions} options 日志参数
 * @param options.level 日志级别
 * @param options.messages 日志消息
 * @param options.namespace 命名空间
 * @param options.info 日志信息
 * @param options.logOptions 日志选项
 * @param options.color 日志颜色
 * @param options.callStackInfo 调用堆栈信息
 * @returns
 */
export function formatLog(options: PrintOptions): {
    printString: string;
    printLog: any[];
} {
    let {
        level,
        messages,
        namespace,
        labels,
        logOptions,
        callStackInfo,
        printCustomStyle,
    } = options;
    let color = printCustomStyle.color;
    let title = formatString(logOptions.formatter!, {
        namespace: namespace || "",
        time: getCurrentTimeDate(),
        level: level !== "silent" ? `${level!.toUpperCase()}` : "",
        tracker:
            getLogTrace(
                callStackInfo.fileName,
                callStackInfo.functionName,
                callStackInfo.lineNumber
            ) || "",
        label: labels!.join("|") || "",
    });
    title = removeEmptyBrackets(title);
    logOptions.isEmoji &&
        (title = `${emojis.new} ${title} ${emojis[level!] || emojis.rocket}`);
    const printString = `${title} -> ${_serializeMessage(messages)}`
    const placeHolder = messages
        .map((item) => (typeof item === "string" ? "%s" : "%o"))
        .join(" ");
    title = `${title} -> ${placeHolder}`;
    color = logOptions.isColor
        ? color || logOptions.levelColors![level!]
        : "#fff";
    printCustomStyle.color = color;
    return {
        printString,
        printLog: [getChalk(printCustomStyle)(title), ...messages],
    };
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
        });
    };

    return messages.reduce((prev, next) => {
        if (typeof next === "string") {
            return prev + next;
        } else {
            // 使用安全的字符串化方法
            return prev + safeStringify(next);
        }
    }, "");
}
