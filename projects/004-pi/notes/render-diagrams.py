"""Render editable SVG and matching PNG research diagrams; no upstream code executes."""
from pathlib import Path
from html import escape
import math
from PIL import Image, ImageDraw, ImageFont

ASSETS = Path(__file__).resolve().parents[1] / 'assets'
FONT = 'C:/Windows/Fonts/msyh.ttc'
BOLD = 'C:/Windows/Fonts/msyhbd.ttc'
INK, MUTED, BLUE, TEAL, AMBER = '#19283e', '#53647b', '#2454ef', '#08786b', '#996216'

class Diagram:
    def __init__(self, name, width, height, title, subtitle):
        self.name, self.w, self.h = name, width, height
        self.image = Image.new('RGB', (width, height), '#f5f7fc')
        self.draw = ImageDraw.Draw(self.image)
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(subtitle)}</desc><rect width="100%" height="100%" fill="#f5f7fc"/>']
        self.text(60,42,'PI / THEORY ATLAS',23,BLUE,True)
        self.text(60,87,title,43,INK,True)
        self.text(60,150,subtitle,23,MUTED)
        self.text(60,height-81,'研究版本：400d6905 · 2026-09-10 · 原创源码分析图，非实际运行记录',21,MUTED)
        self.text(60,height-45,'来源索引与完整说明：projects/004-pi/notes/02-architecture-and-scheduling.md',19,MUTED)
    def text(self,x,y,text,size=23,color=INK,bold=False):
        font=ImageFont.truetype(BOLD if bold else FONT,size)
        # Draw using top anchors; SVG uses a matching baseline offset.
        self.draw.text((x,y),text,font=font,fill=color,anchor='lt')
        self.parts.append(f'<text x="{x}" y="{y+size*.88}" fill="{color}" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}">{escape(text)}</text>')
    def rect(self,x,y,w,h,fill='#ffffff',stroke='#d5deed',radius=14,dashed=False):
        self.draw.rounded_rectangle((x,y,x+w,y+h),radius,fill,None if dashed else stroke,width=2)
        if dashed:
            for start,end in [((x+radius,y),(x+w-radius,y)),((x+radius,y+h),(x+w-radius,y+h)),((x,y+radius),(x,y+h-radius)),((x+w,y+radius),(x+w,y+h-radius))]:
                self.dashed_line(start,end,stroke,2)
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="2"'+(' stroke-dasharray="9 6"' if dashed else '')+'/>')
    def card(self,x,y,w,h,title,lines,color=BLUE,fill='#ffffff',source='',size=23,dashed=False):
        self.rect(x,y,w,h,fill,color,dashed=dashed)
        self.text(x+22,y+19,title,26,color,True)
        content_top=58
        available=h-content_top-(33 if source else 16)
        size=min(size,int((available-max(0,len(lines)-1)*5)/max(1,len(lines))))
        if size<18: raise ValueError(f'Card too short: {title}')
        for i,line in enumerate(lines):
            measured=self.draw.textlength(line,font=ImageFont.truetype(FONT,size))
            if measured>w-44: raise ValueError(f'Text too wide in {title}: {line}')
            self.text(x+22,y+content_top+i*(size+5),line,size)
        if source:self.text(x+22,y+h-24,source,18,MUTED)
    def dashed_line(self,start,end,color,width):
        length=math.dist(start,end)
        if not length:return
        for offset in range(0,int(length),16):
            a=offset/length;b=min(offset+9,length)/length
            self.draw.line([(start[0]+(end[0]-start[0])*a,start[1]+(end[1]-start[1])*a),(start[0]+(end[0]-start[0])*b,start[1]+(end[1]-start[1])*b)],fill=color,width=width)
    def line(self,pts,color='#798eac',width=3,dashed=False,arrow=True):
        if dashed:
            for start,end in zip(pts,pts[1:]):self.dashed_line(start,end,color,width)
        else:self.draw.line(pts,fill=color,width=width,joint='curve')
        self.parts.append(f'<polyline points="'+ ' '.join(f'{x},{y}' for x,y in pts)+f'" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"'+(' stroke-dasharray="8 7"' if dashed else '')+'/>')
        if arrow:
            x,y=pts[-1]; px,py=pts[-2];a=math.atan2(y-py,x-px);n=12
            triangle=[(x,y),(x-n*math.cos(a-.45),y-n*math.sin(a-.45)),(x-n*math.cos(a+.45),y-n*math.sin(a+.45))]
            self.draw.polygon(triangle,fill=color)
            self.parts.append(f'<polygon points="'+ ' '.join(f'{x},{y}' for x,y in triangle)+f'" fill="{color}"/>')
    def label(self,x,y,text,color=MUTED,size=20):
        width=self.draw.textlength(text,font=ImageFont.truetype(FONT,size))+14
        self.rect(x-5,y-3,width,size+10,'#f5f7fc','#f5f7fc',3)
        self.text(x,y,text,size,color)
    def band(self,x,y,w,h,label,color=BLUE):
        self.rect(x,y,w,h,'#edf2fc','#d5deed',18)
        self.text(x+24,y+20,label,24,color,True)
    def finish(self):
        self.parts.append('</svg>')
        ASSETS.mkdir(exist_ok=True)
        (ASSETS/(self.name+'.svg')).write_text('\n'.join(self.parts),encoding='utf-8')
        self.image.save(ASSETS/(self.name+'.png'),optimize=True)
        print(f'{self.name}: {self.w} × {self.h}, SVG + PNG')

