# 来源与验证记录

研究日期：2026-09-10。上游仓库：[crypto101/book](https://github.com/crypto101/book)。

## 版本

通过 GitHub API 的 commits/master 返回结果核对默认分支，固定研究提交为 [fdd5dbbb02ebf3ed316f66db2af62dbad4e39455](https://github.com/crypto101/book/commit/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455)，提交日期 2023-08-10T09:51:57Z，消息为合并 PR #447（修复 Docker 内 Git 仓库所有权导致的构建问题）。此信息是本次查询结果，不代表仓库以后不会更新。

## 证据表

| 核查内容 | 固定来源 | 支持的结论 |
| --- | --- | --- |
| 项目定位、英文与构建说明 | [README.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/README.rst) | 书稿源码；语言参数与 Docker 示例 |
| 教学目标与预发布状态 | [src/foreword.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/foreword.rst) | 通过失败案例理解组件；书稿为早期预发布 |
| 基础目录 | [src/building-blocks.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/building-blocks.rst) | 10 个基础主题 |
| 系统目录 | [src/complete-cryptosystems.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/complete-cryptosystems.rst) | TLS、GPG、OTR |
| XOR | [src/exclusive-or.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/exclusive-or.rst) | 异或定义、性质与图示引用 |
| 分组密码 | [src/block-ciphers.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/block-ciphers.rst) | AES 与 DES/3DES 背景 |
| 流密码与工作模式 | [src/stream-ciphers.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/stream-ciphers.rst) | ECB、CBC、CTR、位翻转等 |
| 密钥交换 | [src/key-exchange.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/key-exchange.rst) | Diffie–Hellman 与认证边界 |
| 公钥加密 | [src/public-key-encryption.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/public-key-encryption.rst) | RSA、OAEP；椭圆曲线小节 TODO |
| 哈希 | [src/hash-functions.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/hash-functions.rst) | 密码存储、盐、长度扩展、哈希树 |
| MAC / AEAD | [src/message-authentication-codes.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/message-authentication-codes.rst) | HMAC、认证加密；部分攻击说明 TODO |
| 签名 | [src/signature-algorithms.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/signature-algorithms.rst) | DSA；PKCS#1 v1.5、PSS、ECDSA 待补 |
| 密钥派生 | [src/key-derivation-functions.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/key-derivation-functions.rst) | HKDF 已有讲解；PBKDF2、bcrypt、scrypt 仅标题 |
| 随机数 | [src/random-number-generators.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/random-number-generators.rst) | Dual_EC_DRBG、Mersenne Twister；Yarrow 等 TODO |
| TLS | [src/ssl-and-tls.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/ssl-and-tls.rst) | 证书、前向保密、攻击背景；现代握手 TODO |
| GPG | [src/openpgp-and-gpg.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/openpgp-and-gpg.rst) | 概念与信任网 |
| OTR | [src/off-the-record-messaging.rst](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/off-the-record-messaging.rst) | 加密、身份认证、可否认性与密钥交换案例 |
| 构建目标 | [Makefile](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/Makefile) | book: html latexpdf epub |
| 语言参数 | [make-lang](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/make-lang) | 设置语言与输出目录，不生成翻译内容 |
| Sphinx 配置 | [src/conf.py](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/src/conf.py) | 扩展、引用、语言和排版配置 |
| 依赖环境 | [docker/Dockerfile.ubuntu](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/docker/Dockerfile.ubuntu) | Ubuntu 22.04、Sphinx、LaTeX、字体与插图工具 |
| 上游许可 | [LICENSE](https://github.com/crypto101/book/blob/fdd5dbbb02ebf3ed316f66db2af62dbad4e39455/LICENSE) | 作者署名与 CC BY-NC 4.0 |

补充：[官网](https://www.crypto101.io/)于本次查询展示 PDF 入口，EPUB 和 Mobi 条目划线。官网为可变页面，不能用于证明 PDF 对应上述提交；本次未下载、渲染或逐页核查官方 PDF。

## 已验证与未验证

| 范围 | 结果 |
| --- | --- |
| 仓库定位、默认分支版本与许可 | 已查阅 README、API 和 LICENSE |
| 能力覆盖与未完成部分 | 已核对目录，阅读主要章节的相关段落和 TODO；不是逐字技术审校 |
| 多格式与翻译配置 | 已阅读 Makefile、make-lang、conf.py 与 Dockerfile；只确认源码声明 |
| 本研究 Markdown 与 SVG | 链接、编号顺序与 XML 检查通过；SVG 渲染图已目视检查 |
| 上游书籍构建 | 未安装依赖，未构建 HTML/PDF/EPUB |
| 漏洞实验、协议运行、密码学实现 | 未执行；未验证书中代码片段安全性 |
| 中文译本完整度 | 未验证；参数支持不证明译本存在 |
| 学习效果、当前性能和最佳实践 | 未实测；学习路线是研究建议 |
| Web 展示 | 已新增中文学习网页，发布状态见 [网页记录](04-web-learning-guide.md) |

## 许可与材料处理

上游作者为 Laurens Van Houtven，社区亦参与贡献。LICENSE 声明 CC BY-NC 4.0（署名—非商业性使用），不应作为 MIT/Apache 类软件许可记录。本项目为中文独立研究摘要，保留来源和版本，概览图原创绘制；未引入完整上游仓库、长段原文或原书插图。涉及上游材料的使用仍应遵循其许可。

## 本地检查

- 检查 7 份子项目 Markdown 与根 README 新增内容，39 处本地引用的目标均存在。
- 根索引与预览共 12 个项目，编号唯一、升序且一一对应；012 使用历史最大目录编号加一。
- SVG XML 可解析；渲染为 1280 × 880 PNG 后目视检查，文字清晰且没有截断或重叠。临时渲染图放在系统临时目录，不作为上游截图或仓库交付文件。
- Git 差异空白检查通过。未修改其他子项目，也未引入依赖或构建产物。
- 后续新增中文学习网页，验证与发布情况见 [网页记录](04-web-learning-guide.md)。

[返回项目介绍](../README.md) · [能力详解](01-capabilities.md)
