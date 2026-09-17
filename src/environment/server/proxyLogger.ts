import Logger from "../../core/Logger";
import { localConsoleWarn } from "../../utils/common";

// 已警告过的属性（避免每次属性访问都重复打印警告刷屏）
const warnedProps = new Set<string>();

export default (logger: Logger) => {
    const proxyLogger: Logger = new Proxy(logger, {
        get(target, prop, receiver) {
            if (['image', 'performance'].includes(prop as string) && !warnedProps.has(prop as string)) {
                warnedProps.add(prop as string)
                localConsoleWarn(`[easy-log-plus]: \`${prop as string}\` is not supported in current environment!`);
            }
            return Reflect.get(target, prop, receiver);
        }
    });
    return proxyLogger;
}