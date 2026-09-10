"""Generate original SVG and PNG explanatory diagrams from shared geometry."""
from pathlib import Path
from html import escape
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / 'assets'
FONT = Path('C:/Windows/Fonts/msyh.ttc')
INK, MUTED, BLUE, BORDER = '#142b45', '#465e75', '#155bb5', '#cbd8e7'

class Diagram:
    def __init__(self, width, height, title):
        self.w, self.h = width, height
        self.image = Image.new('RGB', (width, height), '#f6f9fd')
        self.draw = ImageDraw.Draw(self.image)
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title"><title id="title">{escape(title)}</title><rect width="100%" height="100%" fill="#f6f9fd"/>']
    def box(self,x,y,w,h,fill='#ffffff',stroke=BORDER,r=18):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
        self.draw.rounded_rectangle((x,y,x+w,y+h),radius=r,fill=fill,outline=stroke,width=2)
    def text(self,x,y,s,size=24,color=INK):
        self.parts.append(f'<text x="{x}" y="{y}" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" fill="{color}">{escape(s)}</text>')
        font=ImageFont.truetype(str(FONT),size)
        # Match SVG baseline with Pillow's baseline anchor.
        self.draw.text((x,y),s,font=font,fill=color,anchor='ls')
    def line(self,pts,color=BLUE,arrow=True):
        points=' '.join(f'{x},{y}' for x,y in pts)
        self.parts.append(f'<polyline points="{points}" fill="none" stroke="{color}" stroke-width="3"/>')
        self.draw.line(pts,fill=color,width=3)
        if arrow:
            x,y=pts[-1]; px,py=pts[-2]
            if x==px: tri=[(x,y),(x-7,y-11 if y>py else y+11),(x+7,y-11 if y>py else y+11)]
            else: tri=[(x,y),(x-11 if x>px else x+11,y-7),(x-11 if x>px else x+11,y+7)]
            self.parts.append(f'<polygon points="{" ".join(f"{a},{b}" for a,b in tri)}" fill="{color}"/>')
            self.draw.polygon(tri,fill=color)
    def save(self,name):
        (OUT/f'{name}.svg').write_text(''.join(self.parts)+'</svg>\n',encoding='utf-8')
        self.image.save(OUT/f'{name}.png')

def guide():
    d=Diagram(1200,850,'Luvus：任务管理与 Agent 适配，连接已有 Agent 执行')
    d.text(52,61,'Luvus · 两个核心模块，一条执行链',36)
    d.text(52,100,'多 Agent 工作台：UI 帮助操作和观察，主 Agent 可选。',24,MUTED)
    d.box(52,132,1096,73,'#e9efff')
    d.text(85,177,'任务来源：人直接管理  ／  可选主 Agent  ／  Agent 交接  ／  定时规则',25)
    d.line([(600,205),(600,246)])
    d.box(52,247,1096,283,'#edf4ff','#86aadc')
    d.text(78,285,'LUVUS 负责管理与连接',20,BLUE)
    d.box(78,306,476,195)
    d.text(103,353,'01  任务管理',31)
    d.text(103,397,'下发任务 · 状态与依赖 · 执行跟踪')
    d.text(103,436,'工作目录协调 · 检查 · 结果整合')
    d.text(103,476,'决定做什么：人或主 Agent',21,MUTED)
    d.box(646,306,476,195)
    d.text(671,353,'02  Agent 适配',31)
    d.text(671,397,'识别与启动 · 提交输入 · 读取输出')
    d.text(671,436,'会话恢复 · 状态观察 · 可选事件')
    d.text(671,476,'把不同助手接到同一控制接口',21,MUTED)
    d.line([(554,399),(646,399)])
    d.line([(884,530),(884,573),(600,573),(600,604)])
    d.text(80,573,'支撑：后台终端、会话持久化、CLI / UHP',21,MUTED)
    d.box(52,605,1096,128,'#eaf8f1','#98c8b1')
    d.text(81,652,'执行端  ·  已有 Agent 工具',29)
    d.text(81,698,'Claude Code / Codex / Pi 等  →  各自的模型与工具循环  →  代码、文档与结果',23)
    d.text(52,778,'结果与状态回到 Luvus；检查与业务评审决定是否接受。',24)
    d.text(52,819,'图源：本研究依据固定提交 f3f3ae0 原创整理 · 非产品截图 · 上游未运行验证',18,MUTED)
    d.save('entry-guide')