def architecture():
    d=Diagram('architecture',2000,2380,'Pi 完整架构与技术能力','实线：常用执行关系  ·  虚线边框：实验性服务路线  ·  右栏：横切能力与边界；不代表所有应用必须加载全部模块')
    d.band(60,220,1340,235,'01  接入与呈现：同一运行能力，多种使用入口')
    for x,title,lines,src in [
        (84,'交互 CLI',['编辑器 / 命令 / 模型选择','pi-tui：组件与差分渲染'],'[S1, S10]'),
        (414,'Print / JSON',['一次性文本输出','或完整 JSON 事件流'],'[S1]'),
        (744,'TypeScript SDK',['createAgentSession()','嵌入自己的 Node 应用'],'[S2]'),
        (1074,'RPC 模式',['stdin / stdout','LF 分隔的 JSONL'],'[S3]')]:
        d.card(x,285,302,142,title,lines,source=src,size=20)
    d.line([(235,455),(235,478),(730,478),(730,558)],BLUE)
    d.line([(895,455),(895,478),(730,478)],BLUE,arrow=False)
    d.line([(565,455),(565,478)],BLUE,arrow=False)
    d.line([(1225,455),(1225,478),(895,478)],BLUE,arrow=False)
    d.label(750,475,'命令 / prompt / 事件订阅',BLUE)
    d.band(60,510,1340,525,'02  pi-coding-agent：把运行时、资源与会话组装成编程助手')
    d.card(84,580,390,185,'资源与配置加载',['Settings / Project Trust','AGENTS.md / SYSTEM.md','Skills / 模板 / Pi Packages'],source='[S1, S2, S8, S9]',size=22)
    d.card(504,580,420,185,'AgentSession · 应用协调层',['输入预处理 / 命令与队列','压缩 / 重试 / 事件与生命周期','持有 Agent 与会话依赖'],fill='#e8eeff',source='[S2, S5]',size=22)
    d.card(954,580,420,185,'ModelRuntime',['模型目录 / 供应商注册','认证解析与模型选择','向 pi-ai 提供调用入口'],source='[S2, S4]',size=22)
    d.line([(474,665),(504,665)],BLUE)
    d.line([(954,665),(924,665)],BLUE)
    d.card(84,805,390,190,'SessionManager · 常用路径',['JSONL 追加记录 / 会话树','恢复 / 分支 / fork / 导出','摘要条目 + 最近消息'],source='[S6, S7]',size=22)
    d.card(504,805,420,190,'ExtensionRunner',['输入 / 上下文 / 请求钩子','工具拦截 / 自定义命令与 UI','加载扩展 ≠ 限制其系统权限'],source='[S8, S9]',size=22)
    d.card(954,805,420,190,'工具集合',['默认：read / write / edit / bash','可选：grep / find / ls / powershell','自定义 Tool / 可替换执行实现'],source='[S11]',size=20)
    d.line([(714,765),(714,805)],BLUE)
    d.line([(279,805),(279,788),(504,788),(504,755)],'#8c9ab2',dashed=True)
    d.line([(1164,805),(1164,788),(924,788),(924,755)],'#8c9ab2',dashed=True)
    d.line([(714,1035),(714,1090)],BLUE)
    d.label(738,1052,'prompt / steer / followUp / abort',BLUE)
    d.card(220,1090,1100,165,'03  pi-agent-core：状态与 Agent 循环',['AgentState：model + systemPrompt + tools + messages','runAgentLoop：模型调用 → 工具批次 → 结果回传 → 下一轮；可取消、可监听事件'],fill='#e8eeff',source='[S4, S5]')
    d.line([(500,1255),(500,1320)],BLUE)
    d.line([(1050,1255),(1050,1320)],BLUE)
    d.label(280,1280,'上下文 → 统一模型调用',BLUE)
    d.label(860,1280,'toolCall → 调度执行',BLUE)
    d.card(84,1320,610,205,'04A  pi-ai：模型协议适配',['Context / Message / Tool / TypeBox','provider 适配 / 流式事件 / 用量信息','跨模型消息转换 / 认证与传输支持'],TEAL,'#eff9f6','[S4]',size=23)
    d.card(774,1320,600,205,'04B  工具执行与结果整理',['名称与参数校验 / beforeToolCall','并行或顺序执行 / afterToolCall','toolResult + isError → 返回上下文'],BLUE,'#ffffff','[S5, S11]',size=23)
    d.line([(389,1525),(389,1590)],TEAL)
    d.line([(1074,1525),(1074,1590)],BLUE)
    d.label(411,1545,'请求 / 流式响应',TEAL)
    d.label(1095,1545,'动作 / 实际结果',BLUE)
    d.card(84,1590,610,145,'外部模型服务',['OpenAI / Anthropic / Google 等','兼容自建端点；能力取决于模型与协议'],TEAL,'#eff9f6',size=22)
    d.card(774,1590,600,145,'外部执行环境',['文件系统 / Shell / 业务 API','容器、凭据隔离与业务授权由宿主提供'],TEAL,'#eff9f6',size=22)
    d.line([(84,1450),(42,1450),(42,1170),(220,1170)],TEAL,dashed=True)
    d.line([(1374,1450),(1420,1450),(1420,1170),(1320,1170)],BLUE,dashed=True)
    d.label(80,1173,'结果与事件',TEAL,19)
    d.band(60,1800,1340,455,'05  实验性服务路线：独立展示，不能等同于上面的 JSONL RPC',AMBER)
    d.card(84,1870,370,150,'pi-client',['传输无关客户端 / 显式重连','请求 / 订阅 / presentation attach'],AMBER,'#fffcf3','[S12]',size=20,dashed=True)
    d.card(510,1870,350,150,'pi-protocol',['路由信封 / CBOR / 长度帧','serverId / sessionId / attachmentId'],AMBER,'#fffcf3','[S13]',size=18,dashed=True)
    d.card(916,1870,458,150,'pi-server',['本地服务与会话路由 / 多呈现挂接','宿主负责 Session / worker 生命周期'],AMBER,'#fffcf3','[S14]',size=21,dashed=True)
    d.line([(454,1945),(510,1945)],AMBER)
    d.line([(860,1945),(916,1945)],AMBER)
    d.card(84,2070,625,150,'进程内 Session / AgentHarness',['由应用与 agent-core 接口组织；不跨进程传递对象','服务调用与状态复制由 Chord 契约承载'],AMBER,'#fffcf3','[S12–S15]',size=21,dashed=True)
    d.card(749,2070,625,150,'pi-session-backend-sqlite-node',['可选 node:sqlite 持久化；与 CLI JSONL 路线区分','写入所有权由宿主保证；非内置全文检索服务'],AMBER,'#fffcf3','[S16]',size=21,dashed=True)
    d.line([(1145,2020),(1145,2045),(396,2045),(396,2070)],AMBER)
    d.line([(709,2145),(749,2145)],AMBER)
    d.card(1450,220,490,325,'先分清：谁负责什么',['人：目标、约束与验收标准','模型：生成回答与工具调用','Pi：组织、执行、反馈、保存','工具：实际访问外部环境','业务规则：Skill / 扩展 / 宿主','工作流可定制，不是固定业务 DAG'],fill='#e8eeff',size=23)
    d.card(1450,595,490,260,'横切能力 · Chord',['服务依赖与插件 facets','本地与远程服务绑定','状态复制 / 增量更新','取消上下文 / 生命周期组织'],source='[S15] 独立包，可用于非 Pi 应用',size=23)
    d.card(1450,905,490,250,'横切能力 · pi-telemetry',['显式 Context / Span 契约','类型化 schema / 内存参考实现','可自行适配日志或追踪后端','不是现成监控后台'],source='[S17]',size=23)
    d.card(1450,1205,490,250,'开发验证 · pi-evals',['真实 AgentSession 行为评测','临时项目与 agent 目录','对比模型、提示词、工具与 Skills','保留会话产物；依赖真实模型'],source='[S18] 不在普通任务的必经路径',size=22)
    d.card(1450,1505,490,310,'扩展能力与安全边界',['Skill：按需加载操作方法','Extension：新增工具与钩子','子 Agent / 计划模式：官方示例','MCP：需扩展接入','项目资源信任 ≠ 系统权限隔离','沙箱与业务授权需独立建设'],source='[S1, S8, S9]',size=22)
    d.card(1450,1865,490,355,'读图范围与技术取舍',['覆盖固定提交的 11 个组件包','左侧是能力与执行关系总览','不是精确的 npm 依赖锁定图','实验协议无兼容性保证','CLI 会话仍按 JSONL 解释','SQLite 不能当成默认 CLI 存储','节点来源编号对应配套分析'],color=AMBER,fill='#fffcf3',size=22)
    d.finish()

