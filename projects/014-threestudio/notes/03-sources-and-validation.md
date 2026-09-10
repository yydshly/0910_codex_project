# threestudio 来源与验证记录

## 研究版本

- 研究日期：2026-09-10。
- 原始仓库：[threestudio-project/threestudio](https://github.com/threestudio-project/threestudio)。
- 固定提交：[`28d9d80d9d00f308244adfcf3be8b17ca0cb6465`](https://github.com/threestudio-project/threestudio/tree/28d9d80d9d00f308244adfcf3be8b17ca0cb6465)。
- GitHub API 查询默认分支所得提交时间：2024-12-16T06:11:15Z；提交说明为给 `extern/ldm_zero123` 增加包初始化文件。
- 版本日期与研究日期分别记录；没有把旧依赖约束描述为经过当前环境验证的最新推荐组合。

## 关键证据

下列路径全部指向同一固定提交。仅下载并阅读了 14 份选定文件，原始内容保留在仓库之外的研究缓存，没有将上游仓库或权重复制进本项目。[选定文件清单与 SHA-256](source-manifest.json)

| 编号 | 来源 | 支持的结论 |
| :--- | :--- | :--- |
| S01 | [README](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/README.md) | 支持方法、文字 / 图片 / 编辑任务、显存案例、迭代与导出流程、实验性限制、扩展机制 |
| S02 | [DOCUMENTATION](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/DOCUMENTATION.md) | 数据、相机、系统、几何、材质、背景、渲染、引导与导出的配置职责 |
| S03 | [安装说明](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/docs/installation.md) | NVIDIA GPU、驱动和 CUDA、Ubuntu / WSL2 / Docker、容器光栅化限制 |
| S04 | [requirements.txt](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/requirements.txt) | Lightning 2.0.0、OmegaConf 2.3.0、Diffusers < 0.20、Transformers 4.28.1、CUDA 与网格依赖 |
| S05 | [DreamFusion SD 配置](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/configs/dreamfusion-sd.yaml) | Stable Diffusion 2.1 base、隐式体、NeRF 渲染、SDS、10,000 步及 geometry / background 优化参数 |
| S06 | [Stable Zero123 配置](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/configs/stable-zero123.yaml) | 图片路径与条件图，以及使用下划线的 `stable_zero123.ckpt` 路径 |
| S07 | [Magic123 coarse 配置](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/configs/magic123-coarse-sd.yaml) | 图片和文字条件、Stable Diffusion / Zero123 组合 |
| S08 | [BaseSystem / BaseLift3DSystem](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/threestudio/systems/base.py) | 系统组合模块、配置优化器、几何转换与导出组织 |
| S09 | [DreamFusion 系统](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/threestudio/systems/dreamfusion.py) | 渲染图交给 guidance，汇总生成损失与几何正则项，记录验证 / 测试输出 |
| S10 | [Stable Diffusion guidance](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/threestudio/models/guidance/stable_diffusion_guidance.py) | 加载预训练权重，冻结 VAE / UNet，编码图像、加噪、预测噪声与 SDS 梯度 |
| S11 | [Zero123 guidance](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/threestudio/models/guidance/zero123_guidance.py) | 图像条件、相机角度与预训练模型在引导中的作用；不是对全部 Zero123 变体的完整审计 |
| S12 | [mesh-exporter](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/threestudio/models/exporters/mesh_exporter.py) | obj-mtl、obj、UV 和纹理导出；FBX 仍为 TODO |
| S13 | [launch.py](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/launch.py) | 训练、测试、导出、配置与运行入口 |
| S14 | [LICENSE](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/LICENSE) | 上游代码许可证为 Apache-2.0 |

## 从本次讨论中明确的概念

1. **框架、AI 模型与三维表示分开。** 框架提供实现和组织能力，AI 模型提供视觉知识，三维表示是生成对象。
2. **工具准备与任务输入分开。** 模型权重是预先加载的工具，文字 / 图片 / 指定场景数据是任务输入。
3. **生成指导不等于分类识别。** SDS 利用扩散模型预测构造更新方向，不能简化成只判断“是否为猫”。
4. **冻结结论有范围。** DreamFusion SD 路线冻结图像模型；ProlificDreamer 等方法另涉及 LoRA，不能把示例推广到所有路线。
5. **最低显存不代表完整能力。** 6GB 为部分基础配置门槛，更复杂示例的显存要求更高且分阶段变化。
6. **扩展、核心实现与实际验证分开。** 扩展列表不是开箱即用能力清单；源码存在不是本地验证结果。

## 图源与许可

总览 PNG、SVG 及绘制脚本为本研究原创，使用相同内容源输出。图中文字是对固定版本的独立中文概括，没有复用上游示例图片、视频或生成模型。图内明示研究日期、上游提交与非实测性质；项目与根 README 均提供替代文字、来源说明及相对链接。

上游代码采用 Apache-2.0。预训练权重、依赖与独立扩展分别有自己的许可证，应按实际选用对象核查；没有推断所有生成流程或模型都受同一许可证覆盖。

## 验证范围

### 本次完成的静态核对

- 通过 GitHub API 固定默认分支提交，读取并保存 14 份选定源码 / 文档的路径和 SHA-256 清单。
- 核对主要依赖版本、模型与输入路径、DreamFusion 模块组合、SDS 指导和导出格式。
- 发现并记录 README 的 `stable-zero123.ckpt` 与配置的 `stable_zero123.ckpt` 文件名差异。
- 汇总理解、准备条件与模块职责，生成同内容的 PNG / SVG，并目视检查 PNG 的中文文字、布局和循环箭头。

### 提交前检查

- 在独立提交目录中检查 46 处本地链接与 Markdown 锚点，全部有效；首页索引与预览按编号数值升序且不重复。
- 核对 14 份来源文件的 SHA-256 与长度；来源清单全部指向同一固定提交。
- PNG 文件完整性通过，尺寸为 3840 × 5100；SVG 可解析，覆盖四类准备、任务输入、八类模块、流程与输出。PNG 已目视检查，SVG 未单独做浏览器视觉检查。
- 在独立提交目录运行仓库既有构建与检查：初次 11 个展示、1481 处引用通过；同步远端已提交的 013 项目后，重新检查 12 个展示与 1529 处站内引用，全部通过。本项目未加入演示清单。
- 本次提交范围限定为根 README 的 threestudio 条目和 `projects/014-threestudio/`，不包含其他任务尚未提交的内容。
- 未提交模型、上游依赖、检查点、构建目录或原始上游源码缓存；绘图脚本只负责原创研究图。

### 未执行

- 未安装上游 Python / CUDA 依赖，未下载预训练模型权重。
- 未运行文字 / 图片生成、场景编辑、导出或 Gradio。
- 未测量显存、耗时、成本、质量、多 GPU 或不同系统兼容性。
- 未验证示例命令成功，未安装扩展，未复现原论文结果。
- 未部署本项目 Web 演示或 GPU 服务。

本次文档中的适用场景为基于源码能力的应用判断；硬件和环境数字来自上游说明，不是本研究实测值。

[回到项目介绍](../README.md)
