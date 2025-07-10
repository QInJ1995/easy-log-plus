import createLogger from './core/createLogger';
import EasyLogVuePlugin from './core/vue-plugin';


// 支持 ES Module
export { createLogger, EasyLogVuePlugin, };
const EasyLogPlus = createLogger;

// 支持 CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EasyLogPlus;
    module.exports.default = EasyLogPlus;
    module.exports.createLogger = createLogger;
    module.exports.EasyLogVuePlugin = EasyLogVuePlugin;
}

// 支持 UMD
if (typeof window !== 'undefined') {
    (window as any).EasyLogPlus = { createLogger, EasyLogVuePlugin, };
}

export default EasyLogPlus;