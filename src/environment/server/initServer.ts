import Logger from "../../core/Logger";
import { ILogOptions } from "../../types";
import { setGlobalLogger } from "../../utils/globals";

export default function (namespace?: string | null, options?: ILogOptions): Logger {
    // 创建日志实例
    const logger = new Logger(namespace, options);

    // 挂载到全局对象上
    options?.isGlobal && setGlobalLogger(logger);

    return logger;

}