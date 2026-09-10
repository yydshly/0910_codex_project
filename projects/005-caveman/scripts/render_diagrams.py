"""Render original Caveman research diagrams as matching PNG and SVG assets."""
from pathlib import Path
from html import escape
import math
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / 'assets'
BG='#F5F4EF'; INK='#182F3A'; MUTED='#52666D'; TEAL='#147B74'; PALE='#E5F2ED'
LINE='#D4DEDA'; WHITE='#FFFFFF'; AMBER='#A56721'; SAND='#FAEEDB'; BLUE='#315E8A'
FONT='C:/Windows/Fonts/msyh.ttc'; BOLD='C:/Windows/Fonts/msyhbd.ttc'

class Canvas:
    def __init__(self, height, title, desc):
        self.w=1800; self.h=height
        self.im=Image.new('RGB',(self.w,self.h),BG); self.d=ImageDraw.Draw(self.im)
        self.svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="{height}" viewBox="0 0 1800 {height}" role="img"><title>{escape(title)}</title><desc>{escape(desc)}</desc>', f'<rect width="1800" height="{height}" fill="{BG}"/>']
    def box(self,x,y,w,h,fill=WHITE,stroke=LINE,r=20):
        self.d.rounded_rectangle((x,y,x+w,y+h),r,fill=fill,outline=stroke,width=2)
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
    def text(self,x,y,s,size=28,color=INK,bold=False):
        font=ImageFont.truetype(BOLD if bold else FONT,size)
        width=self.d.textlength(s,font=font)
        assert x+width < self.w-35,(s,x,width)
        self.d.text((x,y),s,font=font,fill=color,anchor='lt')
        self.svg.append(f'<text x="{x}" y="{y}" dominant-baseline="text-before-edge" fill="{color}" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}">{escape(s)}</text>')
    def lines(self,x,y,ss,size=27,color=MUTED,gap=43):
        for i,s in enumerate(ss): self.text(x,y+i*gap,s,size,color)
    def arrow(self,pts,color=TEAL,width=4,dashed=False):
        # Match vector and raster routing; text labels also distinguish branches.
        self.d.line(pts,fill=color,width=width,joint='curve')
        a,b=pts[-2:]; ang=math.atan2(b[1]-a[1],b[0]-a[0]); n=13
        tri=[b,(b[0]-n*math.cos(ang-.5),b[1]-n*math.sin(ang-.5)),(b[0]-n*math.cos(ang+.5),b[1]-n*math.sin(ang+.5))]
        self.d.polygon(tri,fill=color)
        self.svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in pts)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>')
        self.svg.append(f'<polygon points="{" ".join(f"{x},{y}" for x,y in tri)}" fill="{color}"/>')
    def header(self,num,title,sub):
        self.text(70,48,f'CAVEMAN  /  {num}',24,TEAL,True)
        self.text(70,97,title,58,INK,True)
        self.text(72,179,sub,29,MUTED)
    def footer(self,y,source):
        self.text(70,y,'研究版本 15581d1 · 2026-09-10 · 依据文档与源码原创绘制；非运行截图，未实测节省率。',22,MUTED)
        self.text(70,y+35,source,21,MUTED)
    def save(self,name):
        self.im.save(OUT/(name+'.png'),optimize=True)
        (OUT/(name+'.svg')).write_text('\n'.join(self.svg+['</svg>']),encoding='utf-8')

