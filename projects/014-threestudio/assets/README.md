# threestudio 图片与图源

| 文件 | 用途 | 来源 |
| :--- | :--- | :--- |
| [complete-overview.png](complete-overview.png) | 根 README 与子项目共用的完整总览；含准备条件、输入、能力、流程、模块与输出 | 本研究依据固定版本官方文档、配置和代码原创排版 |
| [complete-overview.svg](complete-overview.svg) | 同内容可缩放版本，便于放大文字 | 与 PNG 使用同一内容源生成 |
| [render_overview.py](render_overview.py) | 图片内容与可复现绘制源 | 本研究原创脚本，非上游代码 |

图示不是上游界面截图，也不是模型实际生成效果。本次没有复用上游示例视频、图片或模型资产。来源提交：`28d9d80d9d00f308244adfcf3be8b17ca0cb6465`，研究日期 2026-09-10；证据和许可说明见[来源记录](../notes/03-sources-and-validation.md)。

## 重新生成

普通阅读无需安装任何依赖。如需重新生成图片，单独使用 Python 与 Pillow，给脚本传入本机中文字体及粗体字体路径：

```bash
python render_overview.py --font /path/to/chinese-font.ttf --bold-font /path/to/chinese-bold-font.ttf
```

从其他目录调用时使用脚本的实际路径；输出始终写入本 assets 目录。脚本会同时生成 PNG 和带文字的 SVG，PNG 中使用字体渲染，SVG 使用本机可用中文字体。Pillow 仅用于研究图绘制，不属于 threestudio 运行依赖。

[回到项目介绍](../README.md)
