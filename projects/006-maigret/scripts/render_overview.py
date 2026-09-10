"""Generate one original research overview in matching PNG and SVG formats."""
from pathlib import Path
from html import escape
import argparse
import math
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument('--font', default='C:/Windows/Fonts/msyh.ttc')
parser.add_argument('--bold-font', default='C:/Windows/Fonts/msyhbd.ttc')
args = parser.parse_args()
OUT = Path(__file__).resolve().parents[1] / 'assets'
W, H = 1800, 2130
BG, INK, MUTED = '#F4F5F1', '#1C343D', '#50656B'
TEAL, PALE, WHITE = '#13796D', '#E1F0E9', '#FFFFFF'
AMBER, SAND, LINE = '#925B20', '#FAECD6', '#D0DDD7'
im = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(im)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">',
       '<title id="title">Maigret：我们的完整理解</title>',
       '<desc id="desc">规则维护与批量检查的原理，能力与网站范围，网页搜索对比，实际价值、身份边界、使用场景与扩展方向。依据 578d603 源码和官方文档原创绘制，未实测。</desc>',
       f'<rect width="{W}" height="{H}" fill="{BG}"/>']


def box(x, y, w, h, fill=WHITE, stroke=LINE, r=18):
    d.rounded_rectangle((x, y, x+w, y+h), r, fill=fill, outline=stroke, width=2)
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')


def text(x, y, s, size=27, color=INK, bold=False, maxwidth=None):
    font = ImageFont.truetype(args.bold_font if bold else args.font, size)
    width = d.textlength(s, font=font)
    assert width <= (maxwidth if maxwidth is not None else W-x-45), (s, width, maxwidth)
    assert y + size < H-20
    d.text((x, y), s, font=font, fill=color, anchor='lt')
    svg.append(f'<text x="{x}" y="{y}" dominant-baseline="text-before-edge" fill="{color}" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}">{escape(s)}</text>')


def lines(x, y, ss, size=26, color=MUTED, gap=41, maxwidth=None):
    for i, s in enumerate(ss):
        text(x, y+i*gap, s, size, color, maxwidth=maxwidth)


def arrow(pts, color=TEAL):
    d.line(pts, fill=color, width=4, joint='curve')
    a, b = pts[-2:]
    ang = math.atan2(b[1]-a[1], b[0]-a[0])
    tri = [b, (b[0]-13*math.cos(ang-.5), b[1]-13*math.sin(ang-.5)),
           (b[0]-13*math.cos(ang+.5), b[1]-13*math.sin(ang+.5))]
    d.polygon(tri, fill=color)
    svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in pts)}" fill="none" stroke="{color}" stroke-width="4" stroke-linejoin="round"/>')
    svg.append(f'<polygon points="{" ".join(f"{x},{y}" for x,y in tri)}" fill="{color}"/>')


text(60, 42, '006  /  OPEN SOURCE RESEARCH  /  MAIGRET', 24, TEAL, True)
text(60, 93, 'Maigret：我们的完整理解', 59, INK, True)
text(63, 175, '搜索用户在网站设置的账号用户名（非实名），按预设规则批量检查。', 31, MUTED)
box(60, 237, 1680, 106, INK, INK)
text(88, 260, '核心判断：站点适配与维护  +  自动化批量检查  +  公开资料整理', 34, WHITE, True)
text(90, 309, '提前收集的是网站规则；查询时再访问主页或接口，并不预先汇总全网用户。', 24, '#D9E8E3')

box(60, 373, 810, 225)
text(88, 399, 'A  开发者与社区：维护规则', 31, TEAL, True)
lines(90, 457, ['收集网站 → 找入口 → 配置判断 → 自检与修复',
                '规则记录：地址模板、请求参数、存在／不存在特征',
                '相同系统可复用规则；网站改版后需继续维护'], 27, gap=42, maxwidth=750)
box(900, 373, 840, 225, PALE)
text(930, 399, '“主要是体力活？”——大量适配，也有工程', 30, TEAL, True)
lines(930, 457, ['人工：收集、比较页面、修规则、跟进失效',
                 '工程：并发、超时重试、错误识别、提取与报告',
                 '长期难点：覆盖面、准确性与维护质量'], 27, gap=42, maxwidth=780)

