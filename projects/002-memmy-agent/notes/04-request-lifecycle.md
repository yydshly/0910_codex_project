# 请求生命周期、失败处理与验证方法

补充日期：2026-09-10。Memmy 研究提交仍为 `98146714aad8569a298cf8692946da8bb28bf7cb`。本篇细化已有架构，不代表上游运行验证。

## 一次任务的六个阶段

| 阶段 | 参与者与操作 | 输出及注意事项 |
| --- | --- | --- |
| 1. 准备请求 | 宿主打开或复用会话，按接入策略调用 turn.start | 传入已有 sessionId 和当前 query，可传入稳定 turnId |
| 2. 决定召回 | Memory 根据意图、模式和范围选择检索 | 闲聊等请求可以跳过；不同宿主并非每轮自动查询 |
| 3. 返回上下文 | 检索、融合、过滤，返回 turnId、状态与可用 injectedContext | 历史参考与当前请求保持区分；无命中不应编造历史 |
| 4. 实际执行 | 原 Agent Runtime 或 Memmy Runtime 调用模型与工具 | 产生真实结果；记忆服务本身不统一调度外部 Agent |
| 5. 结束写回 | turn.complete 关联请求、回答和结果 | 完成 episode 路由与记录持久化，返回最终归属 |
| 6. 后台加工 | Worker 总结、评分、索引及高层提炼 | 处理就绪的记录供以后召回；不保证立即生成全部层级 |

这是一条支持回合生命周期的典型路径。显式 memory.add / memory.search 可以独立使用；历史扫描也有自己的导入管线。

## ID 与接口职责

- **Session**：会话容器和上下文关联。
- **Turn**：一轮用户请求与 Agent 响应。
- **Episode**：相互关联的任务过程，可以包含多个轮次。
- **Source**：来源 Agent 的标识，用于归属与追溯，不等于完整权限控制。

固定版本的 turn-start 接口说明明确：需要已有会话；开始阶段记录召回和内部路由提议，**不创建 RawTurn、episode、L1 或演化任务**。最终 episode 归属在 turn-complete 时确定。这比“请求一进来就存成最终记忆”的理解更准确。

turn-complete 需要关联轮次、会话、真实请求和回答。手动 CLI、宿主 Hook 与插件对失败和取消状态的处理不完全相同，应按所用入口核对，不能假设所有集成共享同一状态规则。

来源：[turn-start 说明](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/cli/skills/memmy-memory/references/turn-start.md)、[turn-complete 说明](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/cli/skills/memmy-memory/references/turn-complete.md)。文中的接口名是分析说明，本研究未调用实际服务。

## 故障时的处理

| 故障 | 固定版本说明或源码行为 | 实际使用仍需确认 |
| --- | --- | --- |
| Memory 服务不可用 | 官方适配说明采用 fail-open，记录错误并让宿主继续 | 继续任务不等于召回或写回成功 |
| 查询向量生成失败 | 全文、短片段、结构线索可继续参与 | 结果相关性可能变化 |
| 写入后的向量生成失败 | 可进入后台重试路径 | 未完成索引记录是否满足召回条件 |
| 模型过滤不可用或返回格式错误 | 可退回机械排序候选 | 与合法返回“全部丢弃”区分 |
| 合法无命中 / 全部丢弃 | 可以返回无历史上下文 | 不应把未检索到等同于记录不存在 |
| 经验过时或条件不符 | 存在状态与价值管理机制 | 仍需核对版本和来源，必要时修正、失效或停用 |

来源：[固定版本集成说明](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/docs/en/memory/sources.mdx)、[固定版本检索说明](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/docs/en/memory/overview.mdx)。

## 数据在哪里处理

| 环节 | 数据 | 默认或可配置位置 |
| --- | --- | --- |
| 历史读取 | 本地会话与工具记录 | 本地适配器 |
| 保存和索引 | 正文、来源、状态、向量 | 本地 SQLite 默认存储 |
| Embedding | 待索引文本和查询文本 | 配置的本地或远程向量模型 |
| 摘要与提炼 | 执行记录、反馈、支持证据 | 配置的摘要 / 演化模型 |
| 查询与过滤 | 查询、候选片段 | 本地检索及可配置模型处理 |
| 实际 Agent 推理 | 当前请求、相关上下文与工具返回 | 对应 Agent 配置的模型 |

所以“本地存储”描述的是保存位置，不是全链路离线承诺。配置远程 Provider 时，相应输入会成为远程模型请求的一部分。Memory HTTP 的 token 鉴权按配置启用，source / namespace 不应被当作完整团队授权系统。

来源：[Memory 配置](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/readme.md)、[Embedding 实现](https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/Memory/src/model/embedder.ts)。

## 我们建议如何验证实际收益

以下为评测建议，尚未运行：

1. 选取一组可复现任务，固定源码、模型、工具环境与完成标准。
2. 设置“不启用记忆”和“启用记忆”两组，保留相同条件；考虑重复运行，避免单次偶然结果。
3. 记录任务成功率、错误历史引用、来源可追溯性、总耗时与模型成本。
4. 加入跨会话续接、旧经验冲突、服务不可用和长期历史召回等情况。
5. 先确认收益，再增加摘要、向量、更多数据源或自动技能提炼。

本研究库可用“比较两个相似 GitHub 项目的采用条件”作为第一组场景。注意：研究网页只是讲解，上述评测需要真实 Memmy 环境，不能用网页按钮切换作为效果验证。

[返回项目](../README.md)
