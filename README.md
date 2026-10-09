# vue-uniapp-template

一个可以直接运行、构建并继续开发业务的 **uni-app 单应用模板**。使用 Vue 3、TypeScript、Wot UI v2、Tailwind CSS 和 Zustand，预置跨端 Mock、单元测试与提交检查。

源码位于根目录 `src/`，全部命令在项目根目录执行。没有 Monorepo、Turborepo 或子包。

## 1. 5 分钟跑起来

最快可先运行 H5：安装 [Node.js 24.21.0](https://nodejs.org/)，然后执行：

```bash
git clone https://github.com/Dongyifengs/vue-uniapp-template.git
cd vue-uniapp-template
npm install -g pnpm@12.10.1
pnpm install
pnpm dev:h5
```

浏览器打开终端显示的地址（默认 **http://127.0.0.1:5173**）。预期看到模板首页；点击「打开功能示例」，再点击「加载数据」，会通过默认 Mock 显示三条示例数据，无需后端。

| 端         | 启动命令             | 查看方式                                              |
| ---------- | -------------------- | ----------------------------------------------------- |
| H5         | `pnpm dev:h5`        | 打开终端显示的浏览器地址                              |
| 微信小程序 | `pnpm dev:mp-weixin` | 微信开发者工具导入项目根目录下的 `dist/dev/mp-weixin` |
| App 资源   | `pnpm dev:app`       | HBuilderX 导入整个项目根目录，再运行到手机或模拟器    |

### 环境要求

- Node.js：推荐 **24.21.0**，要求 `^24.11.0`；版本记录在 `.nvmrc`。
- 包管理器：只使用 **pnpm 12.10.1**；`package.json` 的 `packageManager` 和 `engines` 已固定版本。运行 `node --version`、`pnpm --version` 核对。
- 微信开发者工具：用于查看、调试和上传微信小程序。
- HBuilderX：用于 App 真机运行和 APK/IPA 打包，建议使用与当前 uni-app 编译器对应的稳定版本。

如果使用 nvm，可按 `.nvmrc` 安装并切换 Node。`pnpm` 出现 `shim integrity check failed` 时，修复或重新安装本机包管理器；也可使用 `npx pnpm@12.10.1 install` 临时运行指定版本。

### 微信小程序

```bash
pnpm dev:mp-weixin
# 等价的默认入口：pnpm dev
```

保持终端运行，在微信开发者工具导入 **`dist/dev/mp-weixin`**。修改源码后会重新编译。

`src/manifest.json` 的 `mp-weixin.appid` 初始为 `touristappid`，用于本地游客模式。正式调试、真机预览、平台能力和上传请改为自己的微信小程序 AppID，再重新构建。部分开发者工具自动化接口要求有效 AppID，不接受游客模式。

小程序每次冷启动由微信检查新版本。新版本下载完成后会显示不可取消的提示，点击「立即重启」后应用更新；下载失败时会提示检查网络并重新打开小程序。此逻辑仅在微信小程序中启用，不影响 H5 和 App。可在微信开发者工具的编译模式中勾选「下次编译时模拟更新」验证成功与失败场景；开发版和体验版不能验证真实的版本更新分发。

### H5

```bash
pnpm dev:h5
```

浏览器访问终端显示的地址，默认 **http://127.0.0.1:5173**。首页的「打开功能示例」可以体验组件、共享计数器、Tailwind 布局和 Mock 请求。

默认端口已占用时，使用 `pnpm dev:h5 --port 5174` 指定其他端口。

### App

```bash
pnpm dev:app
```

命令生成并监听 `dist/dev/app` 中的 App 资源，终端本身不会启动手机基座。使用 HBuilderX 导入整个项目根目录，再通过「运行 → 运行到手机或模拟器」完成真机运行。

### 常见启动问题

| 现象                                | 检查方法                                                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Unsupported engine` 或依赖安装失败 | 对照 `.nvmrc` 切换到 Node 24.21.0，确认 pnpm 为 12.10.1，再运行 `pnpm install`。                                                        |
| `shim integrity check failed`       | 修复本机 pnpm shim，或先用 `npx pnpm@12.10.1 install` 安装依赖。                                                                        |
| H5 端口 5173 已占用                 | 执行 `pnpm dev:h5 --port 5174`，打开终端实际显示的地址。                                                                                |
| H5 接口未走代理                     | 确认 `.env.development.local` 设置 `VITE_API_BASE_URL=/api`、`VITE_USE_MOCK=false` 与有效的 `VITE_PROXY_TARGET`，修改后重启开发服务器。 |
| 小程序无法导入或缺少平台能力        | 先等 `dist/dev/mp-weixin` 生成；游客模式仅供本地体验，平台能力和真机预览需在 `src/manifest.json` 配置自己的 AppID。                     |
| `pnpm dev:app` 未弹出手机应用       | 此命令只生成 App 资源；仍需在 HBuilderX 中运行到手机或模拟器。                                                                          |

## 2. 常用命令与导出

| 命令                                | 用途                       | 默认产物               |
| ----------------------------------- | -------------------------- | ---------------------- |
| `pnpm dev` / `pnpm dev:mp-weixin`   | 微信小程序开发监听         | `dist/dev/mp-weixin`   |
| `pnpm dev:h5`                       | H5 开发服务器              | 开发服务器             |
| `pnpm dev:app`                      | App 资源开发监听           | `dist/dev/app`         |
| `pnpm build:mp-weixin`              | 微信小程序生产构建         | `dist/build/mp-weixin` |
| `pnpm build:h5`                     | H5 生产构建                | `dist/build/h5`        |
| `pnpm build:app`                    | App 生产资源构建           | `dist/build/app`       |
| `pnpm build`                        | 顺序构建上述三个目标       | 对应平台目录           |
| `pnpm analyze`                      | 微信小程序主包体积分析     | `dist/analyze/`        |
| `pnpm lint` / `pnpm lint:fix`       | ESLint 检查 / 自动修复     | —                      |
| `pnpm format` / `pnpm format:check` | Prettier 格式化 / 格式检查 | —                      |
| `pnpm type-check`                   | 检查应用、配置与测试类型   | —                      |
| `pnpm test` / `pnpm test:watch`     | 单次测试 / 监听测试        | —                      |
| `pnpm test:coverage`                | 测试覆盖率                 | `coverage/index.html`  |
| `pnpm check`                        | Lint、格式、类型和单元测试 | —                      |

### 小程序主包体积分析

执行 `pnpm analyze` 会构建微信小程序，并生成两个本地报告：`dist/analyze/mp-weixin.html` 显示 JS 模块占用，`dist/analyze/mp-weixin-files.md` 按字节数列出主包内所有文件（不含 `app.json` 声明的分包）。先用文件清单找出最大的 JS、模板、样式或资源文件，再用 HTML 图表追查 JS 依赖。清单是原始产物大小，最终上传包大小以微信开发者工具为准。普通 `pnpm build` 不生成报告，报告本身也不会进入小程序包。

### 微信小程序发行

1. 在 `src/manifest.json` 的 `mp-weixin.appid` 填入自己的 AppID。
2. 执行 `pnpm build:mp-weixin`。
3. 微信开发者工具导入 `dist/build/mp-weixin`，确认页面和平台能力。
4. 配置公众平台合法请求域名后，通过开发者工具预览、上传。

构建命令只生成产物，不会自动上传或发布。需要忽略域名校验时，在开发者工具的本机项目设置中调整，正式发布仍须配置合法 HTTPS 域名。

### H5 发行

执行 `pnpm build:h5`，将 `dist/build/h5` 部署到静态站点服务。默认使用 hash 路由。部署到子路径时，在 `vite.config.ts` 设置对应的 `base`，重新构建并检查资源地址。

### App 发行与 HBuilderX

1. HBuilderX 选择「文件 → 导入 → 从本地目录导入」，导入整个项目根目录；先在根目录运行 `pnpm install`。
2. 在 `src/manifest.json` 填写 **DCloud AppID**（顶层 `appid`），配置应用名称、版本、图标、权限和 Android/iOS 包信息。
3. `pnpm build:app` 可验证并生成 App 资源；也可按编译器提示将生成的 `dist/build/app` 导入 HBuilderX 运行。
4. 通过 HBuilderX 的「发行 → 原生 App」进行云打包或本地打包，按要求提供 Android 签名证书或 iOS 证书及描述文件。

`build:app` 成功表示 **App 资源编译成功**，不代表生成了 APK/IPA。原生安装包、真机能力和商店发布需要自己的 AppID、证书及对应平台环境。

不要只把 `src` 导入 HBuilderX：这样会切换到 HBuilderX 内置编译器，绕开本模板锁定的项目依赖。

## 3. 目录职责

```text
vue-uniapp-template/
├── src/
│   ├── api/                         # 业务接口，demo.ts 为示例
│   ├── assets/                      # 经 import 参与构建的资源
│   ├── components/demo-section/     # easycom 公共组件
│   ├── composables/                 # useStore、useRequest
│   ├── config/env.ts                # 接口地址与 Mock 开关
│   ├── constants/                   # 常量与首页介绍
│   ├── mock/                        # 模拟路由和数据
│   ├── pages/index/                 # 首页
│   ├── pages/examples/              # 基础功能示例
│   ├── static/                      # 原样复制到产物的资源
│   ├── stores/                      # Zustand vanilla Store
│   ├── styles/                      # Tailwind 与全局 CSS
│   ├── types/                       # 接口、环境、组件等类型
│   ├── utils/                       # 请求、错误和格式化工具
│   ├── App.vue                      # 生命周期、全局样式入口
│   ├── main.ts                      # Vue 应用入口
│   ├── manifest.json                # 应用及平台配置
│   ├── pages.json                   # 页面注册、easycom、导航配置
│   └── uni.scss                     # 全局 SCSS 变量
├── test/unit/                       # 单元测试
├── test/mocks/                      # 单元测试用 uni API 替身
├── test/setup.ts                    # 测试隔离与环境初始化
├── scripts/analyze-mp.mjs           # 小程序主包文件体积清单
├── .husky/pre-commit                # 暂存文件提交检查
├── .env.example                     # 本地环境配置示例
├── .env.development                 # 开发默认配置
├── .env.production                  # 生产默认配置
├── package.json                     # 单应用依赖与全部命令
├── pnpm-workspace.yaml              # pnpm 12 安装策略；仅根应用
├── pnpm-lock.yaml                   # 可复现依赖锁文件
├── vite.config.ts                   # uni-app + Tailwind 构建
├── vitest.config.ts                 # 独立的单元测试配置
├── tsconfig.json                    # 应用类型检查
├── tsconfig.node.json               # 配置与测试类型检查
├── eslint.config.mjs                # Vue + TypeScript ESLint
└── prettier.config.mjs              # 格式规则
```

空资源目录使用 `.gitkeep` 保留。`dist`、`node_modules`、`coverage`、本机环境配置和工具缓存不提交。

**为什么单应用仍有 `pnpm-workspace.yaml`？** pnpm 12 已不再读取 `package.json#pnpm` 中的依赖覆盖和构建脚本策略。本文件仅配置统一 Vite 版本、严格环境检查和允许的依赖安装脚本；`packages: []` 表示没有子工作区，不是 Monorepo。

## 4. 开始业务开发

### 新增页面

创建 `src/pages/profile/index.vue`，使用 `<script setup lang="ts">`，在 `src/pages.json` 的 `pages` 数组加入 `{"path":"pages/profile/index"}`。通过原生 uni-app 路由导航：

```ts
uni.navigateTo({ url: '/pages/profile/index' })
```

小程序/App 页面使用 `view`、`text` 等 uni-app 标签。平台专有 API 使用 `#ifdef MP-WEIXIN` 等条件编译；保持通用业务逻辑可以在多端运行。

### 新增组件与 Wot UI v2

公共组件按 `src/components/my-card/my-card.vue` 命名，在页面使用 `<my-card />` 即可自动引入。若组件使用全局 Tailwind 类，参考 `demo-section` 设置 `styleIsolation: 'shared'`。

Wot 已配置 easycom：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^wd-(.*)": "@wot-ui/ui/components/wd-$1/wd-$1.vue"
    }
  }
}
```

在页面直接使用 `<wd-button>`、`<wd-tag>` 等组件，无需手动注册。v2 使用 `@wot-ui/ui` 包名；按钮变体使用 `variant="plain"` 等新版 API。

反馈 hook 要在 `setup` 内调用，且同一页面要声明挂载组件：

```vue
<script setup lang="ts">
import { useToast } from '@wot-ui/ui'

