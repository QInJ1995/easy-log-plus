import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import progress from 'vite-plugin-progress'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  // 服务器配置
  server: {
    port: 3000, // 可选，指定端口
    strictPort: true, // 可选，如果端口被占用则退出
    // open: '/test/test.html' // 启动时自动打开测试页面（确保路径正确）
  },
  // 仅在开发时显式指定入口（避免影响构建）
  build: {
    // 生成完整的 Sourcemap 文件
    sourcemap: false,
    // 指定输出目录
    lib: {
      entry: 'src/index.ts', // 入口文件
      name: 'EasyLogPlus', // 全局变量名称
      formats: ['es', 'cjs', 'umd'], // 生成ESModule、CommonJS、UMD
      fileName: (format) => getFileName(format), // 文件名
    },
    // 配置 Rollup 的选项，用于打包库
    rollupOptions: {
      input: 'src/index.ts', // 入口文件
      output: {
        exports: 'named' // 设置导出类型为命名导出
      },
      external: [], // 忽略的依赖项
    }
  },
  // 配置插件
  plugins: [
    progress(), // 进度条
    // 生成类型声明文件
    dts({
      insertTypesEntry: true, // 自动插入 types 字段到 package.json
      outDir: 'dist' // 输出目录 

    }),
    // 生成库的依赖关系图
    visualizer({
      filename: 'analysis.html', // 输出文件名
      open: false, // 是否自动打开浏览器
    }),
    // 构建完成回调
    {
      name: 'build-complete',
      async closeBundle() {
        showLog()
      }
    }
  ]
})


const showLog = (): void => {
  console.log(
    ' .+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+. ' + '\n' +
    '(      _____                  _                  ____  _                  )' + '\n' +
    ' )    | ____|__ _ ___ _   _  | |    ___   __ _  |  _ \\| |_   _ ___       ( ' + '\n' +
    '(     |  _| / _` / __| | | | | |   / _ \\ / _` | | |_) | | | | / __|       )' + '\n' +
    ' )    | |__| (_| \\__ \\ |_| | | |__| (_) | (_| | |  __/| | |_| \\__ \\      ( ' + '\n' +
    '(     |_____\\__,_|___/\\__, | |_____\\___/ \\__, | |_|   |_|\\__,_|___/       )' + '\n' +
    ' )                    |___/              |___/                           ( ' + '\n' +
    '(                                                                         )' + '\n' +
    ' "+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+" ' + '\n'
  );
}

// 定义格式到文件后缀的映射关系
const formatToExtensionMap: Record<string, string> = {
  es: 'mjs',
  cjs: 'cjs',
  umd: 'umd.js',
};

// 获取文件名的函数（可复用、可扩展）
const getFileName = (format: string): string => {
  const ext = formatToExtensionMap[format] || 'js'; // 默认 fallback 到 js
  return `easy-log-plus.${ext}`;
};
