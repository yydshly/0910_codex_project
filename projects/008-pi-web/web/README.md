# Pi Web 中文能力展示

独立静态研究页面，使用 HTML、CSS 与 JavaScript，无第三方依赖。它解释上游能力，不运行 Pi 引擎，也不模拟真实模型回复。

## 展示内容

- 外部阅读引导图、Codex / Claude Code / Cursor Agent 同类定位，以及开源研究、个人开发和自建助手的用途。
- 浏览器、本地服务端、Pi 引擎与模型服务的分工。
- 完整理解总览图（PNG / SVG）、Codex 对比的意义与完整在线文章；文章从同一份 Markdown 生成。
- 上游截图及六类能力说明。
- 编程、源码研究和子智能体审查三个场景，共 15 个手动演示阶段。
- 场景切换、上一步、下一步、重新演示、能力展开与源码链接。
- 默认关闭、对话与代码分支、目录边界与执行权限等关键限制。

## 本地运行

环境：Node.js ≥ 22。工作目录：本项目 `web/`。

```powershell
node scripts/build.mjs
node scripts/check.mjs
node scripts/serve.mjs
```

浏览器打开 `http://127.0.0.1:30148`。固定监听回环地址。此端口属于研究展示，上游应用默认端口是 30141。

## 目录与发布

- `public/`：页面、样式和三个场景的数据与交互。
- `scripts/`：构建、静态检查和本地 HTTP 预览。
- `dist/`：生成产物，不提交。

已按仓库[统一发布约定](../../../docs/web-demos.md)接入 [web-demos.json](../../../docs/web-demos.json)。根目录可运行 `node scripts/build-pages.mjs` 和 `node scripts/check-pages.mjs` 检查子路径。已于 2026-09-10 发布并验证：[在线展示](https://yydshly.github.io/0910_codex_project/008-pi-web/) · [完整理解](https://yydshly.github.io/0910_codex_project/008-pi-web/understanding.html) · [总览 SVG](https://yydshly.github.io/0910_codex_project/008-pi-web/assets/research-overview.svg)。沿用仓库 GitHub Pages 发布结构；首发源码 c0f6259666c77eadeee92167d7977bafc718eca9。

部署静态展示不会获得上游智能体能力；运行 Pi Web 本体需要常驻服务端及模型配置。

## 数据来源和验证

场景文字为依据固定源码原创编写的解释性示例；截图来源与许可见 [assets](../assets/README.md)。未调用模型、读取真实项目或执行命令。检查范围见[验证记录](../notes/02-verification.md)。

[返回项目](../README.md)
