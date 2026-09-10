"""Generate the original vector overview and matching PNG. Requires Pillow, not used by the web build."""
from pathlib import Path
from html import escape
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / 'assets'
W, H = 1800, 2210
paper, ink, muted, accent, green, line = '#f5f3ed', '#232820', '#61675e', '#b54425', '#dfe7d8', '#d6d9ce'
im = Image.new('RGB', (W, H), paper)
d = ImageDraw.Draw(im)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc"><title id="title">Pi Web 完整理解：能力、本质与 Codex 对比的意义</title><desc id="desc">Pi Web 包含浏览器前端与内嵌 Pi 引擎的服务端。模型推理、引擎执行、界面展示；与 Codex 桌面体验的工作方式相似，但底层引擎和具体能力不同。图中包含六类能力、任务循环、适用场景和扩展边界。</desc>']
svg.append(f'<rect width="{W}" height="{H}" fill="{paper}"/>')

def box(x,y,w,h,fill='#fffcf6',stroke=line,r=16):
    d.rounded_rectangle((x,y,x+w,y+h),r,fill=fill,outline=stroke,width=2)
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')

def text(x,y,s,size=26,color=ink,bold=False):
    font=ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc' if bold else 'C:/Windows/Fonts/msyh.ttc',size)
    assert d.textbbox((0,0),s,font=font)[2] <= W-x-40, f'Text overflow: {s}'
    d.text((x,y),s,font=font,fill=color)
    svg.append(f'<text x="{x}" y="{y+size}" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{escape(s)}</text>')

def arrow(x,y,x2,y2):
    d.line((x,y,x2,y2),fill=accent,width=4)
    points=[(x2,y2),(x2-12,y2-7),(x2-12,y2+7)] if y==y2 else [(x2,y2),(x2-7,y2-12),(x2+7,y2-12)]
    d.polygon(points,fill=accent)
    svg.append(f'<path d="M{x} {y} L{x2} {y2}" fill="none" stroke="{accent}" stroke-width="4"/><polygon points="'+ ' '.join(f'{a},{b}' for a,b in points)+f'" fill="{accent}"/>')

text(70,42,'OPEN SOURCE FIELD NOTES   /   008',22,muted,True)
text(70,90,'Pi Web：在浏览器中使用 Pi 编程智能体',52,ink,True)
text(70,170,'能力在背后的智能体系统中运行，浏览器负责交互、展示与管理。',30,accent,True)
box(70,235,1660,135,green)
text(100,255,'我们的共同理解',23,muted,True)
text(100,297,'使用体验可类比 Codex 桌面工作台；Pi Web 是基于 Pi SDK 的完整 Web 应用。',29,ink,True)
text(70,414,'01 / 本质：一个工作台，三层职责',32,ink,True)
box(70,482,355,310)
text(98,502,'浏览器 · Pi Web 前端',28,ink,True)
text(98,559,'输入需求、切换会话',25)
text(98,604,'查看文件、差异与结果',25)
text(98,649,'配置模型、技能和插件',25)
text(98,727,'HTTP 操作 / SSE 事件',21,muted)
box(490,482,710,310,green)
text(520,502,'运行 Pi Web 的电脑 / 服务器',28,ink,True)
text(520,550,'Pi Web 服务端：会话、接口、事件转发',25)
box(520,608,650,151,'#fffcf6','#bac7af',10)
text(547,624,'内嵌 Pi 智能体引擎（同一进程）',28,ink,True)
text(547,674,'组织任务循环 → 调用工具 → 读写文件 / 命令',23)
text(547,711,'共用 Pi 本地配置与 JSONL 会话记录',22,muted)
box(1265,482,465,310)
text(1295,502,'配置的模型服务',28,ink,True)
text(1295,560,'理解需求、推理、生成代码',25)
text(1295,605,'决定下一步工具调用',25)
text(1295,668,'计算位置取决于模型配置',23,muted)
text(1295,713,'本地工作台 ≠ 模型必定离线',23,accent)
arrow(435,622,480,622); arrow(1210,622,1255,622)
text(90,812,'启动 Pi Web 即包含网页与服务端，无需先启动独立 Pi 服务；纯静态网页无法运行这些执行能力。',25,muted)

text(70,885,'02 / 与 Codex 比较：相似的是工作方式，差异不止界面',32,ink,True)
box(70,949,805,235)
text(100,970,'Pi Web',30,accent,True)
text(100,1017,'浏览器 → Pi Web 服务端 → Pi 引擎与所配模型',26)
text(100,1067,'研究价值：理解怎样把 SDK 组织成可扩展工作台。',25)
text(100,1117,'复用价值：会话、工具展示、文件预览与资源管理。',24,muted)
box(905,949,825,235)
text(935,970,'Codex（以桌面使用体验作参照）',29,ink,True)
text(935,1017,'桌面界面 → Codex 智能体运行体系',26)
text(935,1067,'同样围绕需求、代码操作与结果检查推进任务。',25)
text(935,1117,'Codex 也有 CLI、IDE 等入口，不只是一款 App。',24,muted)
text(90,1204,'不能推导：Pi Web 是 Codex 网页版 / 只换了皮肤 / 效果和权限完全相同。两者未做同任务效果对测。',24,accent)

