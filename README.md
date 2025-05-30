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

const logger = createLogger('MyApp', {
  level: 'debug',
  isTime: true, // 是否显示时间戳 默认为 true
  isColor: true, // 是否启用彩色输出 默认为 true
  isLevel: true, // 是否显示日志级别 默认为 true
  isFileName: true, // 是否显示文件名 默认为 true
  isFunctionName: true, // 是否显示函数名 默认为 true
  isLineNumber: true, // 是否显示行号 默认为 true
  isEmoji: true, // 是否显示表情符号 默认为 true
  style: { // 日志打印样式
    padding: '5px', // 内边距 string
    fontWeight: 500, // 字体粗细 number
    fontSize: 12 // 字体大小 number
  }
});

// 基本使用
logger.debug('这是一条调试信息');
logger.info('这是一条普通信息');
logger.warn('这是一条警告信息');
logger.error('这是一条错误信息');

// 带前缀的日志
logger.debug()('CustomPrefix','这是一条带前缀的调试信息');
logger.info()('CustomPrefix', '这是一条带前缀的普通信息');

// 带颜色和前缀的日志
logger.debug()()('CustomPrefix', '#ff0000', '这是一条红色的调试信息');
logger.info()()('CustomPrefix', '#00ff00', '这是一条绿色的普通信息');
```

### CommonJS 方式

```javascript
const createLogger = require('easy-log-plus');

const logger = createLogger('MyApp', {
  level: 'debug',
  isEmoji: true
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
  namespace: 'MyApp',
  level: 'debug',
  isVue: true,        // 是否在 Vue 实例上挂载 $logger 默认为 true
  isProvide: true,    // 是否使用 provide/inject 方式 默认为 false
  isWindow: true,     // 是否在 window 对象上挂载 logger 默认为 false
  enabled: true,       // 是否启用插件 默认为 true
  ...LogOptions       // 日志配置项
})

// 在组件中使用
// Vue 3
const { proxy } = getCurrentInstance()
proxy.$logger.info('这是一条日志')

// Vue 2
this.$logger.info('这是一条日志')

// 使用 inject 方式（需要设置 isProvide: true）
const logger = inject('$logger')
logger.info('这是一条日志')
```

## 配置选项

- `level`: 日志级别 ('debug' | 'info' | 'warn' | 'error' | 'silent')
- `isTime`: 是否显示时间戳
- `isColor`: 是否启用彩色输出
- `isLevel`: 是否显示日志级别
- `isFileName`: 是否显示文件名
- `isFunctionName`: 是否显示函数名
- `isLineNumber`: 是否显示行号
- `isEmoji`: 是否显示表情符号
- `style`: 自定义样式配置
  - `padding`: 内边距
  - `fontWeight`: 字体粗细
  - `fontSize`: 字体大小

## 动态配置

Logger 实例提供了动态更新配置的方法：

```typescript
const logger = createLogger('MyApp');

// 更新配置选项
logger.setOptions({
  level: 'warn',
  isEmoji: false,
  style: {
    fontSize: 14
  }
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

- 支持多种日志级别（debug、info、warn、error、silent）
- 支持命名空间
- 时间戳支持
- 彩色输出支持
- TypeScript 支持
- 支持 ES Module 和 CommonJS 两种导入方式
- Vue 2/3 插件支持
- 支持显示文件名、函数名和行号
- 支持动态更新配置
- 支持自定义日志颜色
- 支持表情符号
- 支持自定义样式
- 支持链式调用
- 支持前缀和颜色自定义
- 生产环境自动禁用日志
- 支持全局配置
