export const commit = 'f475e8b2b11ca7540a37234a451e9f085471bd94';
export const sourceUrl = (path) => 'https://github.com/asgeirtj/system_prompts_leaks/blob/' + commit + '/' + path.split('/').map(encodeURIComponent).join('/');
const cap = (id,title,summary,section,rule,effect,runtime,boundary,path) => ({id,title,summary,section,rule,effect,runtime,boundary,path});
const codex='OpenAI/Codex/gpt-5.4.md', claude='Anthropic/claude-code/claude-code-opus-4.6.md', cursor='Cursor/cursor.md', gemini='Google/gemini-cli.md', design='Anthropic/claude-design/skills/README.md';
export const agents = [
{id:'codex',name:'Codex',vendor:'OpenAI',symbol:'CX',color:'#275ee7',version:'GPT-5.4 指令样本',description:'从执行任务到代码审查，观察编码助手的工作规则。',caps:[
cap('execution','持续执行与验证','为什么它会继续把任务做完？','Autonomy and persistence','对于明确的实现任务，继续完成修改、验证与结果说明；遇到阻碍尝试解决。','收到“修复登录问题”后，按规则继续处理代码与验证，而不是停在解决建议。','宿主提供文件操作、命令执行，以及工具结果回传。','这是期望行为；并不保证每次任务都能成功完成。',codex),
cap('review','按风险进行代码审查','为什么审查结果会先列问题？','Special user requests','遇到 review 请求，优先查找缺陷、行为回归与缺失测试，并按严重程度给出位置。','先指出可能导致登录失败的逻辑及文件位置，再给整体总结。','宿主提供代码与差异，模型判断风险并组织结果。','审查规则不会自动证明代码正确，结论仍需验证。',codex),
cap('parallel','并行读取上下文','多个文件为什么可以一起读？','General','无依赖关系的工具读取尽量并行，减少不必要的等待。','理解登录流程时，可以同时读取路由、服务和相关测试。','调度程序必须支持并行工具调用，收集结果后再交给模型。','存在先后依赖的操作不能仅为提速而并行。',codex),
cap('planning','先规划，暂不改代码','计划模式和普通执行有何区别？','Mode rules / Three phases','规划模式允许有助于设计的非修改操作，先了解环境，再澄清目标，最后形成完整方案。','要求“规划登录重构”时，先输出实施路线与验收条件。','宿主管理当前模式，并限制可执行的修改操作。','这里只解释单独收录的模式文件，不表示所有会话都处于规划模式。','OpenAI/Codex/plan_mode.md')
]},
{id:'claude',name:'Claude Code',vendor:'Anthropic',symbol:'CC',color:'#ac583d',version:'Opus 4.6 + 独立子代理样本',description:'查看主助手、只读子代理、任务追踪与记忆的分工。',caps:[
cap('tasks','任务拆解与追踪','复杂工作如何按步骤推进？','Using your tools','使用任务工具规划和跟踪工作；完成一项就及时更新状态。','把“修复登录”拆为定位、修改和验证，逐项记录进展。','任务工具保存状态，模型根据状态继续决策。','文字中的任务规则需要真实任务存储与工具接口配合。',claude),
cap('explore','只读搜索子代理','为什么可以派一个助手只找代码？','Explore / Read-only mode','Explore 被定义为定位文件和符号的搜索角色，并限制文件修改。','主助手可以让搜索角色定位登录入口，再接收搜索结论。','宿主启动子代理，并为其配置工具权限和返回通道。','该样本说明它适合定位代码，不适合替代完整代码审查。','Anthropic/claude-code/agents/Explore.md'),
cap('memory','分类保存长期记忆','哪些信息值得留给下一次任务？','auto memory','样本区分用户、反馈、项目和参考信息，并描述独立记忆文件的保存与读取。','记录“此项目测试需连接真实数据库”，供后续任务参考。','宿主需要提供持久存储、检索入口以及访问权限。','记忆是否被正确提取、更新和使用，仍需实际测试。',claude),
cap('permissions','区分不同操作的影响','什么时候应当先确认？','Executing actions with care','根据可逆性、影响范围及用户授权判断是否直接执行，特别留意共享系统上的操作。','本地读代码和向共享仓库推送更改，会按不同影响处理。','程序层的权限与确认机制执行最终限制。','自然语言规则是行为约定，实际权限不能只靠模型自觉。',claude)
]},
{id:'cursor',name:'Cursor',vendor:'Cursor',symbol:'CU',color:'#6245c2',version:'IDE 指令样本',description:'理解编辑器上下文如何被交给模型，以及代码工具如何被描述。',caps:[
cap('context','编辑器上下文注入','它为什么知道你正在编辑什么？','Opening context / system-communication','样本说明产品可能附带打开的文件、光标、编辑历史与检查错误等上下文。','你问“这里为什么报错”时，模型可能同时收到相关文件与错误信息。','编辑器必须实际采集、选择并附加这些信息。','提示词提到上下文，并不意味着模型能自行访问整个电脑。',cursor),
cap('tools','发现与读取工具接口','如何知道一个工具该传哪些参数？','mcp_file_system','使用 MCP 工具前，先查看可用工具描述及参数定义。','连接一个文件服务后，先了解接口，再构造读取请求。','宿主提供接口发现、认证与实际工具调用。','接口说明不会自动安装工具或授予账户访问权。',cursor),
cap('references','可定位的代码引用','回答里的代码位置从哪来？','citing_code','区分已有代码引用与新代码示例；引用已有代码时带文件和行号。','解释登录逻辑时，把结论对应到现有代码位置。','编辑器渲染引用，并支持用户跳转查看。','行号与引用是否准确仍需校验，格式本身不保证正确性。',cursor),
cap('skills','按任务加载技能','为什么不同任务会有不同工作说明？','Agent Skills','执行任务前判断是否有相关技能，并阅读对应的技能文档。','任务涉及特殊开发流程时，额外加载该流程的说明。','宿主发现已安装技能，并把文档提供给模型。','技能内容与可用性依赖用户实际安装的环境。',cursor)
]},
{id:'gemini',name:'Gemini CLI',vendor:'Google',symbol:'GC',color:'#157b87',version:'CLI 指令样本',description:'观察上下文成本控制、工程要求与专用角色的组织方式。',caps:[
cap('efficiency','控制上下文成本','为什么只读相关片段？','Context Efficiency','优先搜索定位，限制读取范围，并组合独立读取，兼顾信息充分与会话成本。','排查登录错误时，先找到相关函数，再读取必要上下文。','搜索和读取工具需要支持范围及结果数量限制。','减少读取也可能漏掉线索，需要按结果调整范围。',gemini),
cap('conventions','遵循项目工程规范','为什么先查看项目已有写法？','Engineering Standards','检查项目规则、现有库和周边代码，沿用已建立的结构与风格。','修登录页面时，先确认项目现有表单与校验方式。','宿主把项目说明和代码提供给模型读取。','提示词要求遵循规范，不代表实现已通过类型或测试检查。',gemini),
cap('delegation','专用角色协作','什么时候需要把任务交给另一角色？','Available Sub-Agents','样本描述专用子代理，并按任务类型组织委派及并发边界。','复杂调查可以由专用角色返回结果，再由主助手继续整合。','需要子代理启动、上下文传递、通信与资源调度。','子代理说明不能替代实际调度系统，也不能保证节省成本。',gemini),
cap('validation','把验证纳入任务','为什么修改之后还要检查？','Engineering Standards / Testing','要求修改兼容项目，并通过相关测试与验证确认行为。','修复后检查原登录失败路径以及相关正常流程。','测试命令与项目环境执行验证，并返回结果。','本展示没有运行 Gemini CLI，也未验证其实际测试覆盖率。',gemini)
]},
{id:'design',name:'Claude Design',vendor:'Anthropic',symbol:'CD',color:'#a35f09',version:'Skills 与配套组件目录',description:'观察设计类 Agent 如何把审美要求、技能和组件资料组织起来。',caps:[
cap('direction','设计方向指令','为什么会先考虑受众与风格？','Design Thinking / Aesthetics Guidelines','前端设计技能要求先考虑目的、受众和审美方向，再处理排版、颜色与细节。','做页面时，先决定适合任务的视觉方向，再落实到界面。','需要能够创建前端文件并呈现结果的运行环境。','这是一份设计指导，不能保证输出的视觉质量。','Anthropic/claude-design/skills/frontend-design/SKILL.md'),
cap('modular','按产物拆分技能','做文档与做原型为何使用不同流程？','Built-in skills','目录按文档、演示、交互原型、线框图等任务拆分技能说明。','同一助手根据目标产物选择相应的任务说明。','宿主需要提供技能发现与加载机制。','列表来自整理说明；部分技能名称与描述是重建元数据。',design),
cap('schema','工具定义与任务说明','除了提示词，还收录了什么接口资料？','System prompt and raw tool schemas','整理说明将系统提示词与原始工具定义关联到 claude-design.md。','研究者可以继续查看任务说明如何引用工具接口。','真正的工具还需要参数校验、执行实现和结果回传。','此项展示收录结构，未逐个复现或测试工具。',design),
cap('components','起始组件资料','Agent 使用的界面积木能否被研究？','Starter component sources','仓库还列有浏览器窗口、设备框架与演示等起始组件源文件。','可以研究产物如何复用已有组件，而不必每次从头编写。','组件需要兼容的前端依赖、构建和运行环境。','已核对目录存在；本项目没有运行这些上游组件。',design)
]}
];
export const scenarios = [
{id:'fix',name:'修复登录问题',agent:'codex',cap:'execution',task:'登录后仍跳回登录页，请帮我修复。',steps:[
{title:'接收任务',owner:'宿主程序',text:'把用户任务、项目上下文、工作规则与工具清单交给模型。',result:'模型获得任务和可用操作范围。'},
{title:'决定下一步',owner:'大模型 + 指令',text:'结合持续执行与验证的规则，决定先检查相关代码。',result:'生成读取文件的结构化调用。'},
{title:'执行工具',owner:'宿主程序',text:'实际读取项目文件，把内容或错误信息回传。后续修改也通过真实工具完成。',result:'模型获得新的代码证据。'},
{title:'继续并验证',owner:'模型与程序循环',text:'模型根据结果提出修改与检查步骤，程序执行，再把结果交回。',result:'形成修改说明与验证结果；失败时继续处理。'}]},
{id:'plan',name:'只规划，不修改',agent:'codex',cap:'planning',task:'帮我规划登录模块的重构方案。',steps:[
{title:'加载模式',owner:'宿主程序',text:'把规划模式规则与用户目标一起交给模型。',result:'任务以形成完整方案为目标。'},
{title:'调查环境',owner:'大模型 + 指令',text:'按规划规则，先了解项目，再澄清会影响方案的目标。',result:'提出读取相关代码的请求。'},
{title:'只读执行',owner:'宿主程序',text:'读取并返回代码，按实际权限限制修改操作。',result:'方案获得代码依据，项目未被修改。'},
{title:'交付计划',owner:'大模型 + 指令',text:'整理实现步骤、关键文件、边界情况与验收方式。',result:'得到可供后续实施的方案。'}]},
{id:'explore',name:'子代理定位代码',agent:'claude',cap:'explore',task:'找出登录入口和调用它的位置。',steps:[
{title:'选择角色',owner:'主助手',text:'按搜索任务的特点，把定位请求交给 Explore 角色。',result:'形成范围明确的搜索子任务。'},
{title:'配置子代理',owner:'宿主程序',text:'加载独立角色说明和工具权限，提供任务上下文。',result:'搜索角色获得只读任务边界。'},
{title:'查找与读取',owner:'子代理 + 工具',text:'在允许范围内搜索文件与符号，工具返回实际命中结果。',result:'找到可能相关的文件与位置。'},
{title:'回传结论',owner:'子代理 → 主助手',text:'把定位结果交回主助手，主助手继续解释或处理后续任务。',result:'得到位置线索；不等于完成全面代码审查。'}]}
];
export const getAgent = id => agents.find(a=>a.id===id) || agents[0];
export const getCapability = (agent,id) => agent.caps.find(c=>c.id===id) || agent.caps[0];

