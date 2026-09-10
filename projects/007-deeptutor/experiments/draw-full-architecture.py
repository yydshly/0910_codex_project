"""One layout, two outputs: editable SVG and high-resolution PNG research diagram."""
from pathlib import Path
from html import escape
import math
from PIL import Image, ImageDraw, ImageFont

ASSETS = Path(__file__).resolve().parents[1] / 'assets'
W, H = 2400, 3510
image = Image.new('RGB', (W, H), '#f5f4ef')
draw = ImageDraw.Draw(image)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">',
       '<title id="title">DeepTutor 完整理解架构图</title>',
       '<desc id="desc">展示用户输入与产物、教学状态闭环、模型工具运行循环、知识接入检索、三层记忆、基础模型、同类产品实质差异及扩展验证边界。概念架构，非实际部署拓扑。</desc>',
       f'<rect width="{W}" height="{H}" fill="#f5f4ef"/>']
INK='#1c3d33'; MUTED='#53675e'; GREEN='#17634b'; LINE='#c6d2c7'
BLUE='#24557b'; PURPLE='#665482'; AMBER='#8a611c'
font_cache={}
text_bounds=[]

def font(size, bold=False):
    key=(size,bold)
    if key not in font_cache:
        font_cache[key]=ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc' if bold else 'C:/Windows/Fonts/msyh.ttc',size)
    return font_cache[key]

def rect(x,y,w,h,fill='#fffefa',stroke=LINE,radius=16,dashed=False):
    draw.rounded_rectangle((x,y,x+w,y+h),radius=radius,fill=fill,outline=stroke,width=2)
    dash=' stroke-dasharray="10 7"' if dashed else ''
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="2"{dash}/>')

def text(x,y,s,size=30,color=INK,bold=False):
    f=font(size,bold)
    width=draw.textlength(s,font=f)
    if x<0 or y<0 or x+width>W-30 or y+size>H-15:
        raise ValueError(f'Text outside canvas: {s}')
    draw.text((x,y),s,font=f,fill=color,anchor='lt')
    svg.append(f'<text x="{x}" y="{y}" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}" dominant-baseline="text-before-edge">{escape(s)}</text>')
    text_bounds.append((x,y,x+width,y+size,s))

def wrap(s,width,size):
    result=[]; current=''
    for c in s:
        if c=='\n': result.append(current); current=''; continue
        if current and draw.textlength(current+c,font=font(size))>width:
            result.append(current); current=c
        else: current+=c
    if current: result.append(current)
    return result

def block(x,y,w,lines,size=29,color=MUTED,step=43):
    cursor=y
    for line in lines:
        for part in wrap(line,w,size):
            text(x,cursor,part,size,color);cursor+=step
    return cursor

def card(x,y,w,h,title,lines,fill='#fffefa',accent=GREEN,size=29):
    rect(x,y,w,h,fill,LINE)
    text(x+25,y+20,title,33,accent,True)
    bottom=block(x+25,y+72,w-50,lines,size,step=43)
    if bottom-43+size>y+h-13:raise ValueError('Card too short: '+title)

def arrow(points,color=GREEN,width=3):
    draw.line(points,fill=color,width=width,joint='curve')
    ax,ay=points[-2];bx,by=points[-1]
    angle=math.atan2(by-ay,bx-ax);length=12
    tri=[(bx,by),(bx-length*math.cos(angle-.5),by-length*math.sin(angle-.5)),(bx-length*math.cos(angle+.5),by-length*math.sin(angle+.5))]
    draw.polygon(tri,fill=color)
    data=' '.join(f'{x},{y}' for x,y in points)
    svg.append(f'<polyline points="{data}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>')
    svg.append('<polygon points="'+' '.join(f'{x:.1f},{y:.1f}' for x,y in tri)+f'" fill="{color}"/>')

def section(y,h,index,title,note,fill='#e8eee7',accent=GREEN):
    rect(55,y,2290,h,fill,LINE,20)
    text(85,y+22,index,29,accent,True)
    text(160,y+18,title,39,accent,True)
    text(160,y+72,note,27,MUTED)

# Header and evidence legend.
text(65,38,'007 / DEEPTUTOR · 完整理解架构图',30,GREEN,True)
text(65,92,'通用 AI 底座之上，组织可持续的教学过程',65,INK,True)
text(65,181,'底层方法有共性；特色主要在教学业务与工程编排。功能相似，不代表证据、状态与执行方式相同。',32,MUTED)
text(65,237,'阅读顺序：输入与产物 → 教学层 → 运行与知识层 → 模型层 → 产品对照 → 扩展与边界',27,MUTED)