const toast = useToast()
</script>

<template>
  <wd-button @click="toast.success('保存成功')">保存</wd-button>
  <wd-toast />
</template>
```

Wot 全局组件类型已引入；自己的 easycom 组件类型可补充到 `src/types/components.d.ts`。主题优先使用组件库 CSS 变量或 `wd-config-provider`。

### Tailwind 样式

样式入口为 `src/styles/tailwind.css`，由 `App.vue` 引入。weapp-tailwindcss v5 负责生成 Tailwind 4 样式、小程序类名适配及单位转换，H5/App WebView 自动切换 Web 输出。

```vue
<view class="flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-blue-600">
  <text>原子化样式</text>
</view>
```

使用完整的类名，例如条件切换 `active ? 'bg-blue-500' : 'bg-slate-100'`，避免 `bg-${color}-500` 形式的字符串拼接。新增存放类名的源码目录时，在入口 CSS 中补充 `@source`；不要扫描依赖、生成产物和 `uni_modules`。

不要另行注册 `@tailwindcss/vite` / `@tailwindcss/postcss`，也不需要旧版 `weapp-tw patch`。Tailwind 入口保持 `.css`，不要放入 SCSS 的 `@use` 流程。

### Zustand 状态

Store 放在 `src/stores`，从 `zustand/vanilla` 导入 `createStore`。Vue 页面通过适配函数订阅：

```ts
import { useStore } from '@/composables/useStore'
import { counterStore } from '@/stores/counter'

