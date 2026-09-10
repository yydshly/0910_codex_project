# Luvus：详细架构与读图说明

先用入口图理解“任务管理＋Agent 适配”；本页保留上一轮的详细图，按需深入。静态图按七组模块重排，完整有向关系保留在下方 Mermaid 源图中。

## 1. 完整架构的分层阅读版

![决策、管理、适配、执行、任务闭环、产品对照和用途边界](../assets/full-architecture.svg)

图源：本研究依据固定提交 f3f3ae0 和本次讨论原创整理，非产品截图与运行轨迹。[放大 SVG](../assets/full-architecture.svg) · [下载 PNG](../assets/full-architecture.png)。

## 2. 如何阅读

- 第 1 组：人、可选主 Agent、Agent 交接或预设规则决定任务来源。后台服务不等于主 Agent。
- 第 2、3 组：Luvus 提供任务与会话管理，再通过适配和终端控制连接助手。
- 第 4 组：助手自己调用模型与工具；输出和状态返回管理层，必要时直接交接给其他助手。
- 第 5 组：正式任务的依赖、执行、检查与整合闭环；无检查可直接完成，共享工作区没有独立合并步骤。
- 第 6、7 组：产品对照和研究用途，是解释层，不是程序执行步骤。

## 3. 原始 Mermaid 图

保留前一轮完整图的模块、节点和有向关系，移除仅用于展示的颜色与局部布局配置。图较密集，适合查看具体关系或自行调整布局。[下载 Mermaid 源文件](../assets/full-architecture.mmd)。

