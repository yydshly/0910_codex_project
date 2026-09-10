# 开源项目研究集

记录近期发现的优秀 GitHub 项目，从体验、源码阅读到复现与实践，逐步积累可复用的研究成果。

这里是研究总入口：每个子项目使用独立编号，包含项目介绍、研究笔记、效果截图，以及可选的 Web 演示。

[在线演示导航](https://yydshly.github.io/0910_codex_project/) · [Agent 任务逻辑与汇总图](https://yydshly.github.io/0910_codex_project/001-system-prompts-leaks/#logic)

## 项目索引

按编号升序排列，编号与子项目目录保持一致。

<!-- PROJECT_INDEX_START -->
| 编号 | 研究项目 | 原始仓库 | 摘要 | 状态 | 在线演示 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 001 | [System Prompts Leaks](projects/001-system-prompts-leaks/README.md) | [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) | 理解总稿、任务逻辑汇总图；Web 含 24 项解读与四条任务推进路径 | 研究与线上展示完成 | [打开演示](https://yydshly.github.io/0910_codex_project/001-system-prompts-leaks/) |
<!-- PROJECT_INDEX_END -->

## 项目预览

### 001 · System Prompts Leaks

[![System Prompts Leaks 完整概述：来源、整理方式、ChatGPT 5.6 内容与研究意义](projects/001-system-prompts-leaks/assets/research-overview.png)](projects/001-system-prompts-leaks/README.md)

研究 AI 产品如何用提示词组织行为、工具和任务流程，附可交互的「Agent 解剖室」。图源：本研究原创总览，依据固定研究版本、PR #166 与公开源码绘制，非产品截图。[放大查看](projects/001-system-prompts-leaks/assets/research-overview.svg) · [研究详情](projects/001-system-prompts-leaks/README.md) · [打开在线展示](https://yydshly.github.io/0910_codex_project/001-system-prompts-leaks/) · [展示运行说明](projects/001-system-prompts-leaks/web/README.md)

## 仓库导航

[新增专题：Agent 如何推进任务](projects/001-system-prompts-leaks/notes/06-agent-task-loop.md) · [任务逻辑汇总图](projects/001-system-prompts-leaks/assets/agent-task-loop.svg)

| 入口 | 内容 |
| :--- | :--- |
| [研究项目](projects/README.md) | 编号约定、目录结构与研究状态 |
| [子项目模板](templates/project/README.md) | 项目介绍、研究记录、图片说明与运行指引 |
| [新增项目指南](docs/adding-projects.md) | 从登记项目到更新首页的步骤 |
| [Web 演示约定](docs/web-demos.md) | 多个演示的地址规划与部署记录要求 |

## 研究方式

发现与筛选 → 本地体验 → 源码研究 → 实践验证 → 总结归档。

保留原项目链接、所研究的版本及许可证信息。区分原项目能力、实际验证结果与个人推测；优先记录有用的结论和可复现的过程。
