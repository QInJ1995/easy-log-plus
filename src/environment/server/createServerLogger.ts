import Logger from "../../core/Logger";
import { Env, Language, ILogOptions } from "../../types";
import { printAsciiArt } from "../../utils/common";
import { setGlobalLogger } from "../../utils/globals";
import { defaultLevel, defaultMaxLogCount } from "../../utils/constant";
import getProxyLogger from './proxyLogger'

export default function (namespace?: string | null, options?: ILogOptions): Logger {
    // 创建日志实例
    const logger = new Logger(namespace, options);

    // 打印 ascii 艺术字
    (options?.env ?? Env.Dev) !== Env.Prod && printAsciiArt(namespace || '')

    // 创建代理日志实例
    const proxyLogger: Logger = getProxyLogger(logger)

    // 挂载到全局对象上
    options?.isGlobal && setGlobalLogger(proxyLogger);

    // 与浏览器环境保持一致：应用默认运行时配置，否则 level / isEnable 等选项在 Node 下不生效
    //（Node 环境无 configStore，setConfig 内的持久化调用为安全的空操作）
    proxyLogger.defaultConfig = {
        isEnableLog: options?.isEnable ?? (options?.env ?? Env.Dev) !== Env.Prod, // 生产环境禁用日志
        level: options?.level || defaultLevel, // 默认日志级别
        isRecordLog: options?.isRecord ?? false, // 是否记录日志（Node 环境无存储，不生效）
        maxLogCount: options?.maxLogCount ?? defaultMaxLogCount, // 日志最大记录条数
        isAutoClearAfterDownload: true, // 下载日志后自动清空本地记录
        isPersistentConfig: options?.isPersistentConfig ?? false, // 是否持久化配置（Node 环境无存储，不生效）
        isSourceCodeLocation: options?.isSourceCodeLocation ?? false, // 是否显示源代码位置
        isDebugLog: false, // 是否调试日志
        language: options?.language ?? Language.EN, // 默认语言
    }
    proxyLogger.setConfig()

    return proxyLogger;
}
