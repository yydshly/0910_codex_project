# Maigret Web 演示状态

本目录提供独立的静态研究网页，集中展示能力、搜索原理、网站范围、网页搜索对比、价值与扩展方向。首页明确说明输入是用户在网站设置的账号用户名（非实名），并提供总览图、章节导航、来源与 Markdown 下载。

这里部署的是研究内容，不是上游 Maigret 搜索服务；页面不收集用户名或发起账号扫描。

## 本地构建

使用 Node.js，零第三方依赖；仓库发布工作流使用 Node.js 24。在仓库根目录运行：

```powershell
node scripts/build-pages.mjs
node scripts/check-pages.mjs
```

仅构建此项目时，在本目录运行：

```powershell
node scripts/build.mjs
node scripts/check.mjs
```

输出为本目录的 `dist/`；统一构建将其复制到根 `dist/006-maigret/`。输出不提交。完整研究正文由 `../notes/01-understanding.md` 渲染，配图来自 `../assets/`，页面样式在 `public/style.css`。

## 发布与检查

已登记在[演示清单](../../../docs/web-demos.json)，通过仓库既有 GitHub Pages 工作流发布。遵循[Web 演示约定](../../../docs/web-demos.md)，上线并实际访问验证后再添加真实链接。

检查覆盖章节完整性、来源引用、用户名与实名边界、页面锚点、下载与图片路径；统一构建还检查所有已登记项目的子路径链接。未执行浏览器视觉或点击测试。

[返回项目介绍](../README.md)
