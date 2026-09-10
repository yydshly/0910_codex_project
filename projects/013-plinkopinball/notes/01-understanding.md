# Plinkopinball：把三维场景变成可玩的网页

这个项目将 Plinko（小球穿过钉阵下落）与 Pinball（使用挡板击球）组合起来。它的研究价值在于把美术资源、物理求解、交互输入与声音反馈组织成一个完整的浏览器体验。

## 1. 项目定位与能力

作者 Andrew Woan 为 Codrops 和 Three.js 大会制作了这份演示。原站提供木质弹珠台、植物及周边装饰构成的三维场景。用户点击钉板投球，用左右方向键或 A/D 操作挡板，按住空格后释放蓄力机构，也可以缩放镜头、重置桌面和切换声音。触摸设备有相应的屏幕操作按钮。

小球可以碰撞钉子、墙壁和其他球，从垂直钉板进入下方桌面，再进入拱形轨道。声音层包含碰撞采样、机构动作声和随运动变化的滚动音。代码设定最多 1,000 个球，达到上限后回收最早的球；这不是性能测试结论。

当前源码未见完整计分与胜负、关卡进度、账号、排行榜或多人网络系统。适合研究与二次开发，不应视为完整游戏产品框架。

来源：[固定版本 README](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/README.md)、[游戏模块](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/tree/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/src/Experience/World/Plinko)。

## 2. 可以用在什么场景

以下为基于实现的研究判断，不代表作者已经验证这些应用。

| 场景 | 可以借鉴的能力 | 需要补充 |
| :--- | :--- | :--- |
| 品牌与会议活动 | 有主题、有声音、可操作的三维场景 | 主题模型、活动内容与转化流程 |
| 创意作品集 | 美术与代码结合的互动体验 | 项目介绍与内容导航 |
| 浏览器小游戏 | 投球、碰撞、挡板及轨道玩法 | 规则、关卡、分数、存档 |
| Three.js 教学 | 模型、渲染、输入、物理与音频的组织 | 教学步骤和调试可视化 |
| 物理科普 | 可改变条件并观察结果的运动过程 | 清楚的模型假设与实验记录 |

对本研究集，适合借鉴“最终效果与原理并排探索”的展示方式，让读者从操作现象返回源码。

## 3. 模型与光照：提前准备视觉结果

Blender 用于场景制作和光照烘焙。网页加载 GLB 模型、贴图与音频，加载器包含 Draco 和 KTX2 支持。静态烘焙网格按名称前缀匹配贴图，使用 MeshBasicNodeMaterial；贴图已经包含光照，因此不再依赖场景实时灯光计算相同效果。

移动小球单独使用受光照影响的材质。其木纹采用局部坐标的三平面投影，以免直接使用烘焙图集 UV 时产生拉伸。球下的接触阴影用实例化平面与渐变模拟，并随轨道高度变化。植物通过 TSL 顶点变形产生风动。

这种分工降低运行时成本，但不适合在保留原贴图的情况下任意修改全场景光照；昼夜变化或大幅移动静态物体，需要重新烘焙或设计更多实时效果。

来源：[Baked.js](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/src/Experience/World/Baked.js)、[BallMaterial.js](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/src/Experience/World/Plinko/BallMaterial.js)、[BallShadows.js](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/src/Experience/World/Plinko/BallShadows.js)。

## 4. 物理：三维外观，低维求解

钉板和桌面各有一个 Rapier 2D 世界。每个板面拥有独立的二维坐标系，重力由坡度投影；小球从钉板进入桌面时，位置和速度通过世界空间转换，并施加经验阻尼。球上轨道后使用沿曲线的位置和速度，轨道上的球间碰撞单独按一维距离处理。

普通物理使用 1/120 秒固定时间步长，每帧最多 4 个子步，设置连续碰撞检测并限制长帧累积，以降低高速穿透和切换标签页后突跳的风险。场景单位进入求解器前放大 10 倍，以匹配碰撞容差的适用尺度。

这是一套针对板面和轨道的混合实现。它包含速度下限、阻尼和轨道速度限制等体验调校，不能当作精密物理测量工具。要扩展到自由飞行、任意三维碰撞或复杂空间机关，需要重做相应物理设计。

来源：[Physics.js](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/src/Experience/World/Plinko/Physics.js)、[Balls.js](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/src/Experience/World/Plinko/Balls.js)。

## 5. 从模型截面提取碰撞边界

Extract.js 先根据三角形法线识别主要板面，构建二维坐标系；随后在距板面一个球半径的高度切割模型。三角形与切平面交出的线段被拼接成轮廓，接近圆形的轮廓转成圆形碰撞体，其他轮廓保留为折线。

基于形状而不是顶点数量识别对象，可以减少 Draco 量化和 glTF 接缝拆分带来的脆弱性。它仍依赖当前场景形状和结构；不能声称任意 Blender 模型都可自动变成正确的游戏碰撞场景。

来源：[Extract.js](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/src/Experience/World/Plinko/Extract.js)。

## 6. 性能与资源开发流程

小球共享一个 InstancedMesh，接触阴影共享另一个实例化网格。容量固定且绘制槽位可复用，但生成小球时仍会创建对应物理刚体，销毁时移除刚体；不能把源码注释中的“对象池”理解为所有物理对象永远不再分配。

音频层根据碰撞类型和速度选择声音，并设置冷却、强度门槛以及每帧碰撞音数量上限。渲染入口使用 WebGPURenderer 和 TSL。当前 RenderPipeline 接入了场景通道，本次代码没有启用额外后期特效；跨浏览器兼容与性能没有测试。

Vite 资源插件监听模型与贴图目录变化，生成资产登记与模型类，再刷新页面。调试变换工具支持移动、旋转、缩放物体，并通过开发服务器保存 JSON 覆盖数据；该写入端点不属于静态生产构建。

作者文章介绍 Blender MCP、插件和烘焙工作流，但文件树中未发现配套 Blender 插件源码或 .blend 工程。本次未验证完整双向同步，不能把文章建议全部算作仓库交付能力。

来源：[Renderer.js](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/src/Experience/Renderer.js)、[资源刷新插件](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/scripts/vite-plugin-asset-reloader.mjs)、[变换保存插件](https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/scripts/vite-plugin-transform-overrides.mjs)。

## 7. 扩展方向与实施成本

- **主题定制：** 替换文字、品牌、装饰与音效。若改变模型几何，需要重新检查碰撞提取和光照烘焙。
- **完整玩法：** 增加分数、生命值、目标区域、关卡和存档。需要建立独立的游戏状态与规则模块。
- **教学实验室：** 显示碰撞轮廓，暴露弹性、重力与坡度，并说明模型假设。本项目已提供独立简化二维实验，未修改原版参数。
- **可配置关卡：** 将命名、出生点、边界和机关参数整理成配置，减少对固定模型结构的依赖。
- **可复用工具链：** 抽离资源管理、相机、音频、输入与调试模块，并补足 Blender 端插件与文档。
- **自由三维或多人游戏：** 需要新增物理架构、网络同步或服务端成绩校验，工作量明显高于换主题。

![能力与技术流程图](../assets/capability-overview.svg)

图源：本研究依据固定源码原创绘制，非原站截图。扩展方向属于设计建议，不表示上游已经实现或商业验证。
