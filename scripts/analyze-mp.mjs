import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const buildDir = fileURLToPath(new URL('../dist/build/mp-weixin/', import.meta.url))
const reportPath = fileURLToPath(new URL('../dist/analyze/mp-weixin-files.md', import.meta.url))

export async function createReport(outputDir, outputFile) {
  const appConfig = JSON.parse(await readFile(path.join(outputDir, 'app.json'), 'utf8'))
  const subpackageRoots = (appConfig.subPackages ?? appConfig.subpackages ?? [])
    .map(({ root }) => root.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
  const files = []

  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name)
      const relativePath = path.relative(outputDir, absolutePath).split(path.sep).join('/')
      if (
        subpackageRoots.some((root) => relativePath === root || relativePath.startsWith(`${root}/`))
      ) {
        continue
      }
      if (entry.isDirectory()) {
        await visit(absolutePath)
      } else if (entry.isFile()) {
        files.push({ path: relativePath, bytes: (await stat(absolutePath)).size })
      }
    }
  }

  await visit(outputDir)
  files.sort((a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path))
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0)
  const lines = [
    '# 微信小程序主包文件体积',
    '',
    `产物：\`dist/build/mp-weixin\`；主包 ${files.length} 个文件，共 ${totalBytes.toLocaleString()} 字节（${(totalBytes / 1024).toFixed(2)} KiB）。`,
    '',
    '按原始文件字节数降序排列。该清单用于定位文件，不等同于微信开发者工具的最终上传包大小。',
    '',
    '| 文件 | 字节 | KiB |',
    '| --- | ---: | ---: |',
    ...files.map(
      (file) =>
        `| \`${file.path.replaceAll('|', '\\|')}\` | ${file.bytes.toLocaleString()} | ${(file.bytes / 1024).toFixed(2)} |`,
    ),
    '',
  ]
  await mkdir(path.dirname(outputFile), { recursive: true })
  await writeFile(outputFile, lines.join('\n'), 'utf8')
  return { files, totalBytes }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { files, totalBytes } = await createReport(buildDir, reportPath)
  console.log(`主包体积报告：${reportPath}（${files.length} 个文件，${totalBytes} 字节）`)
}
