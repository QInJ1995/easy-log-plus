// 引入 cli-color 模块以支持命令行颜色输出
const colorizer = require('cli-color');

// 定义一系列颜色代码，用于后续的日志颜色配置
var colorCodes = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 226, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];

// 存储所有命名空间的数组
let allNamespaces = [];
// 根据环境变量 DEBUG 初始化启用的命名空间数组
let enabledNamespaces = process.env.DEBUG ? process.env.DEBUG.split(/[\s,]+/) : [];
// 存储最长命名空间长度的变量，用于对齐日志输出
let longestNamespaceLength = 0;

/**
 * 创建一个日志记录器
 * @param {string} namespace - 日志记录器的命名空间
 * @param {object} options - 配置选项，包括颜色代码、是否包含函数名、文件名和行号
 * @returns {function} - 返回一个配置好的日志记录函数
 */
function createLogger(namespace = '', { colorCode, includeFunction, includeFile, includeLineNumber } = {}) {
    // 初始化日志记录器的属性
    logger.colorCode = colorCode ? colorCodes[colorCodes.indexOf(colorCode)] : colorCodes[pickColor(namespace)];
    logger.includeFunction = includeFunction === undefined ? true : includeFunction;
    logger.includeFile = includeFile === undefined ? true : includeFile;
    logger.includeLineNumber = includeLineNumber === undefined ? true : includeLineNumber;
    logger.namespace = namespace;

    // 将新的命名空间添加到所有命名空间的数组中
    allNamespaces.push(logger.namespace);

    // 更新最长命名空间长度
    if (logger.namespace.length > longestNamespaceLength) {
        longestNamespaceLength = logger.namespace.length;
    }

    /**
     * 日志记录函数
     * @param {any} data - 要记录的日志数据
     */
    function logger(data = '') {
        // 检查命名空间是否启用
        if (namespace === '' || namespaceEnabled(namespace)) {
            // 获取并应用颜色设置
            const color = colorizer.xterm(logger.colorCode)
                , fileName = logger.includeFile ? theFileName() : ''
                , functionName = logger.includeFunction ? theFunctionName() : ''
                , lineNumber = logger.includeLineNumber ? theLineNumber() : ''
                , logTraceBar = logger.includeFile || logger.includeFunction || logger.includeLineNumber ? ' |' : ''
                , logTrace = `${logTraceBar}${functionName}${fileName}${lineNumber}`
                , useArrow = data === '' ? '' : ' -> '
                , totalPrefix = namespace.toString().padStart(longestNamespaceLength, ' ') + logTrace + useArrow;
            // 输出日志
            console.log(color(totalPrefix + `${data}`));
        }
    }

    /**
     * 启用当前命名空间的日志记录
     */
    logger.enable = function () {
        // 不能禁用默认命名空间
        if (this.namespace === '') {
            console.log(colorizer.bgYellowBright.black("You cannot turn off the default logger with the '' namespace"));
            return
        }
        // 启用命名空间
        if (!enabledNamespaces.includes(this.namespace)) {
            enabledNamespaces.push(this.namespace);
        }
    }

    /**
     * 禁用当前命名空间的日志记录
     */
    logger.disable = function () {
        // 不能禁用默认命名空间
        if (this.namespace === '') {
            console.log(colorizer.bgXterm(226).xterm(20)("You cannot turn off the default logger with the '' namespace"));
            return
        }
        // 禁用命名空间
        enabledNamespaces.splice(enabledNamespaces.indexOf(this.namespace), 1);
    }

    // 返回配置好的日志记录函数
    return logger;
}

/**
 * 检查命名空间是否启用
 * @param {string} namespace - 要检查的命名空间
 * @returns {boolean} - 返回命名空间是否启用
 */
function namespaceEnabled(namespace) {
    // 检查命名空间是否在启用的列表中
    if (enabledNamespaces.includes(namespace)) {
        return true;
    }
    let enabled = false;
    enabledNamespaces.forEach(en => {
        // 处理启用和禁用命名空间的模式匹配
        if (en[0] === "-") {
            if (en.substr(1, en.length - 1) === namespace) {
                enabled = false;
            } else if (en[en.length - 1] === "*") {
                enBase = en.substr(1, en.length - 3);
                if (namespace.length > enBase.length) {
                    if (namespace.substr(0, enBase.length) === enBase) {
                        enabled = false;
                    }
                }
            }
        } else if (en[en.length - 1] === "*") {
            enBase = en.substr(0, en.length - 3);
            if (namespace.length > enBase.length) {
                if (namespace.substr(0, enBase.length) === enBase) {
                    enabled = true;
                }
            }
        }
    })
    return enabled;
}

/**
 * 选择颜色代码
 * @param {string} namespace - 基于命名空间选择颜色
 * @returns {number} - 返回颜色代码
 */
function pickColor(namespace) {
    // 根据命名空间的字符编码计算颜色代码
    return [...namespace].reduce((valTotal, char) => valTotal + char.charCodeAt(0), 0) % colorCodes.length;
}

/**
 * 获取当前文件名
 * @returns {string} - 返回当前文件名
 */
function theFileName() {
    // 获取调用栈信息中的文件名
    const filePath = currentStack[2].getFileName();
    const filePathArray = filePath.split('/');
    const simpleFileName = filePathArray[filePathArray.length - 1];
    return ' ' + simpleFileName;
}

/**
 * 获取当前函数名
 * @returns {string} - 返回当前函数名
 */
function theFunctionName() {
    // 获取调用栈信息中的函数名
    return currentStack[2].getFunctionName() ? ' ' + currentStack[2].getFunctionName() + '()' : ' Top Level';
}

/**
 * 获取当前行号
 * @returns {string} - 返回当前行号
 */
function theLineNumber() {
    // 获取调用栈信息中的行号
    return ':' + currentStack[2].getLineNumber();
}

// 定义全局变量 currentStack 以获取当前调用栈信息
Object.defineProperty(global, 'currentStack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

// 导出 createLogger 函数以供外部使用
module.exports = createLogger;