def scheduling():
    d=Diagram('scheduling-flow',2000,2670,'Pi 业务调度流程：一个任务怎样推进','主线：常用 AgentSession / Agent 路线  ·  框内写明责任模块  ·  回环代表再次调用模型，不代表重复整个初始化')
    # Three lanes separate user/app orchestration, model decisions, and real tools.
    for x,w,title in [(60,590,'A / 人与应用协调'),(720,590,'B / Agent 与模型'),(1380,560,'C / 工具与反馈')]:
        d.band(x,220,w,2080,title)
    def box(x,y,w,h,num,title,lines,color=BLUE,src=''):
        d.card(x,y,w,h,f'{num}  {title}',lines,color,'#ffffff',src,size=22)
    box(84,295,542,170,'01','创建或恢复运行环境',['入口：CLI / SDK / RPC','加载配置、资源与信任决策','装配 AgentSession、模型、工具、会话'],src='[S1, S2]')
    box(84,510,542,180,'02','接收输入与预处理',['扩展命令可直接处理并返回','input 钩子可接管或变换输入','Skill / 模板展开；普通 prompt 继续'],src='[S5, S8]')
    d.line([(355,465),(355,510)],BLUE)
    box(84,745,542,205,'03','输入如何进入运行？',['空闲：校验模型 / 认证，准备消息','运行中：steer 或 followUp 排队','steer：工具批次后、下轮响应前','followUp：内循环准备结束时'],src='[S5] 队列不强行中断正在执行的工具')
    d.line([(355,690),(355,745)],BLUE)
    box(744,295,542,185,'04','组装本轮上下文',['AgentSession / Agent','起始及轮间按条件压缩 / 刷新','注入 steering；读取当前模型与工具'],src='[S5, S7]',color=BLUE)
    # Route input to the model lane without crossing cards.
    d.line([(626,855),(690,855),(690,380),(744,380)],BLUE)
    box(744,535,542,170,'05','转换并调用模型',['transformContext → convertToLlm','ModelRuntime → pi-ai → provider','流式响应持续产生消息事件'],src='[S2, S4, S5]',color=TEAL)
    d.line([(1015,480),(1015,535)],TEAL)
    box(744,760,542,175,'06','检查模型结果',['error / aborted → 结束本轮循环','有 toolCall：准备工具批次','无 toolCall：进入轮末继续条件'],src='[S5]',color=TEAL)
    d.line([(1015,705),(1015,760)],TEAL)
    box(1404,760,512,180,'07','参数完整吗？',['输出因 length 截断：不执行该批调用','记录错误结果 → 10，再反馈给模型','否则查找工具并进入参数校验'],src='[S5] 不把残缺参数当成可执行动作')
    d.line([(1286,840),(1404,840)],BLUE)
    d.label(1304,803,'有调用',BLUE)
    box(1404,995,512,180,'08','工具执行前检查',['TypeBox 参数校验','beforeToolCall / tool_call 钩子','允许 → 09；阻止或校验失败 → 10'],src='[S5, S8] 钩子不是操作系统沙箱')
    d.line([(1660,940),(1660,995)],BLUE)
    box(1404,1230,512,185,'09','执行工具批次',['并行默认：依次预检，再并发执行','全局或任一工具要求顺序则串行','访问文件 / 命令 / 业务 API','异常作为失败结果回传'],src='[S5, S11] 实际能力来自工具实现')
    d.line([(1660,1175),(1660,1230)],BLUE)
    box(1404,1470,512,185,'10','收集并整理结果',['afterToolCall / tool_result 钩子','toolResult 追加到消息上下文','完成事件可按完成顺序发出','结果消息保持模型调用的原始顺序'],src='[S5, S8]')
    d.line([(1660,1415),(1660,1470)],BLUE)
    d.line([(1916,850),(1962,850),(1962,1510),(1916,1510)],AMBER,dashed=True)
    d.line([(1916,1080),(1940,1080),(1940,1545),(1916,1545)],AMBER,dashed=True)
    box(744,1055,542,250,'11','本轮结束，是否继续？',['发出 turn_end','shouldStopAfterTurn：停止则去 13','否则读取 steering 队列','有 steering 或未终止的工具批次：','回到 04，准备下一轮模型响应'],src='[S5] 全部工具结果 terminate 才终止批次')
    d.line([(1015,935),(1015,1055)],BLUE)
    d.label(1035,988,'无工具调用',BLUE)
    d.line([(1404,1560),(1350,1560),(1350,1190),(1286,1190)],BLUE)
    d.label(1318,1336,'结果',BLUE)
    d.line([(744,1190),(674,1190),(674,425),(744,425)],BLUE)
    d.label(655,1010,'继续',BLUE)
    box(744,1370,542,190,'12','还有后续输入吗？',['内循环没有继续条件时','读取 followUp 队列','有：注入为待处理消息，回到 04','无：发出 agent_end，进入应用收尾'],src='[S5] 显式停止 / 错误可直接跳到 13')
    d.line([(1015,1305),(1015,1370)],BLUE)
    d.label(1035,1323,'不再继续',BLUE)
    d.line([(744,1450),(660,1450),(660,435),(744,435)],BLUE,dashed=True)
    d.label(670,1422,'有 followUp',BLUE,18)
    box(744,1650,542,235,'13','AgentSession 后处理',['可重试错误：按配置退避后 continue','可恢复上下文溢出：压缩后有限重试','还有收尾钩子追加的队列：继续','否则：结算事件、清理与交付结果'],src='[S5, S7] agent_end 不总等于整个任务已结算')
    d.line([(1015,1560),(1015,1650)],BLUE)
    d.line([(1286,1815),(1330,1815),(1330,430),(1286,430)],AMBER,dashed=True)
    d.label(1290,655,'恢复',AMBER)
    box(744,1970,542,160,'14','等待下一次用户输入',['返回结果或明确失败 / 中止状态','历史保留在会话中，可恢复或分支','这次运行结束；进程可继续等待'],color=TEAL)
    d.line([(1015,1885),(1015,1970)],TEAL)
    d.label(1035,1916,'没有恢复或继续工作',TEAL)
    d.line([(1286,892),(1360,892),(1360,1735),(1286,1735)],AMBER,dashed=True)
    d.label(1269,951,'错误 / 中止',AMBER,18)
    box(84,1035,542,285,'旁路','正在运行时的人类控制',['追加要求 → steer / followUp','取消 → AbortSignal，工具需配合取消','切换模型与工具 → 轮间刷新生效','扩展命令可管理自己的模型交互','“有新输入”不等于并行启动新循环','普通任务未配置队列方式时可报错'],src='[S5, S8]')
    box(84,1380,542,265,'旁路','上下文与会话管理',['压缩发生在起始 / 轮间 / 收尾检查','旧消息摘要 + 保留近期消息','会话 JSONL 记录完整历史与分支','/tree 与 /fork 改变对话路径','文件回滚需要另配快照机制'],src='[S6, S7] 压缩不是无损长期记忆')
    box(84,1705,542,220,'旁路','流式事件与持久化',['message / tool / turn / agent 事件','UI 或调用者订阅进度','完成的消息进入 SessionManager','落盘与展示贯穿执行，不只在最后'],src='[S3, S5, S6]')
    box(84,1985,542,260,'边界','业务调度 ≠ 固定业务引擎',['模型决定是否调用工具以及参数','Pi 管理回环、队列、状态与事件','Skill 定义方法，扩展可改变行为','审批、业务状态机、调度器可另建','多 Agent 协作需示例或自定义扩展'],color=AMBER,src='[S1, S8]')
    box(1404,1725,512,240,'异常','工具失败与模型失败分开',['工具失败 → toolResult.isError','通常反馈给模型，让它调整动作','模型请求失败 → 结束当前内循环','由 AgentSession 判断是否可恢复','用户中止不按普通错误自动重试'],color=AMBER,src='[S5] 受配置与具体错误类型约束')
    box(1404,2025,512,215,'验证','如何理解“任务完成”',['Pi 的循环结束是运行时判断','测试、业务验收由工具或人提供','没有工具调用不保证答案正确','源码分析不代表成功率已经验证'],color=AMBER)
    d.card(60,2355,1880,175,'调度要点：一个外层协调循环，包住模型与工具的内层闭环',['优先读主线 01–14，再看旁路。工具批次结果必须先回到消息上下文，下一轮模型才有新的观察依据。','省略了供应商各自的底层网络重试、每个斜杠命令和实验性服务协议内部细节；它们的职责见完整架构图与配套分析。'],fill='#e8eeff',size=25)
    d.finish()

if __name__=='__main__':
    architecture();scheduling()
