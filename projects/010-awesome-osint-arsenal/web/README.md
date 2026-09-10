# 无需安装工具的中文展示

本研究新增静态页面：753 条原始目录记录、中文分类和获取方式筛选、名称用途搜索、分页、六个场景和核心能力说明。不会执行安装脚本或第三方工具。

## 运行

在本文件所在 web 目录，使用现有 Node.js：

```powershell
node scripts/build.mjs
node scripts/check.mjs
node scripts/serve.mjs
```

访问 `http://127.0.0.1:30150/`。无需安装应用依赖或 Linux，部署后读者只需浏览器。

## 维护

- `public/catalog.mjs`：26 种中文分类、20 条重点解释、六个场景及筛选逻辑。
- `public/app.mjs`：搜索、筛选、分页及可选 WebMCP；不执行外部命令。
- `scripts/build.mjs`：复制页面、笔记、数据、许可证、图片，生成统计。
- `scripts/check.mjs`：数据一致性、筛选逻辑、场景引用和本地链接检查。
- `scripts/serve.mjs`：本地静态文件服务。
- 上级 `data/tools.json`：固定版本原始快照，含重复记录和缺失字段；保留原始字节与 MIT 许可证。

网页使用文本渲染上游描述，外部网址限 http/https。空网址链接回上游目录，不自动猜造。20 个重点条目为中文说明，其他条目保留上游英文原文。

## 发布

沿用仓库既有 GitHub Pages 和 `docs/web-demos.json`。所有静态资源使用相对路径，可在项目子路径运行。部署并核验后才添加真实链接。

## 边界

未安装或实测第三方工具。场景仅介绍输入、预期输出与选择流程。可选 WebMCP 没有真实浏览器上下文验证，不影响普通页面使用。

[返回项目说明](../README.md)