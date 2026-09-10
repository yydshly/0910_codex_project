# 远端发布与验证记录

验证日期：2026-09-10。对象为本研究仓库的静态展示，上游研究版本仍为 `400d6905ce46ec46e79da8a7701b1b48850192df`。

## 已发布内容

- [完整理解总稿](https://yydshly.github.io/0910_codex_project/004-pi/understanding.html)：能力、本质、任务流程、方法与扩展、价值与场景、能力边界、验证状态和证据。
- [完整架构与业务调度](https://yydshly.github.io/0910_codex_project/004-pi/theory.html)：覆盖 11 个组件包、14 个调度节点和 18 组来源，提供 SVG 与 PNG 下载。
- [能力实验室](https://yydshly.github.io/0910_codex_project/004-pi/)：三条预设任务路径、能力地图、会话分支、上下文压缩与扩展组合。

首发源码：[47860d011e3e494f382ae61f78ef361a544f13ea](https://github.com/yydshly/0910_codex_project/commit/47860d011e3e494f382ae61f78ef361a544f13ea)。构建及远端发布成功：[GitHub Actions 运行](https://github.com/yydshly/0910_codex_project/actions/runs/34446893679)。后续部署版本以站点 [deployment.json](https://yydshly.github.io/0910_codex_project/deployment.json) 和 Actions 为准。

## 验证方法与结果

1. 从本次提交内容独立导出构建，避免工作区其他研究草稿混入发布。六个已登记演示构建通过，共 336 处站内相对引用检查通过。
2. Pi 页面检查通过：65 处本地引用、八节文章及目录、18 组理论来源、图谱文件、标签关联、模块语法和动态目标元素。
3. 五项状态逻辑测试通过，覆盖三场景 / 18 阶段、结束重放、播放中切换和重置、全部 16 种扩展组合、上下文示意切换和 HTML 转义。
4. 远端 `deployment.json` 的版本与首发提交一致。逐项请求全部 17 个 Pi 展示文件、导航首页及五个原有项目首页，共 23 个文件全部 HTTP 200。
5. 远端文本统一换行后与独立构建内容一致，PNG 按字节一致；HTML、CSS、JavaScript 模块、SVG 与 PNG 的内容类型正确。
6. 架构与流程 PNG 已单独目视检查。未执行浏览器视觉测试或真实点击测试，状态测试不能代替浏览器验收。

## 验证边界

线上展示不调用模型，不执行上游 Pi，也不操作用户文件。工具结果、任务轨迹和压缩数值均为教学预设，不属于模型或工具实测。

未验证上游真实模型兼容性、任务成功率、性能、成本、完整 Windows 体验、执行隔离和生产部署能力。GitHub Pages 发布成功证明研究内容可访问，不证明上游 Agent 已运行。

下一阶段应选择真实任务，记录模型与工具日志，再验证一个 Skill 或扩展的实际作用。

[返回项目](../README.md) · [研究索引](README.md)
