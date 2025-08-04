import Logger from "../../core/Logger";
import { ILogOptions } from "../../types";
import { setGlobalLogger } from "../../utils/globals";
import getProxyLogger from './proxyLogger'

export default function (namespace?: string | null, options?: ILogOptions): Logger {
    // 创建日志实例
    const logger = new Logger(namespace, options);

    // 创建代理日志实例
    const proxyLogger: Logger = getProxyLogger(logger)

    // 挂载到全局对象上
    options?.isGlobal && setGlobalLogger(proxyLogger);

    return proxyLogger;

}