def capabilities():
    c=Canvas(1390,'Caveman 能力范围','以模型调用前的输入优化为中心，展示处理对象、核心能力、接入方式及独立输出风格技能。')
    c.header('01 / CAPABILITIES','能力范围：模型调用前的输入优化','核心对象是模型即将读取的上下文；工具的输出，会成为下一轮模型的输入。')
    c.box(70,249,440,167); c.text(100,277,'输入来源',31,INK,True)
    c.lines(100,328,['日志 / 文件 / 搜索 / 网页','工具结果 / 选定历史片段'],27,gap=40)
    c.box(615,249,570,167,INK,INK); c.text(648,279,'Caveman Engine + Proxy',34,WHITE,True)
    c.lines(648,334,['分类处理 · 精简内容 · 保留恢复入口'],26,'#D5EBE6')
    c.box(1290,249,440,167); c.text(1320,277,'大模型',31,INK,True)
    c.lines(1320,328,['接收精简后的上下文','需要细节时，经 Agent 取回原文'],25,gap=40)
    c.arrow([(510,331),(615,331)]); c.arrow([(1185,331),(1290,331)])
    c.text(70,462,'核心能力',33,INK,True)
    cards=[
        ('01','识别与分流',['识别内容形态，选择匹配策略','默认注册 15 类压缩器','部分类型需要调用方明确指定']),
        ('02','按内容结构精简',['日志、JSON、表格、差异等','代码可保留签名与类型概览','精简的是模型看到的表示']),
        ('03','原文恢复与回退',['有损替换前满足原文恢复条件','保存原始字节，提供恢复引用','解析失败或未变短则保留原文']),
        ('04','上下文预算选择',['BM25 相关性 + 时间 + 错误信号','在预算内选片段，再恢复原顺序','Pack 是可调用模块，接入依路径']),
        ('05','接入现有工作流',['本地代理 / CLI / MCP / SDK','可包装已有 Agent 或调整端点','兼容范围取决于协议与恢复能力']),
        ('06','专用工具与度量',['命令输出、网页、记忆处理入口','本地 token 估算与使用记录','Pixel：可选的文字转图片路线']),
    ]
    for i,(num,title,ss) in enumerate(cards):
        x=70+(i%3)*562; y=524+(i//3)*261
        c.box(x,y,536,234)
        c.text(x+25,y+25,num,24,TEAL,True); c.text(x+81,y+23,title,30,INK,True)
        c.lines(x+25,y+88,ss,25,gap=43)
    c.box(70,1076,1660,120,SAND,'#E9D3AD')
    c.text(98,1100,'独立配套：输出精简 Skill',29,AMBER,True)
    c.text(575,1100,'用提示词控制回答风格，可单独启用；不等于输入压缩引擎。',27,INK)
    c.text(98,1148,'收益边界：上下文变短 ≠ 任务一定更省钱；需计入规则、恢复调用、缓存与实际任务质量。',26,MUTED)
    c.footer(1256,'来源：github.com/JuliusBrussee/caveman · product-model / engine / contextwindow / skills/caveman')
    c.save('capability-map')

def mechanism():
    c=Canvas(1530,'Caveman 输入压缩实现原理','展示本地分类、压缩、收益检查、原文保存、发送模型，以及失败保留原文和按需恢复两条分支。')
    c.header('02 / MECHANISM','实现原理：先精简，再发送，细节可取回','图示为典型有损压缩路径；具体可处理字段与恢复方式，由接入协议和适配器决定。')
    c.box(605,246,570,920,'#EAF1ED','#CEDFD7',24)
    c.text(634,268,'本地处理 · Engine / Proxy',23,TEAL,True)
    xs=635; ww=510
    steps=[
      (320,'01  提取待处理内容','从请求中选取可压缩的上下文'),
      (462,'02  识别类型，选择压缩器','Detect + Registry：日志 / JSON / 代码等'),
      (604,'03  按结构精简','本地规则 / 解析器；保留相关结构与信号'),
      (746,'04  检查结果','解析成功？token 更少？可恢复？'),
      (888,'05  保存原文，再发布压缩结果','CCR 保存原始字节；返回恢复引用'),
      (1030,'06  组装请求并转发','压缩后的内容 + 恢复入口 → 模型服务'),
    ]
    for y,t,s in steps:
        c.box(xs,y,ww,104,WHITE,'#BFD5CC',15)
        c.text(xs+22,y+19,t,28,INK,True); c.text(xs+22,y+63,s,23,MUTED)
        if y<1030: c.arrow([(890,y+104),(890,y+142)])
    c.box(xs,1191,ww,88,INK,INK,15); c.text(xs+28,1215,'大模型读取上下文并继续任务',28,WHITE,True)
    c.arrow([(890,1134),(890,1191)])
    c.box(70,320,462,272)
    c.text(98,346,'待处理内容从哪里来？',29,INK,True)
    c.lines(98,403,['Agent 的工具返回结果','日志、文件、代码、JSON、表格','选定的历史与其他上下文','工具输出 = 模型下一轮输入'],25,gap=43)
    c.arrow([(532,372),(635,372)])
    c.box(70,647,462,300)
    c.text(98,675,'精简不是普通文件压缩',29,INK,True)
    c.lines(98,736,['模型直接读取更短的内容表示','例如代码只呈现类型和函数签名','函数体被省略后，需要再取回','核心压缩器不额外调用大模型','语法可解析 ≠ 程序行为等价'],24,gap=42)
    c.box(70,1004,462,241)
    c.text(98,1032,'可选：上下文预算模块',28,INK,True)
    c.lines(98,1091,['Pack 按相关性、时间和错误信号','选择预算内片段，并保持原顺序','该模块不代表每条代理路径必经'],24,gap=43)
    c.box(1250,410,450,212,SAND,'#E9D3AD')
    c.text(1277,437,'回退：保留原文',29,AMBER,True)
    c.lines(1277,494,['未知类型 / 解析失败 / 未变短','无法满足恢复或持久化条件','由调用层保留原文或处理错误'],24,gap=39)
    c.arrow([(1145,792),(1215,792),(1215,566),(1250,566)],AMBER)
    c.text(1179,749,'不满足',22,AMBER)
    c.arrow([(1700,564),(1733,564),(1733,1235),(1145,1235)],AMBER)
    c.text(1488,1177,'原文路径',23,AMBER)
    c.box(1250,875,450,208,PALE,'#ACD3C5')
    c.text(1277,904,'CCR 原文存储',30,TEAL,True)
    c.lines(1277,959,['原始字节 + 恢复引用','持久化路径使用本地 SQLite','需要时按引用读取完整原文'],24,gap=37)
    c.arrow([(1145,937),(1250,937)])
    c.text(1190,900,'保存',21,TEAL)
    c.arrow([(1145,1210),(1209,1210),(1209,1040),(1250,1040)],BLUE)
    c.text(1245,1110,'模型请求细节',24,BLUE)
    c.text(1245,1147,'Agent 调用恢复工具，再送入模型',23,BLUE)
    c.box(70,1340,1660,75,INK,INK,15)
    c.text(99,1361,'核心取舍：模型先看到有损的精简表示；原文可恢复，不代表当前输入无损或任务质量必然不变。',27,WHITE)
    c.footer(1445,'来源：engine.go / compressors / contextwindow / ccr / proxy · github.com/JuliusBrussee/caveman')
    c.save('compression-flow')

if __name__=='__main__':
    capabilities(); mechanism()
    print('Rendered two PNG + SVG diagram pairs.')
