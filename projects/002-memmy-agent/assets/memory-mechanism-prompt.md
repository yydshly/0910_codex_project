# 记忆原理图生成记录

使用内置 image_gen 工具生成并修订。最终图片：memory-mechanism.png。研究依据：Memmy 98146714aad8569a298cf8692946da8bb28bf7cb。图为 AI 生成的研究示意，不是上游产品截图。

## 初始提示词

Use case: infographic-diagram
Create one high-resolution Chinese educational infographic explaining the Memmy memory module. Landscape 3:2 composition, crisp legible Simplified Chinese typography, professional technical editorial design, white/light gray background, dark navy type, green for writing/storage, blue for retrieval, amber for feedback. Flat diagram with a few tasteful dimensional database/document icons, generous whitespace. This is an explanatory image, not a product screenshot or physical photo. All text should be accurate, large enough to read, concise. No decorative robot brain, no fake statistics.

Title exactly: "Memmy 记忆实现原理"
Subtitle exactly: "把执行记录存下来，按任务找回来，再从结果中更新经验"

Structure three clearly numbered horizontal lanes, left to right, with unambiguous arrowheads and ample room:
Lane 1 green title "01 写入｜留下可追溯记录"
Four boxes connected:
"请求 · 回答 · 工具结果" → "关联轮次与来源\n稳定 ID · 哈希去重" → "保存正文与状态\nSQLite · better-sqlite3" → "后台摘要与建索引\nLLM · Embedding · Worker"
Below this lane, a centered shared store band labeled "共享记忆库" with three compartments: "正文与经验", "来源 · 版本 · 状态", "全文索引 FTS5 · 向量索引 sqlite-vec". Show clear labeled arrow from saved/indexed data to this shared store.

Lane 2 blue title "02 召回｜为当前任务选择历史"
Five boxes connected:
"当前问题\n意图与范围" → "多路检索\n向量 · 全文 · 结构线索" → "融合排名\nRRF · 质量 · 时间权重" → "去重与筛选\nMMR · 可选 LLM 过滤" → "历史上下文\n交给 Agent 执行"
Connect shared store to the multi-channel retrieval box, label arrow "读取".
Under the retrieval row small concise explanatory line: "Embedding 找语义相近的内容；RRF 综合排名；MMR 减少重复。"

Lane 3 amber title "03 更新｜从结果中提炼经验"
"执行结果与反馈" → "评分与证据关联" → "合格 L1 → L2 规则" then branch into two separate boxes "L3 环境知识" and "Skill 操作指南", then a clearly labeled return arrow "更新后再次索引" returning toward the shared store. Prefer simple labeled return connector at edge rather than crossing other rows. Important: L3 and Skill are parallel branches from L2, not sequential. Show process can be asynchronous, not all memory upgrades.

Bottom strip with two explicit readable boundary statements:
"记忆服务提供参考，实际任务由对应 Agent 执行。"
"更新外部记忆与索引，不训练模型参数；高层提炼需满足条件。"
Small footer: "依据 Memmy 固定版本 9814671 的源码归纳 · 原理示意，非运行截图"

Do not invent extra stages. Do not imply every task waits for all background processing. Make flow readable before decorative detail. Render literal intended line breaks rather than backslash n text.

## 最终修订提示词

Edit this Chinese Memmy memory infographic. Preserve all text, typography, colors, box positions, icons and layout. Fix only two connector details for technical accuracy: (1) The blue vertical connector between shared memory store and 多路检索 must be bidirectional with an arrowhead at both ends, label remains 读取. This represents query and results. (2) Both L3 环境知识 and Skill 操作指南 outputs must visibly join the orange return path labeled 更新后再次索引 that points into the shared memory store. Currently only L3 is connected. Add a short clean orange elbow from the right side of Skill to the same return path, moving the small parenthetical note slightly only if necessary. Do not imply Skill follows L3. Keep all other content exactly intact, clear readable Chinese.
