from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/complete-understanding.png'
W, H = 2400, 3330
im = Image.new('RGB', (W, H), '#f0f4f9')
d = ImageDraw.Draw(im)
REG = 'C:/Windows/Fonts/msyh.ttc'
BOLD = 'C:/Windows/Fonts/msyhbd.ttc'
NAVY, INK, BLUE, MUTED, LINE = '#122e4b', '#172b40', '#164dd4', '#50667c', '#d1dce8'
TEAL = '#9df0eb'
fonts = {}
def f(size, bold=False):
    key = (size, bold)
    if key not in fonts: fonts[key] = ImageFont.truetype(BOLD if bold else REG, size)
    return fonts[key]
def txt(x,y,text,size=34,color=INK,bold=False):
    d.text((x,y),text,font=f(size,bold),fill=color)
def wrap(text,width,size=34,bold=False):
    result=[]
    for p in text.split('\n'):
        line=''
        for c in p:
            if d.textlength(line+c,font=f(size,bold)) > width and line:
                result.append(line);line=c
            else:line+=c
        result.append(line)
    return result
def para(x,y,text,width,size=34,color=INK,bold=False,gap=12):
    for line in wrap(text,width,size,bold):
        txt(x,y,line,size,color,bold);y+=size+gap
    return y
def panel(x,y,w,h,num,title):
    d.rounded_rectangle((x,y,x+w,y+h),radius=16,fill='white',outline=LINE,width=2)
    d.rounded_rectangle((x+28,y+30,x+94,y+90),radius=9,fill=BLUE)
    txt(x+39,y+33,num,34,'white',True)
    txt(x+116,y+30,title,43,NAVY,True)
    return x+34,y+120,w-68
def bullet(x,y,label,body,width,size=32):
    d.ellipse((x,y+14,x+9,y+23),fill=BLUE)
    return para(x+25,y,label+body,width-25,size,gap=11)+12
def arrow(x,y,width=34):
    d.line((x,y,x+width,y),fill=BLUE,width=4)
    d.line((x+width-11,y-10,x+width,y,x+width-11,y+10),fill=BLUE,width=4)

# Header: a useful conclusion is visible before the detail.
d.rectangle((0,0,W,294),fill=NAVY)
txt(86,33,'010 / AWESOME OSINT ARSENAL',31,TEAL,True)
txt(85,92,'我们的完整理解',78,'white',True)
txt(87,204,'以工具查找为主的合集：帮你找到工具，了解获取方式并准备安装。',37,'#d6e5f3')
d.rounded_rectangle((2020,38,2314,98),radius=28,outline='#91b5d1',width=2)
txt(2050,47,'工具查找 · 安装',28,TEAL)

# 01 / 02
x,y,w=panel(85,330,1090,390,'01','原库到底自带什么？')
y=bullet(x,y,'README：','工具介绍、分类与外部入口。',w)
y=bullet(x,y,'tools.json：','名称、用途、分类与获取方式。',w)
y=bullet(x,y,'Shell 脚本：','批量安装或下载部分工具。',w)
txt(x,655,'收录工具 ≠ 已经安装 ≠ 集成为统一产品',32,BLUE,True)
assert y<656
x,y,w=panel(1225,330,1090,390,'02','三个核心能力')
y=bullet(x,y,'发现工具 → ','找到候选工具、网站和学习资料。',w)
y=bullet(x,y,'提供目录 → ','方便程序读取、统计与再整理。',w)
y=bullet(x,y,'准备环境 → ','获得软件、源码或容器镜像。',w)
txt(x,655,'没有统一的自动调查与报告引擎。',32,BLUE,True)
assert y<656

# 03 responsibility workflow
x,y,w=panel(85,760,2230,363,'03','从一个问题到结果，分别是谁在工作？')
cw=502; start=119
blocks=[('合集','提供工具目录','与获取线索'),('使用者 + 安装器','选择工具、安装','并配置所需条件'),('第三方工具','执行查询或分析','返回候选、字段或线索'),('使用者','核验来源、时效与关联','形成有证据的结论')]
for i,(owner,a,b) in enumerate(blocks):
    bx=start+i*555
    d.rounded_rectangle((bx,887,bx+cw,1029),radius=10,fill='#edf3fa')
    txt(bx+22,901,owner,34,BLUE,True)
    txt(bx+22,954,a,28,INK)
    txt(bx+22,992,b,28,INK)
    if i<3:arrow(bx+cw+8,960,31)
txt(120,1051,'例：自己的图片 → 在目录找到 ExifTool → 另行运行 → 读取文件里实际存在的元数据',32,INK)

