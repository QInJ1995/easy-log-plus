import createLogger from './core/createLogger';
import EasyLogVuePlugin from './core/vue-plugin';
import { envs } from './utils/constant'

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