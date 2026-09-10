# 关键知识清单：避免遗漏，而不只登记读过

日期：2026-09-10。原书固定版本：fdd5dbbb02ebf3ed316f66db2af62dbad4e39455。

## 目的

此前的 204 个标题入口解决目录覆盖，不能代表完整讲解或学习者已经掌握。此次增加关键点层，帮助未来复习时发现缺口；原有章节、细节导读和笔记继续保留。

清单面向程序员的应用密码学主线，不是密码学全部领域，也不是生产系统安全认证。52 个检查点为本研究按学习目标精选，其中 44 个必会、8 个进阶；42 个依据原书提炼，10 个为外部补充学习。

## 每点包含什么

- 核心结论：应理解的知识和重要前提。
- 常见误区：容易混淆、过度推断或遗漏的条件。
- 掌握标准：能解释、画图、举反例或区分场景。
- 检查题与参考思路：先回答再查看，不自动判分。
- 固定原书或外部权威来源，以及返回相关章节的入口。

新增独立知识页，也将对应检查点放到每章的“本章关键点”中。术语和文献属于查阅支持单元，引导回总清单；不为凑数量虚构算法知识点。

## 特别补上的遗漏

编码与加密、认证与授权、消息新鲜性/重放、无歧义认证输入、密钥生命周期、密码存储成本与升级、TLS 1.3 握手职责、0-RTT 重放条件、Ed25519 的签名用途、跨重启/多发送者的 nonce 管理。

补充不冒充原书已写内容。资料核对日期为 2026-09-10，不直接提供“适用于所有环境”的参数建议，也未复现相关算法或部署。

## 外部资料

- [RFC 4648 §12](https://www.rfc-editor.org/rfc/rfc4648.html#section-12)：编码的安全边界。
- [RFC 4303 §3.4.3](https://www.rfc-editor.org/rfc/rfc4303.html#section-3.4.3)：以 ESP 的序号/窗口机制理解重放。
- [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)：认证与授权。
- [OWASP Key Management](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)：密钥生命周期。
- [RFC 5116 §3.3](https://www.rfc-editor.org/rfc/rfc5116.html#section-3.3)：关联数据的无歧义编码。
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)、[RFC 9106](https://www.rfc-editor.org/rfc/rfc9106.html)：密码存储与 Argon2。
- [RFC 8446 §2](https://www.rfc-editor.org/rfc/rfc8446.html#section-2)、[§8](https://www.rfc-editor.org/rfc/rfc8446.html#section-8)：TLS 1.3 握手和 0-RTT 条件。
- [RFC 8032 §5.1](https://www.rfc-editor.org/rfc/rfc8032.html#section-5.1)：Ed25519。
- [RFC 8439 §4](https://www.rfc-editor.org/rfc/rfc8439.html#section-4)：nonce 使用前提。

## 如何查漏

先检查必会点，不能解释的标“未学”；有印象但条件说不清的标“需复习”。能说明结论、前提、反例并回答检查题后，再自评“能解释”。换场景不再能解释时，可以改回需复习。

五个串联场景覆盖文件下载、付款请求、密码存储、安全连接和长期加密服务。每个场景链接到关联知识点，要求解释不同保护的职责。

可只看尚未掌握的点，筛选必会、进阶或补学，复制待学清单给助手。每章原有引导语也会带上该章未掌握的点。

## 个人记录

知识点使用独立浏览器存储键 crypto101-knowledge-v1，原有章节完成状态与笔记仍用原来的键，不迁移或覆盖。学习状态只在当前浏览器保存，不是自动测试成绩。

导出复习记录为 Markdown，包含所有点的当前状态及待学清单，适合留档和粘贴到对话；不自动恢复网站进度。存储或剪贴板不可用时提供提示和手动复制途径。JavaScript 关闭时仍可阅读全部清单并下载文本。

知识点 ID 稳定，不随排序改变，不复用已移除 ID；今后增加数据时需要保留跨章状态。

## 验证范围

- 21 个静态页面；52 项数据字段、44/8 优先级、42/10 来源分类、原书行号与各章对应检查通过。
- 检查全部知识点出现在总清单和所属章节，掌握标准/答案经过 HTML 转义后存在，Markdown 下载包含全部点。
- 新状态验证无效值过滤、跨章状态保留、撤销、旧进度隔离；筛选和待学引导语顺序检查通过。
- 原有章节、来源、演算与下载检查继续通过；967 处本地页面引用与锚点检查通过。
- 未执行浏览器真实点击、截图或视觉回归，未做教学效果或上游密码学实验。

发布结果见[仓库 Web 记录](../../../docs/web-demos.md)。

[返回项目介绍](../README.md) · [网页运行说明](../web/README.md)
