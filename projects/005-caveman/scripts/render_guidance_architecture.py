"""Render the external-guidance and native-context-management comparison."""
from render_diagrams import Canvas, INK, MUTED, TEAL, PALE, WHITE, AMBER, SAND, BLUE

c=Canvas(1580,'外部引导与上下文整理架构','区分给 Agent 的文字引导与实际改写输入的压缩程序，展示 Codex 原生上下文管理、可选 Caveman 层、模型、恢复与效果验证。')
c.header('03 / CONTEXT ARCHITECTURE','外部引导，如何参与上下文整理？','Codex 已有原生管理能力；外部规则的价值，要看它能否带来额外收益。')

c.box(70,258,620,228)
c.text(100,284,'A  文字引导：告诉 Agent 怎样工作',29,INK,True)
c.lines(100,341,['任务要求 / AGENTS.md / Skill / 提示词','例如：先检索再读取；保留约束与未完成事项','由 Agent 执行，指令本身也占上下文'],25,gap=43)
c.box(785,258,945,228,PALE,'#BEDACD')
c.text(815,284,'B  可执行规则：直接处理候选内容',29,TEAL,True)
c.lines(815,341,['按类型解析、筛选、缩短；检查是否更短、是否可恢复','例如：日志去重复；代码保留结构；JSON 精简重复数据','由 Engine 执行；不等同于把几句“压缩提示词”交给模型'],25,gap=43)
c.arrow([(380,486),(380,640)])
c.text(401,576,'引导任务行为',23,TEAL)
c.arrow([(1055,486),(1055,640)])
c.text(1080,581,'配置与实现策略',23,TEAL)

c.box(70,640,620,320,INK,INK)
c.text(100,672,'Codex：原生上下文管理',32,WHITE,True)
c.lines(100,733,['历史自动整理 / 手动 compact','工具输出预算 / 压缩提示词配置','实验选项：笔记 + 可搜索历史','负责任务循环、工具调用与请求组装'],26,'#D9E8E3',gap=45)
c.box(785,640,540,320,PALE,'#BEDACD')
c.text(815,672,'Caveman：可选外部层',31,TEAL,True)
c.lines(815,733,['代理选取可处理的请求内容','识别类型 → 匹配结构压缩器','检查结果 → 保存原文 → 替换','不适合压缩：保留原文或处理错误'],25,MUTED,gap=45)
c.box(1420,640,310,320)
c.text(1450,672,'大模型',33,INK,True)
c.lines(1450,740,['读取最终上下文','推理、回答','或请求工具调用','由 Agent 继续执行'],26,MUTED,gap=44)
c.arrow([(690,800),(785,800)])
c.arrow([(1325,800),(1420,800)])

# The native path bypasses the optional compression layer.
c.arrow([(690,696),(733,696),(733,543),(1575,543),(1575,640)],BLUE)
c.text(1158,505,'原生路径：无需 Caveman 也能运行',24,BLUE)

c.box(70,1048,620,218)
c.text(100,1075,'工具、文件与任务材料',29,INK,True)
c.lines(100,1132,['Agent 执行工具，工具结果回填下一轮输入','先做精准检索、分段读取，也能减少冗余','这是材料进入上下文前的另一处优化点'],25,gap=40)
c.arrow([(300,960),(300,1048)])
c.text(220,995,'调用',22,TEAL)
c.arrow([(435,1048),(435,960)])
c.text(453,995,'结果回填',22,TEAL)

c.box(785,1048,945,218)
c.text(815,1075,'原文恢复：Caveman CCR',29,TEAL,True)
c.lines(815,1132,['有损替换前保存原始字节，并提供恢复引用','模型提出细节需求后，由 Agent 调用恢复工具，再送入模型','可恢复不等于当前输入无损；恢复调用同样有开销'],25,gap=40)
c.arrow([(1055,960),(1055,1048)])
c.text(1081,992,'保存原文',23,TEAL)

c.box(70,1320,1660,134,SAND,'#E9D3AD')
c.text(98,1343,'研究与验证：比较原生 Codex 和 Codex + Caveman',29,AMBER,True)
c.text(98,1398,'可选接入不表示我们建议叠加使用，也不表示已经确认叠加有收益；须对照任务质量与总开销。',26,INK)
c.text(70,1490,'关系示意，非当前会话部署图。Codex 实验功能默认关闭；接口与规则生效范围依版本和接入方式。',22,MUTED)
c.text(70,1525,'依据：OpenAI 官方文档（2026-09-10 查阅）与 Caveman 15581d1；原创整理，未验证叠加收益。',22,MUTED)
c.save('external-guidance-architecture')
print('Rendered external guidance architecture as PNG and SVG.')
