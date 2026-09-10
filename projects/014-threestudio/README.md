# 014 · threestudio

threestudio 是 AI 三维内容生成与编辑的算法框架：依赖 NVIDIA GPU、CUDA、Python/PyTorch、项目依赖及另行下载的预训练模型权重，以文字、参考图片或方法要求的场景数据为输入，通过大模型指导与三维优化生成或编辑对象，输出三维表示、带纹理网格和多角度预览。适合算法研究、资产草稿、创意探索与工具原型。

## 一图理解

![threestudio 完整总览：安装准备、任务输入、核心能力、三维优化循环、八类模块职责与输出](assets/complete-overview.png)

图 1：将运行前准备与每次任务的输入分开，并展示模型、算法、渲染器的协作关系。来源：本研究依据固定版本官方文档、配置与源码原创绘制；非上游运行截图，未表示生成质量已经实测。[高清 PNG](assets/complete-overview.png) · [可缩放 SVG](assets/complete-overview.svg) · [图源与复现](assets/README.md)。

## 项目资料

| 项目 | 内容 |
| :--- | :--- |
| 原始仓库 | [threestudio-project/threestudio](https://github.com/threestudio-project/threestudio) |
| 官方文档 | [固定版本 README](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/README.md) · [模块配置](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/DOCUMENTATION.md) · [安装说明](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/docs/installation.md) |
| 研究版本 | [`28d9d80d9d00f308244adfcf3be8b17ca0cb6465`](https://github.com/threestudio-project/threestudio/tree/28d9d80d9d00f308244adfcf3be8b17ca0cb6465)，提交日期 2024-12-16；2026-09-10 查询默认分支得到该提交 |
| 上游许可证 | [Apache-2.0](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/LICENSE)；模型权重、第三方依赖和扩展分别适用其许可 |
| 技术栈 | Python、PyTorch、Lightning、Diffusers、Transformers、CUDA 与可微渲染工具 |
| 研究状态 | 已总结：文档、配置与关键源码已核对；上游安装和生成未实测 |
| 收录日期 / 最近更新 | 2026-09-10 / 2026-09-10 |
| 在线演示 | —（本项目仅整理文档与图片，未部署 Web 演示或 GPU 服务） |

## 核心理解

- **它提供什么：** 一套接入已有模型、组织算法、渲染、优化与导出的框架，包含多种研究方法的实现。
- **大模型负责什么：** 提供视觉知识与生成指导信号，作用超出“识别这是猫还是狗”；通常加载已有图像扩散模型，不需要从头训练一个大模型。
- **算法负责什么：** 将指导信号用于更新三维形状和外观；典型流程反复渲染不同角度，逐步优化同一个对象。
- **输入是否是大模型：** 大模型权重属于运行前准备；文字、图片等属于任务输入。生成出的三维模型是另一种含义的“模型”。
- **训练的是什么：** DreamFusion 的典型 SDS 路线冻结图像模型，优化当前三维表示；ProlificDreamer 等方法还有额外 LoRA 训练，不能把冻结结论推广到所有方法。

[完整理解与通俗解释](notes/01-understanding.md) · [安装准备和模块职责](notes/02-setup-and-modules.md)

## 安装依赖摘要

| 准备条件 | 具体要求与作用 |
| :--- | :--- |
| GPU 与驱动 | NVIDIA GPU；官方最低 6GB 显存仅适合部分配置，驱动需与 CUDA 匹配 |
| 运行环境 | 官方提供 Ubuntu、WSL2、Docker 路径；README 基线为 Python ≥ 3.8、PyTorch ≥ 1.12，记录过 PyTorch 1.12.1/CUDA 11.3 和 2.0.0/CUDA 11.8 测试组合 |
| Python 依赖 | 固定版本清单含 Lightning 2.0.0、OmegaConf 2.3.0、Diffusers < 0.20、Transformers 4.28.1 等；旧约束不能直接解释成任意新版本均兼容 |
| CUDA / 三维组件 | tiny-cuda-nn、nerfacc、nvdiffrast 等用于编码、体渲染或可微光栅化；部分安装涉及编译，网格导出另用 xatlas、trimesh 等 |
| 预训练权重 | 按配置下载 Stable Diffusion、Stable Zero123 等所需权重，准备可访问的模型路径；部分模型需先接受许可并登录下载 |
| 任务配置与素材 | 选定方法，填写文字或图片路径、分辨率、迭代步数、输出位置；图片方法常要求去背景的 RGBA 图 |

以上是上游文档和依赖清单的静态核对，不代表已在当前电脑安装成功。详细版本、显存案例、安装顺序与路径注意事项见[准备条件](notes/02-setup-and-modules.md)。

## 能力与输入输出

| 能力 | 输入 | 典型方法 | 输出 / 限制 |
| :--- | :--- | :--- | :--- |
| 文字生成三维内容 | 文字描述 | DreamFusion、Magic3D、ProlificDreamer 等 | 三维对象；部分配置支持场景，不能保证精确尺寸与结构 |
| 图片生成三维内容 | 单张参考图；Magic123 还需文字 | Zero123、Stable Zero123、Magic123 | 与参考图相关的三维对象，未见视角依赖模型推测 |
| 指令编辑 | 方法要求的场景数据与文字指令 | InstructNeRF2NeRF、Control4D 静态实现 | 修改场景外观；不能据此认定任意 OBJ 均可直接编辑 |
| 几何 / 纹理优化 | 前阶段结果与对应配置 | Magic3D、ProlificDreamer 等多阶段方法 | 细化形状与外观，需要额外优化过程 |
| 渲染与导出 | 三维表示或检查点 | 测试流程、mesh-exporter | 多角度图片、360° 视频、OBJ + MTL / 纹理或带顶点颜色的 OBJ |

研究版本还提供扩展机制。高斯表示、动态 4D、人物等能力涉及独立扩展和各自依赖，不能视为核心安装后全部即用。详见[能力边界](notes/01-understanding.md#能力覆盖与边界)。

## 使用价值与限制

适合研究和比较 AI 三维生成算法、制作资产草稿、探索产品造型，以及搭建生成工具原型。上述场景是基于能力的应用判断，未验证生产收益。

生成往往需要逐对象迭代，可能出现几何缺陷、多面脸、纹理异常或导出不完整；作品进入游戏、美术或制造流程前仍需检查与修整。此库不承诺秒级生成、工程尺寸准确、自动骨骼绑定或直接可交付资产。

## 阅读与实践入口

- [完整理解：框架、模型与算法，以及输入输出](notes/01-understanding.md)
- [准备条件、依赖、模块与最小运行路径](notes/02-setup-and-modules.md)
- [固定版本证据、来源与验证记录](notes/03-sources-and-validation.md)
- [笔记目录](notes/README.md) · [Web 状态](web/README.md)

本次仅验证研究文档、图片和引用；没有安装上游依赖、下载大模型权重、执行生成任务或部署 GPU 服务。

## 来源与许可

事实依据固定提交的 README、DOCUMENTATION、requirements、配置及关键源码，链接见[来源表](notes/03-sources-and-validation.md)。中文文档与总览图为独立研究整理，未复制完整上游仓库、生成结果或模型权重。上游 Apache-2.0 许可不替代所选预训练模型及第三方扩展的许可。

---

[返回总项目索引](../../README.md#项目索引)
