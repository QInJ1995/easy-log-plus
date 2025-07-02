import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import progress from 'vite-plugin-progress'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  build: {
    sourcemap: false, // 生成完整的 Sourcemap
    lib: {
      entry: 'src/index.ts',
      name: 'EasyLogPlus',
      formats: ['es', 'cjs', 'umd'], // 生成ESModule和CommonJS格式
      fileName: (format) => getFileName(format),
    },
    // 配置 Rollup 的选项，用于打包库
    rollupOptions: {
      // 配置外部依赖，不打包模块
      external: [],
      // 配置输出选项，指定全局变量名称
      output: {
        exports: 'named',
      },
    }
  },
  plugins: [
    // 显示构建进度条
    progress(),
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
