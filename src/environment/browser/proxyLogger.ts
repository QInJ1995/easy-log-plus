import Logger from "../../core/Logger";
import { checkIsBrowser, localConsoleWarn } from "../../utils/common";

export default (logger: Logger) => {
    const isBrowser = checkIsBrowser(); // 判断是否在浏览器环境
    // 代理处理 在node和浏览器环境时需要隐藏方法
    const proxyLogger: Logger = new Proxy(logger, {
        get(target, prop, receiver) {
            // 如果在浏览器环境中，且目标属性是方法，则返回 undefined 来“隐藏”方法
            if (isBrowser) {
                if (['overline', 'dim', 'inverse'].includes(prop as string)) {
                    localConsoleWarn(`[easy-log-plus]: \`${prop as string}\` is not supported in current environment!`);
                };
            } else {
                if (['image',].includes(prop as string)) {
                    localConsoleWarn(`[easy-log-plus]: \`${prop as string}\` is not supported in current environment!`);
                }
            }
            return Reflect.get(target, prop, receiver);
        }
    });
    return proxyLogger;
}