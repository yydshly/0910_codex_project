# Codex 提示词如何被获取：以真实提交为证据，逐段理解 ChatGPT 5.6 收录文件

研究日期：2026-09-10

研究仓库：asgeirtj/system_prompts_leaks

固定研究版本：`f475e8b2b11ca7540a37234a451e9f085471bd94`

文档对象：想理解“材料从哪里来、到底收集了什么”的读者。

## 1. 先给两个精确答案

**获取方式存在可以追溯的实例。** Codex 的一个 GPT-5.5 精简提示词样本，贡献者明确说来自本地 `models_cache.json` 的 `instructions_template`。维护者又报告了与新缓存、公开源码和运行时文本的交叉核对。这里有直接来源声明，不必假定它通过诱导模型泄露或拦截通信取得。

**ChatGPT 5.6 样本是混合材料。** 本次研究的 `OpenAI/gpt-5.6-sol.md` 有 1,845 行、127,131 字节，包含产品规则、工具说明、接口格式、个性化设置和已脱敏的会话栏目。它不是模型权重，也不能仅凭文件名认定是每个 ChatGPT 用户都使用的完整统一提示词。

本报告区分三种证据：**仓库中直接可见的文本**、**贡献者或维护者的陈述**、**本研究根据源码提出的机制解释**。作者说“验证过”与本研究独立复现同一次环境，是不同强度的证据。

## 2. 一个有直接出处的 Codex 获取案例

### 2.1 先锁定案例，避免跨版本推断

