# 项目图片

| 图片 | 用途 | 格式 |
| :--- | :--- | :--- |
| [能力范围](capability-map.png) | 输入优化与独立输出 Skill 的边界 | 1800 × 1390 PNG；[SVG](capability-map.svg) |
| [实现原理](compression-flow.png) | 有损压缩、回退与原文恢复 | 1800 × 1530 PNG；[SVG](compression-flow.svg) |
| [外部引导与上下文整理](external-guidance-architecture.png) | Codex 原生机制、可选 Caveman 层和研究验证的关系 | 1800 × 1580 PNG；[SVG](external-guidance-architecture.svg) |

来源：依据 JuliusBrussee/caveman 固定提交 `15581d14007fd01fb3f132016741962f34936ca2` 的文档与源码原创绘制，非运行截图。证据见[研究笔记](../notes/01-diagram-evidence.md)。

第三张图还参考 2026-09-10 查阅的 OpenAI 官方配置与命令文档，表示概念关系，非当前会话实际配置或部署状态；详见[原生能力对照](../notes/02-native-context-and-external-guidance.md)。

PNG 适合直接查看与分享；SVG 可无损放大，使用 Microsoft YaHei / Noto Sans CJK SC 字体回退，跨设备可能略有差异。

由 [render_diagrams.py](../scripts/render_diagrams.py) 生成；需要 Python、Pillow 和 Windows 微软雅黑字体，不需要上游应用依赖。

第三张图由 [render_guidance_architecture.py](../scripts/render_guidance_architecture.py) 生成，复用前述绘制工具。