def full():
    d=Diagram(1400,2480,'Luvus 完整理解：决策、管理、适配、执行、任务闭环与产品对照')
    d.text(54,64,'Luvus · 完整架构与理解',38)
    d.text(54,107,'第二层阅读｜任务管理＋Agent 适配；实际工作由已有 Agent 完成',26,MUTED)
    groups=[
      ('01  决策入口：谁决定做什么？',[
       ('人直接管理',['提出目标与指定执行者','查看结果，决定下一步']),
       ('主 Agent 协调 · 可选',['拆分任务、委派与汇总','必要时请求人工判断']),
       ('直接交接 / 定时规则',['A 经 Luvus 给 B 发消息','自动化按已配置时间触发'])]),
      ('02  Luvus：UI 与任务管理',[
       ('统一操作入口',['终端 UI / CLI / UHP','后台服务负责控制机制']),
       ('两种任务下发',['直接指令：不一定建任务','正式任务：说明、依赖、状态']),
       ('工作区与执行观察',['分屏、会话、历史、远程','状态与支持的用量数据'])]),
      ('03  适配层：连接不同 Agent',[
       ('每种助手的适配描述',['身份、启动命令与参数','会话发现、恢复与分叉']),
       ('真实终端控制',['定位终端、提交输入与按键','等待变化、读取终端输出']),
       ('状态与能力来源',['进程、屏幕特征、原生记录','可选钩子；支持深度不同'])]),
      ('04  执行端：Agent 保留自己的工作循环',[
       ('完整 Agent 程序',['Claude Code / Codex / Pi 等','同种工具也可有多个会话']),
       ('模型与工具循环',['推理与选择下一步','读文件、改代码、运行命令']),
       ('结果与反馈',['代码、文档、实验与日志','状态回传或主动报告其他人'])]),
      ('05  正式任务闭环：管理执行与验收',[
       ('建立与启动',['说明 → 依赖 / 路径检查','worktree 或共享工作区']),
       ('执行与检查',['Agent 执行 → 配置的检查','失败返修；无检查可直接完成']),
       ('结果整合',['worktree → integration 分支','冲突阻塞；分支依赖等整合'])]),
      ('06  产品对照：组织的对象不同',[
       ('Luvus · 执行现场',['终端、会话、任务与目录','适配＋终端 → 已有 Agent']),
       ('Multica · 长期任务协作',['Issue、评论、小队、Run、评审','队列 → Daemon → Provider']),
       ('MetaGPT · 框架内角色',['Team、Role、Action、消息','固定交接或负责人动态分派'])]),
      ('07  对我们的意义与能力边界',[
       ('研究流程 · 扩展设想',['来源核查 → 分析与实验','复核 → 中文文档 → 根索引']),
       ('控制与执行要区分',['后台服务不是主 Agent','消息不会自动同步全部记忆']),
       ('结果仍需验证',['路径占用不是权限隔离','Agent 结束不等于业务完成'])])]
    for i,(heading,cards) in enumerate(groups):
        y=153+i*315
        d.text(54,y+30,heading,29)
        for j,(title,lines) in enumerate(cards):
            x=54+j*438
            d.box(x,y+57,416,180, '#edf4ff' if i in (1,2) else '#ffffff')
            d.text(x+23,y+103,title,26)
            for k,line in enumerate(lines):d.text(x+23,y+148+k*38,line,23,MUTED)
        if i<4:
            d.line([(700,y+249),(700,y+286)],color='#728aa4')
            if i==3:d.text(728,y+280,'输出与状态返回管理层',20,MUTED)
    d.text(54,2394,'按模块阅读的关系图；第 06、07 部分是对照与解释，不是软件运行步骤。',23)
    d.text(54,2437,'图源：固定提交 f3f3ae0 与本次讨论原创整理；上游未运行。完整有向图另存 Mermaid 源。',20,MUTED)
    d.save('full-architecture')

if __name__=='__main__':
    guide();full();print('Generated two original diagrams in SVG and PNG.')