section(295,225,'A','用户输入与学习产物','Web（Next.js / React）→ 后端（FastAPI / Python）；具体能力取决于模型与可选服务。[S1–S4]')
card(85,407,1080,88,'输入：资料 + 目标 + 问题 + 作答',[],size=28)
card(1235,407,1080,88,'产物：解释 / 习题 / 报告 / 图表 / 笔记 / 互动书',[],size=28)
arrow([(1169,451),(1230,451)])
arrow([(1198,526),(1198,550)])

section(555,620,'03','教学业务逻辑 · DeepTutor 的特色重点','按目标组织教学活动，记录学习状态并决定如何推进；以下主闭环对应 Mastery Path。[S3、S5–S8]',fill='#e1eee4')
steps=[('目标拆解',['模块与知识点','绑定教材和学习目标']),('讲解与练习',['解释、例题、提问','按知识点组织活动']),('学习者作答',['提交答案与过程','形成作答记录']),('判断并更新状态',['模型可辅助判题','程序计算并保存掌握度']),('推进或复习',['达到门槛才能继续','已完成知识点到期复习'])]
for i,(title,lines) in enumerate(steps):
    x=85+i*452
    card(x,678,420,165,title,lines,accent=GREEN,size=27)
    if i<4:arrow([(x+424,760),(x+447,760)])
arrow([(1891,850),(1891,874),(747,874),(747,851)],GREEN)
text(880,886,'未达到门槛：继续讲解与练习',27,GREEN)
card(85,938,720,209,'模型负责',[
    '生成讲解、题目与反馈；辅助判断回答。',
    '模型输出仍需程序检查和实际验证。',
    '能生成学习计划 ≠ 已管理学习进度。'],size=28)
card(840,938,720,209,'程序负责',[
    '保存作答、计算掌握度、执行推进规则。',
    '基础评分：最近最多 5 次加权正确率；',
    '1 次记录上限 0.5，2 次上限 0.8。[S5]'],size=28)
card(1595,938,720,209,'不同任务有不同流程',[
    'Solve：计划 → 逐步完成 → 有限重规划',
    'Research：澄清 → 拆分 → 研究 → 报告',
    '其他：问答、Quiz、阅读与可视化。'],size=27)

arrow([(1198,1180),(1198,1209)],GREEN)
section(1215,440,'02','通用 AI 工程 · 运行与编排','共享会话和能力接口；部分任务复用聊天循环，部分采用专门流水线，并非所有模式内部相同。[S2、S6–S8]',fill='#e8eef3',accent=BLUE)
runtime=[('组装上下文',['问题、证据、会话','学习状态、选定记忆']),('调用大模型',['读取已组装的信息','直接回答或请求工具']),('工具分派与执行',['检索、搜索、代码等','依据能力与配置开放']),('读取工具结果',['把观察写回上下文','继续循环或完成回答'])]
for i,(title,lines) in enumerate(runtime):
    x=85+i*565
    card(x,1340,530,170,title,lines,accent=BLUE,size=29)
    if i<3:arrow([(x+535,1420),(x+559,1420)],BLUE)
arrow([(2045,1516),(2045,1542),(345,1542),(345,1516)],BLUE)
text(550,1555,'工具结果 → 更新上下文 → 再次调用；需要用户回答时可暂停并恢复',29,BLUE)
text(85,1610,'工具扩展：内置工具 / MCP / Skills / 外部 Agent；Skills 提供步骤与约束，不等于新增模型能力。',27,MUTED)

arrow([(595,1691),(595,1662)],BLUE)
arrow([(1775,1691),(1775,1662)],PURPLE)
section(1695,625,'02','通用 AI 工程 · 知识与长期状态','知识层向运行层提供来源证据；状态与记忆供后续任务复用，更新也来自任务和用户活动。[S4、S9、S20]',fill='#e8eef3',accent=BLUE)
card(85,1810,1360,470,'资料接入与三种读取方式',[
    '资料入口：教材、PDF / Office、网页与 GitHub、笔记及媒体内容。',
    '① 建立知识库：解析 → 切分 → Embedding / 索引 → 查询相关原文。',
    '    默认 LlamaIndex（向量 + BM25）；可选图检索等集成。',
    '② 文档树检索：PageIndex 沿结构寻找所需页面；不强制向量化。',
    '③ 沉浸式阅读：按页 / 章节搜索与读取，保留位置；无需向量索引。',
    '接入现有库：远端服务或 Obsidian 等实时资料有各自访问方式。',
    '每个知识库绑定一种集成，不是所有引擎同时运行。',
    '交给生成模型的是相关内容与来源；向量用于查找，不替代原文。',
    '引用可追溯 ≠ 解释一定正确；检索遗漏会影响回答依据。'],accent=BLUE,size=28)
