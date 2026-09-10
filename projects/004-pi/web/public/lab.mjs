export const sourceBase = 'https://github.com/earendil-works/pi/blob/400d6905ce46ec46e79da8a7701b1b48850192df/';
const step = (label, title, kind, event, text, why, artifact, artifactState = '工作区示意') => ({ label, title, kind, event, text, why, artifact, artifactState });
const original = 'function total(price, quantity) {\n  return price * (quantity || 1);\n}';
const patched = 'function total(price, quantity) {\n− return price * (quantity || 1);\n+ return price * (quantity ?? 1);\n}';
export const scenarios = {
  repair: {
    title: '修复任务', task: '修复购物车总价计算：数量为 0 时，应返回 0。', tools: ['read', 'edit', 'bash'], file: 'cart.js · 工作区示意', source: 'packages/agent/src/agent-loop.ts', note: '使用 Pi 默认编程工具。代码、测试输出均为预设示例。',
    steps: [
      step('接收任务', '任务进入上下文', 'user', 'message_start', '修复 total(20, 0) 的计算结果。\n要求：保留数量未传入时的默认行为。', '用户任务与项目说明进入上下文。模型先获取目标和约束，再决定需要哪些证据。', original, '尚未修改'),
      step('读取文件', '读取相关代码', 'tool', 'tool_execution_end · read', 'read("cart.js")\n→ return price * (quantity || 1);', '模型提出 read 调用，Pi 执行后把文件内容作为工具结果交回模型；读文件不是模型凭空知道代码。', original, '已读取'),
      step('复现问题', '用测试确认错误', 'error', 'tool_execution_end · bash', '$ node cart.test.js\nFAIL total(20, 0)\nExpected: 0   Received: 20', '外部工具给出可观察结果。测试失败会成为下一轮输入，帮助模型定位默认值逻辑。', original, '测试未通过'),
      step('修改代码', '精确替换默认值逻辑', 'tool', 'tool_execution_end · edit', 'edit("cart.js")\noldText: quantity || 1\nnewText: quantity ?? 1\n→ 替换完成', 'edit 根据唯一匹配的原文做定向修改。这里用空值合并保留 0，只为 null 或 undefined 提供默认值。', patched, '1 处替换'),
      step('再次验证', '把修改交给测试', 'result', 'tool_execution_end · bash', '$ node cart.test.js\nPASS total(20, 0)  → 0\nPASS total(20, 2)  → 40\nPASS total(20)     → 20', '运行测试取得新证据，再决定是否继续修改。Agent 的结果质量依赖实际工具与验收标准。', patched, '示例测试通过'),
      step('完成任务', '汇总结果与改动', 'result', 'agent_end', '已修复：数量为 0 时返回 0。\n未传数量时仍默认为 1。\n示例中的三项测试通过。', '当不再需要工具调用和后续输入时，本次执行结束。页面只回放原理，没有实际修改文件。', 'function total(price, quantity) {\n  return price * (quantity ?? 1);\n}', '模拟任务完成')
    ]
  },
  research: {
    title: '研究任务', task: '研究 Pi 仓库，按“能力、原理、场景、扩展”输出一份中文笔记。', tools: ['read', 'bash', 'write'], file: 'research.md · 产物示意', source: 'packages/coding-agent/docs/skills.md', note: '假设已经准备研究 Skill。获取 GitHub 资料使用命令或另接检索工具。',
    steps: [
      step('接收任务', '明确研究问题', 'user', 'message_start', '研究 earendil-works/pi。\n记录固定版本、来源和未验证的能力。', '把输出要求与证据规范加入上下文，给研究过程明确边界。', '# Pi 研究\n\n等待资料收集。', '待生成'),
      step('加载方法', '读取研究 Skill', 'tool', 'tool_execution_end · read', 'read("skills/research/SKILL.md")\n→ 固定版本 / 文档 / 核心代码 / 来源 / 边界', 'Skill 是按需读取的操作方法与参考资料。它指导研究流程，本身不等于新增一个网络搜索接口。', '# 研究计划\n1. 固定版本\n2. 读取文档与关键源码\n3. 区分事实和推断', '方法已加载'),
      step('收集资料', '获取固定版本资料', 'tool', 'tool_execution_end · bash', '获取指定提交的 README 与 agent-loop.ts\n→ 保存来源与研究版本\n→ 不执行下载的上游代码', '使用环境已有命令或扩展获取资料。网络访问是工具能力，不是所有模型的天然能力。', '来源：README、agent-loop.ts\n版本：400d6905\n验证方式：静态阅读', '证据已收集'),
      step('形成分析', '区分能力与实现边界', 'model', 'message_end', '核心：模型适配、工具循环、会话管理。\n扩展：自定义工具、Skills、界面。\n边界：MCP 和多 Agent 非默认内置。', '模型结合证据整理分析。此处是对预设结论的教学展示，不代表重新完成了远端研究。', '能力 → 工具执行\n原理 → 模型与工具循环\n场景 → 编程与业务 Agent\n扩展 → Skills / Extensions', '分析已整理'),
      step('写入笔记', '生成结构化产物', 'tool', 'tool_execution_end · write', 'write("research.md")\n→ 中文分析\n→ 固定版本引用\n→ 未实测项目清单', 'write 将文本变成文件产物。模板和 Skill 决定文档结构，工具负责真正落盘；本页只展示这层关系。', '# Pi 研究\n\n## 能力与原理\n## 场景与扩展\n## 来源与验证边界', '笔记示意'),
      step('交付结果', '交付可复核的研究', 'result', 'agent_end', '完成中文研究笔记。\n保留来源和研究版本。\n明确标注：上游未实际运行。', '研究 Agent 需要可复核证据与质量验收。Pi 提供执行基础，研究标准由使用者定义。', '研究版本：400d6905\n来源：固定提交文档与源码\n状态：静态研究，未运行上游', '模拟任务完成')
    ]
  },
  extension: {
    title: '扩展任务', task: '查询内部知识库，找到服务发布前需要完成的检查。', tools: ['knowledge_search'], file: '自定义工具 · 数据流示意', source: 'packages/coding-agent/docs/extensions.md', note: 'knowledge_search 为假设的业务扩展，不是 Pi 的内置工具。示例不访问内部系统。',
    steps: [
      step('接收任务', '识别需要外部知识', 'user', 'message_start', '服务发布前要完成哪些检查？\n请给出内部文档来源。', '知识内容来自业务系统。模型需要调用已注册的检索工具，才能获取当前上下文之外的资料。', '用户问题\n↓\n已注册的业务工具', '等待查询'),
      step('选择工具', '模型提出结构化调用', 'model', 'message_end · toolCall', 'knowledge_search({\n  "query": "服务发布 检查清单",\n  "limit": 3\n})', '扩展用名称、描述和参数模式向模型声明工具。模型输出参数，真正查询由扩展实现。', '工具：knowledge_search\nquery：字符串\nlimit：正整数', '调用待校验'),
      step('参数校验', '运行时执行前检查', 'tool', 'beforeToolCall', '参数符合工具定义。\n假设业务扩展已核对请求身份。\n→ 允许执行查询', 'Pi 提供参数校验与执行前钩子。业务授权需要扩展或服务端实现，不由参数模式自动保证。', '结构校验 → 运行时\n访问授权 → 业务实现\n系统隔离 → 外部环境', '示例检查通过'),
      step('执行查询', '业务工具返回检索结果', 'result', 'tool_execution_end', '[示例文档：发布规范]\n1. 自动测试通过\n2. 备份与回退方案就绪\n3. 值班负责人已确认', '工具结果进入下一轮上下文。失败或空结果也应该作为明确结果返回，让模型据此调整。', '知识库服务\n↓ 查询结果与来源\ntoolResult 消息', '收到示例结果'),
      step('组织回答', '根据来源形成答复', 'model', 'message_end', '根据“发布规范”，需确认：\n测试结果、回退准备、值班负责人。\n来源：示例文档，非真实内部资料。', '模型负责组织答案，数据可靠性仍取决于真实检索、访问控制和来源校验。', '检索结果 + 用户问题\n↓\n带来源的答复', '答复已整理'),
      step('完成任务', '扩展完成一次业务连接', 'result', 'agent_end', '查询流程完成。\n没有执行部署操作。\n本页未连接任何真实知识库。', 'Extensions 让 Pi 接入领域工具。MCP 可以作为一种接入方式，但需要另行实现或安装适配扩展。', 'Pi 核心保持通用\n扩展承载业务连接\n服务端负责数据与权限', '模拟任务完成')
    ]
  }
};
export const capabilities = [
  { id:'models', glyph:'⇄', title:'多模型接入', subtitle:'pi-ai', description:'用统一接口组织请求，把模型服务差异留在适配层。', mechanism:'统一消息与工具表示，处理供应商协议和流式事件。', use:'在应用中接入多个供应商，或连接支持的自建端点。', boundary:'兼容接口不代表模型能力相同；自动最优路由需要自行实现。', source:'packages/ai/README.md' },
  { id:'tools', glyph:'>_', title:'工具执行', subtitle:'read · edit · write · bash', description:'让模型的下一步决定，真正连接到文件和命令。', mechanism:'工具参数经过校验，执行结果回到上下文，驱动下一轮。', use:'代码阅读、修改、测试与故障修复。', boundary:'默认按进程权限执行；本页不会执行真实命令。', source:'packages/coding-agent/src/core/tools/index.ts' },
  { id:'loop', glyph:'↻', title:'Agent 循环', subtitle:'pi-agent-core', description:'任务没有结束时，继续观察结果、选择工具、推进工作。', mechanism:'管理消息、工具执行、事件、中止和后续输入。', use:'多步骤任务、业务流程和需要反复验证的工作。', boundary:'循环存在不保证任务成功，仍需明确的验收标准。', source:'packages/agent/src/agent-loop.ts' },
  { id:'session', glyph:'⑂', title:'会话分支', subtitle:'JSONL · id / parentId', description:'保留探索历史，从旧节点继续另一种方案。', mechanism:'会话条目构成树，按选定路径重建对话上下文。', use:'比较方案、复盘尝试、恢复先前任务。', boundary:'对话分支不会自动恢复工作区文件。', source:'packages/coding-agent/docs/session-format.md' },
  { id:'context', glyph:'≋', title:'上下文压缩', subtitle:'summary + recent messages', description:'把旧对话整理为摘要，为下一轮模型调用留出空间。', mechanism:'记录摘要与保留边界，再组合近期消息。', use:'长对话、连续调试和多轮研究。', boundary:'摘要有损；会话历史不是永久准确记忆。', source:'packages/coding-agent/docs/compaction.md' },
  { id:'skills', glyph:'/', title:'Skills 与扩展', subtitle:'方法 · 工具 · 工作流程', description:'既能教 Agent 怎样工作，也能扩展它实际能调用的工具。', mechanism:'Skill 按需读取；TypeScript 扩展注册工具、事件、命令和界面。', use:'团队规范、行业助手、内部系统接入。', boundary:'扩展具有进程权限，加载信任不等于安全隔离。', source:'packages/coding-agent/docs/extensions.md' },
  { id:'embed', glyph:'{}', title:'嵌入你的应用', subtitle:'SDK · RPC · JSON', description:'把同一套执行能力带入自己的产品界面。', mechanism:'SDK 管理 AgentSession；RPC 用标准输入输出交换 JSONL。', use:'IDE、桌面、Web 应用或其他语言驱动的后台任务。', boundary:'认证、部署、并发和多租户隔离仍需应用层建设。', source:'packages/coding-agent/docs/sdk.md' },
  { id:'tui', glyph:'▤', title:'终端交互', subtitle:'pi-tui', description:'把消息、工具进度与输入组织成持续更新的工作界面。', mechanism:'组件化布局、差分渲染和同步终端输出。', use:'自定义终端助手、状态面板和扩展 UI。', boundary:'图片显示受终端协议支持限制；本页并非原生 TUI。', source:'packages/tui/README.md' }
];
export const extensions = [
  {id:'prompt', title:'固定输出格式', type:'Prompt Template', description:'把“能力 / 原理 / 场景 / 扩展”变成可复用的提问。', chip:'输出模板'},
  {id:'skill', title:'加入研究方法', type:'Skill', description:'按需读取固定版本、整理证据与标注边界的步骤。', chip:'研究方法'},
  {id:'tool', title:'连接知识来源', type:'Extension', description:'注册自定义检索工具，并实现它与业务系统的连接。', chip:'检索工具'},
  {id:'package', title:'分享给团队', type:'Pi Package', description:'将选定的模板、Skill 和扩展整理成可分发的包。', chip:'团队分发'}
];
export const branches = {
  a:{title:'当前路径 A · 最小修改', path:'01 → 02 → A', text:'保留函数结构，把 || 替换为 ??，再运行针对默认值和 0 的测试。另一分支的专属对话不会自动合并。'},
  b:{title:'当前路径 B · 扩大校验范围', path:'01 → 02 → B', text:'从同一份已读取的上下文继续，讨论类型与取值校验。这是另一条对话路径，需要额外测试与工作区管理。'}
};
export function initialState(scenario='repair') { if(!scenarios[scenario]) throw new Error('Unknown scenario'); return {scenario, step:0, playing:false}; }
export function transition(state, action) {
  const last=scenarios[state.scenario].steps.length-1;
  switch(action.type){
    case 'select':return initialState(action.scenario);
    case 'reset':return initialState(state.scenario);
    case 'play':return {...state, step:state.step===last?0:state.step,playing:!state.playing};
    case 'pause':return {...state,playing:false};
    case 'next':{const next=Math.min(last,state.step+1);return {...state,step:next,playing:next===last?false:state.playing};}
    case 'jump':return Number.isInteger(action.step)&&action.step>=0&&action.step<=last?{...state,step:action.step,playing:false}:state;
    default:return state;
  }
}
export function recipe(selection) {
  const picked=extensions.filter(e=>selection.has(e.id));
  const core=picked.filter(e=>e.id!=='package');
  const packed=selection.has('package');
  return {chips:['Pi 核心',...picked.map(e=>e.chip)],title:selection.has('tool')?'接入知识的研究助手':selection.has('skill')?'遵循方法的研究助手':selection.has('prompt')?'固定格式的编程助手':packed?'待装入资源的工具包':'基础编程助手',description:core.length===0?(packed?'包负责分发，不会凭空增加能力。选择模板、Skill 或扩展，才能形成有内容的团队工具包。':'核心提供模型与工具闭环。选择左侧资源，逐层加入任务格式、研究方法和外部知识。'):(core.map(e=>({prompt:'模板固定输出格式',skill:'Skill 提供研究步骤',tool:'扩展提供实际查询工具'}[e.id])).join('；')+(packed?'。这些资源可一起分发给团队。':'。可继续加入团队分发。'))};
}
export function contextView(compacted) { return compacted?{tokens:24,blocks:[...Array(2).fill('summary'),...Array(8).fill('empty'),...Array(2).fill('recent')],description:'较早的 60k 消息 → 12k 摘要，保留 12k 近期消息。下一轮看到摘要与近期内容；原始历史仍保留。'}:{tokens:72,blocks:[...Array(10).fill('old'),...Array(2).fill('recent')],description:'当前示例包含 60k 较早消息与 12k 近期消息。点击压缩，查看历史内容怎样被摘要替代。'}; }
export const escapeHtml = text => String(text).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
