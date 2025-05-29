import _createLogger from './core/createLogger';
import _EasyLogVuePlugin from './core/vue-plugin';

// 导出 createLogger 函数
export const createLogger = _createLogger;
export const EasyLogVuePlugin = _EasyLogVuePlugin;

// 默认导出保持原有结构
export default {
    createLogger: _createLogger,
    EasyLogVuePlugin: _EasyLogVuePlugin,
};