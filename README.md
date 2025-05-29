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
  isTime: true,
  isColor: true,
  isLevel: true,
  isFileName: true,
  isFunctionName: true,
  isLineNumber: true
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

### Vue 插件使用方式

```typescript
import { createApp } from 'vue'
import { EasyLogVuePlugin } from 'easy-log-plus'
import App from './App.vue'

const app = createApp(App)

app.use(EasyLogVuePlugin, {
  level: 'debug',
  prefix: 'MyApp'
})

// 在组件中使用
// Vue 3
const { proxy } = getCurrentInstance()
proxy.$logger.info('这是一条日志')

// Vue 2
this.$logger.info('这是一条日志')
```

## 配置选项

- `level`: 日志级别 ('debug' | 'info' | 'warn' | 'error')
- `prefix`: 日志前缀
- `isTime`: 是否显示时间
- `isColor`: 是否启用彩色输出
- `isLevel`: 是否显示日志级别
- `isFileName`: 是否显示文件名
- `isFunctionName`: 是否显示函数名
- `isLineNumber`: 是否显示行号

## 动态配置

Logger 实例提供了动态更新配置的方法：

```typescript
const logger = createLogger();

// 更新配置选项
logger.setOptions({
  level: 'warn',
  prefix: 'NewPrefix'
});

// 自定义日志颜色
logger.setColors({
  debug: '#95a5a6',
  info: '#2ecc71',
  warn: '#e67e22',
  error: '#ff0000'
});
```

## 特性

- 支持多种日志级别
- 可配置的日志前缀
- 时间戳支持
- 彩色输出支持
- TypeScript 支持
- 支持 ES Module 和 CommonJS 两种导入方式
- Vue 2/3 插件支持
- 支持显示文件名、函数名和行号
- 支持动态更新配置
- 支持自定义日志颜色
