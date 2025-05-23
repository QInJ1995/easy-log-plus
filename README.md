# Easy Log Plus

一个简单而强大的 TypeScript/JavaScript 日志工具库。

## 安装

```bash
npm install easy-log-plus
```

## 使用方法

### ES Module 方式

```typescript
import createLogger from 'easy-log-plus';

const logger = createLogger({
  level: 'debug',
  prefix: 'MyApp',
  timestamp: true,
  colors: true
});

logger.debug('这是一条调试信息');
logger.info('这是一条普通信息');
logger.warn('这是一条警告信息');
logger.error('这是一条错误信息');
```

### CommonJS 方式

```javascript
const createLogger = require('easy-log-plus');

const logger = createLogger({
  level: 'debug',
  prefix: 'MyApp'
});

logger.info('Hello World');
```

## 配置选项

- `level`: 日志级别 ('debug' | 'info' | 'warn' | 'error')
- `prefix`: 日志前缀
- `timestamp`: 是否显示时间戳
- `colors`: 是否启用彩色输出

## 特性

- 支持多种日志级别
- 可配置的日志前缀
- 时间戳支持
- 彩色输出支持
- TypeScript 支持
- 支持 ES Module 和 CommonJS 两种导入方式
