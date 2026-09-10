# Web 演示部署与关联

本仓库通过 GitHub Actions 统一构建并发布到 GitHub Pages。多个演示共享一个站点，各自保留独立子路径。

## 已上线入口

| 入口 | 地址 |
| :--- | :--- |
| 演示导航首页 | [开源项目研究集](https://yydshly.github.io/0910_codex_project/) |
| 001 · Agent 解剖室 | [能力拆解](https://yydshly.github.io/0910_codex_project/001-system-prompts-leaks/) |
| 002 · Memmy Agent | [记忆与执行的边界](https://yydshly.github.io/0910_codex_project/002-memmy-agent/) · [外部接入整体架构](https://yydshly.github.io/0910_codex_project/002-memmy-agent/#external-guide) |
| 003 · AnySearch Skill | [客户端背后的搜索服务](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/) · [完整理解文档](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/notes/05-complete-understanding.html) |
| 004 · Pi Agent Harness | [完整理解](https://yydshly.github.io/0910_codex_project/004-pi/understanding.html) · [架构与业务调度](https://yydshly.github.io/0910_codex_project/004-pi/theory.html) · [能力实验室](https://yydshly.github.io/0910_codex_project/004-pi/) |
| 006 · Maigret | [账号用户名跨站检查：完整理解与总览图](https://yydshly.github.io/0910_codex_project/006-maigret/) |
| 007 · DeepTutor | [能力、产品对照与实践意义](https://yydshly.github.io/0910_codex_project/007-deeptutor/) · [完整架构图](https://yydshly.github.io/0910_codex_project/007-deeptutor/full-architecture.svg) · [来源与验证](https://yydshly.github.io/0910_codex_project/007-deeptutor/sources.html) |
| 008 · Pi Web | [能力、本质与 Codex 对比](https://yydshly.github.io/0910_codex_project/008-pi-web/) · [完整理解](https://yydshly.github.io/0910_codex_project/008-pi-web/understanding.html) · [总览图](https://yydshly.github.io/0910_codex_project/008-pi-web/assets/research-overview.svg) |
| 009 · YC AI Research | [网页能力、更新情况与研究价值](https://yydshly.github.io/0910_codex_project/009-yc-ai-research/) |
| 010 · Awesome OSINT Arsenal | [工具目录、场景与核心能力](https://yydshly.github.io/0910_codex_project/010-awesome-osint-arsenal/) |
| Agent 如何推进任务 | [四条交互路径与汇总图](https://yydshly.github.io/0910_codex_project/001-system-prompts-leaks/#logic) |
| 完整理解文档 | [在线阅读与下载](https://yydshly.github.io/0910_codex_project/001-system-prompts-leaks/reports/complete-understanding.html) |

关联方式：仓库首页 → 演示导航或具体项目；演示导航 → 项目网页与 GitHub 研究目录；项目网页 → 对应研究文档、研究仓库与上游来源；在线文档 → 项目网页及相关章节。GitHub 仓库 About 的网站地址指向演示导航首页。

## 自动发布

配置见 [deploy-pages.yml](../.github/workflows/deploy-pages.yml)，[查看发布记录](https://github.com/yydshly/0910_codex_project/actions/workflows/deploy-pages.yml)。

- Pages 发布源为 **GitHub Actions**；目标环境为 `github-pages`。
- 主分支 `main` 的项目文件、构建脚本、演示清单或发布工作流变化会触发发布，也可以在 Actions 页面手动运行。
- Node.js 24 构建，当前演示零第三方依赖，无需 API 密钥。
- [演示清单](web-demos.json) 显式登记要上线的项目；未登记的目录不进入发布产物。
- [统一构建脚本](../scripts/build-pages.mjs) 按编号构建已登记演示，汇总到根 `dist/`，生成导航首页及 `deployment.json` 版本记录。
- [子路径检查](../scripts/check-pages.mjs) 检查链接、资源与文档返回入口，再上传单一产物整体发布，避免不同演示互相覆盖。
- 根 `dist/`、各演示 `dist/` 和生成的文档副本均不提交到 Git。

本地在仓库根目录运行：

```powershell
node scripts/build-pages.mjs
node scripts/check-pages.mjs
```

这两个命令只构建和检查；推送相关更改到 `main` 后由 GitHub 发布。若构建或检查失败，工作流停止，既有线上站点保留。

## 新增演示

### 接入步骤

1. 在 `projects/<编号>-<英文名称>/web/` 独立维护页面及运行说明。
2. 为演示提供 `scripts/check.mjs` 和 `scripts/build.mjs`；后者输出静态文件到该演示的 `dist/`。有独立依赖的项目须同时在工作流中增加对应安装步骤。
3. 在 `docs/web-demos.json` 添加 `directory`、`title`、`description`；目录名使用正式项目完整名称。
4. 资源使用相对路径。路由使用 hash，或提供实际 HTML 文件；不能假设 Pages 会将任意路径重写到首页。
5. 运行统一构建与子路径检查，提交并推送，等待对应发布成功。
6. 核对 `deployment.json` 的源码版本，实际访问演示、脚本、文档、下载与图片，验证后才在首页、项目说明及部署记录中加入真实网址。

GitHub Pages 只承载静态内容。需要常驻后端的项目须单独部署后端，在对应项目中说明依赖与地址。

## 首次上线记录

### Awesome OSINT Arsenal 工具与能力展示

- 日期：2026-09-10；平台：仓库现有 GitHub Pages。
- 首发源码：`af0c257940df852351f4be5f328940d708336ac2`；[成功运行](https://github.com/yydshly/0910_codex_project/actions/runs/34454132468)。
- 提供 753 条真实目录记录的搜索、26 个方向与七种获取方式筛选，20 条重点中文说明和六个用途场景。区分合集的目录与安装能力、第三方工具的查询能力、本研究新增的中文交互功能。
- 本项目检查通过：数据一致性、场景引用、搜索与组合筛选、空结果、网址协议约束、16 处本地引用、模块语法和 SVG XML。统一构建九个展示通过，414 处本地引用通过子路径检查。
- 核对线上部署版本及本项目十个文件，均 HTTP 200，文本统一换行后与本地构建一致，模块、JSON、SVG 内容类型正确；九个展示入口均 HTTP 200。
- 未继续安装工具，未查询目标或生成调查结果；未执行浏览器截图、真实点击与视觉回归。此前安装尝试因权限停止，已在研究笔记如实记录。


### YC AI Research 网页能力与研究价值展示

- 日期：2026-09-10；平台：仓库既有 GitHub Pages 统一站点。
- 首发源码：`f494c4a047f396d1ebc70b5c536e0cf4e5430e6f`；[成功运行](https://github.com/yydshly/0910_codex_project/actions/runs/34452029853)。
- 网页区分官网、单篇清单与研究项目，解释更新边界、网页功能、五项代表研究、使用场景和研究价值，含原创 SVG 流程图与两份笔记下载。
- 统一构建八个项目通过，394 处本地引用通过子路径检查；新增页面六个章节、五项代表研究、13 处本地链接与下载一致性检查通过。
- 核对线上源码版本及 13 个文件，均 HTTP 200，内容类型正确，统一换行后的文本与验证构建一致；含原有七个项目入口回归。
- 未运行上游模型或完整复现实验；未做浏览器截图、真实点击或视觉回归。OpenReview 入口受浏览器验证影响，JETS 和 Guide Labs 仍标为原文转述。


### DeepTutor 能力、对照与完整架构发布

- 日期：2026-09-10；平台：现有 GitHub Pages 统一站点。
- 首发源码：`1a787f3d544eaa74ec1a958595ba3619a9ac6aa5`；[成功运行](https://github.com/yydshly/0910_codex_project/actions/runs/34447580043)。
- 摘要说明问答、解题、出题、学习路径与复习能力，对照 NotebookLM、Open Notebook、SurfSense，突出可修改教学流程及开源项目学习导师的参考价值。包含完整文章、原创 SVG/PNG 架构图、来源页与下载。
- 独立导出待提交内容构建七个已登记项目，376 处站内引用检查通过；DeepTutor 九个研究章节、39 处本地引用和下载一致性检查通过。
- 核对线上版本与 15 个文件：均 HTTP 200，文本统一换行后与验证构建一致，PNG 字节一致，内容类型正确；包含六个既有项目入口回归。
- 仅发布静态研究展示，未部署 DeepTutor 后端或验证教学效果；PNG 已目视检查，未做浏览器视觉或真实点击测试。详细范围见 [DeepTutor 验证记录](../projects/007-deeptutor/notes/02-sources-and-verification.md)。

### Pi Agent Harness 完整理解与理论双图发布

- 日期：2026-09-10；平台：现有 GitHub Pages 统一站点。
- 首发源码：`47860d011e3e494f382ae61f78ef361a544f13ea`；[成功运行](https://github.com/yydshly/0910_codex_project/actions/runs/34446893679)。
- 摘要集中描述库的模型接入、文件与命令工具、多轮任务、会话及扩展能力；附八节理解总稿、完整架构、业务调度双图和交互教学展示。
- 独立导出本次提交构建六个已登记项目，336 处站内引用检查通过；Pi 三场景 / 18 阶段、16 种扩展组合和文章来源检查通过。
- 线上版本与首发提交一致；23 个文件全部 HTTP 200，文本统一换行后与验证构建一致，PNG 字节一致，页面与资源内容类型正确；包含五个原有项目入口回归。
- 发布静态研究展示，未运行上游 Pi 或调用真实模型；PNG 已目视检查，未做浏览器视觉或真实点击测试。详细范围见 [Pi 验证记录](../projects/004-pi/notes/04-verification.md)。

### Pi Web 完整理解与能力展示发布

- 日期：2026-09-10；平台：现有 GitHub Pages 统一站点。
- 首发源码：`c0f6259666c77eadeee92167d7977bafc718eca9`；[成功运行](https://github.com/yydshly/0910_codex_project/actions/runs/34444791540)。
- 摘要聚焦库的能力、本质及 Codex 对比意义；增加完整中文文章与原创 PNG/SVG 总览，说明界面、Pi 引擎与模型的分工，不将相似体验写为能力等同。
- 仅导出本次待提交内容构建五个已登记项目，263 处站内引用通过检查；Pi Web 的 35 处页面引用、三场景 / 15 阶段、文章与源码链接检查通过。
- 核对线上版本及 10 个文件：均 HTTP 200，文本统一换行后与验证构建一致，PNG 字节一致，内容类型正确；原有四个项目入口回归通过。
- 发布的是静态研究展示；上游智能体和同任务效果对比未运行，未做浏览器视觉或真实点击测试。原创总览 PNG 已单独目视检查。


### Maigret 研究展示追加发布

- 日期：2026-09-10，平台：现有 GitHub Pages 统一站点。
- 首次上线源码：`94c5f27a30e54b9b9e1b0ce86c77a7a6d2113119`；[成功运行](https://github.com/yydshly/0910_codex_project/actions/runs/34443124332)。
- 对外摘要明确能力、原理与范围：按网站上设置的账号用户名（非实名），基于预设站点规则检查公开账号并提取资料；只覆盖规则库与所选站点，同名结果不证明身份。
- 干净导出后构建四个已登记项目，225 处站内引用通过检查；Maigret 的 10 个研究章节、来源引用、锚点、图片与下载入口检查通过。
- 核对线上 `deployment.json` 与 10 个文件：全部 HTTP 200，文本统一换行后与验证构建一致，PNG 二进制一致，HTML、CSS、SVG、PNG MIME 正确；包含原有三个项目入口回归检查。
- 发布的是静态研究文章与总览图，未部署或运行 Maigret 搜索服务；未执行浏览器视觉及真实点击测试。

### AnySearch 展示追加发布

- 日期：2026-09-10，平台：现有 GitHub Pages 统一站点。
- 首次上线源码：`de70158077ffb569fbba5a12db46fd5ffeb81ec2`；[成功运行](https://github.com/yydshly/0910_codex_project/actions/runs/34441279694)。
- 从干净导出的待提交内容构建三个展示页，202 处站内引用通过子路径检查；AnySearch 完整文档的 11 个章节、来源与锚点检查通过。
- 核对线上 `deployment.json` 版本；17 个线上文件返回 HTTP 200，文本统一换行后与验证构建一致，PNG 二进制一致，HTML、CSS、SVG、PNG MIME 正确。包含原有两个展示页的入口回归检查。
- 展示页解释 AnySearch 客户端、云端服务与搜索生态，不部署 AnySearch 后端，不发起付费查询。未执行浏览器视觉与真实点击测试。

### Memmy 演示追加发布

- 日期：2026-09-10，平台：现有 GitHub Pages 统一站点。
- 首次上线源码：`cb4817490c2755c7bc84ffd26e0fbc28d094f524`；[成功运行](https://github.com/yydshly/0910_codex_project/actions/runs/34439195041)。
- 在干净导出目录构建两个演示，156 处站内引用通过子路径检查；支持检查 `.mjs` 模块引用。
- 实际核对部署版本；33 个线上文件均返回 HTTP 200，文本统一换行后及图片二进制与验证构建一致，模块 MIME 正确。
- 研究网页属于静态展示，未将 Memmy Memory 后端部署为服务。

### 原有 001 演示首次发布

- 日期：2026-09-10。
- 首次成功部署源码：[`6624b3023c43a3c0a19ea4bda31d9af558bd1131`](https://github.com/yydshly/0910_codex_project/commit/6624b3023c43a3c0a19ea4bda31d9af558bd1131)。
- [成功的发布运行](https://github.com/yydshly/0910_codex_project/actions/runs/34435739964)。后续版本以 Actions 和站点 [deployment.json](https://yydshly.github.io/0910_codex_project/deployment.json) 为准。
- 验证：27 个线上文件均返回 HTTP 200；文本在统一换行后与本地构建一致，PNG 内容一致；135 处站内引用通过子路径检查。
- 交互渲染检查覆盖 24 项能力及四条任务路径的 29 个阶段；未执行浏览器视觉及真实点击测试。

配置依据：[GitHub 官方自定义 Pages 工作流文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
