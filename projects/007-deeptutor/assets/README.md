# 图片说明

| 文件 | 用途 | 来源与边界 |
| :--- | :--- | :--- |
| [full-architecture.svg](full-architecture.svg) | 完整架构矢量图，可放大阅读 | 本研究原创；覆盖输入与产物、教学闭环、运行循环、知识与记忆、模型、产品比较和扩展边界。S1–S20 对应[正文来源索引](../notes/01-understanding.md#来源索引)。 |
| [full-architecture.png](full-architecture.png) | 2400 × 3510 高清图片，供 README 与网页预览、分享 | 与 SVG 使用同一布局生成；源码事实、比较判断和建议扩展分别标注。 |
| [architecture.svg](architecture.svg) | 根 README、子项目与网页共用的三层职责示意图 | 本研究原创；依据 DeepTutor v1.6.6 的循环扩展、Solve 与掌握度代码及官方文档整理。不是产品截图，也不表示已运行或验证教学效果。 |

图中的三层是解释职责的概念分层，不是上游目录或部署服务的一一对应关系。模型与程序共同完成教学：模型生成或辅助判断，程序保存状态和执行规则。

完整图由 [绘图脚本](../experiments/draw-full-architecture.py) 同时生成 SVG 和 PNG，使用 Pillow 和本机微软雅黑字体。脚本检查文字边界与互相重叠；本次另已查看 PNG，确认排版。图中文字来自本研究整理，未复制上游产品截图。
