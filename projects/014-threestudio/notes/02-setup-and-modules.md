# threestudio 准备条件与模块职责

研究日期：2026-09-10；固定版本：`28d9d80d9d00f308244adfcf3be8b17ca0cb6465`。下面是依据官方文件整理的准备方案，**本次没有执行上游安装或生成**。依赖版本为该提交的约束与历史测试记录，不保证当前任意新环境自动兼容。

## 运行前的六类准备

| 类别 | 需要准备的东西 | 作用与注意事项 |
| :--- | :--- | :--- |
| 显卡与驱动 | NVIDIA GPU、兼容的 NVIDIA 驱动；官方最低 6GB 显存 | 执行模型和渲染计算；最低门槛不覆盖所有方法，需按目标配置评估 |
| 系统与 CUDA | Ubuntu / WSL2；或按官方说明使用 Docker 与 NVIDIA Container Toolkit | 非 Docker 路线需要合适的 CUDA Toolkit；官方没有给出本研究已验证的 Windows 原生安装结果 |
| Python 运行时 | README 基线 Python ≥ 3.8、PyTorch ≥ 1.12 | 上游记录过 torch 1.12.1 + CUDA 11.3、torch 2.0.0 + CUDA 11.8；应匹配驱动、编译器和依赖版本 |
| 项目依赖 | 按固定提交的 requirements 安装 Python 包、CUDA 扩展和网格组件 | 项目依赖包含精确版本、版本上限，也有未锁定版本的 Git 依赖，因此固定主仓库提交不等于完整环境可复现 |
| 模型与下载 | 所选配置要求的模型权重及本地 / 仓库路径；需要时接受许可、登录模型平台 | 网络用于取得源码、依赖和权重；官方允许模型缓存或本地路径，离线运行需先备齐全部文件 |
| 任务与存储 | 文字、RGBA 图片或场景数据；方法配置、随机种子、分辨率、步数和输出路径 | 模型权重属于工具准备；这些才是具体任务材料。为缓存、检查点、图片和视频留出存储，未提供统一磁盘容量估计 |

