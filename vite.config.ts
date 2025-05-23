import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// const aaa = require('./dist/easy-log-plus.umd.js')
// console.log("🚀 ~ aaa:", aaa)

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
    },
    rollupOptions: {
      external: [],
      output: [
        {
          format: 'es',
          dir: 'dist',
          entryFileNames: 'easy-log-plus', // 输出文件名
          preserveModules: false, // 将每个入口文件打包成单独的文件
          preserveModulesRoot: 'src', // 将每个入口文件打包成单独的文件
        },
        {
          format: 'umd',
          dir: 'dist',
          entryFileNames: 'easy-log-plus.umd.js', // 输出文件名
          name: 'EasyLogPlus', // 输出文件名
          exports: 'named', // 输出文件名
          extend: true // 扩展全局变量
        },
      ]
    }
  },
  plugins: [dts({
    insertTypesEntry: true, // 自动插入 types 字段到 package.json
    outDir: 'dist' // 输出目录
  })]
}) 