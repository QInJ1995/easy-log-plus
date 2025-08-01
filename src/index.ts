import createLogger from './core/createLogger';
import EasyLogPlusVuePlugin from './plugins/vue-plugin';
import { Env, LogLevel } from './types'


const EasyLogPlus = {
    createLogger,
    Env,
    LogLevel,
    EasyLogPlusVuePlugin
}

export {
    createLogger,
    /** @deprecated 已弃用，此别名将在未来版本中移除, 请使用 EasyLogPlusVuePlugin */
    EasyLogPlusVuePlugin as EasyLogVuePlugin,
    EasyLogPlusVuePlugin,
    Env,
    LogLevel,
};
export default EasyLogPlus;