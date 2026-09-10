export const memmyBase = 'https://github.com/MemTensor/memmy-agent/blob/98146714aad8569a298cf8692946da8bb28bf7cb/';
export const layers = {
  1: { title:'适配接入', summary:'把不同工具的历史格式和事件，转换成 Memory 服务能处理的请求。', tags:['Hook','插件','Skill','HTTP / CLI'], input:'本地历史、用户请求、任务结束事件。', process:'扫描 JSONL / SQLite；在宿主事件中查询或写回，也支持按需工具调用。', output:'统一的会话与任务记录；返回给宿主的历史上下文。', boundary:'负责连接，不统一调度外部 Agent。安装集成不代表所有工具每轮都自动召回。', source:'https://memmy.bot/docs/memory/sources/' },
  2: { title:'采集与写入', summary:'把一次工作转换成可以追溯、可以重复导入而不重复计数的记录。', tags:['Session / Turn','稳定 ID','哈希','增量检查点'], input:'用户请求、Agent 回答、可用工具轨迹、执行状态与来源。', process:'按完整轮次整理历史，用稳定 ID 和检查点去重，保存原始轮次和 L1 记录。字段存在长度与大小限制。', output:'数据库中的记录，以及等待总结、索引和提炼的后台任务。', boundary:'写入成功不等于完整索引就绪。历史导入需满足处理条件后进入召回，也不等于无限保存所有数据。', source:memmyBase+'docs/en/memory/overview.mdx' },
  3: { title:'存储与索引', summary:'正文、元数据和处理状态保存在本地；全文与向量索引承担不同查询。', tags:['SQLite','better-sqlite3','FTS5','sqlite-vec'], input:'记忆正文、来源、状态、时间、评分以及生成的向量。', process:'SQLite 保存结构化记录；FTS5 为文本建立全文索引；sqlite-vec 保存向量并查询语义候选。', output:'可管理的长期记录，以及用于检索排序的候选与元数据。', boundary:'本地保存不代表全程离线。当前向量路径有最近 2,000 条匹配向量的窗口，这不是数据库存储上限。', source:memmyBase+'Memory/src/storage/sqlite-vec-store.ts' },
  4: { title:'后台加工与提炼', summary:'将一次执行整理成摘要、经验规则、环境知识和可参考的操作指南。', tags:['Worker / 重试','Embedding','LLM 结构化生成','反馈评分'], input:'待处理记录、执行结果、反馈和支持证据。', process:'后台管线按配置执行摘要、反思、向量化和评分；符合条件的记录进入 L2 归纳，再衍生 L3 与 Skill。', output:'更新的索引、经验价值、规则与技能指南；以及处理日志和失败状态。', boundary:'这是记忆加工的调度。它不训练模型参数，也不保证生成的指南已经通过真实任务验证。', source:memmyBase+'Memory/src/service/worker/job-handlers.ts' },
  5: { title:'记忆召回', summary:'从历史里找出与当前问题相关、尽量不重复且值得交给 Agent 的内容。', tags:['向量 / FTS5','结构线索','RRF','MMR','模型过滤'], input:'当前查询、检索模式、范围、候选记忆与质量信息。', process:'结合向量、全文、短片段和结构线索召回，再融合排名、加入质量与时间因素、去重和按配置过滤。', output:'经过筛选的历史上下文；可追溯的候选、来源和检索日志。', boundary:'返回的是参考材料。当前请求与实际环境仍需复核；召回或模型处理失败可走相应回退路径。', source:memmyBase+'Memory/src/service/retrieval/retrieval-service.ts' },
  6: { title:'Agent 执行', summary:'运行环境负责把模型提出的工具调用，变成真实操作并反馈结果。', tags:['Provider','工具调用循环','MCP','会话 / 任务管理'], input:'当前用户任务、可用工具、会话状态及相关历史上下文。', process:'调用配置模型，执行所选工具，把结果交回模型判断下一步，直至任务完成、停止或失败。', output:'实际操作结果、回答、任务状态与待回写的执行记录。', boundary:'外部接入时由原 Agent 的 Runtime 执行；自带模式由 Memmy Runtime 执行。共享记忆不表示统一调度。', source:memmyBase+'App/memmy-agent/src/core/agent-runtime/loop.ts' }
};
export const modes = {
  external: { title:'外部 Agent Runtime', subtitle:'Claude Code / Codex 等 · 使用宿主模型与工具', caption:'原 Agent 保留自己的执行机制', explanation:'当前：外部 Agent 执行任务，Memmy 提供记忆。上面的查询与回写箭头不表示 Memmy 指挥外部 Agent。' },
  native: { title:'Memmy Agent Runtime', subtitle:'桌面 / CLI / API 发起 · 调用模型 API 与文件、Shell、MCP 工具', caption:'Memmy 同时提供记忆与执行环境', explanation:'当前：Memmy 自带 Runtime 调用模型、执行工具、反馈结果，并把任务经验写回共享记忆服务。' }
};

// The external mode describes a host integration, not Memmy's own executor.
export function getLayer(id, mode) {
  if (String(id) !== '6' || mode === 'native') return layers[id];
  return {
    ...layers[6], title: '外部 Agent 执行',
    summary: '原 Agent 保留自己的模型调用、工具执行和任务管理；Memmy 提供历史参考。',
    tags: ['宿主 Runtime', '宿主模型与工具', '记忆适配'],
    process: '宿主接收相关历史，调用自己的模型和工具推进任务。集成支持时，在完成事件中向 Memory 服务回写记录。',
    boundary: '这里不是 Memmy Runtime 的实现。是否采集工具轨迹、何时注入，都取决于该宿主与适配器。',
    source: memmyBase + 'docs/en/memory/sources.mdx'
  };
}
