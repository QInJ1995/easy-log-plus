import createLogger from './core/createLogger';
import EasyLogPlusVuePlugin from './plugins/vue-plugin';
import { Env, Language, LogLevel } from './types'


const EasyLogPlus = {
    createLogger,
    Env,
    Language,
    LogLevel,
    EasyLogPlusVuePlugin
}

export {
    createLogger,
    /** @deprecated 已弃用，此别名将在未来版本中移除, 请使用 EasyLogPlusVuePlugin */
    EasyLogPlusVuePlugin as EasyLogVuePlugin,
    EasyLogPlusVuePlugin,
    Env,
    Language,
    LogLevel,
};
export default EasyLogPlus;