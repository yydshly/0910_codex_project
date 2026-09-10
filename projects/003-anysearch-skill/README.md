# 003 · AnySearch Skill

AnySearch 云端搜索服务的开源客户端与 Skill 规范，为已有 AI Agent 接入通用搜索、专业数据查询、并行检索和正文抽取。实际检索由远端服务器执行，仓库不包含可自行部署的搜索后端。它能帮助缺少搜索工具的 Agent 接入服务，也为我们提供能力发现、参数设计和多语言工具封装的参考。

## 项目资料

| 项目 | 内容 |
| :--- | :--- |
| 原始仓库 | [anysearch-ai/anysearch-skill](https://github.com/anysearch-ai/anysearch-skill) |
| 官方文档 | [上游 README](https://github.com/anysearch-ai/anysearch-skill/blob/15b7ea5039983c9dee328be8c7c609f3eb86058e/README.md) |
| 研究版本 | `15b7ea5039983c9dee328be8c7c609f3eb86058e`；技能版本 3.1.1；提交日期 2026-09-02 |
| 上游许可证 | [Apache-2.0](https://github.com/anysearch-ai/anysearch-skill/blob/15b7ea5039983c9dee328be8c7c609f3eb86058e/LICENSE)，适用于仓库代码，不代表远端服务可以自行部署 |
| 技术栈 | Markdown、Python、Node.js、PowerShell、Bash、HTTP JSON API |
| 研究状态 | 文档、完整图与线上展示完成；源码分析、三种运行时本地接口测试及少量在线验证完成 |
| 收录日期 | 2026-09-10 |
| 最近更新 | 2026-09-10 |
| 在线演示 | [客户端背后的搜索服务](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/) · [完整研究在线阅读](https://yydshly.github.io/0910_codex_project/003-anysearch-skill/notes/05-complete-understanding.html) |

## 研究摘要

- **核心定位：** 仓库开放接入代码，搜索由云端执行；当前没有获得对应服务端的公开源码。
- **接入能力：** 通过远端服务完成通用搜索、垂直领域查询和网页正文抽取；客户端支持最多五项并行搜索。
- **值得借鉴：** 先发现能力再调用，用技能规范指导 Agent，以共享规范维护多语言客户端。
- **同类方案：** Tavily、Exa、Brave Search API、Parallel 等提供检索服务；SearXNG 可用于研究开源聚合搜索后端，Firecrawl、Crawl4AI 可用于研究抓取和正文提取。
- **对我们的意义：** 适合学习服务接入与 Agent 工具设计；若 Agent 已有搜索，应比较数据覆盖、准确率、时效和成本，再判断是否值得增加此客户端。核心搜索算法仍需研究其他公开后端。
- **适用场景：** 编程资料检索、研究资料收集、事实核查和行业助手的检索环节。
- **限制与取舍：** 搜索和抽取依赖远端服务；仓库不包含搜索后端或完整研究 Agent；质量未做系统评测。

## 完整理解总览

[![AnySearch 完整理解：客户端与云端服务边界、能力、收费、同类产品及开源 Agent 的搜索调用来源](assets/research-overview.png)](assets/research-overview.svg)

图 1：依据固定研究版本源码、在线能力目录和官方文档绘制的原创总览，非产品截图。价格及生态信息核对于 2026-09-10，未知实现明确标注。[完整理解总稿](notes/05-complete-understanding.md) · [放大 SVG](assets/research-overview.svg) · [简版调用架构](assets/architecture.svg) · [图片来源](assets/README.md)

## 详细研究

- **[完整理解总稿：客户端、搜索服务与 Agent 生态](notes/05-complete-understanding.md)**：优先阅读，集中回答本轮讨论的全部问题。
- [能力、技术原理、使用场景与扩展方向](notes/01-analysis.md)
- [验证结果与复现方法](notes/02-verification.md)
- [服务端、40 项能力与原理边界](notes/03-server-and-capabilities.md)
- [同类产品与主流 Agent 的搜索能力](notes/04-alternatives-and-agent-search.md)
- [笔记目录](notes/README.md)
- [Web 演示状态](web/README.md)

## 研究问题

- [x] 核心能力与技术边界。
- [x] 动态能力发现、并行机制和跨平台实现。
- [x] 适用场景与可扩展方向。
- [x] 最小客户端行为和在线接口可用性。
- [ ] 各领域准确率、覆盖率、时效性、成本和长期可用性。
- [ ] 远端数据源及排序机制。

## 本地运行与来源

环境与复现步骤见[验证记录](notes/02-verification.md)。上游代码仅在系统临时目录用于研究，没有复制进本项目，也未安装为个人技能。本文及示意图为原创分析，源代码证据链接固定到研究提交。在线目录与结果是 2026-09-10 的观察，后续可能变化。

---

[返回总项目索引](../../README.md#项目索引)
