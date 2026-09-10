# Luvus 静态研究展示

[在线模块引导](https://yydshly.github.io/0910_codex_project/011-luvus/) · [完整理解](https://yydshly.github.io/0910_codex_project/011-luvus/understanding.html) · [详细架构](https://yydshly.github.io/0910_codex_project/011-luvus/architecture.html)

首页用“任务管理＋Agent 适配 → 已有 Agent 执行”的简图引导；完整理解、详细架构和来源分别提供阅读页与 Markdown 下载。详细架构保留静态 SVG 和可复制的原始 Mermaid 源，不依赖在线图表服务。

## 本地运行

在本目录运行：

```powershell
node scripts/build.mjs
node scripts/check.mjs
python -m http.server 8123 --bind 127.0.0.1 --directory dist
```

打开 http://127.0.0.1:8123 。独立构建时“研究导航”指向父目录；整站构建后返回统一导航。

## 整站接入

仓库根目录执行 `node scripts/build-pages.mjs` 和 `node scripts/check-pages.mjs`。项目登记在 docs/web-demos.json，沿用现有 GitHub Pages 子路径发布。2026-09-10 首发已验证，记录见 ../notes/03-sources-and-verification.md。

## 维护

- 正文维护在 ../notes，构建时生成对应阅读页和下载副本。
- 两张说明图由 ../scripts/diagrams.py 生成；完整图源在 ../assets/full-architecture.mmd。
- 无需安装应用依赖；静态 HTML、CSS 和 SVG 支持无 JavaScript 阅读。
- 本展示不运行 Luvus 或模型，不能作为上游能力实测证明。
