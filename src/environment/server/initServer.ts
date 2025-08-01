import Logger from "../../core/Logger";
import { ILogOptions } from "../../types";

export default function (namespace?: string | null, options?: ILogOptions): Logger {
    // 创建日志实例
    return new Logger(namespace, options);

}