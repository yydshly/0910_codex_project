# 007 · DeepTutor

DeepTutor 是可自行部署和修改的 AI 教学工作台：接入教材、文档和现成模型，提供资料问答、分步解题、出题练习、阅读研究、学习路径与复习，并保存作答和学习状态。

与 NotebookLM 的资料学习成品、Open Notebook 的笔记研究和 SurfSense 的多来源研究相比，它更侧重可修改的教学流程：怎么教、怎么考、何时继续和复习。它们共用许多模型与检索方法，但证据组织、状态管理和工具执行存在实质差异，不能只看成界面变化。

对我们最有价值的是借鉴这些流程，把已经理解的资料检索能力接到“项目讲解 → 可执行练习 → 结果验证 → 学习反馈”，探索开源项目学习导师。这个扩展尚未实现；本研究也未验证上游教学效果。

[完整理解文档](notes/01-understanding.md) · [来源与验证边界](notes/02-sources-and-verification.md) · [网页构建与阅读](web/README.md)

## 项目资料

| 项目 | 内容 |
| :--- | :--- |
| 原始仓库 | [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) |
| 官方文档 | [DeepTutor Docs](https://docs.deeptutor.info/) |
| 研究版本 | v1.6.6 · `7a96bba1ae03401644c17763a2411c28aff3dcc9` |
| 上游许可证 | [Apache-2.0](https://github.com/HKUDS/DeepTutor/blob/7a96bba1ae03401644c17763a2411c28aff3dcc9/LICENSE) |
| 技术栈 | Python / FastAPI、Next.js / React、模型与检索服务 |
| 研究状态 | 完整理解、产品对照与静态网页已上线；上游未部署，教学效果未实测 |
| 收录及更新日期 | 2026-09-10 |
| 在线演示 | [完整理解与架构图](https://yydshly.github.io/0910_codex_project/007-deeptutor/) · [来源与验证](https://yydshly.github.io/0910_codex_project/007-deeptutor/sources.html) |

## 研究摘要

- **核心能力：** 围绕资料进行问答、解题、出题、研究、阅读、可视化与持续学习。
- **主要理解：** 基础模型与检索方法有共性；教学规则、学习记录、状态转移和工具编排构成实际业务增量。
- **同类对照：** NotebookLM 是成品资料学习工具；Open Notebook 偏资料与笔记研究；SurfSense 偏多来源研究、连接器与自动化；DeepTutor 着重教学过程。定位存在重叠，不能按名称划分成不同技术体系。
- **研究价值：** 基于已经理解的 SurfSense 技术链路，重点考察 DeepTutor 新增的教学流程、评分、复习与记忆机制。
- **限制：** 架构完整和功能丰富不能直接证明回答质量或教学效果更好。

## 理解总览

![DeepTutor 完整架构：输入产物、教学闭环、模型工具循环、知识检索与记忆、基础模型、同类产品对照及扩展边界](assets/full-architecture.png)

图 1：依据固定版本源码、官方文档和本次讨论原创绘制的完整概念架构，非上游界面或实际部署拓扑。来源与解释见[完整理解](notes/01-understanding.md)和[图片说明](assets/README.md)。

[放大完整架构图（SVG）](assets/full-architecture.svg) · [高清图片（PNG）](assets/full-architecture.png) · [三层职责简图](assets/architecture.svg)

## 阅读与实践

- [完整理解：能力、技术共性、产品区别与扩展](notes/01-understanding.md)
- [来源、版本、许可与验证记录](notes/02-sources-and-verification.md)
- [静态研究网页运行说明](web/README.md)

本项目网页用于阅读研究结论，不运行 DeepTutor，不上传资料，不生成真实题目，也不计算真实掌握度。上游本地运行尚未验证。

---

[返回总项目索引](../../README.md#项目索引)
