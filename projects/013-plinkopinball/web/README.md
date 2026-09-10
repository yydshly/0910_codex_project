# Plinkopinball 能力展示

零第三方依赖的独立静态网页，包含原版外部嵌入、原创二维原理实验、可切换技术拆解、应用场景与完整中文研究。

## 本地运行

在此 web 目录中，使用 Node.js 24（本地较新版本亦可）：

```powershell
node scripts/build.mjs
node scripts/check.mjs
node scripts/serve.mjs
```

访问终端打印的本地地址，默认 http://127.0.0.1:4313/ 。无需安装依赖或设置密钥。单独预览时“研究集”入口不提供完整导航；统一构建后可用。服务器仅绑定本机。

## 页面与行为

- index.html：直接加载作者原站，并提供“原理实验”模式。
- understanding.html：完整中文能力与技术研究。
- sources.html：固定版本、来源、许可与验证范围。
- games.html：八种可切换游戏方向，含自动演示和亲自试玩；支持 #puzzle、#maze、#breakout、#track、#chain、#sorting、#rhythm、#race 定位。
- games-notes.html：玩法操作、使用算法、原型边界和测试记录。
- notes/：与研究文档一致的 Markdown 下载。
- assets/：原创流程图。
- public/physics.mjs：独立二维教学模型，固定步长，最多 80 球。
- public/app.mjs：界面输入、绘制、模式切换与参数控制。
- public/games-engine.mjs：八种独立游戏的状态、规则与胜负判定；games-view.mjs 绘制玩法表面，games-app.mjs 处理用户操作。

原版方向键或 A/D 控制挡板，空格蓄力；实验方向键或 A/D 控制挡板，空格投球。两个模式的参数与进度独立。切换至实验会卸载原站，切回会重新加载。

## 构建与发布

构建输出仅为本目录 dist；根 docs/web-demos.json 登记项目，沿用仓库 GitHub Pages 流程。根目录执行 node scripts/build-pages.mjs 和 node scripts/check-pages.mjs 完成所有项目构建与子路径检查。

原站 iframe 依赖外部网络与作者服务，提供独立窗口入口；中文研究及实验核心不依赖外部 JavaScript 包。当前未在新展示页执行浏览器交互与视觉回归，详见验证记录。

[返回研究项目](../README.md)
