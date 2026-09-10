# YC AI 研究导航网页

独立中文阅读页，说明网页能力、更新情况、五项代表研究与研究价值。不会运行上游 AI 或自动同步原站。

## 本地运行

Node.js 构建，发布环境 Node.js 24；零第三方应用依赖。仓库根目录执行：

```powershell
node scripts/build-pages.mjs
node scripts/check-pages.mjs
python -m http.server 8009 --bind 127.0.0.1 --directory dist
```

访问 `http://127.0.0.1:8009/009-yc-ai-research/`。Python 仅作为可替换的本地静态服务。

也可在本目录执行 `node scripts/build.mjs`、`node scripts/check.mjs` 单独构建，产物为 `web/dist/`；返回研究导航的入口需通过统一构建浏览。

## 维护

页面与样式在 `public/`；研究材料的唯一编辑源在 `../notes/`、`../assets/`。构建复制下载材料，检查脚本验证章节、链接与下载一致性。构建产物不提交。

## 部署

沿用[仓库 GitHub Pages 约定](../../../docs/web-demos.md)，登记于 `docs/web-demos.json`。当前会话没有可调用的 Sites 托管连接器，因此保留仓库统一发布方式。

[在线阅读](https://yydshly.github.io/0910_codex_project/009-yc-ai-research/)。2026-09-10 已上线，首次发布与验证记录见仓库部署文档。验证边界见[来源记录](../notes/02-sources-and-verification.md)。

[返回项目说明](../README.md)
