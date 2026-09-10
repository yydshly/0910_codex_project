# AnySearch Skill 完整理解：客户端、搜索服务与 Agent 生态

研究汇总日期：**2026-09-10**。上游：[anysearch-ai/anysearch-skill](https://github.com/anysearch-ai/anysearch-skill)。固定代码基线：`15b7ea5039983c9dee328be8c7c609f3eb86058e`，技能声明版本 **3.1.1**，许可证 **Apache-2.0**。价格、服务能力与其他产品信息按核对日期记录，不代表永久承诺。

## 一图总览

[![AnySearch 完整理解总览：开源客户端与未公开后端的边界、四类能力、收费与证据、同类产品、开源 Agent 的搜索来源和研究价值](../assets/research-overview.png)](../assets/research-overview.svg)

图 1：本研究依据固定源码、在线能力目录和官方文档原创绘制，非产品截图。蓝色表示本地/客户端实现，绿色表示已知能力与调用关系，橙色表示服务声明或尚未公开的部分。图中的“未公开”指没有获得相应服务端源码或技术证据。[原尺寸 PNG](../assets/research-overview.png) · [可缩放 SVG](../assets/research-overview.svg) · [图片来源说明](../assets/README.md)

## 1. 核心判断

**这个 GitHub 仓库提供的是 AnySearch 云端检索服务的开源客户端，以及指导 AI 使用客户端的 Skill 规范。** 搜索、专业数据查询与正文抽取由远端 `api.anysearch.com` 完成；下载仓库即可获得调用代码，但无法仅凭它自行部署完整搜索服务。[S1]、[S2]

可以将其定位为“商业检索服务的开源接入案例”。其中值得研究的是能力发现、工具参数、调用流程、并发和跨平台适配。搜索索引、数据源接入、路由模型、排序算法与生产部署等核心服务端实现，当前没有公开源码可供本研究核查。

这不意味着所有能力都没有价值：对于缺少搜索工具的 Agent，它可以补上检索入口；对于已有搜索和网页读取的 Agent，它的增量价值需要由实际数据覆盖、准确率、时效、稳定性与成本证明。

## 2. 它在整个系统里处于哪一层

| 层次 | 职责 | 是否属于这个仓库 |
| :--- | :--- | :--- |
| 用户 | 提出研究、编程、信息查询等需求 | 否 |
| 模型与宿主 Agent | 理解问题、规划、选择工具，读取结果后组织回答 | 否；由用户已有的 AI 产品或运行环境提供 |
| Skill 规范 | 告诉 Agent 何时搜索、如何发现领域能力和填参数 | **是：`SKILL.md`、共享接口说明** |
| 跨平台客户端 | 参数解析与转换、认证、HTTP 请求、并发、错误和输出格式 | **是：Python / Node.js / PowerShell / Bash 脚本** |
| AnySearch 云端服务 | 实际执行搜索、专业查询、URL 内容抽取 | **否：只能调用公开接口** |
| 上游信息来源 | 网页、专业数据库、平台数据等 | 否；具体调用链没有完整公开 |

典型流程：用户提出问题 → Agent 阅读 Skill 并选择能力 → CLI 提交请求 → AnySearch 处理 → CLI 输出 Markdown → Agent 核对来源并回答。

Skill 主要面向 Agent，但人也可以直接运行 CLI 或调用 API。安装 Skill 不会修改模型参数，也不会将搜索数据装进模型。它增加的是运行环境中的操作规范和调用入口。[S1]、[S2]

## 3. 客户端具体提供什么

| 命令 | 客户端工作 | 远端接口 |
| :--- | :--- | :--- |
| `get_sub_domains` | 查询能力名称、说明与参数要求；最多同时查五个领域 | `GET /v1/sub-domains` |
| `search` | 传入 query、tag、params 等，格式化搜索结果；单次 1–10 条 | `POST /v1/search` |
| `batch_search` | 最多五个查询并发，按输入顺序输出，允许部分失败 | 每项分别调用 `POST /v1/search` |
| `extract` | 提交 URL，格式化返回正文 | `POST /v1/extract` |
| `doc` | 显示本地接口说明 | 不联网 |

当前客户端直接调用 REST API，不需要另设 MCP 服务器。HTTP 传输使用 JSON，CLI 将主要结果转为 Markdown。旧参数 `sub_domain`、`sub_domain_params` 被转换为 `tag`、`params`。[S2]、[S3]

Python 的批量搜索使用线程与队列，Node.js 使用异步并发。批量调用会产生多个独立请求，也分别计入额度。它本身不执行跨查询去重、全局排序、证据冲突判断或报告写作。

四个语言版本共享常量和接口说明，生成器同步指定区块；业务实现仍分别维护。仓库自带接口测试，验证请求参数、并发、错误和结果顺序。[S2]、[S4]

## 4. “特殊能力”究竟特殊在哪里

**专业查询可以携带领域专用的标识与筛选参数，直接取得相应记录。** 它的潜在价值在于减少逐个接入数据源的工作。

| 需求 | 对应专业能力的用途 | 仍需核验 |
| :--- | :--- | :--- |
| 查股票历史价格 | 按代码、资产类型、时间范围查询行情 | 来源、延迟、复权方式等 |
| 查论文引用 | 按 DOI 等标识查询引用关系、数量或参考文献 | 数据覆盖、更新时间 |
| 查航班状态 | 按航班或机场等参数查询起降与延误信息 | 数据时效、航线覆盖 |
| 查软件漏洞 | 按 CVE、软件包及版本查询漏洞信息 | 版本匹配和记录完整性 |
| 查开发资料 | 按库名查询文档，按语言/路径/仓库查询代码片段 | 文档版本、示例正确性 |

以上是能力目录声明，未逐项做端到端实测。客户端已读取目录并成功完成一次 React 文档查询，不等于所有专业能力已经验证。

2026-09-10 的在线目录包含 **17 个领域、40 个子能力**：[完整参数快照](capabilities-2026-09-10.json)。

| 领域 | 子能力数 | 目录内容概括 |
| :--- | ---: | :--- |
| 通用 | 1 | 通用搜索 |
| 素材 | 1 | 图片、插画、SVG、矢量素材 |
| 社交媒体 | 1 | 微博、知乎、X、Reddit、LinkedIn、微信公众号等 |
| 金融 | 6 | 行情、新闻、筛选、日历、宏观、基本面 |
| 学术 | 5 | 综合文献、引用、生物医学、数据集、预印本 |
| 法律 | 3 | 判例、法规、立法追踪，存在地区范围限制 |
| 健康 | 3 | 药品、临床试验、公共卫生统计 |
| 商业 | 4 | 企业、招聘、贸易、职业联系人 |
| 安全 | 4 | 扫描、背景噪声、威胁情报、漏洞 |
| 知识产权 | 1 | 专利与专利族 |
| 代码 | 2 | 代码片段、开发文档 |
| 能源 | 2 | 电力、生产与消费数据 |
| 环境 | 1 | 空气质量 |
| 农业 | 1 | FAO 农业统计 |
| 旅行 | 2 | 机票、航班状态 |
| 影视 | 1 | 影视与音乐 BT 资源信息 |
| 游戏 | 2 | Steam、电竞数据 |

不能将“搜到一种资源”理解为“可以解析这种资源”：例如素材目录可以搜索图片，但 `extract` 不支持图片、PDF、Word 和音视频。它声明支持 HTML/XHTML、纯文本、JSON、Markdown；HTML/文本可能在 50,000 字符处截断，过大的 JSON/Markdown 会报错。[S3]

如果“搜书”指书籍，学术类型参数有 book / book-chapter，引用能力有 ISBN，但未发现独立的电子书全文下载能力，也未实测书籍查询。

## 5. 服务端原理：事实、声明与未知

| 证据层次 | 当前可以说什么 |
| :--- | :--- |
| **源码和请求可确认** | 客户端调用 AnySearch 的搜索、能力目录和正文接口；服务在线；部分匿名调用成功 |
| **目录可确认** | 返回了专业能力和参数；说明提到 S2、Crossref、PubMed/MEDLINE、PMC、EPO、FAO 等来源线索 |
| **官方产品声明** | 多来源统一接入、意图识别、分层路由、弹性编排、跨领域重排和质量处理 |
| **没有公开实现证据** | 完整上游供应商名单、每次请求调用链、自建索引范围、模型与重排算法、缓存和抓取方式、集群部署 |

可以用“按能力选择查询路径 → 获取信息 → 整理结果”解释服务的概念结构。不能进一步断言它全部依赖 Google/Bing，也不能断言它必然内置浏览器、RSS、某种向量数据库或某个爬虫框架。[S2]、[S5]

浏览器、HTTP 抓取、第三方 API、RSS、自建索引和缓存是此类系统的可能构件，其中专业 API/数据源对接有目录线索，但具体组合仍未公开。看见来源名字不等于看见采购合同或逐次请求追踪。

宿主 Agent 的领域选择与云端自己的路由是两个层次：前者有 Skill 与客户端代码可读，后者主要依据官网声明。官网也展示自报评测，本研究没有复现，因此不能将宣传分数当成独立质量结论。[S5]

## 6. 免费、收费与会员权限

| 套餐 | 2026-09-10 官方价格页信息 |
| :--- | :--- |
| Free | $0/月；1,000 次请求/日；每 Key 20 QPS |
| Professional | 标注 Coming Soon；尚无公开价格；描述包括更高额度和更深入的垂直搜索 |
| Enterprise | 联系销售；定制额度与高级垂直搜索等 |

价格页未给出“40 项能力逐项对应哪个套餐”的完整表。README 声明匿名可用搜索功能但额度更低，因此不能直接把匿名额度等同于 Free 套餐的每日 1,000 次。批量请求里的各查询分别计算额度，复杂 Agent 任务可能多次搜索。[S1]、[S3]、[S6]

**AnySearch 套餐与第三方网站会员是不同的权限关系。** 没有证据证明使用它即可获得知网、付费研报、专业金融终端或新闻付费墙的会员权限。它可能采购某些数据接口，也可能使用公开信息，但采购关系和授权范围未完整公开。不能据目录名称推断用户获得了第三方付费全文访问权。

## 7. 同类产品处在什么位置

以下是能力定位对照，不是质量排名，也不表示这些产品在所有功能上互相等价。

| 产品 | 核心定位 | 服务或开源边界 |
| :--- | :--- | :--- |
| Tavily | 面向 Agent 的搜索、筛选、内容提取，以及 Extract/Crawl/Map | 托管 API；适合比较检索上下文质量。[S7] |
| Exa | 自有索引、语义检索与内容获取 | 有自己的检索索引，不能简单视为其他搜索结果转发。[S8] |
| Brave Search API | 独立网页索引与排序、网页及模型上下文输出 | 官方明确说明独立索引。[S9] |
| Parallel | 搜索、内容抽取、多步骤研究、实体发现 | 检索与研究基础设施。[S10] |
| Perplexity Search API | 排序结果、多查询与过滤、内容提取 | Search API 返回资料；生成答案另用 Agent API。[S11] |
| Firecrawl | 搜索、页面和站点抓取、正文抽取 | 有开源与云服务，但能力不应默认等价。[S12] |
| SerpApi | 将 Google 等搜索结果提供为 API | 重点是结果接入，不等于自建 Google 索引。[S13] |
| SearXNG | 多来源元搜索 | 可以部署和研究其服务端；上游引擎仍有自己的边界。[S14] |
| Crawl4AI | 相邻的网页采集、浏览器控制、正文清洗与结构化抽取组件 | 开源抓取实现；本身不能等同于完整全网搜索索引。[S15] |

同类产品也可能具有论文或开发资料检索能力。比较时应看它返回的是网页摘要、数据库记录、全文、结构化字段还是生成答案，不能只数“领域标签”多少。

## 8. 开源 Agent 的底层搜索调用

**Agent 核心开源，不代表模型和搜索后端也开源。** 一个开源运行时可以调用托管模型和商业检索 API。以下为文档核对的现有接入关系，支持不代表默认全部启用。

| 开源 Agent / 核心 | 搜索或读取工具 | 调用关系与启用条件 |
| :--- | :--- | :--- |
| Codex CLI | 托管 `web_search` | → OpenAI 托管搜索；缓存模式使用 OpenAI 维护的索引，另有 live 等配置。CLI 开源范围不等于所有 Codex 产品或云后端开源。[S16] |
| Gemini CLI | `google_web_search`、`web_fetch` | → Google Search grounding；搜索结果先由 Gemini API 处理，返回带来源的综合内容。[S17] |
| OpenCode | `websearch`、`webfetch` | → Exa 或 Parallel；取决于 provider 和启用配置。[S18] |
| OpenClaw | `web_search`、`web_fetch`、`x_search`，另有浏览器 | → 所配置的搜索供应商，可选 Brave、Exa、Tavily、Parallel、Perplexity、Gemini、Grok、SearXNG 等。[S19] |
| Pi | 默认 read、write、edit、bash | 默认没有独立 web_search；通过扩展、Skill、包或程序补充。[S20] |

例如，OpenCode 已有 Exa/Parallel 接入；OpenClaw 的工具层本身就支持配置多种服务。因此“换搜索来源”不一定要再安装一个 Skill。Pi 的默认工具更精简，补充一个搜索入口的作用相对直接。

### 其他常见 Agent 产品

| 产品 | 已知能力 | 不应推断的部分 |
| :--- | :--- | :--- |
| ChatGPT | 第一方联网搜索、来源引用 | 本次文档未建立完整上游供应商名单。[S16] |
| Claude / Claude Code | 搜索与网页读取；Claude Code 的 WebSearch 调用 Anthropic 后端，WebFetch 再读网页 | 不将特定部署的供应商推广为全部 Claude 产品；内置后端不能直接改配置替换，可额外接 MCP。[S21] |
| Cursor Agent | 网页搜索、代码库检索，另有浏览器 | 核对文档未明确固定搜索供应商；切换模型不等于切换搜索来源。[S22] |
| Grok API | `web_search` 搜网页和读取页面，`x_search` 专门检索 X | API 工具不等于聊天产品所有套餐都无条件开放。[S23] |

## 9. 搜索、浏览器、专业查询与模型能力的区别

| 概念 | 主要输入与输出 |
| :--- | :--- |
| 搜索 | 问题/关键词 → 相关链接、摘录或检索答案 |
| 网页读取 | URL → 页面正文 |
| 浏览器操作 | 页面状态 → 点击、输入、滚动和新的页面状态 |
| 专业数据查询 | 实体标识与筛选条件 → 领域记录 |
| 模型能力 | 理解、推理、规划与生成；外部实时信息由工具提供 |
| Skill / MCP | 规范与接入方式，帮助 Agent 使用外部工具 |

Agent 可以在一次任务中组合这些能力。其运行环境提供什么工具、如何付费、有哪些权限，不能仅凭模型名称推断。

## 10. 这个项目的实际研究价值

**对于客户端集成研究：** 可以学习动态能力目录、领域参数设计、输出格式、错误处理、并行执行和多运行时一致性。

**对于核心搜索技术研究：** 当前公开代码不足以研究搜索后端的关键算法。若目标是自行建设，优先看 SearXNG 的聚合服务端、Crawl4AI 的抓取与提取实现、Firecrawl 的开源/云端边界，以及 OpenCode/OpenClaw 的供应商适配。

**对于日常使用：** 已有搜索的 Agent 不一定需要它。只有当它能提供缺失的专业数据、更好的覆盖与质量、更低成本或更少集成工作时，增量价值才成立。

后续扩展可以选择：参数 schema 校验与目录缓存、结构化输出、限流退避与额度预算、多供应商兼容网关、去重和证据核验、行业跟踪与报告。上述均为研究建议，不是本仓库已具备的完整产品能力。

## 11. 已验证与未验证

- **源码确认：** 客户端命令、接口、参数转换、并发机制、输出格式、共享生成区块与本地测试。
- **本地测试通过：** Python、Node.js、PowerShell 的上游模拟接口测试；四个客户端的生成一致性检查。
- **在线基础验证成功：** 通用搜索、React 文档搜索、example.com 正文抽取；后续取得完整 17 领域、40 子能力目录。
- **未验证：** Bash 实际运行、所有领域效果、免费额度极限、专业版/企业版权益、价格稳定性、后端算法、第三方采购和授权范围、与竞品的质量对照。
- **没有做：** 安装为个人 Skill、注册账户、购买套餐、部署搜索服务或提交完整上游副本。

详细过程见[验证记录](02-verification.md)，完整目录见[参数快照](capabilities-2026-09-10.json)。

## 来源索引

源代码链接固定提交；产品网页是核对当日状态。图中涉及的来源也按本表追溯。

[S1]: https://github.com/anysearch-ai/anysearch-skill/blob/15b7ea5039983c9dee328be8c7c609f3eb86058e/README.md
[S2]: https://github.com/anysearch-ai/anysearch-skill/blob/15b7ea5039983c9dee328be8c7c609f3eb86058e/scripts/anysearch_cli.py
[S3]: https://github.com/anysearch-ai/anysearch-skill/blob/15b7ea5039983c9dee328be8c7c609f3eb86058e/scripts/shared/doc_spec.md
[S4]: https://github.com/anysearch-ai/anysearch-skill/blob/15b7ea5039983c9dee328be8c7c609f3eb86058e/scripts/test_cli.py
[S5]: https://www.anysearch.com/home
[S6]: https://www.anysearch.com/pricing
[S7]: https://docs.tavily.com/documentation/about
[S8]: https://exa.ai/docs/reference/the-exa-index
[S9]: https://brave.com/search/api/
[S10]: https://docs.parallel.ai/getting-started/overview
[S11]: https://docs.perplexity.ai/docs/search/quickstart
[S12]: https://docs.firecrawl.dev/contributing/open-source-or-cloud
[S13]: https://serpapi.com/search-api
[S14]: https://docs.searxng.org/
[S15]: https://docs.crawl4ai.com/
[S16]: https://learn.chatgpt.com/docs/web-search
[S17]: https://geminicli.com/docs/tools/web-search/
[S18]: https://opencode.ai/docs/tools/#websearch
[S19]: https://docs.openclaw.ai/tools/web
[S20]: https://github.com/earendil-works/pi/blob/400d6905ce46ec46e79da8a7701b1b48850192df/packages/coding-agent/README.md
[S21]: https://code.claude.com/docs/en/tools-reference#websearch-tool-behavior
[S22]: https://cursor.com/docs/agent/overview
[S23]: https://docs.x.ai/developers/tools/x-search

| 编号 | 来源与用途 |
| :--- | :--- |
| S1–S4 | [项目说明][S1]、[客户端代码][S2]、[接口规范][S3]、[测试代码][S4] |
| S5–S6 | [服务端产品声明][S5]、[价格][S6] |
| S7–S11 | [Tavily][S7]、[Exa][S8]、[Brave][S9]、[Parallel][S10]、[Perplexity][S11] |
| S12–S15 | [Firecrawl 开源/云边界][S12]、[SerpApi][S13]、[SearXNG][S14]、[Crawl4AI][S15] |
| S16–S20 | [Codex/ChatGPT 搜索][S16]、[Gemini CLI][S17]、[OpenCode][S18]、[OpenClaw][S19]、[Pi][S20] |
| S21–S23 | [Claude Code][S21]、[Cursor][S22]、[Grok X Search][S23] |

补充依据：[Codex 开源组件范围](https://learn.chatgpt.com/docs/open-source)、[Tavily 四类接口](https://docs.tavily.com/documentation/integrations/mastra)、[Exa 内容获取](https://exa.ai/docs/reference/contents-api-guide)、[Firecrawl 搜索](https://docs.firecrawl.dev/features/search)、[Gemini 网页读取](https://geminicli.com/docs/tools/web-fetch/)、[Claude 聊天产品搜索](https://support.claude.com/en/articles/10684626-enable-and-use-web-search)、[Cursor 浏览器](https://cursor.com/docs/agent/tools/browser)、[Grok 网页搜索](https://docs.x.ai/developers/tools/web-search)。

---

[返回项目介绍](../README.md) · [返回研究笔记](README.md)
