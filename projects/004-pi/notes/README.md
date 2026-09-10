# 研究笔记

研究日期：2026-09-10。上游：[earendil-works/pi](https://github.com/earendil-works/pi)，提交 `400d6905ce46ec46e79da8a7701b1b48850192df`。

## 笔记索引

1. [能力、技术原理、使用场景与扩展方向](01-analysis.md)
2. [完整架构与业务调度：双图、模块职责、时序与源码索引](02-architecture-and-scheduling.md)
3. [完整理解总稿：能力、本质、工作流程、价值与验证边界](03-understanding.md)

4. [远端发布与验证记录](04-verification.md)

## 验证范围

- 已读取根说明、许可证、包版本，以及 ai、agent、tui、chord、telemetry 文档。
- 已读取 SDK、RPC、会话格式、压缩、Skills、Extensions 文档。
- 已核对 Agent 循环、工具注册、edit 与 bash 的部分源码。
- 已确认 subagent 和 plan-mode 官方示例存在并阅读说明，未运行。
- 已目视检查上游截图，画面版本 v0.49.3，不作为当前版本运行证据。
- 未验证真实模型兼容性、任务成功率、性能、成本、Windows 完整体验、隔离和部署。

## 交互展示验证

新增 [Pi 能力实验室](../web/README.md)，与上游运行验证分开记录。已检查三条模拟任务的状态转换、16 种扩展组合、上下文切换、模块语法、页面引用和目标元素；本地页面与资源返回 HTTP 200。统一构建与子路径检查通过。已发布远端 GitHub Pages 并核对版本、HTTP 状态和文件内容，详见 [发布验证记录](04-verification.md)。未执行浏览器视觉与真实点击测试。