text(60, 630, 'B  用户发起查询：规则驱动的实时检查流程', 31, INK, True)
steps = [
    ('01  输入与筛选', ['账号用户名，非实名', '如 bluecat123／支持的 ID', '按站点、标签与排名筛选']),
    ('02  构造请求', ['套用站点地址模板', '访问主页或检查接口', '不同网站分别适配']),
    ('03  并发与判定', ['同时请求多个网站', '检查页面特征／状态码', '存在 · 未找到 · 未知']),
    ('04  提取与关联', ['尝试提取公开资料', '昵称、简介、关联链接', '发现其他用户名或 ID']),
    ('05  汇总结果', ['账号列表与资料报告', 'Web 界面与关系图', '可选 AI 概括已有报告'])
]
for i, (title, ss) in enumerate(steps):
    x = 60 + i*342
    box(x, 685, 312, 180)
    text(x+20, 707, title, 28, TEAL, True, maxwidth=272)
    lines(x+20, 757, ss, 22, gap=33, maxwidth=272)
    if i < 4:
        arrow([(x+312, 775), (x+342, 775)])
arrow([(1242, 865), (1242, 907), (216, 907), (216, 865)])
text(590, 919, '关联出的新用户名／ID → 可继续递归搜索', 23, TEAL)

box(60, 976, 810, 264)
text(90, 1000, '能力：找账号 → 读公开资料 → 整理线索', 30, INK, True)
lines(90, 1060, ['批量发现同名账号；字段完整度取决于站点',
                 '沿公开关联链接继续寻找其他账号',
                 'HTML / PDF / JSON / CSV、图谱与 Python 接口',
                 '普通搜索无需 API Key；AI 摘要需单独配置'], 26, gap=41, maxwidth=750)
box(900, 976, 840, 264)
text(930, 1000, '网站范围：已有名单 × 本次筛选', 30, INK, True)
lines(930, 1060, ['例：GitHub、Reddit、Telegram、CSDN、微博',
                  '知乎、豆瓣、YouTube、Bilibili、Steam 等',
                  '默认约前 500；可指定站点／标签或扩大范围',
                  '部分需平台 ID；禁用默认跳过；收录不保证可用'], 26, gap=41, maxwidth=780)

text(60, 1280, 'C  网页也能搜到：它的增量价值在哪里？', 31, INK, True)
compare = [
    ('搜索引擎', ['在已收录网页中找', '可找到规则库之外的内容', '未收录主页可能遗漏']),
    ('人工逐站查询', ['自己打开网站查找和核对', '少数平台通常就够用', '网站很多时，耗时且易漏记']),
    ('Maigret', ['直接按规则批量检查', '有机会发现未被收录的主页', '省去重复检查与汇总操作'])
]
for i, (title, ss) in enumerate(compare):
    x = 60 + i*570
    box(x, 1336, 540, 185, PALE if i == 2 else WHITE)
    text(x+27, 1360, title, 30, TEAL if i == 2 else INK, True)
    lines(x+27, 1414, ss, 26, gap=33, maxwidth=485)

box(60, 1555, 1680, 126, SAND, '#E4CAA5')
text(90, 1579, '边界：同名 ≠ 同一人　｜　没查到 ≠ 没注册　｜　条目多 ≠ 全部有效', 33, AMBER, True)
text(90, 1633, '只查规则库及所选站点；不按实名查人。规则失效、验证码与访问限制会影响结果。', 27, INK)

box(60, 1720, 810, 244)
text(90, 1744, '适合：跨很多平台盘点公开账号', 30, INK, True)
lines(90, 1801, ['自己的数字足迹自查／授权账号盘点',
                 '品牌同名账号与疑似冒充候选发现',
                 '公开资料研究／接入已有分析流程',
                 '价值判断：节省操作 + 有效覆盖；效率未实测'], 26, gap=37, maxwidth=750)
box(900, 1720, 840, 244, PALE)
text(930, 1744, '可扩展方向（建议，非全部现有能力）', 30, TEAL, True)
lines(930, 1801, ['优先：人工核验、规则质量、证据追溯',
                  '后续：授权增量监测、任务队列与服务化',
                  'AI：引用来源，区分事实、推断与未知',
                  '评估重点：查得准、可复核、长期维护得住'], 26, gap=37, maxwidth=780)

text(60, 2007, '研究基准：soxoj/maigret · 578d603 · v0.6.5 · MIT · 2026-09-10', 23, MUTED)
text(60, 2042, '来源：上游 README、sites.md、checking / executors / maigret / ai 源码与官方文档；详见配套研究文档。', 22, MUTED)
text(60, 2077, '原创信息图，非产品截图；未运行跨站扫描。固定名单统计 5,373 条站点／搜索方法，含重复平台方法及禁用项。', 22, MUTED)
OUT.mkdir(parents=True, exist_ok=True)
im.save(OUT / 'research-overview.png', optimize=True)
(OUT / 'research-overview.svg').write_text('\n'.join(svg + ['</svg>']), encoding='utf-8')
print(f'Generated PNG and SVG: {W} x {H}')
