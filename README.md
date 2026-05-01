# Micro Web Tools Batch Generator

This folder stores generated single-page HTML tools and the metadata used by the automation workflow.

## What This Project Does

The Python script in the parent directory reads `tasks.json`, calls an OpenAI-compatible API, extracts the returned HTML, and saves each tool as an independent `.html` file in this `output` directory.

The workflow also keeps a Chinese display-name mapping for each tool, so Git commit messages and future audits can use human-readable names instead of only English slugs.

## Important Files

- `*.html`: generated single-page web tools.
- `tool_name_map.json`: maps each task name to its Chinese tool name.
- `generated_tools.json`: records generated file paths and generation metadata.
- `run_state.json`: stores resumable task state for interrupted runs.
- `failures.json`: records failed tasks when generation errors occur.

## Resume And Concurrency

The workflow is resumable. If the process is interrupted, already completed tools remain on disk and are recorded in `run_state.json`. The next run skips completed or existing tools and continues with missing work.

The script automatically chooses a concurrency level based on task count. You can override it with:

```powershell
$env:MAX_WORKERS="5"
python "D:\DirMove\Document\New project\batch_generate_from_tasks.py"
```

## GitOps Deployment

After each tool is generated or repaired, the script commits and pushes that tool individually. The commit message includes the Chinese tool name:

```text
Auto-deploy: 工具中文名
```

If only the Chinese name mapping is missing, the script repairs `tool_name_map.json` and commits that metadata update with the related tool name.

---

# 微型 Web 工具批量生成器

此文件夹用于存放批量生成的单页 HTML 工具，以及自动化流程所需的元数据文件。

## 项目用途

上级目录中的 Python 脚本会读取 `tasks.json`，调用 OpenAI 兼容格式的大模型 API，提取返回内容中的 HTML 代码，并将每个工具保存为独立的 `.html` 文件。

流程还会为每个工具维护中文名称映射，便于 Git 提交信息、人工检查和后续维护使用中文工具名，而不是只依赖英文文件名。

## 重要文件

- `*.html`：生成出来的单页 Web 工具。
- `tool_name_map.json`：任务名到中文工具名的映射表。
- `generated_tools.json`：记录已生成文件路径和生成时间等信息。
- `run_state.json`：记录断点续跑状态。
- `failures.json`：记录生成失败的任务和错误原因。

## 断点续跑与并发

脚本支持断点续跑。运行过程中即使中断，已经完成的工具也会保留在磁盘上，并写入 `run_state.json`。下次运行时，脚本会自动跳过已完成或已存在的工具，从缺失的部分继续处理。

脚本会根据任务数量自动决定并发请求数量，也可以手动指定：

```powershell
$env:MAX_WORKERS="5"
python "D:\DirMove\Document\New project\batch_generate_from_tasks.py"
```

## GitOps 自动部署

每个工具生成或修复完成后，脚本会单独提交并推送该工具。提交信息会包含中文工具名：

```text
Auto-deploy: 工具中文名
```

如果 HTML 文件已存在但中文名映射缺失，脚本会只修复 `tool_name_map.json`，并使用对应工具中文名提交这次元数据更新。