```mermaid
flowchart TB
    ROOT["Luvus：支持多 Agent 的终端工作台与任务编排系统<br/>接入已有 Agent，统一管理界面、会话、任务和执行过程"]
    subgraph S1["① 谁决定做什么？—— 主 Agent 可选"]
        HUMAN["人直接管理<br/>提出目标、指定执行者<br/>查看结果、决定下一步"]
        LEAD["主 Agent 协调<br/>理解目标、拆分任务<br/>委派工作、汇总与判断"]
        PEER["Agent 直接交接<br/>A 给 B 发任务或反馈<br/>无需经过主 Agent"]
        AUTO["已配置的自动化<br/>到期触发任务<br/>按预设 Agent 和规则运行"]
    end
    ROOT --> S1
    subgraph S2["② Luvus 控制与管理层 —— 程序负责送达、启动、记录和协调"]
        ENTRY["统一操作入口<br/>终端 UI ／ CLI ／ UHP 控制协议"]
        DIRECT["直接下发指令<br/>向指定 Agent 提交文字<br/>补充要求、等待、读取输出<br/>不一定创建正式任务记录"]
        TASK["正式任务管理<br/>任务说明、执行者、依赖关系<br/>预期修改路径、状态、产出、备注"]
        WORKSPACE["工作环境管理<br/>项目、标签页、分屏、终端历史<br/>后台持有进程、会话恢复、远程接入"]
        OBSERVE["执行观察<br/>工作中／空闲／等待确认／结束<br/>读取支持的会话用量与费用<br/>识别到结束 ≠ 业务验收通过"]
        ENTRY --> DIRECT
        ENTRY --> TASK
        ENTRY --> WORKSPACE
        ENTRY --> OBSERVE
    end
    HUMAN --> ENTRY
    LEAD --> ENTRY
    PEER --> ENTRY
    AUTO --> TASK
    subgraph S3["③ 适配与控制层 —— 把不同 Agent 接到同一个工作台"]
        ADAPTER["按 Agent 实现适配<br/>身份识别、启动命令与参数<br/>会话发现、恢复、分叉<br/>可选事件钩子、定时运行配置"]
        TERMINAL["终端控制<br/>创建或定位目标终端<br/>提交输入与按键<br/>等待状态、读取输出"]
        DETECT["状态与数据来源<br/>进程信息、终端特征<br/>原生会话文件、结构化事件<br/>不同 Agent 的支持深度不同"]
    end
    DIRECT --> TERMINAL
    TASK --> ADAPTER
    WORKSPACE --> TERMINAL
    ADAPTER --> TERMINAL
    DETECT -.-> OBSERVE
    subgraph S4["④ 真正执行任务的 Agent —— 保留各自的模型与工具循环"]
        AGENTS["已有 Agent 程序与独立会话<br/>Claude Code ／ Codex ／ Pi ／ 其他支持的 CLI<br/>可以混用不同工具，也可以运行同一种工具的多个会话"]
        MODEL["Agent 自己调用模型<br/>理解任务、选择下一步<br/>生成内容或工具调用"]
        TOOLS["Agent 自己执行工具<br/>读取文件、修改代码、运行命令<br/>检索资料、调用可用外部服务"]
        RESULT["产出与反馈<br/>代码、文档、实验结果、终端输出<br/>可主动通过 Luvus 向其他 Agent 回报"]
        AGENTS --> MODEL
        MODEL -->|"请求执行"| TOOLS
        TOOLS -->|"返回结果，继续推理"| MODEL
        AGENTS --> RESULT
    end
    TERMINAL -->|"启动程序／提交任务"| AGENTS
    AGENTS -.->|"运行证据"| DETECT
    RESULT -.->|"需要继续协作时"| ENTRY
    subgraph S5["⑤ 正式任务闭环 —— 从下发到结果整合"]
        QUEUE["建立任务与依赖<br/>人或主 Agent 定义工作<br/>依赖满足后可领取或启动"]
        ISOLATE["启动与并行协调<br/>独立 Git worktree，或显式共享工作区<br/>检查任务声明的路径是否重叠"]
        EXEC["分配 Agent 执行<br/>记录状态、输出和备注<br/>需要时补充指令或人工介入"]
        GATE{"运行已配置的<br/>质量检查"}
        REVIEW["未通过：进入待处理状态<br/>查看失败证据、修复、重试"]
        DONE["通过：任务完成<br/>未配置检查时可直接完成<br/>仍需依据业务标准评审"]
        MERGE["worktree 任务可进入整合<br/>合并到专用 integration 分支<br/>冲突则阻塞并处理"]
        NEXT["结果交接与后续任务<br/>分支依赖等待整合完成<br/>人或主 Agent 决定后续推进"]
        QUEUE --> ISOLATE --> EXEC --> GATE
        GATE -->|"失败"| REVIEW
        REVIEW --> EXEC
        GATE -->|"通过"| DONE
        DONE --> MERGE --> NEXT
    end
    TASK -.->|"展开正式任务流程"| QUEUE
    RESULT -->|"产出进入检查与评审"| GATE
    subgraph S6["⑥ 三种产品的差异 —— 都能协作，组织层次不同"]
        LUVUS["Luvus：围绕执行现场<br/>终端、会话、任务、工作目录<br/>通过适配与终端控制已有 Agent<br/>突出持续运行、并行协调、检查与整合"]
        MULTICA["Multica：围绕长期任务协作<br/>Issue、讨论、成员、小队、评审<br/>平台队列 → Daemon → Provider → Agent<br/>Issue 可经历多次 Run<br/>组长评论委派，反馈触发下一轮"]
        META["MetaGPT：围绕框架内角色<br/>Team、Environment、Role、Action<br/>框架消息 → 角色 → 模型与工具<br/>支持预设交接与负责人动态分派<br/>重点是定制角色行为与协作流程"]
    end
    NEXT ~~~ S6
    subgraph S7["⑦ 对我们的用途与边界"]
        VALUE["研究流程示例 · 需要自行配置<br/>来源与许可证核查<br/>源码分析＋独立实验<br/>结论复核 → 中文文档 → 更新索引"]
        BOUNDARY["理解边界<br/>后台服务 ≠ 主 Agent<br/>多窗口 ≠ 自动协作<br/>消息交接 ≠ 自动共享全部记忆<br/>路径占用协调 ≠ 文件权限隔离<br/>关闭界面继续运行 ≠ 关机后原地续跑<br/>任务结束 ≠ 结论正确"]
        EVIDENCE["验证状态<br/>依据固定源码与官方文档整理<br/>Luvus 本次未安装运行<br/>架构能力不代表已证明效率或质量提升"]
    end
    S6 ~~~ S7
    TASK -.->|"可用于组织"| VALUE
```