# 04 real tools table
x,y,w=panel(85,1163,2230,503,'04','收录的工具能帮助做什么？')
cols=[120,510,1230]
headers=['问题 / 场景','代表工具','可能得到的结果类型']
for cx,t in zip(cols,headers):txt(cx,1285,t,28,MUTED,True)
rows=[
('查同名账号','Maigret / Sherlock','同名账号候选与页面链接'),
('检查图片信息','ExifTool / TinEye','元数据或图片来源线索'),
('了解自有域名','Amass / Shodan / Nmap','域名、网络资产或服务线索'),
('查企业公开资料','OpenCorporates','覆盖范围内的企业登记记录'),
('分析已有文件','CyberChef / YARA / Volatility','数据转换、规则匹配或内存取证线索'),
('组织学习实验','Wireshark / Ghidra / Juice Shop','协议分析、程序研究与练习资源')]
for i,row in enumerate(rows):
    ry=1331+i*45
    if i%2==0:d.rectangle((115,ry-2,2285,ry+43),fill='#f4f7fb')
    for cx,t in zip(cols,row):txt(cx,ry,t,29,INK)
txt(120,1621,'具体能力属于对应工具，未逐项实测；同名不证明身份，覆盖范围和结果都需核验。',29,MUTED)

# 05 / 06 distinction and automatic update
x,y,w=panel(85,1706,1090,544,'05','我们看到的网页，是什么？')
y=para(x,y,'本研究新增的中文展示，\n不是原库自带的搜索网页。',w,37,NAVY,True,gap=13)+18
y=bullet(x,y,'搜索范围：','固定快照里的 753 条已有记录。',w,31)
y=bullet(x,y,'展示功能：','26 类筛选、20 条重点中文说明、6 个用途场景。',w,31)
y=bullet(x,y,'实际操作：','只浏览，不安装、不查询目标。',w,31)
d.rounded_rectangle((119,2150,1141,2220),radius=8,fill=NAVY)
txt(143,2166,'页面搜索 = 查清单；不会上网寻找新工具。',31,TEAL,True)
assert y<2150
x,y,w=panel(1225,1706,1090,544,'06','它会自己扩展、更新工具吗？')
y=para(x,y,'不会自动发现新工具，也不会自动补齐清单。',w,35,BLUE,True,gap=12)+18
y=bullet(x,y,'上游更新：','作者或贡献者人工收录工具，按需修改安装脚本。',w,31)
y=bullet(x,y,'我们的网页：','固定版本快照，不自动跟随上游更新。',w,31)
y=bullet(x,y,'未来可扩展：','定期检索 GitHub → 去重与可用性检查 → 人工审核 → 更新清单。',w,31)
txt(x,2184,'上述自动发现流程尚未实现。',30,MUTED,True)
assert y<2184

# 07 counts and environment
x,y,w=panel(85,2290,2230,448,'07','数据口径、安装原理与环境')
stats=[('753','原始目录记录'),('752','唯一 ID'),('26','JSON 数据分类'),('50','README 分类章节')]
for i,(n,l) in enumerate(stats):
    sx=120+i*551
    txt(sx,2405,n,62,BLUE,True);txt(sx+150,2434,l,27,MUTED)
txt(120,2492,'网站 300 · 手动处理 161 · 源码 117 · Python 包 70 · Linux 包 62 · Go 35 · 容器镜像 8',29,INK)
d.line((120,2545,2280,2545),fill=LINE,width=2)
yy=2567
left='阅读目录和这个网页：无需 Linux。\n原库批量安装：主要面向 Linux。\n单个工具能否在 Windows 用：由该工具决定。'
right='安装器检测系统，再调用包管理器等准备工具。\n下载源码不等于可运行；镜像下载不等于已启动。\nJSON 目录与安装脚本清单分别维护，未统一驱动。'
para(120,yy,left,1050,30,gap=12)
para(1235,yy,right,1040,30,gap=12)

# 08 significance plus status
x,y,w=panel(85,2778,2230,345,'08','对我们的意义，以及这次做到哪里')
para(120,2898,'价值：减少寻找工具的时间，为开源研究和研究助手提供选型材料。\n做法：先挑少量相关工具深入研究，再考虑接入工具、保存证据与设计任务流程。',2140,33,gap=14)
d.rounded_rectangle((119,3014,2281,3089),radius=8,fill='#e9f4f6')
txt(145,3034,'当前状态：仅整理与展示；安装尝试因权限停止，没有成功安装或实际调查结果。',32,NAVY,True)

# Sources and approval status, deliberately readable.
txt(85,3161,'来源：rawfilejson/awesome-osint-arsenal  ·  研究版本：2c6475a  ·  2026-09-10',28,MUTED)
txt(85,3210,'合集为 MIT 许可；第三方工具分别适用其许可。原创理解图；搜索查已有清单，工具效果需另行验证。',28,MUTED)
txt(85,3254,'记录数量不等于已安装或已验证功能；工具效果、外部数据与自动扩展均未在本次实测。',27,MUTED)
OUT.parent.mkdir(parents=True,exist_ok=True)
im.save(OUT,optimize=True,dpi=(180,180))
print(str(OUT))
print(f'{W} x {H} px; all layout assertions passed')
