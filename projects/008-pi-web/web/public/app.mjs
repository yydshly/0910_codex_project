export const scenarios = {
  coding: { title: '给项目添加登录页面', description: '在已有项目中完成实现，再检查代码变更和测试结果。', steps: [
    ['提交需求','浏览器 · Pi Web','选择项目、模型和工具，在网页中输入需求。','项目会话中出现你的消息，工作台开始显示运行状态。','界面负责接收与展示；接下来由服务端的 Pi 引擎推进任务。'],
    ['理解项目','Pi 引擎 + 模型','模型根据上下文提出读取与搜索请求，Pi 在项目目录执行工具。','文件读取、搜索结果和模型回复通过事件流更新。','模型判断需要什么信息；Pi 调用工具，Pi Web 呈现结果。'],
    ['修改代码','Pi 引擎 + 文件工具','模型生成编辑方案，Pi 调用 edit 或 write 修改项目文件。','工具调用与修改结果出现在对话中，文件预览可更新。','文件变化发生在服务端电脑。这里的预设示例不会修改真实文件。'],
    ['验证结果','Pi 引擎 + 命令工具','智能体可执行项目已有的测试或检查，并根据输出继续修改。','命令输出、错误或检查结果展示在会话里。','是否成功要看实际输出；此展示没有执行测试，不预设验证通过。'],
    ['检查与继续','浏览器 · Pi Web','查看 Git 差异与文件内容，继续提出修改意见或从历史消息分叉。','变更、产物和对话历史集中在工作台中。','会话分支不会回滚代码；需要代码隔离时使用 Git worktree。'] ] },
  research: { title: '研究一个开源库的能力', description: '先阅读，再形成带出处的中文研究记录。', steps: [
    ['选定研究范围','浏览器 · Pi Web','选择源码目录和模型，输入需要分析的能力、原理与应用场景。','研究问题保存在项目会话中。','研究前固定源码版本；工具预设与已启用扩展需按任务检查。'],
    ['查阅关键代码','Pi 引擎 + 检索工具','通过 read、grep、find、ls 定位入口、核心逻辑与文档。','读取记录和分析逐步显示，可以检查证据来自哪些文件。','Pi Web 的文件浏览器辅助查看；源码结论来自工具读取与模型分析。'],
    ['梳理架构','配置的模型','结合已读取的源码，整理模块分工、数据流与实现边界。','模型输出架构解释，并指出仍需验证的问题。','模型分析不等于运行验证，能力声明需要标明证据等级。'],
    ['保存研究笔记','Pi 引擎 + 写入工具','如果授权写入并启用相应工具，可把结论保存为 Markdown。','项目目录出现研究笔记，可在网页预览。','只读工具预设本身不提供写入工具；记录结构可由研究 Skills 约定。'],
    ['审阅与追问','浏览器 · Pi Web','对照源码与笔记，继续追问某个模块，或导出会话留档。','文件预览、会话记录与导出入口共同支持复查。','引用、许可证和研究版本需由研究流程记录，不能假设自动完整。'] ] },
  agents: { title: '委派一次代码审查', description: '先开启内置子智能体，再把边界清楚的任务交给一个角色。', steps: [
    ['启用与配置','浏览器 · Pi Web','启用默认关闭的内置子智能体功能，配置角色并重新加载会话。','角色可拥有独立提示词、模型、工具和资源加载设置。','启用开关与会话重载是实际使用的前提。'],
    ['委派任务','父智能体 · Agent 工具','父智能体使用 Agent 工具，把审查范围和目标交给子智能体。','出现可检查的子会话及任务状态。','委派隔离了会话上下文，不代表文件系统自动隔离。'],
    ['执行子任务','子智能体 · Pi 会话','子智能体按角色工具读取代码；后台模式允许父任务继续工作。','子会话显示自身工具执行和分析记录。','可为审查角色限制工具；多任务修改代码时需另外安排独立 worktree。'],
    ['取回与指导','父智能体 · 控制工具','通过 get_subagent_result 查询结果，或用 steer_subagent 发送后续指导。','结果或运行状态返回父智能体；后台完成可通知父会话。','任务可能失败或中止，不能把启动成功视为任务成功。'],
    ['汇总并检查','父智能体 + 浏览器','父智能体汇总审查发现，用户查看子会话证据后决定下一步。','主对话与子会话形成可追踪的任务记录。','自动调度、强制验收和团队权限仍需额外产品设计。'] ] }
};
if (typeof document !== 'undefined') {
  let selected = 'coding'; let index = 0;
  const byId = id => document.getElementById(id);
  function render() {
    const scenario = scenarios[selected]; const step = scenario.steps[index];
    byId('task-title').textContent = scenario.title; byId('task-description').textContent = scenario.description;
    byId('step-count').textContent = `STEP ${String(index + 1).padStart(2,'0')} / ${String(scenario.steps.length).padStart(2,'0')}`;
    ['step-title','actor','step-description','step-visible','step-boundary'].forEach((id, i) => { byId(id).textContent = step[i]; });
    byId('step-list').replaceChildren(...scenario.steps.map((item, i) => { const li = document.createElement('li'); li.textContent = item[0]; if (i === index) li.setAttribute('aria-current','step'); return li; }));
    document.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === selected)));
    byId('previous').disabled = index === 0; byId('next').textContent = index === scenario.steps.length - 1 ? '重新演示 ↺' : '下一步 →';
  }
  document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => { selected = button.dataset.scenario; index = 0; render(); }));
  byId('previous').addEventListener('click', () => { index = Math.max(0,index-1); render(); });
  byId('next').addEventListener('click', () => { index = (index+1) % scenarios[selected].steps.length; render(); });
  render();
}