选择 [PR #166](https://github.com/asgeirtj/system_prompts_leaks/pull/166)，其标题是将 Codex GPT-5.5 的精简文本与完整文本分开。该 PR 于 2026-07-08 合并。

这个例子回答“Codex 上的一些提示词如何被获取”。它不能自动证明后来 GPT-5.6、GPT-6 或所有其他产品都使用相同获取方式。

| 证据 | 直接说明了什么 | 没有说明什么 |
| :--- | :--- | :--- |
| [PR 贡献者说明](https://github.com/asgeirtj/system_prompts_leaks/pull/166) | 精简版本取自本地缓存的模板字段；另有完整运行时文本 | 没有给出完整运行时文本的导出工具或命令 |
| [维护者跟进](https://github.com/asgeirtj/system_prompts_leaks/pull/166#issuecomment-4915783800) | 使用当日新缓存校对，并与公开模型目录和完整文件中的系统指令段对照 | 这仍是维护者陈述，本研究没有重建其当日会话 |
| [核对提交](https://github.com/asgeirtj/system_prompts_leaks/commit/8733d6c3ca22d7540e6e13132415de375ffb95d2) | 修正精简文本，提交说明强调逐字节比对 | 不能由此认证所有其他文件 |
| [后续重命名](https://github.com/asgeirtj/system_prompts_leaks/commit/684f4c0e18403cb6505887d65f9c94e8a86d8121) | 将完整文件改称 codex-full.md，说明工具与环境属于 Codex 运行框架材料 | 不表示其中每个工具都是模型内置能力 |

### 2.2 models_cache.json 是什么

可以把它理解为客户端保存的一份“模型目录资料”。模型目录除了名称，还可以包含客户端组织请求时使用的指令模板。

本研究读取了固定版本的 OpenAI 公开源码：

- [缓存结构](https://github.com/openai/codex/blob/5a9eb145c4c05fcfc7158d7c25b80e1322eccae1/codex-rs/models-manager/src/cache.rs#L65-L84)包含获取时间、客户端版本、模型列表等字段。
- [公开模型目录](https://github.com/openai/codex/blob/5a9eb145c4c05fcfc7158d7c25b80e1322eccae1/codex-rs/models-manager/models.json)中的 GPT-5.5 项，确实存在 `model_messages.instructions_template` 字段。
- [模型信息处理逻辑](https://github.com/openai/codex/blob/5a9eb145c4c05fcfc7158d7c25b80e1322eccae1/codex-rs/models-manager/src/model_info.rs#L25-L99)会处理指令模板、覆盖配置和部分个性化变量。

这次官方源码核对使用的是 2026-09-10 的提交 `5a9eb145c4c05fcfc7158d7c25b80e1322eccae1`，用于确认该机制确实存在。它不是对 2026-07-08 客户端 0.142.5 环境的历史复现。

下面是便于理解的结构示意，值经过简化，不是作者原始缓存：

```json
{
  "fetched_at": "示意：目录获取时间",
  "client_version": "示意：客户端版本",
  "models": [
    {
      "slug": "gpt-5.5",
      "model_messages": {
        "instructions_template": "示意：编码助手的工作规则……",
        "instructions_variables": {}
      }
    }
  ]
}
```

这里的“提示词”就是 JSON 内的一段字符串。读取并解析 JSON 后，可以把这段字符串还原为含正常换行的文本。取出模板不涉及从模型权重中解码知识，也不意味着得到了服务器内的全部指令。

### 2.3 这次获取过程可以怎样还原

依据 PR 和公开源码，能够解释的流程是：

```text
模型目录资料
    ↓ 客户端获取并缓存
本地 models_cache.json
    ↓ 定位对应模型记录，读取模板字段
instructions_template 文本
    ↓ 与其他公开材料或新缓存比较
精简提示词文件
    ↓ 提交 PR、维护者校对
GitHub 档案
```

具体来说，贡献者取得本地缓存，找到目标模型对应的模板文本，将它与更大的运行时材料分开保存。维护者后来使用新缓存和公开源码检查差异，更新了精简文件。这说明“提取”和“校对”都有人工研究环节。

本研究只读取公开仓库、提交和源码，没有读取当前用户的 Codex 缓存，也没有运行提示词导出、通信拦截或模型诱导实验。

### 2.4 为什么模板与完整运行时文本不同

模板只是请求上下文的一个组成部分。客户端或产品运行框架还可能按任务环境补充开发者规则、工具定义、项目指令、权限说明、技能列表以及用户任务。

可以用以下概念结构理解，实际字段与拼接顺序因产品而异：

```text
基础模板 + 模式或风格设置 + 工具定义
         + 项目与环境上下文 + 用户任务
         → 送入模型的上下文
```

公开 API 的 [Responses 文档](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)也将输入、指令和工具等作为可区分的请求信息。这个官方接口解释有助于理解结构，但不是 ChatGPT 私有后台请求格式的复原。

在本研究版本中，三个文件的范围明显不同：

| 文件 | 行数 | 应如何理解 |
| :--- | ---: | :--- |
| [Codex gpt-5.6.md](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/Codex/gpt-5.6.md) | 168 | 以工作和交流规则为主的 Codex 样本 |
| [Codex codex-full.md](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/Codex/codex-full.md) | 11,104 | 混合系统、开发者、用户、环境及大量工具说明的运行时档案 |
| [ChatGPT gpt-5.6-sol.md](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md) | 1,845 | ChatGPT 产品侧的混合指令与上下文样本 |

这三个文件不是同一产品的三个等价副本。特别是 codex-full.md，不能因为名字带 full 就认定它包含服务端所有规则或全部可能配置。

### 2.5 完整运行时文本究竟怎么导出

**这次 PR 没有给出足以复现的导出步骤。** 可以确认作者把它称作运行时导出，但不能进一步断言它来自哪条命令、哪个日志、哪个代理或哪种对话技巧。

在自己可控制的 Agent 程序里，开发者可以在请求组装完成后、发送前查看自己构造的输入；如果程序提供相应调试导出，也能形成运行时记录。这解释“为什么运行时材料可以被保存”，不是对该贡献者实际操作的事实陈述。

同样，观察客户端请求只能看到在该观察点已经出现的信息。若服务端还会增加其他上下文，客户端记录就不一定包含它。网络连接采用加密传输时，普通抓包也不等于能直接读取完整请求文本。

另一个常被混淆的途径是让模型复述先前指令。即便模型输出看起来像提示词，也可能遗漏、改写或编造。此类输出不能在缺少对照时当成逐字准确的原始记录。本案例中的精简模板已有更直接的本地缓存出处，不需要用这种猜测替代证据。

### 2.6 不同账户为什么可能得到不同文本

PR 讨论中，参与者报告同一客户端版本的缓存出现 GPT-5.5 模板差异。维护者推测这可能是服务端按账户分组进行提示词实验，但没有公开内部实验配置。

因此应分别记录：

- “参与者报告缓存文本存在差异”是可追溯的陈述。
- “差异一定由 A/B 测试导致”是作者推断，本研究未独立确认。
- 模型名称、客户端版本相同，也不足以证明指令文本必然相同。

这也是为什么保存捕获日期、客户端版本、来源和文件校验值有研究价值。

## 3. ChatGPT 5.6：这次究竟在研究哪一份文件

本文研究的是 [OpenAI/gpt-5.6-sol.md](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md)。名称与文件首行将它标为 ChatGPT GPT-5.6 Sol；这是档案的标注，不是本研究对所有产品配置的官方认证。

| 项目 | 记录 |
| :--- | :--- |
| 所属目录 | OpenAI 根目录，不在 Codex 子目录 |
| 文件当前名称 | gpt-5.6-sol.md |
| 旧名称 | gpt-5.6-sol-extra-high.md |
| 旧路径新增记录 | 2026-07-10 |
| 更新和重命名 | 2026-08-22 |
| 文件开头日期 | 2026-08-22 |
| 当前固定版本的物理行数 | 1,845，含空行 |
| 文件大小 | 127,131 字节 |
| SHA-256 | 5f4ca63d00730919bf0046a627a6eef28bf9fc755b1d8c87ccc058aaac6ace89 |

[首次新增提交](https://github.com/asgeirtj/system_prompts_leaks/commit/693b5e102df3b1e1a25808a2b6add9cba15bcba7)与[更新重命名提交](https://github.com/asgeirtj/system_prompts_leaks/commit/a4c661e3ec98674c878aeb3cbf60647b55883f4f)说明它经历了持续维护。旧文件名包含 extra-high，不应据此把当前整份文本或其中每项设置推断为某个推理档位的稳定规范。

在本次检查的文件、路径历史和相关说明中，没有找到这份 ChatGPT 5.6 文件具体获取方法的可复现记录。**Codex 本地缓存的证据不能直接移用到 ChatGPT 网页产品上。**

## 4. 带行号的内容地图

下面是索引式解读；链接固定到研究提交，便于对照。描述的是文件中出现的信息，不表示当前账户可以使用相应能力。

| 文件位置 | 收录的信息 | 阅读时应关注什么 |
| :--- | :--- | :--- |
| [L1–18](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1-L18) | 身份、日期、运行环境与产物约定 | 环境路径和依赖说明不等于模型本身具备这些软件 |
| [L19–106](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L19-L106) | 表达风格、广告相关沟通、产品指引、工具使用和详细程度 | 产品规则与会话设置混在一起，应与模型能力区分 |
| [L107–116](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L107-L116) | 一段内容处理政策 | 这里只是一段政策文本，不能认定是完整安全政策 |
| [L117–1317](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L117-L1317) | 按命名空间排列的工具描述和调用格式 | 接口声明与执行实现属于不同层次 |
| [L1318–1337](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1318-L1337) | 输出通道、内部标签、个性与风格设置 | 这些值不能单独推导模型训练方式或性能 |
| [L1338–1403](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1338-L1403) | 开发者指令、预取组件与连接来源的使用说明 | 预先放入上下文的资料不是用户本次输入 |
| [L1404–1620](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1404-L1620) | 文件检索、读取、文件引用与文件库管理流程 | 看的是“如何选择与使用接口”的说明 |
| [L1621–1640](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1621-L1640) | 用户资料、自定义指令、记忆和近期对话栏目 | 具体私有内容已经被脱敏替换 |
| [L1643–1675](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1643-L1675) | 附件、时间、来源依据和文件参数传递说明 | 反映会话环境与产品处理约定 |
| [L1676–1746](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1676-L1746) | 成品写作内容的显示格式 | 一部分指令面向产品如何渲染回答 |
| [L1747–1845](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1747-L1845) | 预取交互组件、调用提醒和时间字段 | 属于随环境组装的上下文材料 |

### 4.1 工具区具体收录了哪些东西

工具区共有 **16 个 Namespace 标题**。这个数字包含被明确禁用的命名空间，不是“16 项经本研究验证可用的功能”。

| 命名空间 | 原文行号 | 文本所描述的接口方向 |
| :--- | :--- | :--- |
| python | [121–143](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L121-L143) | Python 执行 |
| genui | [144–198](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L144-L198) | 交互组件检索与运行 |
| web | [199–701](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L199-L701) | 网络与结构化信息查询 |
| automations | [702–877](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L702-L877) | 定时任务的创建、修改和查看 |
| local | [878–910](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L878-L910) | 向另一工作环境转交任务 |
| python_user_visible | [911–933](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L911-L933) | 面向用户展示的 Python 执行 |
| user_info | [934–950](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L934-L950) | 与位置、时间有关的上下文 |
| summary_reader | [951–978](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L951-L978) | 读取可安全分享的既往过程摘要 |
| container | [979–1040](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L979-L1040) | 命令、进程输入和文件辅助操作 |
| personal_context | [1041–1084](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1041-L1084) | 检索个人相关上下文 |
| bio | [1085–1131](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1085-L1131) | 记忆更新 |
| api_tool | [1132–1237](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1132-L1237) | 资源、插件与工具发现 |
| image_gen | [1238–1276](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1238-L1276) | 图像生成或编辑接口 |
| hotline | [1277–1288](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1277-L1288) | 本地援助热线信息 |
| user_settings | [1289–1311](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1289-L1311) | 查询或调整用户设置 |
| canmore | [1312–1317](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/gpt-5.6-sol.md#L1312-L1317) | 明确标为禁用 |

这些接口名称能帮助你画出产品能力的组成图。它们没有提供执行服务的完整实现、账户认证和部署环境。summary_reader 的描述也不代表这份档案保存了模型的完整私有推理内容。

### 4.2 用户资料栏目，是不是意味着公开了用户隐私

本文件可见相关栏目的结构，但具体内容使用脱敏占位符。可以研究“产品可能将哪些类别的个性化资料放入上下文”，不能把占位符当作真实用户资料，也不能据此推测被删除的内容。

这说明它并非完全未经处理的原始字节转储：至少存在脱敏或整理痕迹。脱敏通常有必要，但研究时应记录这种处理，避免声称拿到了完整原始会话。

### 4.3 为什么有风格、界面和广告说明

因为一个面向用户的 AI 产品还要决定如何呈现回答、如何交付文档、怎样区分平台界面与模型正文。这些属于产品行为要求。

从工程上理解，模型负责生成符合一定约定的内容，界面再按协议渲染。若只把模型看作“回答问题的函数”，就容易忽略这部分产品层设计。反过来，看到某种显示协议，也不能证明对应组件当前仍启用。

### 4.4 文件中的数字能说明什么

文件写有详细程度设置，以及一个名为 Juice 的数值标签。前者在文本中有默认回答长度风格的解释；后者不能直接换算成实际思考步数、输出 token、模型智力或可用预算。

研究原则是保留原始标签，并说明已知与未知。一个没有得到官方定义和实测支持的内部字段，不应被包装成模型性能结论。

## 5. 选一个文件任务，把这些栏目连起来理解

设想用户要求：“根据这份销售表制作一份中文报告。”下面是本研究编写的概念示例，不是该文件中真实记录的执行轨迹。

| 阶段 | 会涉及哪类材料 | 对开发者的启发 |
| :--- | :--- | :--- |
| 理解任务 | 用户输入、附件、当前时间和偏好 | 先明确数据来源和目标产物 |
| 确认工作环境 | 环境说明、任务转交约定 | 需要知道文件应由哪个实际环境处理 |
| 获取依据 | 文件检索、读取和引用说明 | 必须拿到真实内容，不能凭文件名猜数据 |
| 处理与产出 | 相应工具及文档工作说明 | 提示词只是操作约定，计算和文件生成由程序完成 |
| 呈现结果 | 风格、写作块和附件交付规则 | 结果除了正确，还要以用户能使用的方式提供 |

这份材料能为以上环节提供设计线索。它没有附带这一示例的真实输入、工具结果和最终报告，因此不能拿它作为端到端能力复现证据。

## 6. 这个案例最终说明了什么

**对“怎么获得”而言：** Codex 案例给出了本地模板字段的直接出处，还展示了社区提交、版本比较与维护者校对。完整运行时文件以及 ChatGPT 5.6 文件的具体获取手法，仍有证据缺口。

**对“收集了什么”而言：** 仓库不只收录狭义的角色设定。有些文件混合基础规则、产品开发者指令、工具接口、环境信息和会话字段。精简模板与完整运行时材料必须分别研究。

**对“有什么价值”而言：** 你可以借鉴如何划分职责、描述接口、安排工作流程和组织上下文。若要做自己的 Agent，还需要模型服务、工具实现、权限、状态管理和效果验证。

本例适合采用四步研究法：先找来源证据，再区分材料层次，然后提出设计假设，最后在自己的环境里验证。相比仅收集“看起来很厉害的提示词”，这能积累更可靠、可复用的知识。

## 7. 验证记录与复核入口

| 检查项目 | 本次完成情况 |
| :--- | :--- |
| PR #166、评论和核对提交 | 已读取，区分参与者陈述与推断 |
| Codex 精简和完整文件的命名历史 | 已沿旧路径追查 |
| ChatGPT 5.6 文件的旧名和更新记录 | 已检查 |
| 三份样本的行数、大小和 SHA-256 | 已从固定提交下载到临时目录后计算 |
| ChatGPT 工具标题与行号 | 已生成结构索引，核对禁用和脱敏标记 |
| 当前公开 Codex 缓存与模型目录结构 | 已读取固定官方源码版本 |
| 2026-07-08 原客户端与缓存环境 | 未独立重建 |
| 作者的运行时导出、ChatGPT 提取过程 | 未获得可复现说明，未复现 |
| 真实模型与工具调用 | 未执行 |

[结构索引与校验值](03-source-index.json)只保存文件元数据、标题和位置，不保存完整上游正文。上游根目录声明 CC0 1.0；本报告以原创中文解释为主，逐项第三方材料的权利来源未核查。

补充来源：[OpenAI 目录分类说明](https://github.com/asgeirtj/system_prompts_leaks/blob/f475e8b2b11ca7540a37234a451e9f085471bd94/OpenAI/README.md)、[Codex 配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[项目完整分析](01-analysis.md)、[研究意义与实践方法](02-significance.md)。

[返回项目介绍](../README.md)
