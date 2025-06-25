# Easy Log Plus

一个简单而强大的 TypeScript/JavaScript 日志工具库，支持浏览器和 Node.js 环境。

## 安装

```bash
npm install easy-log-plus
```

## 快速使用

```typescript
import { createLogger } from 'easy-log-plus';

const logger = createLogger()

logger.log('这是一条调试信息');

```

## 使用方法

### ES Module 方式

```typescript
import {createLogger, envs} from 'easy-log-plus';

const logger = createLogger('MyApp', {
  env: envs.prod, // 环境变量 默认为 'dev'
  level: 'debug', // 日志级别 默认为 'debug'：'debug' <= 'info' <= 'warn' <= 'error' 
  formatter: '', // 默认：[$namespace$] [$time$] [$level$] [$tracker$] [$label$] 日志格式说明： $namespace$：命名空间，$time$：时间戳，$level$：日志级别，$tracker$：跟踪器，$label$：标签  
  depth: 0, // 堆栈深度 默认为0， 在封装打印时需要配置，目的为了准确获取 tracker 信息
  isColor: true, // 是否启用彩色输出 默认为 true
  isEmoji: true, // 是否显示表情符号 默认为 true
  colors: { // 自定义颜色
    debug: '#87CEFA', // 调试级别颜色 默认为 '#87CEFA'
    info: '#90EE90', // 普通级别颜色 默认为 '#90EE90'
    warn: '#FF7F00', // 警告级别颜色 默认为 '#FF7F00'
    error: '#FF0000', // 错误级别颜色 默认为 '#FF0000'
    silent: '#A7B0C4' // 静默级别颜色 默认为 '#A7B0C4'
  }
  style: { // 日志打印样式
    color: 'red', // 颜色 默认为对应色码 
    bgColor: 'blue', // 背景颜色 默认为对应色码 
    bold: true, // 加粗 默认值为 false
    italic: true, // 斜体 默认值为 false
    underline: true, //  下划线 默认值为 false
    strikethrough: true, // 删除线 默认值为 false
    overline: true, //  上划线 默认值为 false（浏览器不支持）
    dim: true, // 灰色 默认值为 false （浏览器不支持）
    inverse: true, // 反转颜色 默认值为 false （浏览器不支持）
  }
});

// 基本使用
logger.log('这是一条调试信息'); // 不受level控制，颜色为静默颜色
logger.debug('这是一条调试信息'); 
logger.info('这是一条普通信息'); 
logger.warn('这是一条警告信息'); 
logger.error('这是一条错误信息'); 

// 带前缀的日志
logger.label('CustomInfo').debug('这是一条带前缀的调试信息');
logger.label('CustomInfo').info()('这是一条带前缀的普通信息');

// 带颜色和前缀的日志
logger.label('CustomInfo').color('#ff0000').debug('这是一条红色的调试信息');
logger.label('CustomInfo').color('#ff0000').info('这是一条绿色的普通信息');

// 带颜色和前缀、加粗、斜体、下划线、删除线的日志
logger.label('CustomInfo').color('#ff0000').bold.italic.underline.strikethrough.info('这是一条绿色、前缀、加粗、斜体、下划线、删除线的普通信息');
```

### CommonJS 方式

```javascript
const createLogger = require('easy-log-plus');
const { createLogger, envs } = require('easy-log-plus')

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
  enabled: true,       // 是否启用插件 默认为 true
  // 日志配置项
  env: envs.prod, // 环境变量 默认为 'dev'
  level: 'debug', // 日志级别 默认为 'debug'：'debug' <= 'info' <= 'warn' <= 'error' 
  formatter: '$namespace$ | [$time$] [$level$] [$tracker$] $label$', // 日志格式： $namespace$：命名空间，$time$：时间戳，$level$：日志级别，$tracker$：跟踪器，$label$：标签  
  depth: 0, // 堆栈深度 默认为0， 在封装打印时需要配置，目的为了准确获取 tracker 信息
  isColor: true, // 是否启用彩色输出 默认为 true
  isEmoji: true, // 是否显示表情符号 默认为 true
  isGlobal:  true, // 是否在全局(window/global)挂载logger 默认为 false  
  colors: { // 自定义颜色
    debug: '#87CEFA', // 调试级别颜色 默认为 '#87CEFA'
    info: '#90EE90', // 普通级别颜色 默认为 '#90EE90'
    warn: '#FF7F00', // 警告级别颜色 默认为 '#FF7F00'
    error: '#FF0000', // 错误级别颜色 默认为 '#FF0000'
    silent: '#A7B0C4' // 静默级别颜色 默认为 '#A7B0C4'
  }
  style: { // 日志打印样式
    color: 'red', // 颜色 默认为对应色码 
    bgColor: 'blue', // 背景颜色 默认为对应色码 
    bold: true, // 加粗 默认值为 false
    italic: true, // 斜体 默认值为 false
    underline: true, //  下划线 默认值为 false
    strikethrough: true, // 删除线 默认值为 false
    overline: true, //  上划线 默认值为 false（浏览器不支持）
    dim: true, // 灰色 默认值为 false （浏览器不支持）
    inverse: true, // 反转颜色 默认值为 false （浏览器不支持）
  }
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
- `env`: 环境变量 ('dev' | 'test' | 'prod')
- `formatter`: 日志格式 默认：`[$namespace$] [$time$] [$level$] [$tracker$] [$label$]`
  - `$namespace$`: 命名空间
  - `$time$`: 时间戳
  - `$level$`: 日志级别
  - `$tracker$`: 跟踪器
  - `$label$`: 标签
- `depth`: 堆栈深度
  - `0`: 默认值，表示不获取堆栈信息
- `isColor`: 是否启用彩色输出
- `isEmoji`: 是否显示表情符号
- `colors`: 自定义颜色配置
  - `debug`: 调试级别颜色
  - `info`: 普通级别颜色
  - `warn`: 警告级别颜色
  - `error`: 错误级别颜色
  - `silent`: 静默级别颜色
- `style`: 自定义样式配置
  - `color`: 颜色
  - `bgColor`: 背景颜色
  - `bold`: 加粗
  - `italic`: 斜体
  - `underline`: 下划线
  - `strikethrough`: 删除线
  - `overline`: 上划线
  - `dim`: 灰色
  - `inverse`: 反转颜色

## 动态配置

Logger 实例提供了动态更新配置的方法：

```typescript
const logger = createLogger('MyApp');

// 更新配置选项
logger.setOptions({
  level: 'warn',
  isEmoji: false,
  style: {
    
  }
});

// 自定义日志颜色
logger.setColors({
  debug: '#95a5a6', // 默认为 '#87CEFA'
  info: '#2ecc71', // 默认为 '#90EE90'
  warn: '#e67e22', // 默认为 '#FF7F00'
  error: '#ff0000' // 默认为 '#ff0000'
  silent: '#000000' // 默认为 '#A7B0C4'
});
```

## 生成环境在浏览器的Console中查看日志

```text
window.showLog = true; // 开启日志
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
- 支持全局配置
