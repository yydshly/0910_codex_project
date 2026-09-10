# Web 演示约定

当前仅规划演示结构，尚未配置部署工作流或发布任何站点。各项目可以独立选用技术栈，并在自己的 `web/README.md` 中记录运行和部署方法。

## GitHub Pages 地址规划

GitHub Pages 托管静态 HTML、CSS 和 JavaScript，每个仓库最多对应一个 Pages 站点。多个静态演示可以组织在同一个站点的不同子路径中。

本仓库未来可采用以下路径，**这些是规划地址，尚未上线**：

```text
https://yydshly.github.io/0910_codex_project/
├── 001-example/
└── 002-another-project/
```

每个子路径沿用研究项目完整目录名。根路径将来可用作演示导航页，GitHub 仓库 README 继续作为研究总入口。

## 构建与发布原则

1. 每个项目独立构建，记录其命令和产物目录。
2. 发布时将所有已启用演示的静态产物汇总至一个发布目录，再整体部署到 Pages。
3. 不让多个项目的部署各自覆盖同一个 Pages 站点；项目增多时维护统一发布流程。
4. 静态资源及前端路由需适配 `/0910_codex_project/<项目目录>/` 前缀；验证图片、脚本、页面跳转与直接刷新。
5. 首个真实演示完成后，再选定构建工具、创建发布工作流并启用 Pages。

## 需要后端的项目

GitHub Pages 不能运行常驻后端进程。此类项目需单独部署后端或整体部署到其他平台，在子项目文档记录服务依赖与访问地址；首页索引仍保留统一入口。

## 上线记录

各项目 `web/README.md` 记录实际部署平台、线上地址、源码版本、部署日期及验证结果。尚未上线的项目不在首页放置预计地址。

参考：[GitHub Pages 概述](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[创建 GitHub Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
