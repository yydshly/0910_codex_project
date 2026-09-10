# 来源与验证

研究日期：2026-09-10。Luvus 固定提交 f3f3ae05e7e6ae6efe4501cca329774cf35715e1；Cargo.toml 版本 0.13.4；Apache-2.0。完整上游副本保留在本机临时研究目录，不进入本仓库。

## 主要源码证据

| 主题 | 固定源码 |
| --- | --- |
| 版本和依赖 | [Cargo.toml](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/Cargo.toml) |
| 后台持有终端与界面 | [ipc/server.rs](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/ipc/server.rs) |
| 真实终端与输入队列 | [terminal/pty.rs](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/terminal/pty.rs) |
| Agent 适配描述与注册 | [types.rs](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/agent/types.rs)、[registry.rs](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/agent/registry.rs) |
| 状态规则 | [detect.rs](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/detect.rs) |
| 任务与路径登记 | [orch/mod.rs](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/orch/mod.rs) |
| 检查与整合 | [app/board.rs](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/src/app/board.rs) |
| 通信原理 | [固定版本通信文档](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/website/src/content/docs/docs/guides/agent-messaging.mdx) |
| UHP 协议 | [固定版本 UHP 文档](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/website/src/content/docs/docs/uhp/index.mdx) |

## 对照来源

- Multica 基线：[9d3613653e310bbbed5ae294efd8f405e3b722aa](https://github.com/multica-ai/multica/tree/9d3613653e310bbbed5ae294efd8f405e3b722aa)。参考此前研究与 2026-09-10 官方文档；未重新进行运行对测。
- MetaGPT 基线：[11cdf466d042aece04fc6cfd13b28e1a70341b1f](https://github.com/FoundationAgents/MetaGPT/tree/11cdf466d042aece04fc6cfd13b28e1a70341b1f)。此前验证仅覆盖固定动作、框架消息和真实测试返修，没有模型推理。
- Pi、Pi Web、Memmy 引用本研究仓库各项目已有固定版本分析，不据此宣称三者已完成与 Luvus 的集成。

## 验证范围

- 已阅读文档与核心代码，核实模块职责、任务下发、适配、消息和检查流程。
- 原创两张 SVG 图，保存完整 Mermaid 源图；图示不代表实际运行轨迹。
- 网页为静态研究展示，不启动 Agent、不调用模型，也不提交真实任务。
- 未安装运行 Luvus，未验证跨平台兼容性、状态准确率、并行效率、费用收益和任务交付质量。
- 不把源码测试的存在当成本次实际执行了上游测试。

## 展示发布记录

本地静态展示检查已通过：四个阅读页、九节研究正文、63 处项目链接与锚点，下载正文与原笔记一致，原始 Mermaid 与文档中的源图一致。整站十个项目构建通过，484 处站内引用通过子路径检查。

两张原创 PNG 已目视检查，修改了详细图中字体不支持的符号。网页已通过本地 HTTP 访问，预览请求提交到应用后返回 queued，未确认前台实际显示；未做浏览器截图、交互点击或手机视觉回归。详细图在小屏幕上可通过原图链接放大，正文表格允许横向滚动。

首发源码为 d6bbf00d670ff13de696367f41903a71db937905；[发布运行成功](https://github.com/yydshly/0910_codex_project/actions/runs/34455572268)。2026-09-10 实际核对线上 deployment.json 与该版本一致，13 个 Luvus 文件返回 HTTP 200，文本统一换行后与验证构建一致，PNG 字节一致；HTML、SVG、PNG 类型正确。原有九个演示入口及导航首页访问通过，首页包含 Luvus 入口。

[在线引导](https://yydshly.github.io/0910_codex_project/011-luvus/) · [完整理解](https://yydshly.github.io/0910_codex_project/011-luvus/understanding.html) · [详细架构](https://yydshly.github.io/0910_codex_project/011-luvus/architecture.html)。此记录证明静态研究展示已发布，不证明上游 Agent 运行能力。

## 来源与许可

Luvus 使用 [Apache-2.0](https://github.com/RizRiyz/luvus/blob/f3f3ae05e7e6ae6efe4501cca329774cf35715e1/LICENSE)。本文和图示为独立中文整理，不复制上游全文、界面素材或完整源码。Multica 与 MetaGPT 的许可及实验边界保留在其原研究文档中，本页不作商业许可判断。
