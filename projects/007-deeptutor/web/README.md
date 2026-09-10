# DeepTutor · 静态研究网页

阅读我们的完整理解：三层职责、能力、NotebookLM 对照、Open Notebook 与 SurfSense 的关系、架构共性、实质差异与扩展方向。包含章节导航、完整架构图（可放大的 SVG 与高清 PNG）、职责简图、来源页和 Markdown 下载。

这不是 DeepTutor 的运行实例，不需要模型密钥，不调用后端，不模拟真实判题。页面主体来自 [01-understanding.md](../notes/01-understanding.md)，来源页来自 [02-sources-and-verification.md](../notes/02-sources-and-verification.md)，构建时统一生成，避免两套正文产生差异。

## 构建与检查

环境：Node.js 24（与仓库 Pages 工作流一致），零第三方依赖。在本目录执行：

```powershell
node scripts/build.mjs
node scripts/check.mjs
```

构建产物位于 `dist/`，不提交到 Git。构建后可直接打开 [本地网页](dist/index.html)，或运行静态服务器：

```powershell
python -m http.server 8787 --bind 127.0.0.1 --directory dist
```

再访问 `http://127.0.0.1:8787/`。本地端口不是公开演示地址。

## 文件结构

- `public/index.html`：两种阅读页共用的布局模板。
- `public/style.css`：自适应排版、键盘焦点、表格滚动与打印样式。
- `scripts/render.mjs`：限定语法的 Markdown 渲染器，转义原始 HTML。
- `scripts/build.mjs`：从正式文档生成两个 HTML 页面，复制原始文档与示意图。
- `scripts/check.mjs`：检查九个章节、资源、锚点、子路径和下载文档一致性。

## 发布状态

已接入 [统一演示清单](../../../docs/web-demos.json)。仓库根目录可运行 `node scripts/build-pages.mjs` 和 `node scripts/check-pages.mjs` 验证整体站点。

当前仅本地构建，尚未发布。Sites 原生托管工具在本会话不可用；保留既有 GitHub Pages 架构，不新增未经验证的线上链接。发布规则见 [Web 演示约定](../../../docs/web-demos.md)。

验证不涵盖上游产品运行、真实模型质量、浏览器点击或视觉测试。
