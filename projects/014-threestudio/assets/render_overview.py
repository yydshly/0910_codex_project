"""Render the original threestudio research diagram; no upstream model is run."""
from pathlib import Path
import argparse
import html
import math
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT, SCALE = 1920, 2550, 2
INK, MUTED = '#14243D', '#596A81'
BLUE, TEAL, ORANGE = '#3265DB', '#087E82', '#BE611E'
SHA = '28d9d80d9d00f308244adfcf3be8b17ca0cb6465'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font', default='C:/Windows/Fonts/msyh.ttc')
    parser.add_argument('--bold-font', default='C:/Windows/Fonts/msyhbd.ttc')
    args = parser.parse_args()
    for font in (args.font, args.bold_font):
        if not Path(font).is_file():
            parser.error('Provide existing Chinese font paths with --font and --bold-font.')

    im = Image.new('RGB', (WIDTH*SCALE, HEIGHT*SCALE), '#F5F7FB')
    d = ImageDraw.Draw(im)
    fonts = {}
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-labelledby="title desc">',
           '<title id="title">threestudio：准备条件、输入、能力、处理流程、模块与输出</title>',
           f'<desc id="desc">基于固定版本 {SHA} 的原创研究示意图，未运行上游生成。大模型是预先加载的工具，文字和图片是任务素材；典型流程渲染图片、计算指导并反复更新三维对象。</desc>',
           f'<rect width="{WIDTH}" height="{HEIGHT}" fill="#F5F7FB"/>']

    def text(x, y, value, size=26, color=INK, bold=False, max_width=None):
        key=(size,bold)
        if key not in fonts:
            fonts[key]=ImageFont.truetype(args.bold_font if bold else args.font,size*SCALE)
        font=fonts[key]
        width=d.textlength(value,font=font)/SCALE
        if max_width is not None and width>max_width:
            raise ValueError(f'Text overflows by {width-max_width:.1f}px: {value}')
        if x+width>WIDTH-36 or y+size>HEIGHT-18:
            raise ValueError(f'Text outside canvas: {value}')
        d.text((x*SCALE,y*SCALE),value,font=font,fill=color,anchor='lt')
        svg.append(f'<text x="{x}" y="{y}" dominant-baseline="text-before-edge" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{html.escape(value)}</text>')

    def box(x,y,w,h,fill='white',stroke=None,r=20):
        d.rounded_rectangle((x*SCALE,y*SCALE,(x+w)*SCALE,(y+h)*SCALE),radius=r*SCALE,fill=fill,outline=stroke,width=2*SCALE)
        svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke or "none"}" stroke-width="2"/>')

    def line(points,color='#A4B2C8',width=3):
        d.line([(x*SCALE,y*SCALE) for x,y in points],fill=color,width=width*SCALE,joint='curve')
        svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in points)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>')

    def arrow(points,color='#8D9EB8',width=3):
        line(points,color,width)
        x,y=points[-1]; px,py=points[-2]
        a=math.atan2(y-py,x-px)
        q=[(x,y),(x-13*math.cos(a-.48),y-13*math.sin(a-.48)),(x-13*math.cos(a+.48),y-13*math.sin(a+.48))]
        d.polygon([(int(xx*SCALE),int(yy*SCALE)) for xx,yy in q],fill=color)
        svg.append(f'<polygon points="{" ".join(f"{x:.2f},{y:.2f}" for x,y in q)}" fill="{color}"/>')

    def section(y,n,title,note=''):
        box(72,y,48,42,BLUE,r=10)
        text(81,y+7,n,25,'white',True)
        text(137,y+1,title,33,INK,True)
        if note: text(137,y+51,note,24,MUTED)

    def cube(x,y,color=ORANGE):
        line([(x,y+12),(x+22,y),(x+44,y+12),(x+22,y+25),(x,y+12),(x,y+38),(x+22,y+51),(x+44,y+38),(x+44,y+12)],color,3)
        line([(x+22,y+25),(x+22,y+51)],color,3)

    text(72,51,'threestudio：从准备到三维结果',55,INK,True)
    text(75,138,'算法框架接入预训练图像大模型，支持文字 / 图片生成 3D、指令编辑与结果导出。',29,MUTED)

    section(215,'01','运行前要准备什么？')
    prep=[
        ('GPU 与驱动',['NVIDIA 显卡 + 兼容驱动','官方最低 6GB 显存','仅适合部分基础配置','复杂方法可能需 20–30GB'],BLUE),
        ('系统与运行时',['Ubuntu / WSL2 / Docker','CUDA + Python ≥ 3.8','PyTorch ≥ 1.12','以上是上游历史基线'],BLUE),
        ('项目依赖与编译',['Lightning 2.0.0 / Diffusers < 0.20','Transformers 4.28.1','tiny-cuda-nn / nerfacc / nvdiffrast','需匹配版本与 CUDA 编译环境'],BLUE),
        ('预训练模型权重',['按方法下载所需模型','如 Stable Diffusion、Zero123','填写模型路径，核对使用许可','大模型是处理工具'],TEAL),
    ]
    for i,(title,lines,color) in enumerate(prep):
        x=72+i*452
        box(x,283,420,239,'#E8F5F2' if i==3 else 'white','#B9DBD2' if i==3 else '#DCE4F1')
        text(x+23,306,title,29,color,True,max_width=374)
        for j,t in enumerate(lines):
            text(x+23,362+j*37,t,21 if i==2 else 24,INK if j<3 else color,max_width=374)
    text(76,549,'还需：配置方法、分辨率与迭代步数；留出模型缓存和结果存储空间。完整依赖见配套文档。',25,MUTED)

    section(608,'02','每次任务，你提供什么？','图片或文字是任务素材；大模型权重是上一步准备好的工具。')
    inputs=[('文字描述','例如：一只戴红帽子的小猫','用于文字生成 3D'),
            ('单张参考图','常见准备：去背景的 RGBA 图片','用于图片生成；部分方法还需文字'),
            ('场景数据 + 编辑指令','提供对应方法要求的数据','用于编辑，不是任意网格都可直接用')]
    for i,(title,a,b) in enumerate(inputs):
        x=72+i*604
        box(x,707,572,139,'white','#DCE4F1')
        text(x+24,726,title,29,INK,True,max_width=524)
        text(x+24,776,a,25,MUTED,max_width=524)
        text(x+24,815,b,23,BLUE,max_width=524)

    section(890,'03','核心能力')
    caps=[('文字 → 3D','按描述生成对象或场景'),('图片 → 3D','根据参考图优化三维对象'),
          ('文字指令编辑','修改已有场景的外观'),('几何与纹理优化','细化形状和表面外观')]
    for i,(title,desc) in enumerate(caps):
        x=72+i*452
        box(x,955,420,108,'white')
        box(x+22,979,6,61,BLUE,r=3)
        text(x+44,974,title,28,INK,True,max_width=352)
        text(x+44,1024,desc,23,MUTED,max_width=352)

    box(48,1105,1824,354,'#EAF0FA')
    section(1128,'04','内部处理流程','以 DreamFusion 为例：大模型给指导，优化算法更新当前三维对象。')
    steps=[('选择方法','确定生成或编辑流程'),('准备三维表示','初始化或载入对象'),
           ('多角度渲染','把三维对象画成图片'),('大模型给出指导','计算画面应如何改变'),('算法更新对象','调整形状与外观参数')]
    for i,(title,desc) in enumerate(steps):
        x=72+i*362
        box(x,1240,328,130,'#E1F3EE' if i==3 else 'white')
        text(x+20,1254,str(i+1).zfill(2),22,TEAL if i==3 else BLUE,True)
        text(x+20,1292,title,28,INK,True,max_width=288)
        text(x+20,1336,desc,22,MUTED,max_width=288)
        if i<4: arrow([(x+331,1303),(x+356,1303)])
    arrow([(1684,1372),(1684,1422),(960,1422),(960,1374)],BLUE)
    box(1114,1403,430,40,'#EAF0FA',r=0)
    text(1132,1408,'换角度、反复迭代，直到结束',23,BLUE,True)

    section(1504,'05','八类模块，各自做什么？','这些模块由配置组合；使用现有方法通常无需自己重新开发。')
    modules=[('输入与相机','读取数据、设置观察角度','提供图片、视角与相机参数'),
             ('提示词处理','把文字转换成模型条件','按需要加入正面 / 侧面提示'),
             ('大模型引导','加载模型，计算修改方向','SDS 等方法提供优化信号'),
             ('几何表示','保存三维空间中的形状','表示密度、表面或法线等'),
             ('材质与背景','决定表面和背景的外观','计算颜色、着色与环境'),
             ('渲染','把三维内容画成二维图','连接图片变化与三维参数'),
             ('系统与优化','组织反馈循环、更新参数','保存进度，支持继续优化'),
             ('导出与记录','提取网格、导出纹理','保存结果、图片和视频')]
    for i,(title,a,b) in enumerate(modules):
        x=72+(i%4)*452; y=1608+(i//4)*173
        box(x,y,420,148,'white')
        text(x+23,y+21,title,28,TEAL if i==2 else INK,True,max_width=374)
        text(x+23,y+72,a,24,INK,max_width=374)
        text(x+23,y+113,b,22,MUTED,max_width=374)

    section(1972,'06','最终输出')
    outs=[('三维对象 / 场景','保存三维表示与检查点','便于后续渲染、继续优化'),
          ('带纹理的网格文件','OBJ + MTL / 纹理，或顶点颜色','可进入后续建模与修整流程'),
          ('多角度预览','渲染图片、360° 展示视频','环绕展示不等于骨骼动画')]
    for i,(title,a,b) in enumerate(outs):
        x=72+i*604
        box(x,2041,572,164,'#FFF8F0','#F0DEC9')
        cube(x+25,2068)
        text(x+91,2064,title,29,INK,True,max_width=453)
        text(x+26,2127,a,25,INK,max_width=520)
        text(x+26,2170,b,23,MUTED,max_width=520)

    box(72,2248,1776,77,INK)
    text(97,2271,'适用场景',27,'#B7D1FF',True)
    text(284,2271,'算法研究    /    资产草稿    /    创意设计    /    工具原型',27,'white')
    text(75,2361,'关键理解：框架组织流程；大模型提供视觉知识；算法把指导落实到三维对象。',26,INK,True)
    text(75,2411,'典型 SDS 路线冻结图像模型；部分方法另训练 LoRA。扩展能力需单独准备依赖。',23,MUTED)
    text(75,2452,'原创能力示意，非实测效果；生成结果通常需要检查与修整。来源：threestudio 官方文档与代码。',22,MUTED)
    text(75,2490,f'研究日期 2026-09-10  ·  上游提交 {SHA[:12]}  ·  github.com/threestudio-project/threestudio',21,MUTED)

    output=Path(__file__).resolve().parent
    im.save(output/'complete-overview.png',optimize=True)
    svg.append('</svg>')
    (output/'complete-overview.svg').write_text('\n'.join(svg)+'\n',encoding='utf-8')
    print(f'PNG: {WIDTH*SCALE} x {HEIGHT*SCALE}; SVG: {WIDTH} x {HEIGHT}; {len(svg)} elements')


if __name__=='__main__':
    main()