card(1480,1810,835,470,'学习状态与三层 Memory',[
    '学习状态：知识点、作答、掌握度与复习。',
    '会话状态：消息、当前材料、任务绑定等。',
    'L1：工作区实体与变化记录。',
    'L2：各类活动的摘要与事实。',
    'L3：跨活动综合信息及偏好。',
    '任务和活动 → 保存 → 提炼 / 更新 → 复用。',
    '记忆可查看与整理；各层引用精度不同。',
    '保存记忆 ≠ 重新训练模型参数。',
    '持久化状态 ≠ 已证明个性化教学有效。'],accent=PURPLE,size=28)

arrow([(1198,2355),(1198,2326)],BLUE)
section(2360,215,'01','基础 AI 能力 · 主要接入现成模型','生成模型负责理解与生成；Embedding 服务于需要向量的路径；媒体模型按配置接入。',fill='#fffefa',accent=GREEN)
text(85,2478,'语言 / 推理模型',35,GREEN,True)
text(620,2478,'Embedding 模型',35,GREEN,True)
text(1220,2478,'视觉 / 语音 / 媒体能力',35,GREEN,True)
text(85,2535,'由运行层和资料处理流程调用。可选模型与服务不等于默认全部启用；自部署的数据流向取决于实际配置。',27,MUTED)

section(2615,390,'B','同类产品对照 · 共用方法，不同工程组合','下列是产品侧重点和已核对的代码路径，不是互斥边界或效果排名；商业产品内部架构未完全公开。',fill='#eeebf3',accent=PURPLE)
card(85,2730,535,210,'Open Notebook',[
    '笔记本、资料、笔记、内容与播客。',
    'Ask：策略 → 分路向量检索 → 汇总。',
    'SurrealDB；另有全文搜索。[S14–15]'],accent=PURPLE,size=26)
card(650,2730,535,210,'SurfSense',[
    '多来源研究、连接器、协作与自动化。',
    '已核对：向量 + 全文排名融合。',
    'PostgreSQL / pgvector。[S13、S16]'],accent=PURPLE,size=26)
card(1215,2730,535,210,'DeepTutor',[
    '资料、工具 + 教学活动与学习状态。',
    '可自部署、替换集成、修改教学规则。',
    '当前研究重点：业务流程的实际增量。'],accent=PURPLE,size=26)
card(1780,2730,535,210,'NotebookLM / Gemini',[
    '来源问答、学习卡片、测验与概览。',
    '配合学习功能；已宣布代码执行。',
    '在线成品，按账号开放。[S10–12]'],accent=PURPLE,size=26)
text(85,2963,'其他参照：RemNote → 笔记与复习；Khanmigo → 引导式辅导；StudyFetch → 课件与备考。[S17–S19]',26,MUTED)

section(3045,300,'C','研究判断、扩展方向与验证边界','共性是理解起点；差异要落实到数据、规则、证据与执行步骤。',fill='#f3eddf',accent=AMBER)
card(85,3160,720,155,'较浅的变化 / 实质的变化',[
    '摘要换卡片：可能主要是提示词与渲染。',
    '检索、评分、复习：需要数据和后端逻辑。'],accent=AMBER,size=27)
card(840,3160,720,155,'建议扩展 · 尚未实现',[
    '开源项目导师：代码阅读 → 练习 → 反馈。',
    '垂直题库、实践评测、班级与企业培训。'],accent=AMBER,size=27)
card(1595,3160,720,155,'未实测 · 不作效果保证',[
    '上游部署、判题准确率、学习收益未验证。',
    '检索质量、权限、延迟与成本需单独评测。'],accent=AMBER,size=27)

text(65,3382,'图例：箭头表示概念信息流或循环；分层表示职责，不对应独立服务或部署拓扑。',26,MUTED)
text(65,3423,'依据：DeepTutor v1.6.6 / 7a96bba · Open Notebook 2d2df8a · SurfSense 3448772 · 2026-09-10',25,MUTED)
text(65,3463,'S1–S20 对应完整理解文档的来源索引。本研究原创整理；源码事实、比较判断与建议扩展已分别标注。',25,MUTED)

# Each visible text rectangle must remain separate. Cards intentionally contain text.
for i,a in enumerate(text_bounds):
    for b in text_bounds[i+1:]:
        if min(a[2],b[2])-max(a[0],b[0])>2 and min(a[3],b[3])-max(a[1],b[1])>2:
            raise ValueError(f'Text overlap: {a[4]} / {b[4]}')
svg.append('</svg>')
ASSETS.mkdir(exist_ok=True)
(ASSETS/'full-architecture.svg').write_text('\n'.join(svg),encoding='utf-8')
image.save(ASSETS/'full-architecture.png',optimize=True)
print(f'Created full architecture SVG and PNG ({W} x {H}); checked {len(text_bounds)} text bounds.')
