import createLogger from './core/createLogger';
// 重新导出 createLogger 函数，避免命名冲突
export { default as createLogger } from './core/createLogger';
// 分别导出插件

// 默认导出保持原有结构
export default {
    createLogger,
};