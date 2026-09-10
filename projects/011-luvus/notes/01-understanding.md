# Luvus：任务管理与 Agent 适配

我们用两个模块理解 Luvus：任务管理负责组织工作，适配层负责连接已有 Agent。接入的 Agent 才负责调用自己的模型和工具，完成具体任务。UI 是观察和操作这些能力的入口。

研究基线为 2026-09-10 的 f3f3ae05e7e6ae6efe4501cca329774cf35715e1，版本 0.13.4。以下“具备”指固定源码和文档中存在能力，本次没有运行上游验证效果。

## 1. 三个模块，各自负责什么

| 模块 | 核心职责 | 谁执行 |
| --- | --- | --- |
| 任务管理 | 建立任务、下发指令、依赖与状态管理、检查和分支整合 | Luvus 后台；人或主 Agent 决定具体工作 |
| Agent 适配 | 识别工具、启动程序、提交输入、发现和恢复会话、接收事件 | Agent 描述、适配代码和终端控制 |
| 实际执行 | 阅读资料、改代码、运行命令、调用模型与工具 | 已接入的 Claude Code、Codex、Pi 等助手 |

前两个是理解 Luvus 的主要模块，第三个是它连接的执行端。这是概念划分，并非把源码严格分成两个目录；终端、持久化、Git 和控制协议是支撑这些能力的工程基础。

## 2. 核心能力与任务下发

Luvus 提供工作区、分屏、后台终端、Agent 状态与会话管理，也支持跨 Agent 通信、正式任务、独立工作目录、检查命令、分支整合、远程接入和定时任务。具体 Agent 的恢复、分叉、用量统计与事件能力并不一致。

**直接下发指令**：向指定助手发送文字，可以等待状态变化并读取终端输出。适合临时询问、追加要求和交接反馈，不一定建立正式任务记录。

**正式任务下发**：记录任务说明、依赖、预期修改路径、检查命令与执行者，然后启动助手。任务状态、产出和备注可以持续跟踪。自动化在配置时间到达后创建任务并启动指定助手；当前自动化在上游文档中标为 Beta。

典型流程：建立任务 → 检查依赖和路径占用 → 创建 worktree 或共享工作区任务页 → 启动 Agent → 执行 → 检查 → 整合结果。

- worktree 为任务准备独立检出目录和分支；共享工作区模式使用现有目录，没有独立合并步骤。
- 路径占用检查协调任务声明的修改范围；不等于操作系统禁止其他进程写这些文件。
- 配置质量检查时，完成操作会运行检查；失败进入待处理状态。未配置检查时可以直接完成。
- worktree 结果可合并到专用 luvus/integration 分支，冲突会阻塞；不等于自动合并到主分支或发布产品。
- 依赖其他分支结果的任务，需要等待其整合后再启动；程序状态与业务验收仍须区分。