const count = useStore(counterStore, (state) => state.count)
counterStore.getState().increment()
```

`useStore` 要在 `setup` 或 `effectScope` 内调用，返回只读 ref，在作用域销毁时自动取消订阅。selector 优先返回具体字段；创建新的对象或数组会改变引用，从而触发更新。

状态通过 action 更新。计数器只在当前应用进程中共享，刷新后恢复初始值；持久化可按业务需要通过 `uni.getStorageSync` / `uni.setStorageSync` 实现。不要导入 Zustand 的 React hook 入口。

### 接口与加载状态

在 `src/api` 定义业务接口，在 `src/types` 定义响应类型：

```ts
import { request } from '@/utils/request'

interface Profile {
  id: number
  name: string
}

export function getProfile() {
  return request<Profile>({ url: '/profile', method: 'GET' })
}
```

`request<T>` 返回 `uni.request` 响应的 **`data` 字段原样内容**，不会自动剥离业务包装层。支持 `method`、`data`、`header`、`timeout` 等原生请求参数，默认超时 10 秒；完整 HTTP(S) URL 可直接调用，相对地址与 `VITE_API_BASE_URL` 拼接。H5 开发态可用 `/api` 基址接入同源代理，其他情况需要完整 HTTP(S) 基址。

`RequestError` 包含 `code`（`CONFIG`、`HTTP`、`NETWORK`、`TIMEOUT`）和可选 `statusCode`。HTTP 非 2xx、网络失败、超时与缺失地址均会抛出错误。

```ts
import { useRequest } from '@/composables/useRequest'
import { getDemoItems } from '@/api/demo'

