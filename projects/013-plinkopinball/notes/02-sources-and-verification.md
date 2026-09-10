# 来源、许可与验证范围

## 研究对象

- 上游：[andrewwoan/codrops-demo-for-threejs-conference](https://github.com/andrewwoan/codrops-demo-for-threejs-conference)。
- 固定提交：[64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/tree/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354)，提交日期 2026-08-25 UTC。
- 作者文章：[Blender to Three.js and Back](https://tympanus.net/codrops/2026/08/24/blender-to-three-js-and-back-10-tips-for-a-better-workflow/)，2026-08-24。
- 作者原站：[Plinko + Pinball](https://codrops-demo-for-threejs-conference-ten.vercel.app/)。原站内容可随作者更新，不保证与固定研究提交完全一致。
- 研究与收录日期：2026-09-10。

## 上游实际检查

- 阅读固定提交的目录树、package.json、核心渲染、资源加载、烘焙、碰撞提取、小球、挡板、蓄力机构、音频及开发插件源码。
- 在作者原站等待加载完成，以静音模式进入，确认三维场景可见；点击投下三个小球，界面数量从 0000 变为 0003；点击 RESET BOARD，数量恢复 0000。
- 本次建站前请求原站响应头，未发现 X-Frame-Options 或 Content-Security-Policy 嵌入限制。这不替代真实内嵌浏览器测试，也不保证作者以后保持可嵌入。
- 没有运行本地上游构建，没有测试 1,000 球、移动设备、音频播放质量、跨浏览器兼容或 Blender 双向同步。

## 本项目与原版的边界

原版页面通过外部 iframe 加载，注明作者来源并提供独立窗口。研究仓库不保存上游完整模型、音频和代码副本；访问原站会向作者站点请求资源。

原理实验为本项目独立编写的二维 Canvas 演示，容量 80 球，含圆形碰撞、球间碰撞、线段边界、简化挡板冲量、重力和弹性调节。它不使用 Three.js 或 Rapier，也未实现原版三维轨道、蓄力器、真实材质或声音。实验参数不修改原站；它不能用于代表上游性能或物理精度。

切换至实验时卸载原站 iframe，避免同时运行两套场景；切回原版重新加载。暂停与重置仅作用于实验。实验没有远端存储、账号和统计上报。

## 网页验证记录

已通过 JavaScript 语法检查、三页中的 40 处本地链接与锚点检查、研究下载一致性检查，以及独立物理测试：重力响应、弹性、球间碰撞、挡板、容量、回收、重置和 60 秒模拟的数值稳定性。统一构建 12 个展示，1,529 处本地资源引用检查通过。可选 WebMCP 参数校验与注册模块的单元检查通过，但未替代真实浏览器接口验证。

已提供本地预览入口。本次没有执行新展示页的浏览器截图、真实点击、手机或视觉回归。可选 WebMCP 接口按浏览器支持情况注册；未在支持该接口的真实浏览器上下文验证，不将其宣称为已验证能力。

## 许可与素材说明

本次固定文件树未发现仓库级 LICENSE，GitHub 仓库元数据也未给出整体许可证。不能从 README 对 Howler 的 MIT 或部分音效的 CC0 标注推导整个项目为 MIT 或可随意商用。

原 README 列出 Dingos、Bebas Neue 字体、木质材质、Baguette Basket、Eiffel Tower 模型以及音效来源。各资产需按其来源分别核对许可。本文没有重新分发这些资产。

本项目中文说明、流程图、网页样式与教学实验为研究仓库原创；简易 Markdown 渲染器复用本研究仓库既有实现。流程图不冒充作者作品截图。若后续复制或修改上游代码与素材，应先核实相应授权并保留署名。