依据：[编排文档](https://luvus.dev/docs/guides/orchestration/)、[任务分发](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/app/dispatch/orchestration.rs)、[检查与合并](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/app/board.rs)。

## 3. 适配层到底适配什么

| 适配项 | 实现目的 |
| --- | --- |
| 身份描述 | 根据进程等证据识别是哪种助手 |
| 启动命令和参数 | 正确启动助手并传入任务 |
| 会话发现 | 从助手自身数据目录找到可用会话 |
| 恢复和分叉 | 调用助手支持的原生操作 |
| 可选事件钩子 | 获得更精确的会话归属和生命周期事件 |
| 定时执行配置 | 声明已实现的无人值守启动方式与权限参数 |

源码通过 AgentDescriptor 和统一注册表组织这些能力。识别规则只解决“看见这个 Agent”，不自动赋予恢复、分叉和无人值守运行能力。上游命令和会话格式变化后，相关适配需要维护。

UHP 是控制 Luvus 的协议。外部客户端调用它后，Luvus 再控制目标终端或 Agent。不能认为所有接入助手都原生实现了 UHP，也不应把它当成已经通行的行业标准。

依据：[适配结构](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/agent/types.rs)、[注册表](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/agent/registry.rs)、[UHP](https://luvus.dev/docs/uhp/)。

## 4. 多 Agent 与可选的主 Agent

它具备多 Agent 管理与编排能力，但具体用法可以是单助手、多助手各自工作，或真正的任务协作。多个 Agent 可以使用相同工具和模型，关键是独立会话、职责与交接。

| 协作方式 | 谁决定下一步 | 交互路径 |
| --- | --- | --- |
| 人直接管理 | 人 | 人 → Luvus → 各执行 Agent |
| 主 Agent 协调 | 主 Agent，必要时交给人 | 主 Agent → Luvus → 执行 Agent → 反馈 |
| Agent 直接交接 | 发起交接的 Agent | Agent A → Luvus → Agent B |
| 预设自动化 | 已保存的时间与任务规则 | 调度器 → 配置的 Agent |

**主 Agent 可选，后台服务是控制中心。** 后台负责定位、提交、启动、状态和记录；主 Agent 是可选的规划与判断者。程序按配置调度不意味着模型已经替你合理拆分任务。

通信通常是把文字提交到目标助手自己的终端输入，随后观察状态、读取输出，或让执行者主动报告。发送成功代表输入已被接受入队，不代表任务完成。Luvus 不会仅因通信就把完整上下文、隐式推理或长期记忆同步给其他助手。

依据：[Agent 通信](https://luvus.dev/docs/guides/agent-messaging/)。

## 5. 底层怎样持续运行

后台服务拥有真实 PTY 终端、进程、布局和状态；前台负责输入和界面。关闭前台而后台仍运行时，任务可以继续。服务重启后，支持的会话通过助手自身方式恢复；这不是把关机前的任意进程原地续跑。

主要 UI 状态在一个事件循环中修改，慢操作由后台线程处理并回传事件。前台渲染传输与公开的 UHP 是不同接口。身份识别参考进程证据，状态结合终端特征与事件钩子；“结束”是运行状态信号，不是结果正确性的证明。

依据：[后台服务](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/ipc/server.rs)、[架构文档](https://luvus.dev/docs/explanation/architecture/)、[状态与会话](https://luvus.dev/docs/guides/agents/)。

## 6. 与 Multica、MetaGPT 的本质区别

Luvus 与 Multica 都主要接入现成 Agent 工具；MetaGPT 主要在框架内构建角色及其执行逻辑。Luvus 和 Multica 都有任务管理，差异不只是“终端”和“看板”的外观。

| 维度 | Luvus | Multica | MetaGPT |
| --- | --- | --- | --- |
| 核心对象 | 终端会话、任务、工作目录 | Issue、成员、小队、Run、评审 | Role、Action、消息、记忆、Team |
| 执行链 | 后台 → 适配与终端 → Agent 工具 | 队列 → Daemon → Provider → Agent 工具 | Team / Environment → Role → Action / 模型与工具 |
| 任务交接 | 终端输入、状态等待、输出或主动反馈 | 评论与提及触发执行，反馈重新唤醒组长 | 消息投递、事件关注或负责人动态分派 |
| 管理侧重点 | 现场操作、持续会话、路径协调、检查与合并 | 长期目标、讨论、节点路由、队列与评审 | 专业角色行为、工具与程序化流程 |
| 主 Agent | 可选，由人或主控组织工作策略 | Squad 提供组长与成员交接约定 | 固定交接与 TeamLeader 动态分派 |
| 扩展着力点 | 工具适配、模块、UHP 客户端 | Provider、Skills、小队、业务与运行管理 | Role、Action、消息规则和工具 |

Multica 中 Issue 是持续目标，Run 是一次执行，一个 Issue 可经历多次 Run；一次执行结束不代表验收结束。MetaGPT 的角色通常是有状态的程序对象，不要求每个角色独占一个操作系统线程或使用不同模型。不能把 MetaGPT 简化为只有固定岗位流水线。

对照基线：[Multica 9d36136](https://github.com/multica-ai/multica/tree/9d3613653e310bbbed5ae294efd8f405e3b722aa)、[MetaGPT 11cdf46](https://github.com/FoundationAgents/MetaGPT/tree/11cdf466d042aece04fc6cfd13b28e1a70341b1f)。原有研究：[Multica](https://github.com/yydshly/0909_codex_project/blob/main/projects/011-multica/notes/understanding.md)、[MetaGPT](https://github.com/yydshly/0909_codex_project/blob/main/projects/012-metagpt/web/research.md)。官方补充：[Multica 执行链](https://multica.ai/docs/how-multica-works)、[小队](https://multica.ai/docs/squads)。

## 7. 与 Pi、Pi Web、Memmy 的关系

- Pi 侧重模型、工具与上下文的 Agent 运行循环；研究版本没有默认内置多 Agent，但有扩展示例。
- Pi Web 把 Pi SDK 组织成浏览器工作台；子 Agent 扩展默认关闭，启用后可在 Pi 引擎内委派。
- Memmy 外接模式侧重共享记忆与经验，原 Agent 仍执行任务；它也有自带运行时。共享记忆不等于编排。
- Luvus 把多个已有执行工具放到一个管理环境。这些能力可以组合，但效果与成本需要实验。

原有研究：[Pi](https://github.com/yydshly/0910_codex_project/tree/main/projects/004-pi)、[Pi Web](https://github.com/yydshly/0910_codex_project/tree/main/projects/008-pi-web)、[Memmy](https://github.com/yydshly/0910_codex_project/tree/main/projects/002-memmy-agent)。

## 8. 对我们的用途与扩展方向

适用场景包括多项目研究、混用不同 CLI 助手、远程长任务、并行开发与周期维护。只有一个助手、任务按顺序完成时，额外工作台的价值可能有限；这是基于架构的判断，不是实测排名。

我们可以配置：来源与许可证核查 → 源码分析与独立实验 → 结论复核 → 中文文档 → 更新根 README。可并行的工作分别执行，根索引最后统一处理。跨目录交接仍需明确产物与合并方法。

以下是扩展设想，尚未实现或验证：

| 方向 | 可以增加的具体能力 |
| --- | --- |
| 研究验收 | 检查研究提交、许可证、来源、未实测标记和图片链接 |
| 研究进度模块 | 侧栏显示阅读、实验、复核和归档状态 |
| 共享研究记忆 | 接入外部存储和检索，复用结论与失败经验 |
| 结果与成本评估 | 比较通过率、返工、人工介入、耗时与费用 |
| 新入口或团队使用 | 使用 UHP，并补齐身份、授权、审计与环境隔离 |

模块通过配置声明可执行程序，扩展菜单、侧栏、面板与事件；UHP 提供状态、终端和任务控制。当前信任基础是单用户系统账户，远程接入不等同于完整多租户平台。依据：[模块](https://luvus.dev/docs/extend/writing-modules/)、[信任模型](https://luvus.dev/docs/explanation/security/)。

## 9. 最终理解与验证边界

入口是“任务管理＋Agent 适配”，UI 帮助操作和观察，已有 Agent 负责执行。主 Agent 是可选组织方式；多 Agent 的价值取决于分工、交接与验收，而不是数量。

本次不证明 Luvus 比 Multica 或 MetaGPT 更快、更便宜或更准确。此前 MetaGPT 实验验证的是固定动作下的消息交接与测试返修，不能替代默认 AI 团队的真实项目交付评估。本次未运行 Luvus。