// 以下为本站根据已收录材料补充的中文解读，不执行这些指令。
agents.find(a=>a.id==='codex').caps.push(cap('preserve','保留用户已有修改','它如何与你共用一个工作目录？','Editing constraints','不撤销用户已有修改；遇到同文件中的既有变更，先理解并在其基础上工作。','修复登录代码时，保留你已经修改的界面文案与其他功能。','宿主提供工作区差异与精确编辑能力，避免无关覆盖。','仍需检查最终差异，不能仅靠提示词保证没有误改。',codex));
agents.find(a=>a.id==='claude').caps.push(cap('plan-agent','独立的方案设计角色','规划子代理与搜索子代理有什么区别？','Plan / Your Process','Plan 角色负责理解需求、探索架构、权衡方案并给出实施步骤，同时限制文件修改。','搜索角色回答“代码在哪里”，规划角色进一步思考“怎样修改比较合适”。','宿主为角色配置上下文、只读工具集合与返回通道。','角色说明能帮助分工；实际的隔离、权限和调度仍要由程序实现。','Anthropic/claude-code/agents/Plan.md'));
agents.find(a=>a.id==='cursor').caps.push(cap('read-first','修改前先读文件','为什么不能直接按猜测替换代码？','making_code_changes','编辑之前先读取文件；完成修改后处理引入的检查错误。','修改登录校验前，先确认当前实现与周边代码，减少基于过时假设的改动。','读取工具提供真实内容，编辑工具应用变更，检查工具反馈错误。','这是工作顺序约定；读取过文件并不代表模型一定理解正确。',cursor));
agents.find(a=>a.id==='gemini').caps.push(cap('intent','区分咨询与执行','问“应该怎么做”会直接触发修改吗？','Engineering Standards / Expertise & Intent Alignment','样本区分咨询、建议与明确的执行指令：分析类请求先提供结论，实施需要相应指令。','询问“怎样重构登录”时，先分析方案；明确要求实施后，再进入修改流程。','宿主传入准确的会话和项目上下文，并配合操作权限。','这里只说明该样本表达的策略；不同产品与模式的默认策略可能不同。',gemini));

