# 两张图的源码依据与边界

研究日期：2026-09-10。研究版本：`15581d14007fd01fb3f132016741962f34936ca2`。方法：官方文档与核心源码静态阅读；未安装上游、未调用模型、未验证节省率。

## 能力范围图

| 图中能力 | 固定版本依据 | 解读边界 |
| :--- | :--- | :--- |
| 输入运行时与输出 Skill 独立 | [product-model.md](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/docs/technical/product-model.md) | 以 Engine / Proxy 为中心，不把整个仓库说成完全不关注输出 |
| 15 类压缩器 | [compressor.go](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/engine/compressors/compressor.go) | 部分类型必须显式指定；注册不等于自动执行 |
| 上下文预算 | [contextwindow.go](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/engine/contextwindow/contextwindow.go) | Pack 是可调用模块，非所有代理请求的必经步骤 |
| 接入与专用工具 | [README](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/README.md) | 兼容性取决于协议与恢复入口；未逐一验证 |
| Pixel | [pixel/doc.go](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/engine/pixel/doc.go) | 文字转图片是可选有损变换，估算不代表账单节省 |

## 实现流程图

1. 从请求中选择可处理内容，由适配器决定哪些字段可压缩。本地代理转发处理后的请求，见 [Proxy README](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/proxy/README.md)。
2. Engine 检测类型并查找匹配压缩器。核心压缩器是确定性的本地字节转换，不调用额外模型；这不代表整个仓库所有辅助模块都不调用模型。
3. cgo 代码压缩器使用 Tree-sitter 省略函数体并重新解析；非 cgo 构建使用另一实现。语法有效不代表程序行为等价。见 [code_cgo.go](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/engine/compressors/code_cgo.go)。
4. Engine 对压缩前后计数，结果未缩短时保留原文。默认离线估算不等于服务商账单计数。见 [engine.go](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/engine/engine.go)。
5. 典型有损路径需要先满足恢复条件，完成原文持久化后才能发布结果。源码也支持外部恢复能力；图中画的是内部 CCR 典型路径。持久化失败可同时返回原文结果及错误，由调用层处理，不能理解为任何错误都会继续发送。
6. 模型需要细节时由 Agent 调用恢复工具；恢复内容成为后续输入。恢复箭头表示经 Agent 协调，不表示模型服务直接访问本机 SQLite。

流程省略协议封装、鉴权、缓存细节、具体选项和无损编码分支，以便聚焦有损压缩机制。图中没有把整个请求、所有历史或模型内部思考都标为必定压缩对象。

## 证据与费用边界

- [HONEST-NUMBERS.md](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/docs/HONEST-NUMBERS.md)：输出 Skill 有额外输入开销，且没有提交经过审查的原始输出评测结果。
- [WRAP-BENCHMARK.md](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/docs/WRAP-BENCHMARK.md)：固定任务报告未公开完整运行产物，不能仅凭当前仓库独立复现，也不能直接推导费用降幅。
- [LICENSING.md](https://github.com/JuliusBrussee/caveman/blob/15581d14007fd01fb3f132016741962f34936ca2/LICENSING.md)：按目录区分 MIT 与 BSL-1.1。
