# 010 · Awesome OSINT Arsenal

以工具查找为主的工具合集，按用途整理情报与安全工具、网站及学习资料，并提供获取方式和批量安装脚本，帮助找到并准备所需工具。

核心用途是“找工具、了解怎么获取和安装”。原库主要提供目录与脚本；我们的中文网页补充了对已有清单的搜索和筛选，不会到互联网自动寻找新工具。

## 项目资料

| 项目 | 内容 |
| :--- | :--- |
| 原始仓库 | [rawfilejson/awesome-osint-arsenal](https://github.com/rawfilejson/awesome-osint-arsenal) |
| 官方文档 | [固定版本 README](https://github.com/rawfilejson/awesome-osint-arsenal/blob/2c6475a1d5b941cc598b3612419ef22e6d903ce8/README.md) |
| 研究版本 | `2c6475a1d5b941cc598b3612419ef22e6d903ce8` |
| 上游许可证 | [MIT，Copyright (c) 2026 rawfilejson](data/UPSTREAM-LICENSE)；第三方工具分别适用其许可 |
| 技术栈 | 上游 Markdown、JSON、Bash；展示 HTML、CSS、JavaScript，零第三方应用依赖 |
| 研究状态 | 完整理解与工具查找展示完成；按要求未安装工具 |
| 收录日期 / 最近更新 | 2026-09-10 |
| 在线演示 | [打开工具与能力导航](https://yydshly.github.io/0910_codex_project/010-awesome-osint-arsenal/) |

## 核心能力与展示

- **工具发现：** 提供按用途分类的工具、服务与学习资源入口。
- **结构化目录：** tools.json 有 753 条记录、752 个唯一 ID、26 种分类；不是 753 个已经集成可用的功能。
- **环境准备：** 安装脚本调用包管理器批量安装或下载部分软件、源码和镜像。
- **内置内容：** 主要是工具资料与安装条目；工具本体和数据源通常需要另行获取。
- **本研究展示：** 全量目录检索、中文分类和获取方式筛选、20 条重点工具中文说明、六个问题场景及职责图。
- **展示边界：** 中文交互页是本研究新增，不是上游自带界面。不查询目标、不上传文件、不执行安装；场景只有预期输出类型，没有虚构结果。

## 代表性图片

![Awesome OSINT Arsenal 完整理解：工具查找与安装、代表工具、网页搜索、人工更新、扩展方向与研究意义](assets/complete-understanding.png)

图 1：完整理解总览，突出工具查找与安装用途，区分已有清单搜索和未来自动发现。来源：依据固定版本资料、源码及本次讨论原创排版绘制；非产品截图，未实测第三方效果。[高清原图](assets/complete-understanding.png) · [职责流程图](assets/research-overview.svg) · [图源说明](assets/complete-understanding.source.md)

## 搜索与更新边界

- 原库整理的是已有工具清单；本研究新增的网页搜索只查询固定快照中的 753 条记录。
- 上游由作者和贡献者人工收录、维护，原库没有自动发现新工具的流程。
- 本网页不自动跟随上游更新。以后如要自动扩展，需要另外开发检索、去重、可用性检查、审核和同步流程。
- 查账号、分析图片或网络检测由所选工具执行，不是这个工具合集自身的查询能力。

## 无需安装的本地展示

使用电脑上已有的 Node.js，在仓库根目录运行：

```powershell
node projects/010-awesome-osint-arsenal/web/scripts/build.mjs
node projects/010-awesome-osint-arsenal/web/scripts/check.mjs
node projects/010-awesome-osint-arsenal/web/scripts/serve.mjs
```

访问 `http://127.0.0.1:30150/`。Node 不在 PATH 时，可使用现有可执行文件的完整路径。无须 Linux、Python、Docker 或 API 密钥。上述命令不会安装目录中的工具。

## 实际运行范围

此前原版总安装器因非 root 身份退出；选定 ExifTool 的安装尝试随后被 sudo 密码要求阻止，没有成功安装。用户要求暂时不安装后停止此方向，只进行资料整理和静态展示。

保留 [总安装器退出输出](evidence/master-nonroot.txt)、[选定安装尝试输出](evidence/selected-install.txt) 及 [此前研究脚本](scripts/run-selected.sh)。研究脚本不由页面或构建调用，本次不继续执行。

## 研究与来源

- [完整理解：能力、原理、工具、场景、扩展及意义](notes/01-understanding.md)
- [来源、数据口径与验证记录](notes/02-sources-and-verification.md)
- [网页运行说明](web/README.md)
- [上游原始工具数据快照](data/tools.json)

仅保存必要数据及许可证，没有引入完整上游仓库。中文解读与流程图为本研究新增；目录原文中的覆盖数量、价格和可用性不视为本次验证结论。

---

[返回总项目索引](../../README.md#项目索引)