export const reuseCases=[
{id:'delivery',title:'做一个能交付的编码助手',agent:'codex',cap:'execution',problem:'助手给出修改建议后就结束，用户还要自己完成后续操作。',pattern:'提炼“明确任务 → 实施 → 验证 → 报告结果”的完成规则。',instruction:'对明确的代码修改任务，先阅读相关实现，再完成必要修改和相关验证。报告具体改变、验证结果和仍未解决的问题。遇到失败时根据证据调整；缺少关键权限或信息时明确指出。',tools:['读取和搜索代码','受范围限制的文件编辑','测试执行与结果回传'],measure:'固定模型、工具和一组缺陷任务，对比加规则前后的任务完成率、误修改、耗时和调用成本。',limit:'完成规则可能让助手更愿意继续处理任务；是否提高成功率必须实测。'},
{id:'readonly',title:'做一个只读代码调查助手',agent:'claude',cap:'explore',problem:'只想知道代码在哪里，不希望调查过程修改项目。',pattern:'借鉴专用搜索角色，把职责和可用工具范围一起缩小。',instruction:'你的任务是定位与问题有关的文件、符号和调用位置。先搜索再读取必要片段，返回文件位置与依据。不要修改文件。找不到证据时说明已检查的范围，不把局部搜索当成完整审查。',tools:['只读搜索与读取接口','禁止写入的实际工具权限','文件位置和来源返回格式'],measure:'准备已知答案的定位任务，记录位置准确率、遗漏率，并验证写入操作确实无法执行。',limit:'真正的只读保证来自程序权限。提示词负责说明边界，不能替代权限实现。'},
{id:'memory',title:'做一个记住团队约定的助手',agent:'claude',cap:'memory',problem:'团队的固定规范需要在每次任务中重复解释。',pattern:'借鉴记忆分类与检索时机，把长期约定与当前任务的临时信息分开。',instruction:'将明确且可长期复用的团队约定归类保存，并保留来源、适用范围和更新时间。开始相关任务前读取适用约定；当前指令与旧记录冲突时说明差异并确认更新，不把一次性任务细节当成长期规则。',tools:['有访问控制的持久存储','按任务查找相关约定','允许查看、更新和删除记录的入口'],measure:'在连续多次任务中检查约定是否被正确使用，并测试过期记录、矛盾指令和跨项目误用。',limit:'这是一种迁移设计建议。记忆提取和更新会出错，需要自己的测试与管理流程。'}
];
