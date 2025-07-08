import createLogger from './core/createLogger';
import EasyLogVuePlugin from './core/vue-plugin';
import Logger from './core/Logger';
import { envs } from './utils/constant'
import { LogLevel, PrintCustomStyle, Env, LogOptions, LevelColors, EasyLogVuePluginOptions, BaseColors } from './types'

// 导出类型
export type {
    LogLevel, PrintCustomStyle, Env, LogOptions,
    LevelColors, EasyLogVuePluginOptions, BaseColors, Logger
}



// 支持 ES Module
export { createLogger, EasyLogVuePlugin, envs };
const EasyLogPlus = createLogger;

// 支持 CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EasyLogPlus;
    module.exports.default = EasyLogPlus;
    module.exports.createLogger = createLogger;
    module.exports.EasyLogVuePlugin = EasyLogVuePlugin;
    module.exports.envs = envs;
}

// 支持 UMD
if (typeof window !== 'undefined') {
    (window as any).EasyLogPlus = { createLogger, EasyLogVuePlugin, envs };
}

export default EasyLogPlus;