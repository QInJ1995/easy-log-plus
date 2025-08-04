import Logger from "../../core/Logger";
import { defaultNamespace } from "../../utils/constant";
import { registerConfigStore, registerLogStore } from "./store";

export default function (logger: Logger) {
    logger.logStore = registerLogStore(logger.namespace || defaultNamespace) // 注册日志存储
    logger.configStore = registerConfigStore(logger.namespace || defaultNamespace) // 注册配置存储
}