# 002 · Memmy Agent

Memmy 将跨 Agent 共享记忆、工具适配、后台经验提炼与自带 Agent Runtime 组合在一起。研究重点是：**记忆如何进入任务、任务经验如何保存、实际执行由谁负责**。

## 我们最终形成的理解

1. **请求接入 → 历史召回 → Agent 执行 → 结果写回 → 后台加工**，构成主要闭环。记忆保存在模型之外，经过索引与筛选再作为上下文使用，并非全部加工完成后才执行任务。
2. 外部接入时，Memmy 提供记忆与配套服务；实际工具调用仍由原 Agent 的运行环境组织。使用自带 Agent 时，Memmy Runtime 才同时负责实际执行。
3. “自进化”在所研究流程中表现为更新记忆价值、归纳规则和生成操作指南，不是训练大模型参数；生成的技能不等于已在真实任务中验证可靠。
4. Mnemosyne 侧重可接入应用的记忆组件；Memmy 覆盖更多适配、后台服务与产品界面。**Memmy 是独立项目，不是 Mnemosyne 的二次封装。** 两者的效果优劣尚未对测。

## 架构引导

![Memmy 架构：外部 Agent 与 Memmy Runtime 分别执行任务，通过适配层共享采集、存储、后台提炼和检索服务。](assets/architecture.svg)

图 1：记忆服务与任务执行的职责边界。来源：本研究依据固定上游版本原创绘制；非上游产品截图，省略部分管理与配置链路。[放大查看](assets/architecture.svg)。

## 阅读与展示入口

| 入口 | 内容 |
| --- | --- |
| [完整理解](notes/01-understanding.md) | 能力、本质、场景、意义、扩展方向与理解纠偏 |
| [外部接入整体架构](notes/07-external-memory-architecture.md) | Agent / 适配 / Memory 三方职责、外部化含义、模型工作流与任务执行的区别 |
| [架构与技术](notes/02-architecture.md) | 各层技术、执行流程、记忆分层与源码导航 |
| [记忆实现原理](notes/06-memory-mechanism.md) | 写入 / 召回 / 更新三条流程、数据结构、技术职责、RRF 与 MMR 原理 |
| [Mnemosyne 对照](notes/03-mnemosyne-comparison.md) | 相同点、差异、两种调度及我们的取舍 |
| [请求生命周期](notes/04-request-lifecycle.md) | 六阶段流程、接口职责、失败回退、数据流与效果评测方法 |
| [排错与验证](notes/05-validation.md) | 本研究页面的修复、构建检查与浏览器验证范围 |
| [Web 页面说明](web/README.md) | 交互式架构讲解、技术详解、项目对照、运行与部署状态 |

## 项目资料

| 项目 | 内容 |
| --- | --- |
| 原始仓库 | [MemTensor/memmy-agent](https://github.com/MemTensor/memmy-agent) |
| 官方文档 | [Memmy 文档](https://memmy.bot/docs/) |
| 研究版本 | 主项目 `1.1.4`；commit [`98146714aad8569a298cf8692946da8bb28bf7cb`](https://github.com/MemTensor/memmy-agent/tree/98146714aad8569a298cf8692946da8bb28bf7cb)；2026-09-08 提交 |
| 上游许可证 | [MIT](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/LICENSE) |
| 技术栈 | TypeScript / Node.js、SQLite / FTS5 / sqlite-vec、模型 API、Electron / React / Vite；本地管理后端使用 Fastify |
| 收录与研究日期 | 2026-09-10 |
| 研究状态 | 文档与核心源码阅读完成；研究页面已制作；上游运行效果未验证 |
| 在线演示 | —（尚未部署） |

## 研究结论与边界

- 新增研究价值集中在适配自动化、任务生命周期与经验到技能的提炼。
- 本地保存不等于全程离线。摘要、检索过滤、技能提炼等可以调用远程模型，取决于配置。
- 各 Agent 接入深度不同，历史导入、自动采集、自动召回和按需查询不能混为一谈。
- 任务续接提供历史上下文，不意味着自动迁移代码、环境或正在运行的进程。
- 对比参考的 Mnemosyne 提交为 `3d8c51a865bc304d541bcfe561771ee676a92fcc`（代码版本 `4.0.0b1`）；此前研究见[已归档说明](https://github.com/yydshly/0908_codex_project/tree/main/projects/002-mnemosyne)。

## 本地运行与来源

本子项目只运行原创研究讲解页面，详见 [Web 运行说明](web/README.md)。没有安装 Memmy、导入个人对话或修改外部 Agent 配置。

文档、架构图和页面为本研究原创归纳，源码结论链接到固定提交。上游采用 MIT 许可；本研究未复制完整上游仓库或产品界面素材，示例不是运行结果。

---

[返回总项目索引](../../README.md#项目索引)
