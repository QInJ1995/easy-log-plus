import { type PrintOptions } from "../types/index";
import { emojis } from "./constant";
import {
    getCurrentTimeDate,
    formatString,
    removeEmptyBrackets,
    formatTrace,
    getChalk,
} from "./common";
import { v4 as uuidv4 } from 'uuid';

/**
 * 打印日志处理 避免打包被删除
 *
 * @param {string} type 日志类型
 * @param {PrintOptions} options 打印参数
 */
export async function print(
    type: string,
    options: PrintOptions
): Promise<any | void> {
    switch (type) {
        case 'performance':
            {
                const { printList, title, taskFnResult, messages } = await formatPerformance(options);
                (globalThis as any)["con" + "sole"]["log"](...printList);
                return { taskFnResult, title, messages }
            }
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
            const { printList, title } = formatLog(options);
            (globalThis as any)["con" + "sole"]["log"](...printList);
            return title
    }
}

async function formatPerformance(options: PrintOptions): Promise<any> {
    let {
        level,
        messages,
        namespace,
        labels,
        logOptions,
        callStackInfo,
        printCustomStyle,
        logger
    } = options;
    let color = printCustomStyle.color;
    let title = formatString(logOptions.formatter!, {
        namespace: namespace || "",
        time: getCurrentTimeDate(),
        level: level !== "silent" ? `${level!.toUpperCase()}` : "",
        tracker: formatTrace(callStackInfo, logger) || "",
        label: labels!.join("|") || "",
    });
    title = removeEmptyBrackets(title);
    logOptions.isEmoji &&
        (title = `${emojis.new} ${title} ${emojis[level!] || emojis.performance}`);
    const nowTitle = title;
    const placeHolder = messages
        .map((item) => (typeof item === "string" ? "%s" : "%o"))
        .join(" ");
    title = `${title} -> ${placeHolder}`;
    color = logOptions.isColor
        ? color || logOptions.levelColors![level!]
        : "#fff";
    printCustomStyle.color = color;
    // 性能分析处理
    const uuid = uuidv4();
    const startMark = `${uuid}-start`;
    const endMark = `${uuid}-end`;
    globalThis.performance.mark(startMark);
    let taskFnResult = null;
    try {
        const taskFn = messages[0]
        if (taskFn instanceof Function) {
            taskFnResult = await taskFn();
        }
    } finally {
        performance.mark(endMark);
        performance.measure(uuid, startMark, endMark);
        const [entry] = performance.getEntriesByName(uuid);
        // 清理标记，避免内存堆积
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
        performance.clearMeasures(uuid);
        messages = [entry.duration + "ms", taskFnResult]
        return { printList: [getChalk(printCustomStyle)(title), ...messages], title: nowTitle, taskFnResult, messages }
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
        logger
    } = options;
    const table = messages[0] ?? {};
    let color = printCustomStyle.color;
    let title = formatString(logOptions.formatter!, {
        namespace: namespace || "",
        time: getCurrentTimeDate(),
        level: level !== "silent" ? `${level!.toUpperCase()}` : "",
        tracker: formatTrace(callStackInfo, logger) || "",
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
            logger
        } = options;
        const { url, scale } = messages[0];
        let title = formatString(logOptions.formatter!, {
            namespace: namespace || "",
            time: getCurrentTimeDate(),
            level: "",
            tracker: formatTrace(callStackInfo, logger) || "",
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
export function formatLog(options: PrintOptions): any {
    let {
        level,
        messages,
        namespace,
        labels,
        logOptions,
        callStackInfo,
        printCustomStyle,
        logger
    } = options;
    let color = printCustomStyle.color;
    let title = formatString(logOptions.formatter!, {
        namespace: namespace || "",
        time: getCurrentTimeDate(),
        level: level !== "silent" ? `${level!.toUpperCase()}` : "",
        tracker: formatTrace(callStackInfo, logger) || "",
        label: labels!.join("|") || "",
    });
    title = removeEmptyBrackets(title);
    logOptions.isEmoji &&
        (title = `${emojis.new} ${title} ${emojis[level!] || emojis.rocket}`);
    const nowTitle = title;
    const placeHolder = messages
        .map((item) => (typeof item === "string" ? "%s" : "%o"))
        .join(" ");
    title = `${title} -> ${placeHolder}`;
    color = logOptions.isColor
        ? color || logOptions.levelColors![level!]
        : "#fff";
    printCustomStyle.color = color;
    return { printList: [getChalk(printCustomStyle)(title), ...messages], title: nowTitle }
}
