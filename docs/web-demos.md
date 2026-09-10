# Web 演示部署与关联

本仓库通过 GitHub Actions 统一构建并发布到 GitHub Pages。多个演示共享一个站点，各自保留独立子路径。

## 已上线入口

| 入口 | 地址 |
| :--- | :--- |
| 演示导航首页 | [开源项目研究集](https://yydshly.github.io/0910_codex_project/) |
| 001 · Agent 解剖室 | [能力拆解](https://yydshly.github.io/0910_codex_project/001-system-prompts-leaks/) |
| 002 · Memmy Agent | [记忆与执行的边界](https://yydshly.github.io/0910_codex_project/002-memmy-agent/) · [外部接入整体架构](https://yydshly.github.io/0910_codex_project/002-memmy-agent/#external-guide) |
| 003 · AnySearch Skill | [客户端背后的搜索服务](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/) · [完整理解文档](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/notes/05-complete-understanding.html) |
| 006 · Maigret | [账号用户名跨站检查：完整理解与总览图](https://yydshly.github.io/0910_codex_project/006-maigret/) |
| 008 · Pi Web | [能力、本质与 Codex 对比](https://yydshly.github.io/0910_codex_project/008-pi-web/) · [完整理解](https://yydshly.github.io/0910_codex_project/008-pi-web/understanding.html) · [总览图](https://yydshly.github.io/0910_codex_project/008-pi-web/assets/research-overview.svg) |
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

### 本地完成、尚未发布

- **004 · Pi 能力实验室**：见 [运行说明](../projects/004-pi/web/README.md)。已加入演示清单；提供任务回放、能力地图、会话分支、上下文压缩和扩展组合。全部为教学模拟，不调用模型或运行上游代码。没有登记在线网址，待实际发布并验证后补充。

### 接入步骤

1. 在 `projects/<编号>-<英文名称>/web/` 独立维护页面及运行说明。
2. 为演示提供 `scripts/check.mjs` 和 `scripts/build.mjs`；后者输出静态文件到该演示的 `dist/`。有独立依赖的项目须同时在工作流中增加对应安装步骤。
3. 在 `docs/web-demos.json` 添加 `directory`、`title`、`description`；目录名使用正式项目完整名称。
4. 资源使用相对路径。路由使用 hash，或提供实际 HTML 文件；不能假设 Pages 会将任意路径重写到首页。
5. 运行统一构建与子路径检查，提交并推送，等待对应发布成功。
6. 核对 `deployment.json` 的源码版本，实际访问演示、脚本、文档、下载与图片，验证后才在首页、项目说明及部署记录中加入真实网址。

GitHub Pages 只承载静态内容。需要常驻后端的项目须单独部署后端，在对应项目中说明依赖与地址。

## 首次上线记录

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
