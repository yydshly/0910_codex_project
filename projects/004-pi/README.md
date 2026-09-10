# 004 · Pi Agent Harness

Pi 是可扩展的 AI Agent 工具包，统一多模型接入，提供文件读写、命令执行、多轮工具调用、会话分支与上下文管理，并支持 Skills、扩展及 SDK/RPC 集成，可直接用于编程任务或构建定制业务助手。

## 项目资料

| 项目 | 内容 |
| :--- | :--- |
| 原始仓库 | [earendil-works/pi](https://github.com/earendil-works/pi) |
| 官方文档 | [仓库文档](https://github.com/earendil-works/pi/blob/400d6905ce46ec46e79da8a7701b1b48850192df/packages/coding-agent/README.md) · [官网](https://pi.dev) |
| 研究版本 | [400d6905ce46ec46e79da8a7701b1b48850192df](https://github.com/earendil-works/pi/commit/400d6905ce46ec46e79da8a7701b1b48850192df)，提交于 2026-09-09 21:29:53 UTC；coding-agent 包声明版本 0.85.1 |
| 上游许可证 | [MIT](https://github.com/earendil-works/pi/blob/400d6905ce46ec46e79da8a7701b1b48850192df/LICENSE)，Copyright (c) 2025 Mario Zechner |
| 技术栈 | TypeScript、Node.js、npm workspaces、TypeBox、自研终端 UI；Bun 用于独立可执行文件构建 |
| 研究状态 | 文档、部分核心源码与本地交互展示完成；未运行上游或调用真实模型 |
| 收录日期 | 2026-09-10 |
| 最近更新 | 2026-09-10 |
| 在线演示 | — |

包内版本号不代表本研究验证了对应 npm 发布物；可复现依据为固定提交。

## 研究摘要

推荐从 [完整理解总稿](notes/03-understanding.md) 开始，再阅读 [架构与调度双图分析](notes/02-architecture-and-scheduling.md)。

- **核心能力：** 读取和修改文件、运行命令、模型切换、流式工具执行、会话恢复与分支、上下文压缩，以及 CLI / JSON / RPC / SDK 接入。
- **技术原理：** 模型输出工具调用，运行时校验并执行，再把结果交回模型；消息、事件、工具与界面分层。
- **适用场景：** 个人编程助手、团队流程、内部业务 Agent、Agent 产品后端与模型实验。
- **扩展方向：** 业务工具、检索、MCP、多 Agent、IDE/Web 界面、隔离和评测，详见[完整分析](notes/01-analysis.md)。
- **关键边界：** MCP、多 Agent、计划模式没有默认内置；后两者已有官方扩展示例。项目资源信任不等同于操作系统权限隔离。

## 效果与图片说明

### 理论架构与业务调度双图

![Pi 完整架构：11 个组件包、常用 Agent 路线、实验性服务及技术能力](assets/architecture.png)

图 1：依据固定提交文档与源码原创绘制的完整架构图，非运行截图。[矢量原图](assets/architecture.svg) · [业务调度流程图](assets/scheduling-flow.svg) · [完整读图分析与来源](notes/02-architecture-and-scheduling.md)。Web 展示新增可缩放的双图阅读页，见 [运行说明](web/README.md)。

### 上游界面参考

新增 **Pi 能力实验室**：三条任务路径、八项能力、会话分支、上下文压缩与扩展组合。见 [展示内容与运行说明](web/README.md)。所有交互为教学模拟，不执行上游 Pi 或真实工具；尚未发布在线版本。

![Pi 终端显示项目上下文、技能、扩展、读取文件结果和输入区](assets/interactive-mode.png)

图 2：上游文档截图，画面版本为 **v0.49.3**，用于展示界面结构，不代表 0.85.1 的实测结果。来源：[固定提交原图](https://github.com/earendil-works/pi/blob/400d6905ce46ec46e79da8a7701b1b48850192df/packages/coding-agent/docs/images/interactive-mode.png)。图片未经修改；许可见 [assets](assets/README.md)。

## 研究问题

- [x] 核心使用流程是什么？见分析第 1、2 节。
- [x] 模块与数据如何组织？见分析第 2 节。
- [x] 哪些实现值得复用？见分析第 3、4 节。
- [ ] 本地运行是否验证了能力？尚未运行。

## 本地运行

研究展示可在本地运行，具体命令见 [Web 说明](web/README.md)。本次没有执行上游 Pi 或配置模型凭据。若复现上游，仍需选择模型服务与运行环境，固定版本验证文件操作、命令执行、会话恢复及扩展加载；Windows 另需核对上游平台说明。

## 笔记与实践

- [完整理解：能力、本质、工作流程、价值与验证边界](notes/03-understanding.md)
- [完整架构与业务调度：双图与源码索引](notes/02-architecture-and-scheduling.md)

- [能力、技术原理、使用场景与扩展方向](notes/01-analysis.md)
- [研究范围与验证边界](notes/README.md)
- [Web 演示说明](web/README.md)

## 结论

Pi 值得借鉴的是模型适配、工具闭环、会话树和扩展接口的分层设计。它适合定制工作流程；发展为多人业务平台还需要身份、隔离、调度、业务状态和评测。

## 来源与许可

事实引用固定到研究提交。仅引入一张上游截图及 MIT 许可证副本，未复制完整仓库、依赖或构建产物。扩展建议为本研究判断，不代表上游承诺。

---

[返回总项目索引](../../README.md#项目索引)
