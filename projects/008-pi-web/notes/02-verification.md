# 验证范围与发布记录

日期：2026-09-10。上游研究提交：`b1a72962d385db4a82b93ad5802e9024d5b44874`。

## 研究与素材

- 核对上游 README、package.json、LICENSE、运行核心、工具预设、终端说明、子智能体与认证实现；只保留整理后的研究成果，不引入完整上游副本。
- Codex 对比参照官方[桌面说明](https://learn.chatgpt.com/docs/app)与[Codex CLI](https://learn.chatgpt.com/docs/codex/cli)，明确比较的是工作方式与技术分工，不作效果等同结论。
- 原创总览同时提供 PNG 与 SVG，尺寸 1800 × 2210；已目视检查 PNG 文字、布局与裁切。此检查针对生成图，不是浏览器页面测试。
- 上游截图与本地副本 SHA-256 一致：`F0BA3291BE15304F9304804EEC3FDA7A6B55E0A4DDA447501D95FF4C6F004F89`。

## 构建与线上验证

- 从仅含本次提交内容的干净导出目录构建：五个已登记项目，263 处站内引用通过子路径检查。未纳入工作区内其他未提交项目。
- Pi Web 展示与完整文章共 35 处本地引用、三个场景 / 15 个阶段、模块语法和研究文档链接检查通过。文章从同一份 Markdown 生成。
- 首发源码：`c0f6259666c77eadeee92167d7977bafc718eca9`；[成功发布记录](https://github.com/yydshly/0910_codex_project/actions/runs/34444791540)。
- 核对线上 deployment.json 的完整源码版本；导航、展示页、完整文章、样式、脚本、PNG/SVG 总览、上游截图、许可证与 Markdown 共 10 个文件均返回 HTTP 200。文本统一换行后与验证构建一致，PNG 字节一致，HTML/CSS/JS/PNG/SVG 内容类型正确。
- 原有 001、002、003、006 四个项目入口均返回 HTTP 200；部署保留原有展示。
- 已验证入口：[能力展示](https://yydshly.github.io/0910_codex_project/008-pi-web/) · [完整理解](https://yydshly.github.io/0910_codex_project/008-pi-web/understanding.html) · [完整总览](https://yydshly.github.io/0910_codex_project/008-pi-web/assets/research-overview.svg)。后续版本见仓库部署记录与线上 deployment.json。

## 未验证的能力

- 未启动上游 Pi Web、安装其依赖、配置 API Key 或调用模型。
- 未实测真实文件编辑、终端原生模块、OAuth、worktree 修改或子智能体任务。
- 未对 Pi Web 与 Codex 做相同任务的效果、费用或权限对测。
- 未做浏览器截图与真实点击测试；响应式与键盘交互为实现设计，未经浏览器实测。
- 本地研究展示使用 Node.js 22.15.0；低于上游要求的 22.19.0，不能把静态展示可运行当作上游环境验证。发布工作流使用 Node.js 24。

[返回项目](../README.md)
