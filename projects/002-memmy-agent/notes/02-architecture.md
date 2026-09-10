# 架构、内部技术与源码入口

研究日期：2026-09-10。Memmy commit：`98146714aad8569a298cf8692946da8bb28bf7cb`。依据核心源码与文档，未运行上游验证。

![外部与自带 Runtime 各自执行任务，共享适配、写入、存储、提炼与召回服务。](../assets/architecture.svg)

图 1：本研究原创逻辑图，来源为本文固定版本代码，非产品截图。箭头不是每次请求必经的全部步骤，省略了管理后端、鉴权和配置链路。

## 1. 两种用法与执行流程

**外部接入：** 用户发起任务 → Hook / 插件 / Skill 查询记忆 → 历史交给原 Agent → 原 Agent 调用模型与工具 → 完成结果经适配器写回。

**自带 Agent：** 桌面 / CLI / API 发起任务 → Memmy Runtime 读取记忆 → 调用模型 → 执行所选工具 → 反馈结果并继续 → 完成任务并写回。

“外部 Agent ↔ 记忆服务”是数据交互，不是统一调度。宿主能力不同，例如当前 Cursor 普通请求的额外查询主要由 Skill 按需完成。

## 2. 各层技术

| 层 | 技术 | 如何使用 |
| --- | --- | --- |
| ① 适配 | Hook、插件、Skill、HTTP / CLI、JSONL / SQLite 解析 | 接收事件、转换格式、返回记忆 |
| ② 写入 | Session / Turn、稳定 ID、哈希、增量检查点 | 组织完整轮次、保留来源、去重 |
| ③ 存储 | SQLite、better-sqlite3、FTS5、sqlite-vec | 保存正文与状态，建立全文与向量索引 |
| ④ 加工 | 持久化 Worker、重试、Embedding、LLM 结构化生成、评分 | 异步总结、索引、归纳经验和生成技能 |
| ⑤ 召回 | 向量、全文、短片段、结构线索、RRF、MMR、模型过滤 | 综合相关性、质量、时间、多样性，返回有限上下文 |
| ⑥ 执行 | Provider、工具循环、MCP、会话与任务管理 | 调用模型、执行工具、反馈结果、推进任务 |
| 管理界面 | Electron、React、Vite；Fastify、SSE | 工作台、来源配置、记忆管理与进度展示 |

Fastify 指本地管理后端，不能推断所有进程采用同一 HTTP 框架。Memory、Agent Runtime 和桌面管理后端是不同模块。

## 3. 写入和后台提炼

历史扫描按完整轮次组织记录，利用来源 ID、稳定 turn ID 和检查点去重。新任务完成后保存请求、回答、可用工具轨迹与状态。字段有长度和大小限制，不等于无限保存所有数据。

后台按配置做摘要、反思、评分、向量化与高层提炼，存在重试和失败状态。历史导入需满足处理就绪条件后进入召回，并非每条记录都立即升级为技能。

| 层 | 内容 | 示意例子 |
| --- | --- | --- |
| L1 Trace | 请求、回答、执行轨迹、错误、反思与来源 | 一次构建失败后修复的记录 |
| L2 Policy | 触发条件、步骤、边界与验证方式 | 同类构建错误的检查规则 |
| L3 World Model | 项目、环境及稳定约束 | 项目的构建条件和环境限制 |
| Skill | 名称、调用说明、步骤与验证条件 | 可供参考的构建排错流程 |

上述例子不是运行产物。Skill 生成依赖模型和证据条件，结构与证据校验不等于真实环境可靠性证明。

## 4. 为什么不是只做向量检索

深入了解数据结构、写入 / 召回 / 更新三条管线，以及 RRF、MMR 的工作方式，见[记忆实现原理](06-memory-mechanism.md)。

Embedding 将文字编码成向量，寻找表达不同但语义相近的记录。本地实现使用 Transformers.js，代码后备模型为 `Xenova/all-MiniLM-L6-v2`，实际取决于配置。错误码、路径和版本通常需要更精确匹配，因此另有全文、短片段和结构线索。

| 技术 | 作用 |
| --- | --- |
| 向量 | 同义表达、相似问题 |
| FTS5 | 关键词与标识符 |
| 短片段 / 结构线索 | 中文短词、错误码、路径等补充匹配 |
| RRF | 综合多个通道的排名 |
| 质量与时间权重 | 经验价值和新旧程度 |
| MMR | 平衡相关性与重复度 |
| LLM 过滤 | 根据当前问题进一步过滤候选 |

结果包装为历史上下文，提示结合当前请求和仓库状态复核。注入上下文不改变模型权重，也不保证模型一定正确使用。

## 5. 两种调度

- **Worker 调度**：安排摘要、索引、提炼与评分。
- **Agent Runtime 调度**：组织用户任务，调用模型、执行工具并处理返回结果。

两者可配合，但不是同一条循环。外部接入模式下，外部宿主保留自己的任务执行。

完整的开始 / 完成接口职责、失败回退和模型数据流，见[请求生命周期](04-request-lifecycle.md)。尤其应区分“开始召回”与“完成后持久化最终对话”。

## 6. 固定版本源码导航

| 内容 | 入口 |
| --- | --- |
| 服务与配置 | [Memory/readme.md](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/readme.md) |
| 依赖 | [Memory/package.json](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/package.json) |
| 索引结构 | [schema.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/storage/schema.ts) |
| Embedding | [embedder.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/model/embedder.ts) |
| 检索编排 | [retrieval-service.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/service/retrieval/retrieval-service.ts) |
| 排序与算法 | [plugin-algorithms.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/algorithm/plugin-algorithms.ts) |
| 后台任务 | [job-handlers.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/service/worker/job-handlers.ts) |
| 奖励更新 | [reward-pipeline.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/service/evolution/reward-pipeline.ts) |
| 经验归纳 | [policy-induction.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/service/evolution/policy-induction.ts) |
| 技能生成 | [skill-pipeline.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/service/evolution/skill-pipeline.ts) |
| Agent 循环 | [loop.ts](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/App/memmy-agent/src/core/agent-runtime/loop.ts) |
| 本地后端 | [App/backend/package.json](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/App/backend/package.json) |

[Mnemosyne 对照 →](03-mnemosyne-comparison.md) · [返回项目](../README.md)
