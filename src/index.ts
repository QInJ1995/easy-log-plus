import createLogger from './core/createLogger';
import EasyLogVuePlugin from './core/vue-plugin';

// 具名导出
export { createLogger, EasyLogVuePlugin };

// 默认导出保持原有结构
export default createLogger