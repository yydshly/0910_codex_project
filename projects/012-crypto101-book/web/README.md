# Crypto 101 中文学习网页

沿用仓库既有 GitHub Pages 静态流程，无第三方运行依赖或后端。

## 功能

18 个单元覆盖序言、10 个基础主题、3 个完整系统、数学、术语、参考资料与书稿工程。17 份上游文件的 204 个标题全部对应：顶级标题作为单元，187 个小节有中文导读和固定行号；另有 57 个术语入口及 47 条书目记录。

每章包含目标、核心解释、例子、自检与参考思路、前后导航。XOR 和小整数 Diffie–Hellman 演算只用于教学。笔记与完成标记仅保存在本浏览器，可撤销完成标记，不跨设备同步。

复制引导语和疑问后，回到助手对话逐步学习；网页不调用模型或自动发送消息。可下载完整导读和来源目录。关闭 JavaScript 仍可阅读正文、原文和自检答案；保存及演算不可用。

中文是本研究新增导读，不是整本译文；原书空白与 TODO 单独标明。

## 本地运行

环境：Node.js 22+（统一发布为 24），预览可用 Python 3。无需安装应用依赖。在仓库根目录执行：

```powershell
node scripts/build-pages.mjs
node scripts/check-pages.mjs
python -m http.server 8126 --bind 127.0.0.1 --directory dist
```

访问 http://127.0.0.1:8126/012-crypto101-book/ 。根 dist 和各子项目 dist 均为忽略提交的产物。

单独构建与检查：

```powershell
node projects/012-crypto101-book/web/scripts/build.mjs
node projects/012-crypto101-book/web/scripts/check.mjs
node --check projects/012-crypto101-book/web/public/app.mjs
```

独立输出在本目录 dist；网站上一级导航需统一构建目录。

## 维护

- data/lessons.json：目标、解释、案例、自检与边界。
- data/source-inventory.json：固定标题、行号、TODO、术语与书目索引，不含完整书稿。
- data/section-guides.json：187 条中文细节导读，顺序与原书一致。
- data/glossary.json：57 个术语入口的中文提示。
- public/：样式、进度与笔记行为、教学演算。
- scripts/：静态生成与覆盖、链接、数据及演算检查。

## 发布

已于 2026-09-10 发布并核验：[打开中文学习指南](https://yydshly.github.io/0910_codex_project/012-crypto101-book/)。遵循[仓库 Web 约定](../../../docs/web-demos.md)。

[研究首页](../README.md) · [网页验证](../notes/04-web-learning-guide.md)
