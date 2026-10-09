import { afterEach, expect, it } from 'vitest'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createReport } from '../../scripts/analyze-mp.mjs'

let fixtureDir

afterEach(async () => {
  if (fixtureDir && path.dirname(fixtureDir) === path.resolve(tmpdir())) {
    await rm(fixtureDir, { recursive: true, force: true })
  }
  fixtureDir = undefined
})

it('主包清单包含所有文件并排除 app.json 声明的分包', async () => {
  fixtureDir = await mkdtemp(path.join(tmpdir(), 'vue-uniapp-analyze-'))
  const buildDir = path.join(fixtureDir, 'build')
  const reportPath = path.join(fixtureDir, 'report.md')
  const appConfig = JSON.stringify({ subPackages: [{ root: 'features' }] })
  await mkdir(path.join(buildDir, 'features'), { recursive: true })
  await writeFile(path.join(buildDir, 'app.json'), appConfig)
  await writeFile(path.join(buildDir, 'app.js'), 'abc')
  await writeFile(path.join(buildDir, 'features', 'page.js'), 'subpackage')

  const { files, totalBytes } = await createReport(buildDir, reportPath)
  expect(files.map((file) => file.path)).toEqual(['app.json', 'app.js'])
  expect(totalBytes).toBe(Buffer.byteLength(appConfig) + 3)
  expect(await readFile(reportPath, 'utf8')).not.toContain('features/page.js')
})
