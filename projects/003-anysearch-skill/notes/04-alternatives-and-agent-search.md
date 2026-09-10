# 同类产品与主流 Agent 的搜索能力

核对日期：2026-09-10。依据官方产品文档与公开项目说明，未进行跨服务质量基准测试。这里选择常见产品作为比较样本，不是全市场清单。产品版本、账户、模型供应商和组织配置会影响工具可用性。

## 1. 先区分四种能力

| 能力 | 输入与输出 | 典型实现 |
| :--- | :--- | :--- |
| 网页搜索 | 问题或关键词 → 相关页面/摘录 | 搜索 API、自建索引、元搜索 |
| 网页读取 | URL → 正文 | HTTP 获取、正文清洗、必要时渲染 |
| 浏览器操作 | 页面状态 → 点击、输入、滚动后的新状态 | 浏览器自动化、DOM 或截图理解 |
| 专业数据查询 | 实体标识与筛选条件 → 专业记录 | 行情、航班、论文引用等数据接口 |

代码库的 grep、语义代码搜索和文件搜索属于另一个检索范围；不能把它们当成互联网搜索。Skill/MCP 则是组织或接入工具的方式，不是搜索算法本身。

## 2. 可与 AnySearch 比较的服务

| 产品 | 主要能力与定位 | 研究边界 / 官方依据 |
| :--- | :--- | :--- |
| Tavily | 面向 Agent 的搜索、抓取、筛选和相关内容提取；另有 Extract、Crawl、Map | 托管检索服务；适合对比搜索上下文质量。[介绍](https://docs.tavily.com/documentation/about)、[四类 API](https://docs.tavily.com/documentation/integrations/mastra) |
| Exa | 自有索引，搜索与网页内容提取，可提供全文、相关摘录和摘要 | 不能简单归类为搜索引擎结果转发器。[索引](https://exa.ai/docs/reference/the-exa-index)、[内容接口](https://exa.ai/docs/reference/contents-api-guide) |
| Brave Search API | 独立网页索引，网页搜索及面向模型的上下文输出 | 官方明确说明有自己的索引和排序模型。[官方说明](https://brave.com/search/api/) |
| Parallel | Search、Extract，以及多步骤研究和实体列表发现 | 更接近检索与研究基础设施。[API 总览](https://docs.parallel.ai/getting-started/overview) |
| Perplexity Search API | 排序后的搜索结果、多查询、地区/语言/域名过滤与内容提取 | Search API 输出结构化结果；生成带引用答案使用另外的 Agent API。[文档](https://docs.perplexity.ai/docs/search/quickstart) |
| Firecrawl | 搜索、页面抓取、站点抓取和正文提取；当前文档还列出研究及开发者索引 | 有开源和云服务，不能默认两者能力完全一致。[搜索](https://docs.firecrawl.dev/features/search)、[开源与云服务](https://docs.firecrawl.dev/contributing/open-source-or-cloud) |
| SerpApi | 将 Google 等搜索引擎结果以 API 形式提供 | 适合需要传统搜索结果结构的应用；不等于自建 Google 索引。[Google 接口](https://serpapi.com/search-api) |
| SearXNG | 可自行部署的元搜索服务，聚合多个上游搜索来源 | 服务端实现可研究，但上游搜索引擎不因此开源。[官方文档](https://docs.searxng.org/)、[架构](https://docs.searxng.org/admin/architecture.html) |

Crawl4AI 是相邻的开源抓取与抽取组件：提供浏览器控制、Markdown 清洗、CSS/XPath/LLM 抽取和并行采集；不能将其等同于完整全网搜索索引。[官方文档](https://docs.crawl4ai.com/)

## 3. 主流 Agent 实际携带什么

下表描述官方工具能力，不代表所有用户已启用，也不把模型 API 能力直接当成聊天产品所有套餐的能力。

| Agent / 产品范围 | 官方公开的搜索或读取能力 | 底层来源及边界 |
| :--- | :--- | :--- |
| ChatGPT | 第一方联网搜索，返回来源引用；工作区可以限制使用 | 由 OpenAI 托管；本次文档未建立完整上游供应商名单。[官方文档](https://learn.chatgpt.com/docs/web-search) |
| Codex | 托管 web_search；本地默认缓存搜索，支持 live、indexed、disabled 等模式；完整访问模式默认 live | 缓存模式使用 OpenAI 维护的索引；与本地命令联网权限分开。[官方文档](https://learn.chatgpt.com/docs/web-search) |
| Claude 聊天产品 | 内置 Web Search，以及通过链接获取页面的 Web Fetch | 商用搜索工具由 Anthropic 提供；不能把某个特定部署的供应商推断为全部产品统一供应商。[帮助文档](https://support.claude.com/en/articles/10684626-enable-and-use-web-search) |
| Claude Code | WebSearch 查结果标题与 URL，再由 WebFetch 读取页面 | 使用 Anthropic 搜索后端；该内置后端不可直接配置替换，可通过 MCP 添加其他服务。模型部署渠道影响可用性。[工具参考](https://code.claude.com/docs/en/tools-reference#websearch-tool-behavior) |
| Gemini API / Gemini CLI | Google Search grounding；CLI 的 google_web_search 返回带来源的综合结果，另有 web_fetch | 明确使用 Google Search。API 需要配置相应工具。[API](https://ai.google.dev/gemini-api/docs/google-search)、[CLI 搜索](https://geminicli.com/docs/tools/web-search/)、[CLI 读取](https://geminicli.com/docs/tools/web-fetch/) |
| Cursor Agent | Web 搜索、代码库检索；另有浏览器工具 | 当前核对文档未说明固定搜索供应商；更换模型不等于自动更换搜索服务。[Agent 工具](https://cursor.com/docs/agent/overview)、[浏览器](https://cursor.com/docs/agent/tools/browser) |
| OpenCode | websearch + webfetch | 官方说明使用 Exa 或 Parallel；可用性由所用 provider 或启用配置决定。[工具文档](https://opencode.ai/docs/tools/#websearch) |
| OpenClaw | web_search、web_fetch、x_search，并有独立浏览器工具 | 可配置 Brave、Exa、Tavily、Parallel、Perplexity、Gemini、Grok、SearXNG 等服务；支持列表不代表全部同时启用。[工具文档](https://docs.openclaw.ai/tools/web) |
| Grok API | web_search 搜网页和读取页面；x_search 搜 X 内容 | x_search 支持关键词、语义、用户搜索和帖子串读取；不要把 X 搜索与普通网页搜索混为一谈。[网页](https://docs.x.ai/developers/tools/web-search)、[X](https://docs.x.ai/developers/tools/x-search) |
| Pi 默认核心 | 默认向模型提供 read、write、edit、bash 四个工具 | 默认没有专门 web_search；可通过 Skill、扩展和包补充，或由命令工具运行检索程序。[上游 README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) |

## 4. 对 AnySearch 的判断

已有托管搜索的 Agent，增加 AnySearch 主要是增加一个检索服务来源，是否有增益需要对照任务评测。对于 Pi 这样的极简默认工具环境，额外搜索工具的补充价值更直接。对于 OpenClaw/OpenCode，原有工具层本身就支持某些其他检索供应商，未必需要为更换搜索来源再安装 Skill。

不能只根据领域数量判断胜负：其他服务也提供研究/代码内容能力；同一个标签可能只代表网站过滤，也可能代表专业数据库查询。需要比较实际返回的数据字段、来源、覆盖、时效、权限和成本。

## 5. 针对源码研究的选择

以下是研究建议，不是搜索质量排名：

1. 学习搜索聚合服务端：SearXNG，重点看上游适配、并发、结果合并和服务部署。
2. 学习网页抓取与正文抽取：Crawl4AI；或研究 Firecrawl 的开源实现及其与云版的差异。
3. 学习 Agent 搜索工具接入：OpenClaw/OpenCode，重点看工具 schema、供应商配置、统一结果和错误处理。
4. 比较商业检索效果：选择 Tavily、Exa、Brave、Parallel、Perplexity 与 AnySearch 做同题测试；安装方式不应成为主要质量指标。

本轮未安装上述工具、未购买套餐、未批量调用其付费接口。所有功能表是文档核对，实际效果需另做基准。