text(70,1274,'03 / 已有能力：把一次开发任务组织起来',32,ink,True)
cards=[('01  编程与工具','读 / 搜 / 改 / 写文件，运行命令','Pi 执行，网页显示过程与结果'),('02  会话与分支','恢复、导出、分叉和上下文查看','对话分支不自动回滚代码'),('03  文件与 Git','多格式预览、差异与 worktree','预览格式不等于模型原生理解'),('04  模型与扩展','配置模型、插件包与 Skills','复用 Pi 资源与配置体系'),('05  网页终端','真实 Shell、多标签与重连','命令在服务端电脑执行'),('06  子智能体','委派、后台运行、结果与指导','默认关闭；启用后重载会话')]
for i,(title,a,b) in enumerate(cards):
    x=70+(i%3)*565;y=1335+(i//3)*188
    box(x,y,530,163)
    text(x+24,y+17,title,27,ink,True);text(x+24,y+69,a,24);text(x+24,y+113,b,22,muted)

text(70,1749,'04 / 任务闭环与可扩展方向',32,ink,True)
box(70,1812,1660,90,green)
text(101,1835,'提出需求  →  读取上下文  →  模型判断  →  工具执行  →  检查结果  →  继续调整',29,ink,True)
text(90,1928,'适用：个人编程、开源项目研究、可信环境远程工作、领域助手。',26)
text(90,1973,'扩展建议：研究 Skills、知识检索、任务验收、子智能体调度、团队权限与执行隔离。',26)
text(90,2020,'边界：文件浏览限制不是命令沙箱；子会话不自动隔离文件；当前网页展示不运行 Pi。',24,accent)
text(70,2090,'依据：agegr/pi-web · b1a7296 · v0.9.0；OpenAI 官方桌面与 Codex CLI 文档（2026-09-10）。',21,muted)
text(70,2130,'本研究原创示意图，非产品截图。源码能力已核对；上游运行、效果对比与浏览器实测未完成。',21,muted)
text(70,2168,'完整来源与证据：projects/008-pi-web/notes/01-understanding.md',20,muted)
svg.append('</svg>')
OUT.mkdir(parents=True,exist_ok=True)
(OUT/'research-overview.svg').write_text('\n'.join(svg),encoding='utf-8')
im.save(OUT/'research-overview.png',optimize=True)
print(f'Overview generated: {W} x {H}, SVG and PNG')

# A compact entrance graphic for readers arriving from the repository or site index.
W, H = 1800, 1370
im = Image.new('RGB',(W,H),paper); d = ImageDraw.Draw(im)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc"><title id="title">Pi Web 阅读引导：能力、同类产品与使用价值</title><desc id="desc">基于 Pi 的自托管浏览器编程工作台。提供项目操作、工作区与扩展管理；与 Codex、Claude Code、Cursor Agent 同属 AI 编程工具。可用于开源项目研究、个人开发和领域助手二次开发。</desc><rect width="{W}" height="{H}" fill="{paper}"/>']
text(70,40,'008 / PROJECT GUIDE',23,muted,True)
text(70,88,'Pi Web：浏览器里的 AI 编程工作台',54,ink,True)
text(70,172,'基于 Pi SDK，可自托管；把任务执行、项目文件与模型配置放在一起。',29,accent)
text(70,252,'01  这个库能做什么',31,ink,True)
guide_cards=[('操作项目','阅读与修改代码、执行命令','查看工具输出，继续调整任务'),('管理工作区','会话恢复与分支、文件预览','Git 差异、worktree 与网页终端'),('配置与扩展','模型、插件包与 Skills 管理','可选子智能体委派（默认关闭）')]
for i,(title,a,b) in enumerate(guide_cards):
    x=70+i*565;box(x,310,530,175);text(x+25,330,title,30,ink,True);text(x+25,385,a,24);text(x+25,429,b,23,muted)
box(70,514,1660,85,green)
text(101,536,'运行关系：浏览器界面  →  Pi Web 服务端（内嵌 Pi 引擎）  →  模型与项目工具',28,ink,True)
text(70,637,'02  同类产品：Codex · Claude Code · Cursor Agent',31,ink,True)
text(90,695,'共同使用方式：描述需求，让智能体读取、修改项目并执行命令，再检查结果。',27)
text(90,742,'Pi Web 的可研究特点：基于 Pi 的开源 Web 应用，可复用其工作台与扩展组织方式。',26)
text(90,788,'界面形态与运行体系各有差异；同属一类工具，不表示同一后端或效果相等。',23,muted)
text(70,859,'03  对当前研究与开发工作的意义',31,ink,True)
values=[('研究 GitHub 项目','在项目上下文中读源码、整理笔记','复查来源、文件和研究结论'),('组织个人开发','集中查看多个项目的对话与产物','比较方案，检查代码差异'),('自建领域助手','借鉴会话、事件展示与配置设计','用 Skills 和工具接入自己的流程')]
for i,(title,a,b) in enumerate(values):
    x=70+i*565;box(x,925,530,180);text(x+25,946,title,29,ink,True);text(x+25,1000,a,23);text(x+25,1048,b,23,muted)
text(90,1139,'使用判断：需要自托管、浏览器操作或二次开发时值得进一步验证；已有工具满足需求时不必迁移。',24,ink,True)
text(90,1190,'继续阅读：项目资料 → 完整理解 → 技术总览 → 三个任务流程演示',27,accent,True)
text(70,1260,'原创引导图，非产品截图。依据 Pi Web b1a7296 与同类产品官方文档，核对日期 2026-09-10。',21,muted)
text(70,1303,'用途为基于能力的研究判断；未运行上游、未进行跨产品效果对测。完整来源见子项目研究笔记。',21,muted)
svg.append('</svg>')
(OUT/'entry-guide.svg').write_text('\n'.join(svg),encoding='utf-8');im.save(OUT/'entry-guide.png',optimize=True)
print(f'Entry guide generated: {W} x {H}, SVG and PNG')
