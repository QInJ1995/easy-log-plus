import _createLogger from './core/createLogger';
 
// 导出 createLogger 函数
export const createLogger = _createLogger;

// 默认导出保持原有结构
export default {
    createLogger: _createLogger,
};