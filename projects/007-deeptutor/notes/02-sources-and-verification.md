# 来源与验证记录

整理日期：2026-09-10。

## 版本与许可

| 项目 | 固定研究版本 | 许可 |
| :--- | :--- | :--- |
| DeepTutor | `7a96bba1ae03401644c17763a2411c28aff3dcc9` / v1.6.6 | [Apache-2.0](https://github.com/HKUDS/DeepTutor/blob/7a96bba1ae03401644c17763a2411c28aff3dcc9/LICENSE) |
| Open Notebook | `2d2df8a3cbb098776e56ca5ee77b9832f848228e` | [MIT](https://github.com/lfnovo/open-notebook/blob/2d2df8a3cbb098776e56ca5ee77b9832f848228e/LICENSE) |
| SurfSense | `3448772bd3d5d439114f810ac5da8e5a86967917`，沿用 0909 研究库基线 | [主体许可](https://github.com/MODSetter/SurfSense/blob/3448772bd3d5d439114f810ac5da8e5a86967917/LICENSE)与[指定目录 BSL 1.1](https://github.com/MODSetter/SurfSense/blob/3448772bd3d5d439114f810ac5da8e5a86967917/surfsense_backend/app/proprietary/LICENSE)分开核对 |

商业产品和官方文档站按 2026-09-10 查阅内容整理，页面可能持续更新。完整的主张—来源对应见[理解文档的来源索引](01-understanding.md#来源索引)。未复制完整上游仓库或商业宣传材料；示意图为本研究原创。

## 交叉核对

- SurfSense 对照沿用已有 `0909_codex_project/projects/014-surfsense/notes/understanding.md` 的研究结论，并重新核对固定版本的混合检索和 Agent 组装代码。
- Open Notebook 的整体功能来自官方 README / 架构文档；Ask 的搜索策略、分路检索与汇总来自固定版本源码。未把单一路径当作整个产品的全部实现。
- DeepTutor 的掌握门槛来自官方学习路径文档，基础分数计算来自源码；未把基础评分算法表述成经过验证的教育测量模型。
- Google 官方公告用于避免把当前 NotebookLM 描述为只能总结、不能出题或运行代码；未推测其未公开的完整内部架构。

## 展示实现与验证

- 网页为无第三方依赖的静态阅读页，不包含模拟 AI 答案、上传入口或伪造的学习记录。
- 正文由 `01-understanding.md` 构建生成，来源与验证记录一并转为 HTML，防止文档和网页维护两套结论。
- 构建与检查包括：来源引用解析、HTML 锚点与本地资源、Markdown 下载、子路径链接与统一 Pages 构建。
- 完整架构图由同一布局生成 SVG 与 2400 × 3510 PNG；检查了文字边界和重叠，并查看了 PNG 排版。图中的 S1–S20 与正文来源对应，概念分层不等同于部署拓扑。
- 未执行上游后端、真实模型调用或学习效果测试。未进行浏览器截图、真实点击及视觉测试。
- 当前 Sites 托管工具不可用，静态页面保留在既有 GitHub Pages 构建结构中；未发布，未登记新的线上地址。

[返回完整理解](01-understanding.md) · [返回项目](../README.md)
