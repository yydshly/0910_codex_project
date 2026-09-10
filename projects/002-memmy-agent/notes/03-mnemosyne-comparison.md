# 与 Mnemosyne 的差异及研究取舍

比较日期：2026-09-10。Mnemosyne 使用此前研究的 `3d8c51a865bc304d541bcfe561771ee676a92fcc`（代码版本 `4.0.0b1`）；Memmy 使用 `98146714aad8569a298cf8692946da8bb28bf7cb`（主项目 `1.1.4`）。这是结构对比，未对测效果与性能。

## 1. 最终理解

**Mnemosyne 提供可接入应用的记忆能力；Memmy 把共享记忆、多工具适配、后台加工与自带 Agent 做成更完整的应用。**

“更多封装”指 Memmy 的产品范围，不表示包装了 Mnemosyne。两者独立，不能仅凭范围认定哪一个效果更好。Mnemosyne 也有 MCP 服务与插件；Memmy 也允许外部工具只使用记忆服务。

## 2. 并排比较

| 维度 | Mnemosyne | Memmy Agent |
| --- | --- | --- |
| 定位 | 嵌入或接入已有应用的记忆组件 | 共享记忆中心与个人 Agent 应用 |
| 接入 | Python SDK、MCP、专用插件 | Hook、插件、Skill、HTTP API、CLI |
| 写入触发 | 宿主、工具调用或集成事件 | 历史扫描、适配事件与按需写入 |
| 数据组织 | Working / Episodic；事实、时间关系和 bank | L1 记录、L2 规则、L3 环境知识、Skill |
| 整理重点 | 长期摘要、保留原文 | 记录评分、经验与技能提炼，另有 Dream |
| 整理调度 | 核心 sleep() 同步，自动调度由集成提供 | 后台任务与重试管线 |
| 检索 | 全文与向量混合、重要性、时间及可选增强 | 多路召回、融合、质量、多样性与过滤 |
| 真实执行 | 由宿主 Agent 负责 | 外部接入由外部执行；自带模式由 Memmy 执行 |
| 工程形态 | Python 核心库，可同进程调用 | TypeScript / Node.js 应用，含桌面与服务 |

两者都使用外部记忆，不因存储信息而自动训练模型。都可能根据配置访问远程模型，不能单凭本地数据库判断是否全离线。

## 3. 不能简单说“一个手动，一个自动”

Mnemosyne 通用 MCP 不自动保存所有对话，宿主或模型决定调用时机；但 Hermes provider 有 `sync_turn`、自动整理和会话结束处理。

Memmy 提供更多现成的扫描、采集与注入流程，但宿主支持不同。Cursor 的自动采集与任务续接不等同于其他宿主普通请求前的自动召回。

应比较“哪种集成在什么事件做什么”，而不是给整个项目贴手动或自动标签。

## 4. 同一任务的不同重点（示意）

一次部署排错：

- **Mnemosyne 主要整理链路**：宿主写入经历 → 长期摘要 → 以后查回记录并组织上下文。
- **Memmy 经验管线**：适配器采集过程 → 评估结果 → 归纳条件与规则 → 符合条件时生成操作指南。

这体现关注点，不说明 Mnemosyne 只能存档，也不说明 Memmy 的指南天然正确。

## 5. 对我们的取舍

此前 Mnemosyne 结论：**保留实现架构，需要开发类似能力时再深入。** 本次不改变它，也不因为 Memmy 覆盖更广而默认采用完整产品。

| 将来所需能力 | 优先参考 |
| --- | --- |
| 为已有应用增加保存、查询、整理 | Mnemosyne 的接口与数据组织 |
| 多个 AI 工具共享经验、采集和续接 | Memmy 的适配与任务生命周期 |
| 将经验转化成操作指南 | Memmy 的证据、评分和提炼管线 |
| 完整个人 Agent | Memmy Runtime、服务与桌面边界 |

我们建议最小实现从“写入、查询、失效 + 正文与来源 + 全文索引 + 宿主触发策略”开始。先验证是否减少重复解释，再增加向量、摘要、跨工具自动化和技能提炼。

## 来源

- [此前研究](https://github.com/yydshly/0908_codex_project/tree/main/projects/002-mnemosyne)
- [Mnemosyne 架构](https://github.com/mnemosyne-oss/mnemosyne/blob/3d8c51a865bc304d541bcfe561771ee676a92fcc/docs/architecture.md)
- [Python 接口](https://github.com/mnemosyne-oss/mnemosyne/blob/3d8c51a865bc304d541bcfe561771ee676a92fcc/mnemosyne/core/memory.py)
- [Hermes 集成](https://github.com/mnemosyne-oss/mnemosyne/blob/3d8c51a865bc304d541bcfe561771ee676a92fcc/hermes_memory_provider/__init__.py)
- [Memmy 固定记忆说明](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/docs/en/memory/overview.mdx)
- [Memmy 在线适配说明](https://memmy.bot/docs/memory/sources/)

[返回项目](../README.md)