const { data, loading, error, execute } = useRequest(getDemoItems)

async function load() {
  try {
    await execute()
  } catch {
    // error.value 已记录错误；在页面处理提示，避免未处理的 Promise。
  }
}
```

`useRequest` 不自动发请求。多次执行时，只有最新请求能写入显示状态，旧请求仍返回自己的结果；作用域销毁后忽略未完成请求的状态更新。

## 5. 环境配置与 Mock

开发时把 `.env.example` 复制为 `.env.development.local`，填写接口地址；该文件会覆盖仓库里的 `.env.development` 默认值：

```dotenv
VITE_API_BASE_URL=https://api.example.com
VITE_USE_MOCK=false
```

H5 开发需要绕开后端跨域限制时，可在 `.env.development.local` 改用同源代理：

```dotenv
VITE_API_BASE_URL=/api
VITE_USE_MOCK=false
VITE_PROXY_TARGET=http://127.0.0.1:3000
```

浏览器请求 `/api/demo/items` 时，Vite 会将相同路径转发到 `VITE_PROXY_TARGET`。后端需要提供带 `/api` 前缀的路由；端口 3000 只是示例，请换成自己的本地或远端后端地址。代理只用于 H5 开发服务器，小程序和 App 请求仍需完整的 HTTP(S) 接口地址及对应平台配置。

环境文件修改后重启开发命令。`.env.development.local` 不提交；`VITE_*` 会进入客户端产物，不能用于保存密钥。

- 开发默认：`VITE_USE_MOCK=true`，示例无需后端。
- 生产默认：关闭 Mock，并在构建期移除 Mock 模块和数据；即使设置 `VITE_USE_MOCK=true`，生产构建也不会启用 Mock。
- 生产地址可通过 `.env.production.local` 或构建环境变量配置。
- Mock 开启时，所有 `request()` 都由本地 Mock 处理，未定义的路由返回 404，不会偷偷转发到真实服务器。

示例路由位于 `src/mock/index.ts`：

| 请求              | 行为                          |
| ----------------- | ----------------------------- |
| `GET /demo/items` | 延迟约 400ms 返回三条模拟数据 |
| `GET /demo/error` | 模拟 HTTP 500 错误            |
| 未定义的请求      | 返回 Mock 404 错误            |

新增业务接口时，在此文件添加匹配路由，在 `src/mock/data.ts` 或新的数据文件添加响应。示例页的「模拟失败」按钮调用 `/demo/error`；关闭 Mock 后，应由实际后端提供该演示接口，或删除此演示按钮。

## 6. 测试与提交检查

```bash
pnpm check
pnpm test:coverage
```

测试位于 `test/unit`，以 `.test.ts` 或 `.test.js` 命名。已有测试覆盖计数器实例隔离、Vue 订阅与清理、异步请求状态与旧请求覆盖、HTTP/网络/超时错误、Mock 与生产开关、主包文件排除，以及日期格式化。

`test/mocks/uni.ts` 提供 `uni.request` 替身，`test/setup.ts` 在每个测试之间重置请求、环境变量和全局对象。单元测试不依赖微信开发者工具；平台能力仍需在对应平台验证。

`vitest.config.ts` 是独立测试配置，不加载 uni-app 的编译插件。新增 uni API 使用时，补充测试替身，避免把浏览器或微信运行环境假定为 Node 测试环境。

安装时 `prepare` 初始化 Husky，Git 提交前 lint-staged 检查并格式化暂存的代码、样式和文档。全量检查运行 `pnpm check`；建议提交前再运行 `pnpm build`。CI 使用：

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

推荐提交信息示例：`feat(pages): 添加个人资料页`、`fix(request): 修复接口超时处理`。

### CI 与自动 Release

`.github/workflows/ci.yml` 在各分支 push 和面向 `main` 的 PR 创建、更新或重新打开时运行：

1. 使用 `.nvmrc` 中的 Node.js 和 `package.json#packageManager` 中的 pnpm，按锁文件安装依赖。
2. 执行 `pnpm check` 与 `pnpm build`，验证微信小程序、H5 和 App 资源。
3. 打包 H5 与微信小程序，保存到该次 Actions 运行的 `release-assets` 附件，保留 14 天；开发分支和 PR 可从这里下载验证。
4. 仅当 push 更新 `main` 且上述检查、构建均成功时，发布正式 [GitHub Release](https://github.com/Dongyifengs/vue-uniapp-template/releases)。PR 合并通过这一次 `main` push 发布，不重复发版。

本地 `git commit` 后需执行 `git push` 才能触发 CI。关闭但未合并的 PR 不发布；开发分支和未合并 PR 只验证并保存构建产物。合并与直接 push 均以触发 CI 的实际提交构建，不取任务开始后的最新分支内容。

Release 标签格式为 `build-<Actions运行序号>-<提交短SHA>`，每次 `main` push 生成独立版本，不自动修改应用版本号。重跑同一次任务复用标签、更新附件和说明。发布先创建草稿，附件上传成功后转为正式 Release。

| 下载文件         | 内容与使用方式                                                        |
| ---------------- | --------------------------------------------------------------------- |
| `h5.zip`         | H5 生产文件，解压后部署到静态站点服务                                 |
| `mp-weixin.zip`  | 微信小程序生产文件，解压后将目录导入微信开发者工具                    |
| `SHA256SUMS.txt` | 两个 ZIP 的 SHA-256 校验值，可运行 `sha256sum -c SHA256SUMS.txt` 校验 |

更新说明自动列出本次 push 的提交标题、提交链接、关联的已合并 PR 地址及 Actions 运行链接；覆盖普通合并、squash 和 rebase。直接 push 没有关联 PR 时会明确标注。提交标题和 PR 标题应写明用户可理解的更新内容。

构建 job 只有仓库读取权限；Release job 仅在 `main` push 时取得 `contents: write` 与 `pull-requests: read`，使用 GitHub 自动提供的 `GITHUB_TOKEN`，无需额外配置发布密钥。若组织策略禁止写入，需由仓库管理员允许 Actions 发布 Release。

构建包沿用仓库中的 `src/manifest.json` 与生产环境配置；正式使用前应配置自己的 AppID 和 API 地址。该流程发布下载包，不自动部署 H5、上传微信公众平台或生成 APK/IPA。

## 7. 版本兼容与升级

本模板在 **2026-10-08** 核对 npm 最新稳定版本，并优先服从 uni-app 编译链和各库声明的兼容范围。直接依赖精确锁定，完整依赖树记录在 `pnpm-lock.yaml`。

| 技术                      | 使用版本                      | 选择原因                                                        |
| ------------------------- | ----------------------------- | --------------------------------------------------------------- |
| uni-app Vue 3 编译相关包  | `3.0.0-5020620260917001`      | 当前稳定 Vue 3 系列，相关包同版                                 |
| Vue                       | `3.4.21`                      | 匹配 uni-app 内置编译/渲染包及 server-renderer 的精确 peer 约束 |
| Vite                      | `5.2.8`                       | uni-app 的精确 peer 约束                                        |
| TypeScript                | `6.0.3`                       | 当前 ESLint TypeScript 插件支持 `<6.1.0`，暂不使用 TS 7         |
| Wot UI                    | `@wot-ui/ui@2.3.2`            | 最新稳定 v2 包，替代 `wot-design-uni`                           |
| Sass                      | `1.105.1`                     | 最新稳定版，满足 Wot v2 的现代 SCSS 要求                        |
| Tailwind CSS              | `4.3.3`                       | 最新稳定版                                                      |
| weapp-tailwindcss         | `5.5.12`                      | 最新稳定版，支持 Vite 5 与 Tailwind 4                           |
| Zustand                   | `5.0.15`                      | 最新稳定版，只使用 vanilla 入口                                 |
| Vitest / coverage-v8      | `3.2.7`                       | 最新仍支持 Vite 5 的稳定版本，覆盖率包保持同版                  |
| pnpm                      | `12.10.1`                     | 最新稳定版，使用新的安装配置格式                                |
| ESLint / Prettier / Husky | `10.12.0` / `3.9.9` / `9.1.7` | 最新稳定版                                                      |
| @dcloudio/types           | `3.4.31`                      | 满足 uni-app 的精确 peer 约束                                   |
| miniprogram-api-typings   | `5.2.3`                       | 微信原生 API 类型，供 Wot 源码和平台扩展使用                    |
| rollup-plugin-visualizer  | `7.1.1`                       | 分析小程序构建的 JS 模块体积                                    |
| cross-env                 | `10.1.0`                      | 跨平台开启 `pnpm analyze` 的分析开关                            |

不要对整个项目直接执行 `pnpm update --latest`：uni-app 的 npm `latest` 标签不一定对应 Vue 3 编译系列，也不能独立升级 Vite、Vue 或某一个 `@dcloudio/*` 编译包。

升级步骤：

1. 确认新的 uni-app **稳定 Vue 3 系列**及其编译器要求，统一升级编译相关包。
2. 依据新编译器约束更新 Vue、Vite，以及 `pnpm-workspace.yaml` 中的 Vite 约束。
3. 检查 TypeScript/ESLint、Vitest/覆盖率、Tailwind/weapp-tailwindcss 的兼容范围，更新可兼容的最新稳定版本。
4. 执行 `pnpm install`、`pnpm peers check`、`pnpm check`、`pnpm build`，再验证开发页面和平台运行效果。
5. 提交更新后的依赖、配置及锁文件。其他小程序平台按需求添加对应同版本 uni-app 平台包和脚本。

当前 Vite 5.2.8 使用 Sass 的旧 JS API，构建时可能出现 `legacy-js-api` 弃用提示；它来自上游构建器，不影响当前 Sass 1.x 的编译结果。升级到支持现代 Sass API 的 uni-app/Vite 编译链后再移除该限制。

### 模板验证记录（2026-10-08）

- 首次安装、`pnpm install --frozen-lockfile` 和 `pnpm peers check` 通过。
- `pnpm check` 通过，包含 Lint、格式、应用与测试类型检查，以及 5 个测试文件中的 21 个单元测试。
- `pnpm test:coverage` 通过；所选组合式函数、Store 与工具模块的语句/行覆盖率为 100%，分支覆盖率为 93.61%。
- `pnpm build` 的微信小程序、H5、App 资源构建通过；生产产物包含 Wot 组件与 Tailwind 样式，未包含 Mock 路由实现及模拟数据。
- H5 已验证页面跳转、计数器更新与跨页同步、Mock 成功/失败反馈，浏览器未记录运行错误。
- 微信开发者工具已验证首页和示例页的组件、样式正常显示；验证使用接口测试号，仅修改忽略的开发产物，源码仍保留 AppID 占位配置。

以上不包含 App 真机运行或 APK/IPA 打包，也未执行任何平台上传或发布。

## 8. 官方资料

- [uni-app CLI 与 HBuilderX](https://uniapp.dcloud.net.cn/quickstart-cli.html)
- [uni-app Vue 3 官方模板](https://github.com/dcloudio/uni-preset-vue/tree/vite-ts)
- [Wot UI v2 快速上手](https://v2.wot-ui.cn/guide/quick-use.html)
- [Wot UI v1 → v2 变化](https://wot-ui.cn/guide/migration-v2.html)
- [weapp-tailwindcss uni-app 接入](https://tw.weapp.dev/docs/quick-start/frameworks/uni-app-vite)
- [Zustand vanilla Store](https://zustand.docs.pmnd.rs/reference/apis/create-store)
- [Vitest 3 文档](https://v3.vitest.dev/guide/)
- [pnpm 安装配置](https://pnpm.io/settings)
