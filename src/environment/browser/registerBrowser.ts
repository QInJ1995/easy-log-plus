import Logger from "../../core/Logger";
import { defaultNamespace } from "../../utils/constant";
import { registerOpenConfigModalEvent } from "./keyboardEvents";
import { registerLogStore } from "./store";

export default function (logger: Logger) {
    registerOpenConfigModalEvent() // 注册打开配置模态框事件
    logger.logStore = registerLogStore(logger.namespace || defaultNamespace) // 注册日志存储
}