# Easy Log Plus

一个简单而强大的 TypeScript 日志工具库，支持浏览器与 Node.js 环境。

## 特性

- 🌈 **彩色输出**：内置级别配色，支持链式自定义颜色 / 背景 / 加粗 / 斜体 / 下划线 / 删除线等样式
- 📊 **多级别日志**：`debug` / `info` / `warn` / `error` / `silent`，支持运行时级别过滤
- 🏷️ **命名空间与标签**：多实例隔离，链式 `label` 前缀
- 📍 **调用追踪**：自动输出文件名、方法名、行号（`$tracker$` 占位符）
- ⏱️ **计时与性能分析**：`time` / `timeEnd` / `performance`（基于 Performance API）
- 🖼️ **图片日志 / 表格日志**（浏览器）
- 💾 **日志记录**：IndexedDB 持久化记录，超限自动淘汰最旧日志，支持一键下载 `.log` 文件
- ⌨️ **快捷键 + 可视化配置弹窗**（浏览器）：生产环境也能实时调参、下载日志
- 🖖 **Vue 2 / Vue 3 插件**，SSR 安全
- 📦 支持 ES Module / CommonJS，TypeScript 类型完备

## 目录

- [安装](#安装)
- [快速开始](#快速开始)
- [日志输出](#日志输出)
- [链式样式](#链式样式)
- [特殊日志类型](#特殊日志类型)
- [日志格式 formatter](#日志格式-formatter)
- [创建时的配置项 ILogOptions](#创建时的配置项-ilogoptions)
- [运行时配置 setConfig](#运行时配置-setconfig)
- [浏览器：生产环境调试](#浏览器生产环境调试)
- [Vue 插件](#vue-插件)
- [Node.js 环境](#nodejs-环境)
- [实例管理与销毁](#实例管理与销毁)
- [TypeScript](#typescript)

## 安装

```bash
npm install easy-log-plus
```

## 快速开始

### 浏览器（返回 Promise）

```typescript
import { createLogger } from "easy-log-plus";

const logger = await createLogger("MyApp");

logger.debug("这是一条调试信息");
logger.info("这是一条普通信息");
logger.warn("这是一条警告信息");
logger.error("这是一条错误信息");
```

### Node.js（同步返回实例）

```javascript
const { createLogger } = require("easy-log-plus");

const logger = createLogger("MyApp");
logger.info("Hello World");
```

### CommonJS（浏览器）

```javascript
const { createLogger } = require("easy-log-plus");

createLogger("MyApp").then((logger) => {
  logger.info("Hello World");
});
```

> `createLogger(namespace?, options?)` 的 `namespace` 默认为 `Easy-Log-Plus`。浏览器环境中相同命名空间会**复用同一个实例**，适合在多个模块中共享配置（Node 环境每次调用都会创建新实例）。

## 日志输出

| 方法                    | 说明                                         |
| ----------------------- | -------------------------------------------- |
| `logger.log(...args)`   | 通用日志，**不受级别过滤**，使用 silent 配色 |
| `logger.debug(...args)` | 调试日志                                     |
| `logger.info(...args)`  | 普通日志                                     |
| `logger.warn(...args)`  | 警告日志                                     |
| `logger.error(...args)` | 错误日志                                     |

所有方法支持任意类型、任意数量的参数，并返回 `this`，可继续链式调用。

级别过滤规则（假设配置 `level: 'warn'`）：

```typescript
const logger = await createLogger("MyApp", { level: "warn" });

logger.debug("不输出"); // debug < warn，被过滤
logger.info("不输出"); // info < warn，被过滤
logger.warn("输出"); // warn >= warn
logger.error("输出"); // error > warn
logger.log("始终输出"); // log 不参与级别过滤
```

将 `level` 设为 `'silent'` 时，`debug` / `info` / `warn` / `error` 全部静默，仅 `logger.log()` 仍会输出。

## 链式样式

样式只对**下一条日志**生效，输出后自动清空，不会泄漏到后续日志：

```typescript
// 带标签前缀
logger.label("CustomInfo").debug("这是一条带前缀的调试信息");

// 自定义颜色 + 标签（color/bgColor 支持十六进制色，如 '#ff0000'）
logger.label("CustomInfo").color("#ff0000").debug("红色的调试信息");
logger.bgColor("#333333").info("带背景的普通信息");

// 加粗、斜体、下划线、删除线（属性直接链式访问，不加括号）
logger.bold.italic.underline.strikethrough.info("组合样式日志");

// 重置样式
logger.reset.info("无样式日志");
```

| API              | 形式 | 说明                               | 环境          |
| ---------------- | ---- | ---------------------------------- | ------------- |
| `label(text)`    | 方法 | 自定义标签前缀，可多次调用追加多个 | 浏览器 / Node |
| `color(color)`   | 方法 | 文本颜色                           | 浏览器 / Node |
| `bgColor(color)` | 方法 | 背景颜色                           | 浏览器 / Node |
| `bold`           | 属性 | 加粗                               | 浏览器 / Node |
| `italic`         | 属性 | 斜体                               | 浏览器 / Node |
| `underline`      | 属性 | 下划线                             | 浏览器 / Node |
| `strikethrough`  | 属性 | 删除线                             | 浏览器 / Node |
| `reset`          | 属性 | 重置样式                           | 浏览器 / Node |
| `overline`       | 属性 | 上划线                             | 仅 Node       |
| `inverse`        | 属性 | 反转颜色                           | 仅 Node       |
| `dim()`          | 方法 | 降低文本不透明度                   | 仅 Node       |

> 浏览器端 `overline` / `dim` / `inverse` 由 Console 样式不支持，会被自动忽略。

## 特殊日志类型

### 计时 time / timeEnd

```typescript
logger.label("api-cost").time(); // 开始计时（标签来自链式 label）
await fetchUser();
logger.label("api-cost").timeEnd(); // 结束计时，输出耗时（标签需与 time 一致）
```

### 表格 table

以折叠分组 + `console.table` 形式输出对象或数组：

```typescript
logger.table([
  { id: 1, name: "foo" },
  { id: 2, name: "bar" },
]);
```

### 性能分析 performance（仅浏览器）

传入异步任务，自动用 Performance API 测量并输出耗时，同时返回任务结果：

```typescript
const users = await logger.performance(async () => {
  const res = await fetch("/api/users");
  return res.json();
});
// 控制台输出任务耗时，users 为任务的返回值
```

### 图片日志 image（仅浏览器）

在控制台中渲染图片，`scale` 为缩放比例（0-1，默认 0.1）：

```typescript
logger.image("https://example.com/logo.png", 0.5);
```

## 日志格式 formatter

默认格式：`[$namespace$] [$time$] [$level$] [$tracker$] [$label$]`，空占位符产生的空括号会自动移除。

| 占位符        | 说明                            |
| ------------- | ------------------------------- |
| `$namespace$` | 命名空间                        |
| `$time$`      | 时间戳（`YYYY-MM-DD HH:mm:ss`） |
| `$level$`     | 日志级别（大写）                |
| `$tracker$`   | 调用追踪：方法名、文件名、行号  |
| `$label$`     | 链式标签（多个以`\|` 连接）     |

```typescript
const logger = await createLogger("MyApp", {
  formatter: "$namespace$ | [$time$] [$level$] $label$",
});
```

### depth（封装场景）

在自己封装的打印函数中调用 logger 时，堆栈会多一层，导致 `$tracker$` 定位错误。通过 `depth` 修正：

```typescript
// 你的封装函数
function myLog(msg: string) {
  logger.debug(msg); // 此处堆栈比直接调用多一层
}

// 创建时配置 depth: 1，向上多取一层堆栈
const logger = await createLogger("MyApp", { depth: 1 });
```

> **性能提示**：`$tracker$` 依赖堆栈捕获（约 25μs/条，是单条日志的最大开销）。仅在 formatter 包含 `$tracker$`、开启 `isSourceCodeLocation` 或 `isDebugLog` 时才会捕获堆栈；高频日志场景建议从 formatter 中移除 `$tracker$`。

### 源码位置 isSourceCodeLocation

开启后 `$tracker$` 会附加完整的源码位置（路径:行:列）：

```typescript
const logger = await createLogger("MyApp", {
  formatter: "[$time$] [$tracker$] [$level$]",
  isSourceCodeLocation: true,
});
```

## 创建时的配置项 ILogOptions

```typescript
const logger = await createLogger("MyApp", {
  env: "dev", // 环境变量：'dev' | 'prod'，默认 'dev'
  level: "debug", // 日志级别，默认 'debug'
  isColor: true, // 是否启用彩色输出，默认 true
  isEmoji: true, // 是否显示级别表情，默认 true
  formatter: "", // 日志格式模板，见上文
  depth: 0, // 堆栈深度修正，默认 0
  isEnable: true, // 是否启用日志，默认 env !== 'prod'
  isGlobal: false, // 是否挂载到 globalThis.logger，默认 false
  isRecord: false, // 是否记录日志到 IndexedDB（浏览器），默认 false
  maxLogCount: 1000, // 日志记录上限，超限自动淘汰最旧，默认 1000
  isPersistentConfig: false, // 是否持久化配置（浏览器），默认 false
  isSourceCodeLocation: false, // 是否显示完整源码位置，默认 false
  language: "en-US", // 配置弹窗语言：'zh-CN' | 'en-US'，默认 'en-US'
  levelColors: {
    // 自定义级别配色（可只传需要覆盖的项）
    debug: "#87CEFA",
    info: "#90EE90",
    warn: "#FF7F00",
    error: "#FF0000",
    silent: "#A7B0C4",
  },
  style: {
    // 实例级基础样式，作用于该实例的所有日志
    color: "red", // 颜色：十六进制色或基础色名
    bgColor: "blue", // 背景颜色
    bold: true, // 加粗，默认 false
    italic: true, // 斜体，默认 false
    underline: true, // 下划线，默认 false
    strikethrough: true, // 删除线，默认 false
    // 以下三项浏览器不支持，仅 Node 生效
    overline: true, // 上划线，默认 false
    dim: true, // 降低不透明度，默认 false
    inverse: true, // 反转颜色，默认 false
  },
});
```

| 配置项                 | 类型                 | 默认值                                                     | 说明                                                     |
| ---------------------- | -------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| `env`                  | `'dev' \| 'prod'`    | `'dev'`                                                    | `prod` 下默认关闭日志（见 `isEnable`），且不打印启动横幅 |
| `level`                | `LogLevel`           | `'debug'`                                                  | 日志级别，作为默认运行时配置                             |
| `isColor`              | `boolean`            | `true`                                                     | 是否启用彩色输出                                         |
| `isEmoji`              | `boolean`            | `true`                                                     | 是否显示级别表情（🐞 ℹ️ ⚠️ ❌ 等）                       |
| `formatter`            | `string`             | `'[$namespace$] [$time$] [$level$] [$tracker$] [$label$]'` | 日志格式模板                                             |
| `depth`                | `number`             | `0`                                                        | 封装调用时的堆栈深度修正                                 |
| `isEnable`             | `boolean`            | `env !== 'prod'`                                           | 是否启用日志                                             |
| `isGlobal`             | `boolean`            | `false`                                                    | 挂载到`globalThis.logger`                                |
| `isRecord`             | `boolean`            | `false`                                                    | 是否记录日志到 IndexedDB（仅浏览器）                     |
| `maxLogCount`          | `number`             | `1000`                                                     | 日志记录上限，超限自动淘汰最旧的日志                     |
| `isPersistentConfig`   | `boolean`            | `false`                                                    | 是否持久化配置到 IndexedDB（仅浏览器）                   |
| `isSourceCodeLocation` | `boolean`            | `false`                                                    | 是否在 tracker 中显示完整源码位置                        |
| `language`             | `'zh-CN' \| 'en-US'` | `'en-US'`                                                  | 配置弹窗与提示语言                                       |
| `levelColors`          | `LevelColors`        | 见上例                                                     | 自定义级别配色                                           |
| `style`                | `object`             | `{}`                                                       | 实例级基础样式                                           |

## 运行时配置 setConfig

运行时配置可随时修改，无参调用恢复默认配置；开启 `isPersistentConfig` 后配置会持久化到 IndexedDB，刷新页面依然生效：

```typescript
logger.setConfig({ level: "warn", isRecordLog: true });

logger.setConfig(); // 恢复默认配置
```

| 配置项                     | 类型                 | 默认值           | 说明                                                             |
| -------------------------- | -------------------- | ---------------- | ---------------------------------------------------------------- |
| `isEnableLog`              | `boolean`            | `env !== 'prod'` | 是否启用日志                                                     |
| `level`                    | `LogLevel`           | `'debug'`        | 日志级别                                                         |
| `isRecordLog`              | `boolean`            | `false`          | 是否记录日志（关闭时会清空已记录的日志）                         |
| `maxLogCount`              | `number`             | `1000`           | 记录上限，超限淘汰最旧（保留上限的 90%）                         |
| `isAutoClearAfterDownload` | `boolean`            | `true`           | 下载日志后是否自动清空本地记录，设为`false` 可保留副本供多次下载 |
| `isPersistentConfig`       | `boolean`            | `false`          | 是否持久化配置                                                   |
| `isSourceCodeLocation`     | `boolean`            | `false`          | 是否显示完整源码位置                                             |
| `isDebugLog`               | `boolean`            | `false`          | 调试模式：浏览器下每条 debug 日志会弹窗显示调用信息              |
| `language`                 | `'zh-CN' \| 'en-US'` | `'en-US'`        | 弹窗语言                                                         |

## 浏览器：生产环境调试

生产环境即使 `isEnableLog` 为 `false`，也无需改代码——通过快捷键或控制台命令打开配置弹窗，实时开启日志、调整级别、下载日志。

### 快捷键

| 快捷键                    | 作用                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| `Alt(Option) + Shift + L` | 打开 / 关闭配置弹窗                                                      |
| `Esc`                     | 关闭配置弹窗                                                             |
| `Alt(Option) + Shift + O` | 弹窗输入地址参数，携带参数（保留原有参数）在新窗口打开页面，便于带参调试 |

> 在输入框、文本域等输入场景下组合快捷键不会触发，避免干扰正常输入。

### 控制台命令

```javascript
// 在浏览器控制台中执行
__EASY_LOG_PLUS__.showConfigModal = true; // 打开配置弹窗
__EASY_LOG_PLUS__.showConfigModal = false; // 关闭配置弹窗
```

> `__EASY_LOG_PLUS__` 挂载在顶层 window 上（iframe 场景全局共享），且仅允许设置 `showConfigModal` 属性，写入其他属性会被拒绝并给出警告。

### 配置弹窗功能

- **语言切换**：中文 / English
- **日志实例**：选择单个实例单独配置，或选「全部」批量配置
- **配置项**：启用日志、日志级别、源码位置、调试日志、记录日志、持久化配置
- **下载日志**：将已记录的日志导出为 `.log` 文件（文件名含命名空间与时间）
- **清除日志**：清空当前实例（或全部实例）已记录的日志
- **恢复默认配置**：重置为创建时的默认配置
- **清除缓存**：删除整个 `EasyLogPlus` IndexedDB 库（所有实例的日志与持久化配置）

### 日志记录与下载

开启 `isRecordLog` 后，每条日志会写入 IndexedDB（库 `EasyLogPlus`，表 `{namespace}-logs`），超过 `maxLogCount` 自动淘汰最旧日志。通过配置弹窗的「下载日志」即可导出，默认下载后清空本地记录；如需保留副本（如审计、二次下载），设置：

```typescript
logger.setConfig({ isRecordLog: true, isAutoClearAfterDownload: false });
```

## Vue 插件

```typescript
import { createApp } from "vue";
import { EasyLogPlusVuePlugin } from "easy-log-plus";
import App from "./App.vue";

const app = createApp(App);

app.use(EasyLogPlusVuePlugin, {
  namespace: "MyApp", // 命名空间
  isVue: true, // 挂载 $logger 到 Vue 实例，默认 true
  isProvide: false, // 同时 provide('$logger')，仅 Vue 3，默认 false
  enabled: true, // 是否启用插件，默认 true
  // 其余配置项与 ILogOptions 相同
  level: "debug",
  isRecord: import.meta.env.PROD, // 例：生产环境开启记录，配合弹窗下载
});

app.mount("#app");
```

### 组件中使用

```typescript
// Vue 3（Options API）
this.$logger.info("这是一条日志");

// Vue 3（Composition API）
import { getCurrentInstance, inject } from "vue";

const { proxy } = getCurrentInstance()!;
proxy.$logger.info("这是一条日志");

// isProvide: true 时（Vue 3）
const logger = inject("$logger");
logger.info("这是一条日志");

// Vue 2
this.$logger.info("这是一条日志");
```

### SSR 与时序说明

插件在 Node/SSR 环境下不会崩溃（`createLogger` 在服务端同步返回实例）。浏览器环境下 logger 初始化是异步的，插件会先注入占位代理：**实例就绪前**的 `$logger.xxx(...)` 调用会被暂存，就绪后自动回放（回放调用无返回值）；需要返回值的方法（如 `performance`）请在挂载完成后使用。

## Node.js 环境

```javascript
const { createLogger } = require("easy-log-plus");

const logger = createLogger("MyApp", {
  env: "dev",
  level: "debug",
  formatter: "[$time$] [$tracker$] [$level$]",
});

logger.info("Hello World");
logger.bold.underline.color("#00ff00").info("绿色加粗下划线");
logger.overline.dim().inverse.info("Node 专属样式");
```

与浏览器环境的差异：

- `createLogger` **同步返回** Logger 实例（不是 Promise）
- `image` / `performance` 不可用，访问时会在控制台警告一次
- 无配置弹窗、快捷键、IndexedDB 记录与配置持久化
- 相同命名空间不会复用实例，每次调用都会创建新的 Logger
- 额外支持 `overline` / `dim()` / `inverse` 样式

## 实例管理与销毁

```typescript
// 浏览器：相同命名空间复用同一实例（Node 环境每次创建新实例）
const a = await createLogger("MyApp");
const b = await createLogger("MyApp");
// a === b

// isGlobal: 挂载到 globalThis.logger
await createLogger("MyApp", { isGlobal: true });
logger.info("全局可用");

// 销毁实例：从顶层全局实例表移除并释放引用，
// 避免 iframe / 微前端场景下实例被顶层 window 持有导致无法回收
logger.destroy(); // 仅销毁实例
logger.destroy(true); // 销毁并清空已记录的日志与持久化配置
```

## TypeScript

```typescript
import { createLogger, LogLevel } from "easy-log-plus";
import type { ILogOptions, ILoggerConfig } from "easy-log-plus/types";

const options: ILogOptions = {
  level: LogLevel.Debug,
  isRecord: true,
};

const config: ILoggerConfig = {
  isEnableLog: true,
  level: LogLevel.Info,
  isRecordLog: true,
  isPersistentConfig: false,
  isSourceCodeLocation: false,
  language: "zh-CN",
};

createLogger("MyApp", options).then((logger) => {
  logger.setConfig(config);
  logger.info("typed!");
});
```

## License

Released under the MIT License. Copyright © 2025-present 秦佬湿
