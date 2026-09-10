export const categories = {
  'domain-ip-network':'域名、IP 与网络', 'username-social':'用户名与社交平台',
  'data-breach':'数据泄露线索', 'people-identity':'人员与身份线索',
  'image-facial':'图片与人像分析', 'red-team-offensive':'授权攻防研究',
  'email-phone':'邮箱与电话号码', 'malware-threat-intel':'恶意软件与威胁情报',
  'search-dorking':'搜索与查询技巧', 'vpn-privacy':'隐私与网络连接',
  'geolocation':'地理位置与地图', 'blue-team-defensive':'安全防御与检测',
  'document-metadata':'文档与元数据', 'misc':'其他资源', 'training-ctf':'练习环境与 CTF',
  'learning-resources':'学习资料', 'vehicle-aviation-maritime':'车辆、航空与航运',
  'crypto-blockchain':'加密资产与区块链', 'iot-devices':'联网设备',
  'digital-forensics':'数字取证与逆向分析', 'hardware-hacking':'硬件与无线电研究',
  'dark-web':'暗网研究入口', 'threat-intel-platforms':'威胁情报平台',
  'frameworks':'综合框架', 'company-business':'企业与商业资料', 'bug-bounty':'漏洞赏金平台'
};
export const methods = {web:'访问网站',manual:'手动处理',git:'获取源码',pip:'Python 包',apt:'Linux 软件包',go:'Go 安装',docker:'容器镜像'};
export const featured = {
  maigret:['按用户名检查多个网站的同名账号，并整理公开资料。','同名不证明属于同一个人；覆盖依赖站点规则。'],
  sherlock:['按用户名查找社交网站上的同名账号。','需要另行运行；站点可用性与误报需要核验。'],
  exiftool:['读取照片、其他图片和文档中保存的作者、设备、时间等元数据。','只能读取文件中实际存在的信息；位置字段可能为空或已被删除。'],
  tineye:['通过图片寻找被索引的相同或相似图片来源。','搜索范围限服务索引；找到旧页面也不自动证明谁是原创者。'],
  amass:['整理域名、DNS 与关联网络资产线索。','需要配置和核验；关联线索不直接证明资产归属。'],
  nmap:['探测所选网络目标的端口和服务。','属于主动检测工具，应在自己的或获授权的环境使用。'],
  shodan:['查询其索引中的联网设备与服务信息。','依赖外部服务、账号与访问额度，数据并非必然实时。'],
  opencorporates:['查阅公司登记及关联公共记录。','覆盖和字段随地区与数据源不同；公司资料不等于信用结论。'],
  cyberchef:['通过组合数据处理步骤，辅助解码、转换和分析数据。','分析步骤由使用者选择；原库没有集成这个应用。'],
  volatility:['从内存镜像中提取进程等取证线索。','需先取得支持格式的内存镜像，并匹配分析条件。'],
  ghidra:['辅助阅读程序结构，进行反汇编与逆向分析。','输出需要专业解释；不会自动给出完整的安全判断。'],
  misp:['组织、交换和关联威胁情报。','需要单独部署、配置和导入情报来源。'],
  yara:['用规则匹配文件中的特征，辅助样本分类。','命中规则是一条线索，不等于最终恶意判定。'],
  wireshark:['查看网络数据包与协议交互细节。','需要先获取可分析的数据包；加密内容不一定可见。'],
  'juice-shop':['提供故意包含漏洞的练习应用，用于安全学习。','需单独运行练习环境；目录页面没有运行它。'],
  theharvester:['从支持的来源收集邮箱、子域名和 IP 等公开线索。','部分来源需要密钥；数据覆盖和访问限制各不相同。'],
  'have-i-been-pwned':['查询服务已收录的数据泄露事件中的相关记录。','查询范围由服务决定；未命中不代表从未泄露。'],
  phoneinfoga:['分析电话号码的基础属性及可获取的公开线索。','不能据此理解为实时定位手机或读取通信内容。'],
  spiderfoot:['通过模块收集和关联多类公开信息。','自动化由 SpiderFoot 提供，需要单独安装配置。'],
  maltego:['以关系图组织实体和信息来源，辅助关联分析。','关系图功能属于 Maltego，不属于这个合集。']
};
export const scenarios = [
  {id:'photo',label:'检查照片信息',question:'一张图片里，可能留下了什么信息？',input:'你自己的图片文件',ids:['exiftool','tineye'],output:'ExifTool 可读取存在的设备、时间、作者等字段；TinEye 可辅助寻找图片曾出现的网页。',boundary:'本页没有读取你的图片，也没有生成查询结果。这里展示的是工具选择与预期输出类型。',steps:['合集提供两个工具的条目与获取线索','你另行准备 ExifTool，或打开图片搜索服务','工具处理图片，返回元数据或来源线索','你核对字段是否真实、来源是否相关']},
  {id:'username',label:'查同名账号',question:'某个用户名在哪些网站出现？',input:'你自己的账号用户名（不是实名）',ids:['maigret','sherlock'],output:'选定网站上的同名账号候选、页面链接，以及工具支持提取的公开资料。',boundary:'同名账号不证明属于同一个人。本页不发起跨站查询。',steps:['合集告诉你有 Maigret、Sherlock 等候选工具','你选择、安装并配置一个工具','工具按照自身站点规则查询用户名','你逐项核验候选页面，不自动合并身份']},
  {id:'domain',label:'了解自有域名',question:'自己的域名关联了哪些公开网络线索？',input:'你拥有或获授权研究的域名',ids:['amass','shodan','nmap'],output:'按所选工具得到 DNS、子域名、已索引服务信息，或授权主动检测结果。',boundary:'查询索引与主动检测是不同操作。安装这些工具不会自动检测目标。',steps:['合集提供域名与网络类工具目录','你根据“查公开索引”或“主动检测”选择工具','配置具体来源、查询范围与访问条件','核验时效与归属，整理资产清单']},
  {id:'company',label:'查企业公开资料',question:'一家公司的公开登记资料在哪里查？',input:'公司名称，以及国家或地区',ids:['opencorporates'],output:'服务覆盖范围内的企业登记记录及相关公开资料。',boundary:'需要访问外部数据服务。原仓库不持有这些企业记录，也不直接生成信用评分。',steps:['合集提供企业资料服务的入口线索','你访问外部服务，并确认覆盖地区','搜索并辨认同名公司记录','交叉核验主体与来源，再形成研究笔记']},
  {id:'file',label:'分析文件线索',question:'我已有的文件或数据，适合用什么分析？',input:'你有权分析的文件、文本或内存镜像',ids:['cyberchef','yara','volatility'],output:'分别得到数据转换结果、规则匹配结果，或内存中的结构化取证线索。',boundary:'这三个工具的输入不同，不能互相替代。原库没有把它们自动串联。',steps:['合集让你发现数据处理和取证工具','你先判断输入是文本、普通文件还是内存镜像','选择匹配的工具、规则与处理步骤','把输出作为证据的一部分，由人解释结论']},
  {id:'learn',label:'搭建学习路径',question:'想开始学习安全分析，先认识哪些工具？',input:'学习目标，例如网络协议、程序分析或 Web 安全',ids:['wireshark','ghidra','juice-shop'],output:'找到三个不同方向的工具与实验资源，随后按目标单独学习。',boundary:'本页提供学习导航，不启动实验环境，也不下载软件。',steps:['合集按方向整理工具与学习入口','选择一个方向，阅读工具自己的文档','在准备好的练习环境中做小实验','记录操作与证据，再决定是否扩展工具集']}
];
export function filterTools(tools,{query='',category='',method=''}={}) {
  const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return tools.filter(t=>(!category||t.category===category)&&(!method||t.install.method===method)&&words.every(w=>[t.name,t.description,categories[t.category],...(featured[t.id]||[]),...(t.tags||[])].join(' ').toLocaleLowerCase().includes(w)));
}
export function safeUrl(value) {try{const u=new URL(value);return /^https?:$/.test(u.protocol)?u.href:null;}catch{return null;}}
