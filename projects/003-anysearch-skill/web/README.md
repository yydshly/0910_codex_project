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

沿用仓库 [GitHub Pages 统一发布流程](../../../docs/web-demos.md)，在演示清单登记后构建到独立子路径 `003-anysearch-skill/`。首次发布验证完成后补充真实线上入口与记录。

## 验证范围

发布前检查全部本地资源、完整文档渲染、图像与下载入口；发布后核对站点版本及线上文件。响应式布局通过 CSS 断点适配，未执行浏览器视觉与真实点击测试。

[返回项目介绍](../README.md)
