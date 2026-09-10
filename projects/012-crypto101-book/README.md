# 012 · Crypto 101

Crypto 101 是面向程序员的密码学入门书源码：从加密、哈希、认证和密钥管理出发，通过错误设计与漏洞案例，解释 TLS、GPG、OTR 等系统如何组合基础组件。它提供学习材料与电子书构建流程，适合建立安全概念、组织中文学习笔记与教学演示。

## 中文学习网页

18 个单元覆盖原书全部标题入口，按学习目标、核心概念、细节导读、案例和自检组织；支持本浏览器记录进度与疑问，并复制引导语回到助手对话逐步学习。[打开学习地图](https://yydshly.github.io/0910_codex_project/012-crypto101-book/) · [从学习目标开始](https://yydshly.github.io/0910_codex_project/012-crypto101-book/foreword.html)。

[网页运行说明](web/README.md) · [覆盖范围与验证](notes/04-web-learning-guide.md)

## 用关键知识清单查漏

学习网页新增 52 个关键检查点：44 个必会、8 个进阶。每项写明核心结论、常见误区、掌握标准、检查题和来源；其中 10 项补学认证与授权、重放、密钥生命周期、密码存储与 TLS 1.3 等问题。

可逐项标记“未学 / 需复习 / 能解释”，筛出漏项、导出复习记录，或复制待学清单让助手带着补学。原有章节进度与笔记独立保留。目录覆盖不代表详细教材已全部完成，勾完清单也不代表掌握密码学全部领域。

[清单范围与来源](notes/05-key-knowledge.md) · [已上线学习首页](https://yydshly.github.io/0910_codex_project/012-crypto101-book/)

## 一图理解

![Crypto 101 能力概览：基础组件、漏洞案例、完整协议与书稿构建；内容学习和工程使用的边界](assets/capability-overview.svg)

图 1：从基础知识到系统理解的学习路径，下方列出书稿构建能力与验证范围。来源：本研究依据固定版本目录、正文和构建文件原创整理；非上游界面或运行截图。[放大查看](assets/capability-overview.svg) · [图片来源](assets/README.md)。

## 项目资料

| 项目 | 内容 |
| :--- | :--- |
| 原始仓库 | [crypto101/book](https://github.com/crypto101/book) |
| 官方入口 | [Crypto 101：介绍与 PDF 阅读入口](https://www.crypto101.io/) |
| 作者 | Laurens Van Houtven（lvh）及社区贡献者 |
| 研究版本 | [fdd5dbbb02ebf3ed316f66db2af62dbad4e39455](https://github.com/crypto101/book/tree/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455)，提交日期 2023-08-10 |
| 上游许可证 | [CC BY-NC 4.0](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/LICENSE)，署名—非商业性使用 |
| 技术栈 | reStructuredText、Sphinx、Python 扩展、Make、LaTeX 与插图工具；提供 Docker 构建环境 |
| 研究状态 | 中文导读与学习网页完成；上游书籍构建与漏洞实验未实测 |
| 收录日期 / 最近更新 | 2026-09-10 / 2026-09-10 |
| 在线演示 | [Crypto 101 中文学习指南](https://yydshly.github.io/0910_codex_project/012-crypto101-book/) |

## 能力与用途

| 能力 | 书中内容 | 帮助理解的问题 |
| :--- | :--- | :--- |
| 加密基础 | XOR、AES、分组模式、流密码、公钥加密 | 为什么选了加密算法，仍可能泄露信息？ |
| 完整性与认证 | 哈希、MAC/HMAC、认证加密、数字签名 | 如何区分隐藏内容、检测篡改和验证签名？ |
| 密钥与随机数 | Diffie–Hellman、KDF、密码存储、随机数生成器 | 双方如何获得密钥？密码和随机数为什么影响安全？ |
| 漏洞案例教学 | ECB 模式泄漏、位翻转、长度扩展、随机数问题 | 安全组件在错误组合下如何失效？ |
| 完整系统理解 | SSL/TLS、OpenPGP/GPG、OTR | 加密、认证与密钥交换如何协作？ |
| 书稿维护与构建 | 章节、插图、引用、HTML/PDF/EPUB 构建目标、翻译配置 | 如何维护和生成一套技术教材？ |

逐项证据见[能力详解](notes/01-capabilities.md)和[来源与验证](notes/02-sources-and-verification.md)。表中“书中内容”表示源码存在相应讲解或章节，不代表每个主题完整、示例已复现或建议仍适用于今天。

## 怎样使用最有价值

- **程序员补基础**：区分加密、哈希、MAC、签名和密钥交换，再结合实际问题阅读。
- **组织学习或分享**：沿“提出方案 → 发现漏洞 → 引入缺失组件”的顺序讲解，参考[学习路线](notes/03-learning-path.md)。
- **研究技术书的组织方式**：借鉴章节、插图、术语表、引用和多格式构建的协作方式。
- **当前项目集的定位**：收录为密码学教育资源，可作为后续教学演示的知识来源。若要给应用增加加密功能，还需要另行选择并验证实现库。

## 重要边界

1. **书稿尚有未完成部分。** 序言称其为早期预发布版本；现代 TLS 握手、部分签名算法和随机数主题仍有 TODO。目录覆盖不等于完整教学。
2. **历史案例需要时间背景。** 本次核对的默认分支最新提交为 2023-08-10；本研究没有把书中的性能数字、算法流行程度或安全配置写成当前工程结论。
3. **构建目标与现成下载分开看。** 源码定义 HTML、PDF、EPUB 目标；官网展示 PDF 入口，EPUB/Mobi 条目划线。本次未验证构建成功，也未核对官网 PDF 对应哪个提交。
4. **语言配置不等于中文译本。** README 说明书籍为英文；zh_CN 是构建语言参数示例，不能据此认定存在完整中文翻译。
5. **许可证带非商业条款。** 本项目保留作者和来源，中文内容为独立研究摘要，未搬运完整书稿或上游插图；转载、改编与分发上游材料应遵循其许可。

上述结论的固定版本证据见[来源表](notes/02-sources-and-verification.md)。

## 阅读与本地体验

本研究提供文档、概览 SVG 和中文学习网页。网页包括全部章节目标与细节入口、术语、自检与个人进度，详见 [Web 说明](web/README.md) 和 [网页验证记录](notes/04-web-learning-guide.md)。

- [能力详解与仓库结构](notes/01-capabilities.md)
- [来源、版本与验证范围](notes/02-sources-and-verification.md)
- [按问题安排的学习路线](notes/03-learning-path.md)
- [笔记目录](notes/README.md) · [Web 状态](web/README.md)

如需构建上游电子书，请先取得固定版本，在独立的 Linux/WSL 环境按照[上游 README](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/README.rst)准备依赖，再于上游仓库根目录执行 `make book`。这是源码说明，未在本次环境中执行；Docker、字体及 LaTeX 依赖的可用性仍需验证。

---

[返回总项目索引](../../README.md#项目索引)
