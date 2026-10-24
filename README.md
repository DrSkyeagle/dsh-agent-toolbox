# Agent Toolbox（WorkBuddy 工具箱）

> DSH web 插件 · 会话输入框旁的「工具箱」

**核心卖点：人工添加 Skill 与 Prompt，按需配置、不自动注入，保留 DSH 最干净的上下文。**

多数「技能加载器」会一次性把所有 Skill / Prompt 塞进上下文，带来噪声与 token 浪费。
本插件反其道而行：它**不自动扫描、不自动注入**，而是让你手动把各 Agent 的
Skill 与常用 Prompt **挑选、收藏、排序**后，按需点选填入输入框——只把当下真正要用的内容喂给 DSH。

## 它解决什么

- DSH 同时对接多个 Agent（WorkBuddy / Claude Code / Codex / Cursor / Gemini），
  各自的 Skill、Prompt 散落在不同目录，来回翻找成本高。
- 自动加载器会污染上下文；本插件让你**人工策展**，保持上下文精简、可控、可解释。

## 功能

- **多 Agent 文件夹配置**：面板可按 Agent 筛选（全部 / 各 Agent）；设置页可添加、编辑、
  停用、删除任意 Agent，每个 Agent 独立配置：
  - 根目录（支持 `~`、`%USERPROFILE%`、`${VAR}` 展开）
  - 技能目录列表（含 `SKILL.md` 的子目录会被列出）
  - Prompt 文件列表（读取第一个存在的；保存写入第一个）
  - 分段开关（技能 / 常用 Prompt）
- **预设一键添加（设置页「从预设添加」）**：内置以下预设，自动探测本机可用状态，点一下即可加入并继续微调：
  | 预设 | 根目录 | 布局 |
  | --- | --- | --- |
  | WorkBuddy 桌面端 | `~/.workbuddy` | `skills` + `connectors/skills`；`prompts.json` |
  | Claude Code | `~/.claude` | `skills` |
  | OpenAI Codex CLI | `~/.codex` | `skills` |
  | Cursor | `~/.cursor` | `skills` + `rules` |
  | Gemini CLI | `~/.gemini` | `skills` |
  | 自定义目录 | `~` | 通用模板，手动修改 |
- **跟手 / 自动化（添加 Agent 不再繁琐）**：
  - 输入根目录即自动识别布局并补全 Agent 名称；
  - 目录浏览器逐级进入 / 一键使用，无需手输长路径；
  - 一键把本机已存在的预设目录全部添加为 Agent；
  - 手动编辑后自动填充不再覆盖该字段。
- **Agent 间迁移（技能互相迁移）**：单条或批量把技能目录在 Agent 之间复制 / 移动（含同名冲突处理）。
- **收藏 / 排序 / Prompt 管理**：收藏（本地持久化、自动迁移）、拖动排序（持久化）、
  Prompt 增删改；点选填入输入框（追加，不清空已有内容）；Skill 预览与调用草稿。

## 安装

### 方式一：npm（推荐，可复现）

```sh
dsh plugin add dsh-agent-toolbox@latest
```

### 方式二：git 固定版本

```sh
dsh plugin add git+https://github.com/DrSkyeagle/dsh-agent-toolbox.git#<40位commit>
```

### 方式三：本地目录（开发 / 热更新）

```sh
dsh plugin --profile web add <插件解压或克隆目录>
```

安装后重启 `dsh web`（host 在 dsh 服务进程启动时加载），输入框左侧出现「工具箱」按钮。
首次打开自动生成默认 WorkBuddy Agent；进入「⚙ 设置」页可从预设一键添加其他 Agent 并配置其文件夹。

> 启用内置 Discover（实验特性）的用户，也可在 Plugins → Experimental plugins →
> More → Custom plugin markets → Discover 中添加本项目的市场索引 URL 安装。

卸载：`dsh plugin --profile web remove dsh-agent-toolbox`

## 安全声明

- **仅本机运行**：Host 半部分提供 `POST /api/workbuddy-toolbox`，鉴权为同源 + 浏览器，无外发、无遥测。
- **路径守卫**：预览与调用只允许访问已配置 Agent 根目录内的文件。
- **迁移为显式操作**：技能复制 / 移动需你主动点选，不会悄悄改动你的目录。
- 不读取、不上传任何账号信息；设置仅持久化在 `<dsh-home>/workbuddy-toolbox/config.json`
  （`dsh-home` = `$DSH_HOME` 或 `~/.dsh`）。

## 组成

- `package.json` — `dsh.bundle`（自动挂载 `cordis.patch.yml`）+ `dsh.client`（浏览器端自动纳入启动清单）
- `lib/index.js` — Host 半部分（ESM，零外部依赖）：读取设置、扫描各 Agent、提供 `/api/workbuddy-toolbox` 接口
- `lib/client.js` — Client 半部分（React，经 `window.__ModuleLoader__` 工厂包格式）：注册按钮与弹窗，RPC 走 `/api/workbuddy-toolbox`
- `test/smoke.mjs` — Host 端点冒烟测试

## 开发与验证

```sh
npm test   # 运行 Host 端点冒烟测试（node test/smoke.mjs）
```

> ⚠️ 升级本插件后必须重启 `dsh web`：client 刷新页面即可生效，但 **host（`lib/index.js`）
> 在 dsh 服务进程启动时加载**。若只刷新页面而 host 仍是旧版，新 client 调用的新接口旧 host 不认识，
> 工具箱会显示为空 / 报错——重启后即恢复。数据不会丢失：Prompt 在对应 Agent 的 `prompts.json`，
> 技能在原目录，收藏会自动迁移。

配置合并检查：`dsh --profile web --dump-config` 应出现 `dsh-agent-toolbox` 相关层。

## 许可证

[MIT](./LICENSE) · © DrSkyeagle

---

项目主页：<https://github.com/DrSkyeagle/dsh-agent-toolbox>
