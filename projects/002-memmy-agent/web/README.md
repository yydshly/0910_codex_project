# Memmy 研究讲解页面

独立中文静态页面，汇总 Memmy 与 Mnemosyne 的理解。它是架构讲解，不是产品复刻，不连接真实记忆服务，不执行模型任务。

## 内容与交互

- `#architecture`：切换“外部接入 / 自带 Agent”，显示谁实际执行；选择六层查看技术、输入输出和依据。
- `#external-guide`：外部接入整体架构图、三方职责和最新理解汇总，说明独立记忆服务与 Agent 执行循环的关系。
- `#technology`：采集、后台处理、混合检索、RRF / MMR、四类记忆、两种调度和请求的六阶段生命周期。
- `#memory-mechanism`：记忆实现原理，三条内部流程、正文 / 元数据 / 索引、八组技术职责、算法展开与示意例子。
- `#comparison`：Mnemosyne 对照，强调独立项目与宿主差异。
- `#meaning`：意义、研究库应用设想与取舍。
- `#boundaries`：边界、失败回退、远程模型数据流、评测方法、官方规划与扩展建议。
- `#sources`：版本、来源与验证范围。

共用原图：[architecture.svg](../assets/architecture.svg)。例子仅为示意。

## 本地运行

需要 Node.js 20 或更新版本。无第三方依赖，无需安装。以下命令在 `projects/002-memmy-agent/web/` 执行：

```powershell
npm run dev
```

默认 `http://127.0.0.1:4318/`。端口占用时先设置 `$env:PORT = '4319'`；Ctrl+C 停止。

资源采用相对路径，锚点支持刷新。模式与选中层保存在 URL 参数中，例如 `?mode=native&layer=6`；非法值回到默认内容。手机选择层后自动定位说明，可返回所选节点；对照表按维度堆叠。

JavaScript 只负责讲解切换，无网络 API 请求和浏览器存储；禁用脚本仍可读默认架构与正文。

## 构建与检查

```powershell
npm run check
```

`check` 先重新构建，再检查入口、锚点、相对资源、模块语法、图形替代文本和文档链接，最后验证本地 HTTP 资源、MIME、HEAD 与错误分支。单独构建可运行 `npm run build`。

构建将 `public/` 与共用图复制到 `dist/`，并清理旧产物。脚本先检查输出路径，拒绝符号链接或重定向目录；产物已被忽略，不提交。

`public/index.html` 保存正文，`styles.css` 负责响应式、焦点与打印；`data.mjs` 保存讲解数据，`app.mjs` 负责交互，`scripts/` 提供预览、构建与检查。

## 部署与验证

- **已上线 GitHub Pages：**[研究页面](https://yydshly.github.io/0910_codex_project/002-memmy-agent/) · [外部接入整体架构](https://yydshly.github.io/0910_codex_project/002-memmy-agent/#external-guide)。
- 首次发布验证：2026-09-10，源码 `cb4817490c2755c7bc84ffd26e0fbc28d094f524`，[发布成功记录](https://github.com/yydshly/0910_codex_project/actions/runs/34439195041)。站点 33 个线上文件与验证构建一致，模块 MIME 检查通过；后续版本见站点 [deployment.json](https://yydshly.github.io/0910_codex_project/deployment.json)。
- 已完成构建、资源 / 语法 / 文档链接和 HTTP 检查，以及浏览器模式切换、刷新恢复、窄屏交互与截图复核。详细范围见[验证记录](../notes/05-validation.md)。
- 未运行上游功能和性能对测；未覆盖所有浏览器与真实设备。
- 发布时将 `dist/` 汇总到统一站点的 `002-memmy-agent/`，遵循[部署约定](../../../docs/web-demos.md)，不能覆盖其他演示。
- 更新后继续检查统一构建、子路径链接和实际线上版本。

## 来源

依据[完整理解](../notes/01-understanding.md)、[架构技术](../notes/02-architecture.md)、[对照研究](../notes/03-mnemosyne-comparison.md)。研究日期 2026-09-10，页面与项目 README 标有固定版本。内容、设计与图均为本研究原创归纳。
