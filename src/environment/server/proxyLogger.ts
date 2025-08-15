import Logger from "../../core/Logger";
import { localConsoleWarn } from "../../utils/common";

export default (logger: Logger) => {
    const proxyLogger: Logger = new Proxy(logger, {
        get(target, prop, receiver) {
            if (['image', 'performance'].includes(prop as string)) {
                localConsoleWarn(`[easy-log-plus]: \`${prop as string}\` is not supported in current environment!`);
            }
            return Reflect.get(target, prop, receiver);
        }
    });
    return proxyLogger;
}