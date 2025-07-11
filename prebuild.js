import { readFile, writeFile } from 'fs/promises';

// 读取 package.json 文件
const packagePath = new URL('./package.json', import.meta.url);
// 读取 package.json 文件内容
const { version } = JSON.parse(await readFile(packagePath, 'utf8'));
// 构建信息
const now = new Date();
const buildTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
const buildInfo = {
  version,
  buildTime,
}
// 写入构建信息文件
writeFile('./build-info.json', JSON.stringify(buildInfo, null, 2), 'utf8');
console.log('当前构建信息已写入 build-info.json 文件', buildInfo);