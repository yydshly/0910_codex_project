# 验证记录与复现方法

日期：2026-09-10；基线提交：`15b7ea5039983c9dee328be8c7c609f3eb86058e`。

## 本地验证

Windows 环境：Python 3.10.11、Node.js 22.15.0、PowerShell 7.6.5。上游浅克隆到系统临时目录；未安装为个人技能，未注册账户或配置密钥。

| 检查 | 结果 | 证明范围 |
| :--- | :--- | :--- |
| `python scripts/generate.py --check` | 四个客户端全部 OK | 共享生成区块一致 |
| `python scripts/test_cli.py --runtime python,node,powershell` | 三种运行时全部 PASS | 模拟服务下参数转换、错误、目录、抽取、并发、输出顺序与部分失败处理 |
| Bash 运行 | 未测试 | 仅验证生成区块一致 |

本地测试不证明生产服务的搜索质量或长期稳定性。

## 匿名在线验证

通过直接 HTTP 调用公开接口，未携带 API Key。

| 请求 | 观察 |
| :--- | :--- |
| 查询 code、academic、finance 领域目录 | 返回成功，包含三个领域的能力和参数 |
| 通用搜索：法国首都，最多 1 条 | 返回成功；Paris 条目及来源 URL |
| 垂直搜索：React useEffect cleanup；tag=code.doc；params.library=react；最多 2 条 | 返回成功；两个指向 React 官方文档仓库的清理逻辑示例 |
| 抽取 https://example.com | 返回成功；Example Domain 标题和 Markdown 正文 |

当前目录中 `code.doc` 的 `library` 为必填，部分静态示例没有该参数，实践应读取当前目录。

这四次调用只验证选定路径的基本可用性。未评测全部领域、额度上限、复杂网页、全文长度限制、数据时间精度或质量基准；服务端自述的覆盖范围未独立验证。

## 复现方法

在独立研究目录检出固定提交后，使用带 `requests` 的 Python 环境：

```powershell
python scripts/generate.py --check
python scripts/test_cli.py --runtime python,node,powershell
```

测试会启动本地模拟服务，Node.js 和 PowerShell 需可用。依赖见上游 requirements.txt，本研究项目未新增应用依赖。

在线查询可通过上游客户端复现，先发现参数：

```powershell
node scripts/anysearch_cli.js get_sub_domains --domain code
node scripts/anysearch_cli.js search 'React useEffect cleanup' --tag code.doc --params library=react --max_results 2
node scripts/anysearch_cli.js extract 'https://example.com'
```

上述在线 CLI 命令由已验证 HTTP 请求对应转换而来，本次在线验证使用直接 HTTP 调用；CLI 本身通过本地模拟接口测试验证，二者证据范围分别记录。

依据：[上游测试](https://github.com/anysearch-ai/anysearch-skill/blob/15b7ea5039983c9dee328be8c7c609f3eb86058e/scripts/test_cli.py)、[生成器](https://github.com/anysearch-ai/anysearch-skill/blob/15b7ea5039983c9dee328be8c7c609f3eb86058e/scripts/generate.py)、[官方服务](https://www.anysearch.com/)。
