import { type PrintOptions } from "../types/index";
import { emojis } from "./constant";
import {
    getCurrentTimeDate,
    formatString,
    removeEmptyBrackets,
    formatTrace,
    getChalk,
    localConsoleWarn,
} from "./common";
import { v4 as uuidv4 } from 'uuid';

/**
 * 同步打印日志处理（log/time/timeEnd/table）
 * 避免打包被删除
 *
 * @param {string} type 日志类型
 * @param {PrintOptions} options 打印参数
 */
export function printSync(
    type: string,
    options: PrintOptions
): any | void {
    switch (type) {
        case "time":
            (globalThis as any)["con" + "sole"]["time"](formatTime(options));
            return;
        case "timeEnd":
            (globalThis as any)["con" + "sole"]["timeEnd"](formatTime(options));
            return;
        case "table":
            {
                const { table, groupCollapsed } = formatTable(options);
                (globalThis as any)["con" + "sole"]["groupCollapsed"](groupCollapsed);
                (globalThis as any)["con" + "sole"]["table"](table);
                (globalThis as any)["con" + "sole"]["groupEnd"]();
            }
            return;
        default:
            {
                const { printList, title } = formatLog(options);
                (globalThis as any)["con" + "sole"]["log"](...printList);
                return title
            }
    }
}

/**
 * 异步打印日志处理（performance/image）
 *
 * @param {string} type 日志类型
 * @param {PrintOptions} options 打印参数
 */
export async function printAsync(
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
        case "image":
            (globalThis as any)["con" + "sole"]["log"](
                ...(await formatImage(options))
            );
            break;
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
        return { printList: [getChalk(printCustomStyle, color)(title), ...messages], title: nowTitle, taskFnResult, messages }
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
    return { table, groupCollapsed: getChalk(printCustomStyle, color)(title) };
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
        // 只加载图片获取宽高，直接使用原始 URL 作为背景，
        // 避免整图 canvas 绘制与 toDataURL 编码造成的主线程阻塞（大图可达 100ms+）与内存开销
        let img: HTMLImageElement | null = new Image();
        img.onload = () => {
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
                        background-image: url("${url}");
                        background-repeat: no-repeat;
                        background-size: ${img!.width * scale}px ${img!.height * scale
                    }px;
                        color: transparent;
                    `,
            ]);
            img = null;
        };
        // 图片加载失败时也必须 resolve，避免 Promise 永久悬挂导致调用链无法释放
        img.onerror = () => {
            localConsoleWarn(`[easy-log-plus]: image log load failed! url: ${url}`);
            resolve([`%c${title}${emojis.warn ?? ''} image load failed!`, `color: ${color};`]);
            img = null;
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
    return getChalk(printCustomStyle, color)(title);
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
    return { printList: [getChalk(printCustomStyle, color)(title), ...messages], title: nowTitle }
}
