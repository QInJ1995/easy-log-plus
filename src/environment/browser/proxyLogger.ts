import Logger from "../../core/Logger";
import { localConsoleWarn } from "../../utils/common";

// 已警告过的属性（避免每次属性访问都重复打印警告刷屏）
const warnedProps = new Set<string>();

export default (logger: Logger) => {
    // 代理处理 在node和浏览器环境时需要隐藏方法
    const proxyLogger: Logger = new Proxy(logger, {
        // 拦截属性的删除
        deleteProperty(_target, property) {
            localConsoleWarn(`[easy-log-plus]: Not allow to delete property: ${String(property)}!`);
            return false; // 不允许删除属性
        },
        get(target, prop, receiver) {
            if (['overline', 'dim', 'inverse'].includes(prop as string) && !warnedProps.has(prop as string)) {
                warnedProps.add(prop as string)
                localConsoleWarn(`[easy-log-plus]: \`${prop as string}\` is not supported in current environment!`);
            };
            return Reflect.get(target, prop, receiver);
        }
    });
    return proxyLogger;
}