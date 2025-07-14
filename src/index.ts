import createLogger from './core/createLogger';
import EasyLogVuePlugin from './core/vue-plugin';
import { Env, LogLevel } from './types'


// 支持 ES Module
export { createLogger, EasyLogVuePlugin, Env, LogLevel };
const EasyLogPlus = createLogger;

// 支持 CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EasyLogPlus;
    module.exports.default = EasyLogPlus;
    module.exports.createLogger = createLogger;
    module.exports.EasyLogVuePlugin = EasyLogVuePlugin;
    module.exports.Env = Env;
    module.exports.LogLevel = LogLevel;
}

// 支持 UMD
if (typeof window !== 'undefined') {
    (window as any).EasyLogPlus = { createLogger, EasyLogVuePlugin, Env, LogLevel };
}

export default EasyLogPlus;