[官方安装说明](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/docs/installation.md) · [README 安装与快速开始](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/README.md#installation)

## 依赖各自提供什么能力

| 依赖组 | 固定版本要求 / 示例 | 作用 |
| :--- | :--- | :--- |
| 张量与训练框架 | PyTorch；`lightning==2.0.0` | GPU 运算、自动微分、训练 / 验证循环与检查点 |
| 配置管理 | `omegaconf==2.3.0` | 管理 YAML 方法配置和命令行覆盖 |
| 模型接入 | `diffusers<0.20`、`transformers==4.28.1`、accelerate、huggingface_hub | 加载扩散模型、文字编码及相关组件 |
| 三维编码与体渲染 | tiny-cuda-nn、`nerfacc@v0.5.2` | 加速三维特征编码和体渲染计算 |
| 可微光栅化 | nvdiffrast | 网格路线中把三维表面渲染成图片并支持求导 |
| 网格与纹理处理 | xatlas、trimesh、libigl、PyMCubes、pysdf 等 | UV 展开、网格处理和表面提取等 |
| 图片与视频 | OpenCV、imageio、imageio[ffmpeg] 等 | 读写图片和生成展示视频 |
| 日志与界面 | TensorBoard、wandb、`gradio==4.11.0` | 查看过程、记录实验或提供浏览器界面 |
| 方法相关组件 | xformers、`bitsandbytes==0.38.1`、CLIP、kornia、controlnet_aux 等 | 支持特定模型、优化或预处理路径 |

功能上不是每次任务都会调用每个组件；安装层面上游 requirements 把多类依赖放在同一清单中，不能据此随意删掉依赖而保证能运行。完整清单以[固定 requirements](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/requirements.txt)为准。本研究不向总仓库添加这些运行依赖。

## 显存怎样理解

下面均为上游说明中的配置案例，**不是当前电脑测试，也不是显卡采购建议**：

| 配置案例 | 上游标注的显存量级 | 含义 |
| :--- | :--- | :--- |
| DreamFusion + Stable Diffusion | 约 6GB | 部分基础配置的训练案例，不能推广为完整功能最低配置 |
| Magic123 coarse / refine | 约 12GB / 10GB | 不同阶段需求不同 |
| InstructNeRF2NeRF 示例 | 约 20GB | 场景编辑示例需求 |
| ProlificDreamer 512×512 NeRF 示例 | 约 30GB | 更高分辨率和复杂流程可能需要明显更多显存 |

模型加载 / 文字编码、训练、验证和导出可能有不同峰值。比如 DeepFloyd IF 的文字编码也会占用较大显存；不要只依据某个训练阶段数字选择环境。[上游方法案例](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/README.md#supported-models)

## 内部模块与职责

下面按便于理解的功能分成八组，不代表源码只有八个文件。系统的 geometry、material、background、renderer、guidance、prompt_processor 等组件，通过配置注册并组织起来。

| 功能组 | 模块 / 位置 | 负责的能力 | 需要什么 / 交给谁 |
| :--- | :--- | :--- | :--- |
| 输入与相机 | data、相机数据模块 | 读取任务数据，采样视角、距离和画面大小 | 素材与相机配置 → 渲染 / 引导所需的批数据 |
| 提示词处理 | prompt_processor | 将文字转换为模型条件，可区分观察方向 | 提示词和文字编码器 → 条件向量；图像条件方法不一定要求文字 |
| 大模型引导 | guidance | 加载预训练模型，计算 SDS 等生成指导信号 | 渲染图、文字或图像条件 → 优化信号 |
| 几何表示 | geometry | 表示与更新密度、表面、法线等空间信息 | 初始化 / 前阶段结果 → 可渲染的三维形状 |
| 材质与背景 | material、background | 计算表面颜色、着色与背景外观 | 几何特征与配置 → 渲染所需外观 |
| 渲染 | renderer | 将三维内容变成二维图片，保留可用于求导的关系 | 几何、外观、相机 → RGB、透明度、法线等可用输出 |
| 系统与优化 | systems、optimizer、trainer | 组合模块，计算损失，更新参数，保存 / 恢复进度 | 配置与指导信号 → 优化后的参数及检查点 |
| 导出与结果记录 | exporter、测试 / 保存流程 | 提取网格、导出材质 / 纹理，记录图像和视频 | 三维表示 / 检查点 → OBJ、MTL、纹理与预览 |

[组件配置文档](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/DOCUMENTATION.md) · [BaseLift3DSystem](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/threestudio/systems/base.py) · [DreamFusion 训练系统](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/threestudio/systems/dreamfusion.py)

## 各能力需要哪些材料

| 目标能力 | 运行前准备的模型 | 每次任务的输入 | 结果 |
| :--- | :--- | :--- | :--- |
| 文字生成 3D | 示例 DreamFusion SD 配置指定 Stable Diffusion 2.1 base | 文字描述 | 三维表示、预览，可再提取网格 |
| 单图生成 3D | Stable Zero123 权重 | 去背景参考图；按配置准备 RGBA | 三维表示、预览，可再导出 |
| 图片 + 文字生成 | Magic123 示例结合 Zero123 和 Stable Diffusion | RGBA 图与文字描述 | 粗阶段结果，进一步细化 |
| 场景编辑 | 编辑方法所要求的模型组件 | 对应场景 / 图像 / 相机数据及指令 | 编辑后的三维场景与预览 |
| 网格导出 | 已准备的三维结果与导出依赖 | 检查点、导出格式和参数 | OBJ + MTL / 纹理，或带顶点颜色的 OBJ |

这些行是方法举例，不表示可把任何模型文件随意替换进任意配置。输入格式、模型结构与系统实现必须对应。

## 最小运行路径：先选一种能力

以“文字生成小猫”为例，应在研究目录之外准备独立上游工作目录，取得固定提交，然后按该提交安装说明创建环境、安装兼容 PyTorch 和 requirements、下载配置要求的权重。准备完成后，在上游仓库根目录可参考：

```bash
python launch.py --config configs/dreamfusion-sd.yaml --train --gpu 0 system.prompt_processor.prompt="a ceramic cat wearing a red hat"
```

这是依据固定配置整理的**未执行示例**，不是已验证安装教程。配置默认使用 `stabilityai/stable-diffusion-2-1-base`，训练步数为 10,000；结果目录由配置和启动程序决定。[固定配置](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/configs/dreamfusion-sd.yaml)

以“图片生成三维对象”为例，准备 RGBA 图和 Stable Zero123 权重后，可参考：

```bash
python launch.py --config configs/stable-zero123.yaml --train --gpu 0 data.image_path=load/images/cat_rgba.png
```

**文件名注意事项：** 固定 README 下载说明写的是 `stable-zero123.ckpt`，而固定配置中的路径为 `./load/zero123/stable_zero123.ckpt`。横线和下划线不同，下载后应使文件名与配置一致，或通过 `system.guidance.pretrained_model_name_or_path` 指向实际位置。本研究核对了这个差异，但未运行验证修正后的任务。[配置路径证据](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/configs/stable-zero123.yaml#L93-L102)

模型文件如已全部缓存，可按官方说明使用本地路径或离线设置；本地路径方式需要同时核对 guidance 与 prompt_processor 所用资源。不要把模型权重、缓存、检查点或生成目录提交进研究仓库。

导出时使用已有任务的配置与检查点，选择 `mesh-exporter`；NeRF 表面提取可能要调整阈值与分辨率。固定导出器支持 obj-mtl 与 obj，FBX 在源码中仍为 TODO，不能写为已支持。[网格导出器](https://github.com/threestudio-project/threestudio/blob/28d9d80d9d00f308244adfcf3be8b17ca0cb6465/threestudio/models/exporters/mesh_exporter.py)

## 可选项与尚待实测

- Gradio 是可选的浏览器操作入口，不是图像大模型，也不是生成原理本身。
- Docker 是环境交付方式；仍需要 GPU 支持。官方记录了容器中 nvdiffrast OpenGL 路径的限制，并给出 CUDA context 配置替代项。
- 多 GPU、显存优化与额外扩展需按具体方法核对；本次没有验证这些组合。
- 后续实测应记录环境版本、实际模型文件、运行配置、峰值显存、耗时、结果质量、导出完整性及失败信息。

[完整理解](01-understanding.md) · [来源与验证记录](03-sources-and-validation.md) · [回到项目介绍](../README.md)
