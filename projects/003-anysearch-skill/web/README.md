# AnySearch 研究展示

静态中文研究页，说明 AnySearch Skill 的客户端定位、云端服务边界、专业能力、收费、同类产品与 Agent 搜索来源。附完整研究文档的在线阅读、Markdown 下载及总览图。页面不调用 AnySearch API，不需要密钥，也没有部署搜索后端。

## 运行与构建

在仓库根目录运行：

```powershell
node scripts/build-pages.mjs
node scripts/check-pages.mjs
python -m http.server 4173 --directory dist --bind 127.0.0.1
```

随后访问 `http://127.0.0.1:4173/003-anysearch-skill/`。停止预览使用 Ctrl+C。Node.js 仅用于静态构建和检查，无第三方依赖；发布工作流使用 Node.js 24。

页面源文件在 `public/`；`scripts/build.mjs` 从项目笔记与图片生成 `dist/`，`scripts/render-report.mjs` 将完整总稿渲染为 HTML，`scripts/check.mjs` 检查入口、锚点、来源和文档链接。构建产物不提交。

## 部署

沿用仓库 [GitHub Pages 统一发布流程](../../../docs/web-demos.md)，在演示清单登记后构建到独立子路径 `003-anysearch-skill/`。

- [在线展示](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/)
- [完整研究在线阅读](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/notes/05-complete-understanding.html)
- [完整总览图](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/assets/research-overview.svg)

首次上线于 2026-09-10，源码版本 `de70158077ffb569fbba5a12db46fd5ffeb81ec2`，[发布运行成功](https://github.com/yydshly/0910_codex_project/actions/runs/34441279694)。已核对线上部署版本，17 个文件返回 HTTP 200，内容与干净导出构建一致，页面、样式与图片 MIME 正确；包括原有两个展示页的入口回归检查。后续版本以站点 [deployment.json](https://yydshly.github.io/0910_codex_project/deployment.json) 为准。

## 验证范围

发布前检查全部本地资源、完整文档渲染、图像与下载入口；发布后核对站点版本及线上文件。响应式布局通过 CSS 断点适配，未执行浏览器视觉与真实点击测试。

[返回项目介绍](../README.md)
