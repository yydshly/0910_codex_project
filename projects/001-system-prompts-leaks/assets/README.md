# 项目图片

| 文件 | 用途 | 来源 |
| :--- | :--- | :--- |
| [agent-task-loop.png](agent-task-loop.png) / [agent-task-loop.svg](agent-task-loop.svg) | 1800 × 2440 任务逻辑总图；补充四次模型调用示例、审批暂停、先澄清与失败调整 | 本研究原创，2026-09-10；依据此前已读取的官方 Agent 文档与讨论归纳，来源和概念边界见[专题文档](../notes/06-agent-task-loop.md) |
| [official-agent-anatomy.png](official-agent-anatomy.png) / [official-agent-anatomy.svg](official-agent-anatomy.svg) | 1800 × 2450 Agent 组成图；区分官方天气样例的工作闭环与可选扩展 | 本研究原创，2026-09-10；依据 OpenAI 官方 Agents SDK 文档，完整链接见[来源说明](../notes/05-official-agent-anatomy.md) |
| [research-overview.png](research-overview.png) / [research-overview.svg](research-overview.svg) | 1800 × 2630 完整概述图；PNG 用于预览，SVG 用于放大阅读 | 本研究原创，2026-09-10；来源与证据范围见下文 |
| [architecture.svg](architecture.svg) | 子项目的结构示意 | 本研究原创；依据上游提交 f475e8b2b11ca7540a37234a451e9f085471bd94 的目录与代表性文本 |

该图片表达档案与实际运行环境的关系，不是上游界面截图，也不表示本研究已经实现图中的扩展能力。

## 完整概述图的来源

- 目录和统计：[上游固定研究版本](https://github.com/asgeirtj/system_prompts_leaks/tree/f475e8b2b11ca7540a37234a451e9f085471bd94)。17 个顶层产品或类别目录，430 个 Markdown 文件，489 个文件；不是已验证能力数量。
- Codex GPT-5.5 缓存来源：[PR #166](https://github.com/asgeirtj/system_prompts_leaks/pull/166)。提取和历史校对来自贡献者、维护者陈述，本研究未复现当日环境。
- 机制对照：[OpenAI Codex 模型目录源码](https://github.com/openai/codex/blob/5a9eb145c4c05fcfc7158d7c25b80e1322eccae1/codex-rs/models-manager/models.json)。当前公开源码核对支持模板机制，不等于复现历史客户端。
- 样本范围与行数：[来源索引](../notes/03-source-index.json)；ChatGPT 样本为 [OpenAI/gpt-5.6-sol.md](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md)。工具标题包括禁用项，用户私有栏目已脱敏。
- [完整研究文档](../notes/03-codex-acquisition-chatgpt56.md)包含逐段行号和证据链接。图中工作循环是便于理解的概念结构，不是对某个产品私有后端的完整复原。
