import { promises as fsp } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/**
 * dsh-agent-toolbox — host half (distribution build).
 *
 * WorkBuddy 工具箱 for the DSH web GUI. Machine-independent release:
 * instead of a hardcoded `C:\Users\<you>\.workbuddy`, every agent source is
 * configured through a runtime settings file, and the UI (client half) ships a
 * settings page with one-click presets for common agents
 * (WorkBuddy / Claude Code / Codex CLI / Cursor / Gemini CLI / 自定义目录).
 *
 * Persistence:
 *   <dsh-home>/workbuddy-toolbox/config.json   — agent folder settings (runtime-editable)
 *   per-agent prompts JSON                     — `<agent root>/<promptsFiles[0]>`
 *
 * Host-plugin file I/O uses node:fs on purpose: the Cordis `fs` service is
 * fenced by the active session's sandbox, which refuses writes outside the
 * workspace (agent data lives in the user profile instead).
 */

export const name = 'workbuddy-toolbox'
export const inject = ['connection']

/** Exact Fetch route under the shared /api channel; the registry needs no webServer. */
const ROUTE_PATH = '/api/workbuddy-toolbox'

const CONFIG_VERSION = 1
const MAX_AGENTS = 50
const MAX_PROMPTS = 500
const MAX_NAME_LEN = 100
const MAX_TEXT_LEN = 20000
const MAX_STRLIST = 20
const MAX_READ_BYTES = 4 * 1024 * 1024 // guard against huge files (e.g. ~/.claude.json)

/* ------------------------------------------------------------------ *
 * Presets — the "several ready-to-use options" shown in settings UI.
 * `~` / `%VAR%` / `${VAR}` are expanded at runtime, so the same layout
 * works on any machine whose home layout matches the tool's convention.
 * ------------------------------------------------------------------ */
export const PRESETS = [
  {
    id: 'workbuddy',
    name: 'WorkBuddy 桌面端',
    desc: 'WorkBuddy 应用数据：技能与常用 Prompt',
    root: '~/.workbuddy',
    skillsDirs: ['skills', 'connectors/skills'],
    promptsFiles: ['prompts.json'],
    sections: { skills: true, prompts: true },
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    desc: 'Anthropic Claude Code：SKILL.md 技能',
    root: '~/.claude',
    skillsDirs: ['skills'],
    promptsFiles: [],
    sections: { skills: true, prompts: false },
  },
  {
    id: 'codex',
    name: 'OpenAI Codex CLI',
    desc: 'Codex CLI：~/.codex 下的技能（SKILL.md）',
    root: '~/.codex',
    skillsDirs: ['skills'],
    promptsFiles: [],
    sections: { skills: true, prompts: false },
  },
  {
    id: 'cursor',
    name: 'Cursor',
    desc: 'Cursor 编辑器：skills / rules 技能',
    root: '~/.cursor',
    skillsDirs: ['skills', 'rules'],
    promptsFiles: [],
    sections: { skills: true, prompts: false },
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    desc: 'Google Gemini CLI：~/.gemini 下的技能',
    root: '~/.gemini',
    skillsDirs: ['skills'],
    promptsFiles: [],
    sections: { skills: true, prompts: false },
  },
  {
    id: 'custom',
    name: '自定义目录',
    desc: '任意目录：可自行配置子路径布局',
    root: '~',
    skillsDirs: ['skills'],
    promptsFiles: ['prompts.json'],
    sections: { skills: true, prompts: true },
  },
]

/** Default configuration: exactly today's WorkBuddy behaviour, no hardcoded user name. */
function defaultAgents() {
  const p = PRESETS.find((x) => x.id === 'workbuddy')
  return [
    {
      id: 'wb',
      name: 'WorkBuddy',
      root: p.root,
      enabled: true,
      skillsDirs: p.skillsDirs.slice(),
      promptsFiles: p.promptsFiles.slice(),
      sections: { ...p.sections },
    },
  ]
}

/* ------------------------------------------------------------------ *
 * Path helpers
 * ------------------------------------------------------------------ */

/** dsh home: DSH_HOME override (relative → cwd-absolute) or ~/.dsh. */
function dshHome() {
  const override = process.env.DSH_HOME
  if (override && override.trim()) return path.resolve(override.trim())
  return path.join(os.homedir(), '.dsh')
}

/** Expand %VAR% / ${VAR} and a leading `~`. */
function expandPath(input) {
  if (typeof input !== 'string') return ''
  let s = input.trim()
  if (!s) return ''
  s = s.replace(/%([A-Za-z_][A-Za-z0-9_]*)%/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(process.env, k) ? process.env[k] : m
  )
  s = s.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(process.env, k) ? process.env[k] : m
  )
  if (s === '~' || s.startsWith('~/') || s.startsWith('~\\')) {
    s = path.join(os.homedir(), s.slice(1).replace(/^[\\/]+/, ''))
  }
  return s
}

/** Resolve one configured entry against an agent root. */
function resolveEntry(root, entry) {
  if (typeof entry !== 'string' || !entry.trim()) return ''
  const e = entry.trim().replace(/\//g, path.sep)
  const expanded = expandPath(e)
  const abs =
    path.isAbsolute(expanded) || /^[A-Za-z]:[\\/]/.test(expanded) || expanded.startsWith('\\\\')
  return abs ? path.resolve(expanded) : path.resolve(root, expanded)
}

function norm(p) {
  return path.resolve(p).toLowerCase()
}

function isWithin(root, target) {
  const r = norm(root)
  const t = norm(target)
  return t === r || t.startsWith(r + path.sep)
}

/** Expand a `*` pattern (single wildcard per segment) into concrete paths. */
async function expandPattern(base, rel) {
  const segs = String(rel || '').split(/[\\/]+/).filter(Boolean)
  if (!segs.length) return []
  let cur = [base]
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]
    const next = []
    if (!seg.includes('*')) {
      for (const c of cur) next.push(path.join(c, seg))
    } else {
      const re = new RegExp(
        '^' + seg.split('*').map(escapeRe).join('[^\\\\/]*') + '$',
        'i'
      )
      for (const c of cur) {
        let entries = []
        try {
          entries = await fsp.readdir(c, { withFileTypes: true })
        } catch (e) {
          continue
        }
        for (const e of entries) {
          if (re.test(e.name)) next.push(path.join(c, e.name))
        }
      }
    }
    cur = next
  }
  return cur
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function isDirectory(p) {
  try {
    return (await fsp.stat(p)).isDirectory()
  } catch (e) {
    return false
  }
}

async function existsFile(p) {
  try {
    return (await fsp.stat(p)).isFile()
  } catch (e) {
    return false
  }
}

function dec(u8) {
  try {
    return new TextDecoder('utf-8').decode(u8)
  } catch (e) {
    return ''
  }
}

async function readHead(p, bytes) {
  try {
    const handle = await fsp.open(p, 'r')
    try {
      const buf = Buffer.alloc(Math.min(bytes, MAX_READ_BYTES))
      const { bytesRead } = await handle.read(buf, 0, buf.length, 0)
      return dec(buf.subarray(0, bytesRead))
    } finally {
      await handle.close()
    }
  } catch (e) {
    return ''
  }
}

async function readTextFile(p) {
  try {
    const st = await fsp.stat(p)
    if (st.size > MAX_READ_BYTES) throw new Error('file too large (' + st.size + ' bytes)')
    return await fsp.readFile(p, 'utf8')
  } catch (e) {
    return ''
  }
}

/* ------------------------------------------------------------------ *
 * Config file (runtime-editable settings)
 * ------------------------------------------------------------------ */

function configPath() {
  return path.join(dshHome(), 'workbuddy-toolbox', 'config.json')
}

function sanitizeStrList(v) {
  if (!Array.isArray(v)) return []
  return v
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean)
    .slice(0, MAX_STRLIST)
}

function sanitizeAgent(raw, index) {
  const base = raw && typeof raw === 'object' ? raw : {}
  const id =
    typeof base.id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(base.id)
      ? base.id
      : 'agent-' + (index + 1)
  const name =
    typeof base.name === 'string' && base.name.trim() ? base.name.trim().slice(0, 60) : 'Agent ' + (index + 1)
  const root = typeof base.root === 'string' && base.root.trim() ? base.root.trim().slice(0, 1024) : '~'
  const sec = base.sections && typeof base.sections === 'object' ? base.sections : {}
  return {
    id,
    name,
    root,
    enabled: base.enabled !== false,
    skillsDirs: sanitizeStrList(base.skillsDirs),
    promptsFiles: sanitizeStrList(base.promptsFiles),
    sections: {
      skills: sec.skills !== false,
      prompts: sec.prompts !== false,
    },
  }
}

async function loadConfig() {
  const file = configPath()
  let raw = null
  try {
    raw = JSON.parse(await fsp.readFile(file, 'utf8'))
  } catch (e) {
    return { agents: defaultAgents() }
  }
  const list = Array.isArray(raw && raw.agents) ? raw.agents : []
  const agents = list.slice(0, MAX_AGENTS).map(sanitizeAgent)
  const ids = new Set()
  for (const a of agents) {
    if (ids.has(a.id)) a.id = 'agent-' + Math.random().toString(36).slice(2, 8)
    ids.add(a.id)
  }
  return { agents: agents.length ? agents : defaultAgents() }
}

async function saveConfig(agents) {
  const clean = (Array.isArray(agents) ? agents : []).slice(0, MAX_AGENTS).map(sanitizeAgent)
  const ids = new Set()
  for (const a of clean) {
    if (ids.has(a.id)) a.id = 'agent-' + Math.random().toString(36).slice(2, 8)
    ids.add(a.id)
  }
  if (!clean.length) clean.push(...defaultAgents())
  const file = configPath()
  await fsp.mkdir(path.dirname(file), { recursive: true })
  await fsp.writeFile(file, JSON.stringify({ version: CONFIG_VERSION, agents: clean }, null, 2), 'utf8')
  return clean
}

async function probeExists(root) {
  return root ? isDirectory(expandPath(root)) : false
}

/* ------------------------------------------------------------------ *
 * Collectors
 * ------------------------------------------------------------------ */

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fm = m[1]
  const one = (key) => {
    const line = fm.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'))
    return line ? line[1].trim().replace(/^["']|["']$/g, '') : ''
  }
  return { name: one('name'), description: one('description'), version: one('version') }
}

async function collectSkills(agent) {
  const out = []
  const root = expandPath(agent.root)
  const dirs = Array.isArray(agent.skillsDirs) ? agent.skillsDirs : []
  for (const d of dirs) {
    const dir = resolveEntry(root, d)
    if (!(await isDirectory(dir))) continue
    let entries = []
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true })
    } catch (e) {
      continue
    }
    for (const e of entries) {
      if (!e.isDirectory()) continue
      const p = path.join(dir, e.name, 'SKILL.md')
      const head = await readHead(p, 16384)
      if (!head) continue
      const fm = parseFrontmatter(head)
      out.push({
        kind: 'skill',
        id: agent.id + ':skill:' + (d.indexOf('connectors') >= 0 ? '连接器配套' : '') + ':' + e.name,
        name: fm.name || e.name,
        folder: e.name,
        path: p,
        description: fm.description || '',
        version: fm.version || '',
        tag: d.indexOf('connectors') >= 0 ? '连接器配套' : '',
        agentId: agent.id,
        agentName: agent.name,
      })
    }
  }
  return out
}

async function collectPrompts(agent) {
  const root = expandPath(agent.root)
  const files = Array.isArray(agent.promptsFiles) ? agent.promptsFiles : []
  if (!files.length) return { missing: true, prompts: null, error: '' }
  let text = ''
  let readPath = ''
  let missing = true
  for (const entry of files) {
    const rel = String(entry || '').replace(/\//g, path.sep)
    const concrete = rel.includes('*') ? await expandPattern(root, rel) : [resolveEntry(root, entry)]
    for (const p of concrete) {
      if (!(await existsFile(p))) continue
      text = await readTextFile(p)
      readPath = p
      missing = false
      break
    }
    if (!missing) break
  }
  if (missing) return { missing: true, prompts: null, error: '' }
  try {
    const data = JSON.parse(text)
    const arr = Array.isArray(data) ? data : data && Array.isArray(data.prompts) ? data.prompts : []
    const out = []
    for (const it of arr) {
      if (it && typeof it.name === 'string' && typeof it.text === 'string') {
        out.push({
          id: agent.id + ':prompt:' + it.name,
          name: it.name,
          text: it.text,
          kind: 'prompt',
          agentId: agent.id,
          agentName: agent.name,
        })
      }
    }
    return { missing: false, prompts: out, error: '', path: readPath }
  } catch (e) {
    return { missing: false, prompts: null, error: String((e && e.message) || e), path: readPath }
  }
}

/* ------------------------------------------------------------------ *
 * Migration helpers (skill folder moves between agents)
 * ------------------------------------------------------------------ */

/** Recursive dir copy; fails when dest exists unless overwrite is set. */
async function copyDir(src, dest, overwrite) {
  const st = await fsp.stat(src).catch(() => null)
  if (!st) throw new Error('源目录不存在：' + src)
  const dt = await fsp.stat(dest).catch(() => null)
  if (dt) {
    if (overwrite) await fsp.rm(dest, { recursive: true, force: true })
    else throw new Error('目标已存在：' + dest)
  }
  await fsp.mkdir(dest, { recursive: true })
  const entries = await fsp.readdir(src, { withFileTypes: true })
  for (const e of entries) {
    const s = path.join(src, e.name)
    const d = path.join(dest, e.name)
    if (e.isDirectory()) await copyDir(s, d, false)
    else await fsp.copyFile(s, d)
  }
}

/** First skills directory entry of an agent (absolute, resolved). */
function skillTargetDir(agent) {
  const dirs = Array.isArray(agent.skillsDirs) ? agent.skillsDirs : []
  if (!dirs.length) return ''
  return resolveEntry(expandPath(agent.root), dirs[0]) || ''
}

/* ------------------------------------------------------------------ *
 * Auto-detection helpers (turn agent-add into: pick a root, done)
 * ------------------------------------------------------------------ */

const SKILL_DIR_CANDIDATES = ['skills', 'connectors/skills', 'rules', '.agent-presets']

/** True when `p` is a directory holding at least one subdir with SKILL.md. */
async function dirHasSkills(p) {
  if (!(await isDirectory(p))) return false
  const inner = await fsp.readdir(p, { withFileTypes: true }).catch(() => [])
  for (const e of inner) {
    if (!e.isDirectory()) continue
    if (await existsFile(path.join(p, e.name, 'SKILL.md'))) return true
  }
  return false
}

/** Guess the folder layout of an agent root from what actually exists. */
async function detectLayout(root) {
  const detected = { skillsDirs: [], promptsFiles: [] }
  const already = new Set()
  for (const c of SKILL_DIR_CANDIDATES) {
    if (await dirHasSkills(path.join(root, c))) {
      detected.skillsDirs.push(c)
      already.add(c)
    }
  }
  // generic: any other direct child dir that holds SKILL.md folders
  const children = await fsp.readdir(root, { withFileTypes: true }).catch(() => [])
  for (const e of children) {
    if (!e.isDirectory() || already.has(e.name)) continue
    if (e.name === 'connectors') continue
    if (await dirHasSkills(path.join(root, e.name))) detected.skillsDirs.push(e.name)
  }
  // prompts
  if (await existsFile(path.join(root, 'prompts.json'))) detected.promptsFiles.push('prompts.json')
  return detected
}

/* ------------------------------------------------------------------ *
 * Route
 * ------------------------------------------------------------------ */

function jsonResponse(value, status) {
  return new Response(JSON.stringify(value), {
    status: typeof status === 'number' ? status : 200,
    headers: { 'content-type': 'application/json' },
  })
}

export function apply(ctx) {
  const log = (...args) => {
    try {
      ctx.logger?.info?.('workbuddy-toolbox:', ...args)
    } catch (e) {
      /* ignore */
    }
  }

  const route = {
    kind: 'exact',
    path: ROUTE_PATH,
    methods: ['POST'],
    requestBody: 'buffered',
    async fetch(request) {
      let body = null
      try {
        body = await request.json()
      } catch (e) {
        return jsonResponse({ ok: false, error: 'body is not JSON' }, 400)
      }
      const endpoint = body && typeof body.endpoint === 'string' ? body.endpoint : ''
      const payload = body ? body.payload : null
      try {
        if (endpoint === 'wb-list') {
          const cfg = await loadConfig()
          const items = []
          const agents = []
          for (const agent of cfg.agents) {
            const root = expandPath(agent.root)
            const exists = await isDirectory(root)
            agents.push({ id: agent.id, name: agent.name, root, enabled: agent.enabled, exists })
            if (!agent.enabled) continue
            if (agent.sections.skills) items.push(...(await collectSkills(agent)))
            if (agent.sections.prompts) {
              const pr = await collectPrompts(agent)
              if (pr.error) {
                const a = agents.find((x) => x.id === agent.id)
                if (a) a.promptsError = pr.error
              }
              if (pr.prompts) items.push(...pr.prompts)
            }
          }
          const first = cfg.agents.find((a) => a.enabled) || cfg.agents[0]
          return jsonResponse({
            ok: true,
            value: { items, agents, defaultAgent: first ? first.id : '' },
          })
        }

        if (endpoint === 'wb-config') {
          const cfg = await loadConfig()
          const agents = []
          for (const a of cfg.agents) {
            agents.push({ ...a, exists: await probeExists(a.root) })
          }
          const presets = []
          for (const p of PRESETS) {
            presets.push({ ...p, rootResolved: expandPath(p.root), exists: await probeExists(p.root) })
          }
          return jsonResponse({
            ok: true,
            value: { agents, presets, home: dshHome(), configFile: configPath() },
          })
        }

        if (endpoint === 'wb-config-save') {
          const next = payload && Array.isArray(payload.agents) ? payload.agents : []
          const clean = await saveConfig(next)
          const agents = []
          for (const a of clean) agents.push({ ...a, exists: await probeExists(a.root) })
          log('config saved:', agents.length, 'agent(s)')
          return jsonResponse({ ok: true, value: { agents } })
        }

        if (endpoint === 'wb-prompts-save') {
          const cfg = await loadConfig()
          const agentId = payload && typeof payload.agentId === 'string' ? payload.agentId : ''
          const agent = cfg.agents.find((a) => a.id === agentId)
          if (!agent) return jsonResponse({ ok: false, error: '未知 Agent：' + agentId })
          const raw = payload && Array.isArray(payload.prompts) ? payload.prompts : []
          if (raw.length > MAX_PROMPTS) return jsonResponse({ ok: false, error: 'Prompt 数量过多（上限 ' + MAX_PROMPTS + '）' })
          const out = []
          for (const it of raw) {
            if (!it || typeof it.name !== 'string' || typeof it.text !== 'string') continue
            const nm = it.name.trim()
            const tx = it.text.trim()
            if (!nm || !tx) continue
            out.push({ name: nm.slice(0, MAX_NAME_LEN), text: tx.slice(0, MAX_TEXT_LEN) })
          }
          const root = expandPath(agent.root)
          const files = Array.isArray(agent.promptsFiles) ? agent.promptsFiles : []
          if (!files.length) {
            return jsonResponse({ ok: false, error: '该 Agent 未配置 Prompt 文件（设置中可添加）' })
          }
          // write to the first existing prompts file, or the first configured one
          let target = ''
          for (const entry of files) {
            const rel = String(entry || '').replace(/\//g, path.sep)
            const concrete = rel.includes('*') ? await expandPattern(root, rel) : [resolveEntry(root, entry)]
            const first = concrete.find((p) => p)
            if (!first) continue
            if (await existsFile(first)) {
              target = first
              break
            }
            if (!target) target = first
          }
          if (!target) return jsonResponse({ ok: false, error: '无法确定 Prompt 文件路径' })
          await fsp.mkdir(path.dirname(target), { recursive: true })
          await fsp.writeFile(target, JSON.stringify({ prompts: out }, null, 2) + '\n', 'utf8')
          const saved = out.map((it) => ({
            id: agent.id + ':prompt:' + it.name,
            name: it.name,
            text: it.text,
            kind: 'prompt',
            agentId: agent.id,
            agentName: agent.name,
          }))
          return jsonResponse({ ok: true, value: { prompts: saved, path: target } })
        }

        if (endpoint === 'wb-preview') {
          const cfg = await loadConfig()
          const p = payload && typeof payload.path === 'string' ? payload.path : ''
          if (!p) return jsonResponse({ ok: false, error: '缺少路径' })
          const allowed = cfg.agents.some((a) => isWithin(expandPath(a.root), p))
          if (!allowed) return jsonResponse({ ok: false, error: '非法路径（不在任何已配置 Agent 目录下）' })
          const head = await readHead(p, 6000)
          return jsonResponse({ ok: true, value: { preview: head } })
        }

        if (endpoint === 'wb-migrate') {
          const cfg = await loadConfig()
          const p = payload || {}
          const sourceId = typeof p.agentId === 'string' ? p.agentId : ''
          const targetId = typeof p.targetAgentId === 'string' ? p.targetAgentId : ''
          const kind = p.kind === 'skill' || p.kind === 'all' ? p.kind : ''
          const move = p.move === true
          const overwrite = p.overwrite === true
          const source = cfg.agents.find((a) => a.id === sourceId)
          const target = cfg.agents.find((a) => a.id === targetId)
          if (!source) return jsonResponse({ ok: false, error: '源 Agent 不存在' })
          if (!target) return jsonResponse({ ok: false, error: '目标 Agent 不存在' })
          if (source.id === target.id) return jsonResponse({ ok: false, error: '源与目标 Agent 不能相同' })
          const srcRoot = expandPath(source.root)
          if (!(await isDirectory(srcRoot))) {
            return jsonResponse({ ok: false, error: '源 Agent 根目录不存在：' + srcRoot })
          }
          const tgtRoot = expandPath(target.root)
          if (!(await isDirectory(tgtRoot))) {
            return jsonResponse({ ok: false, error: '目标 Agent 根目录不存在：' + tgtRoot })
          }

          const summary = {
            skillsCopied: 0,
            skillsMoved: 0,
            skillsSkipped: [],
            errors: [],
          }

          const migrateSkill = async (item) => {
            if (!target.sections.skills) {
              summary.skillsSkipped.push({ name: item.name, reason: '目标已关闭「技能」扫描' })
              return
            }
            const base = skillTargetDir(target)
            if (!base) {
              summary.skillsSkipped.push({ name: item.name, reason: '目标未配置技能目录' })
              return
            }
            const srcDir = path.dirname(item.path)
            const destDir = path.join(base, item.folder || path.basename(srcDir))
            try {
              await copyDir(srcDir, destDir, overwrite)
              if (move) {
                await fsp.rm(srcDir, { recursive: true, force: true })
                summary.skillsMoved++
              } else {
                summary.skillsCopied++
              }
            } catch (e) {
              summary.skillsSkipped.push({ name: item.name, reason: String((e && e.message) || e) })
            }
          }

          if (kind === 'skill' || kind === 'all') {
            const skills = await collectSkills(source)
            if (kind === 'skill') {
              const itemId = typeof p.itemId === 'string' ? p.itemId : ''
              const item = skills.find((s) => s.id === itemId)
              if (!item) return jsonResponse({ ok: false, error: '未找到该技能（可能已不在源目录）' })
              await migrateSkill(item)
            } else {
              for (const s of skills) await migrateSkill(s)
            }
          }
          if (kind === 'all' && move) {
            summary.movesDisabledForBulk = true // bulk always copies; move would be destructive
          }
          return jsonResponse({ ok: true, value: { summary } })
        }

        if (endpoint === 'wb-probe-root') {
          const rawRoot = payload && typeof payload.root === 'string' ? payload.root : ''
          if (!rawRoot || !rawRoot.trim()) return jsonResponse({ ok: false, error: '缺少根目录' })
          const root = expandPath(rawRoot)
          const exists = await isDirectory(root)
          const detected = exists ? await detectLayout(root) : { skillsDirs: [], promptsFiles: [] }
          const name = root && root !== path.parse(root).root ? path.basename(root) : ''
          return jsonResponse({ ok: true, value: { root, exists, name, detected } })
        }

        if (endpoint === 'wb-browse-dirs') {
          const raw = payload && typeof payload.path === 'string' && payload.path.trim() ? payload.path : '~'
          const base = expandPath(raw)
          const st = await fsp.stat(base).catch(() => null)
          if (!st || !st.isDirectory()) return jsonResponse({ ok: false, error: '目录不存在：' + base })
          const entries = await fsp.readdir(base, { withFileTypes: true }).catch(() => [])
          const dirs = entries
            .filter((e) => e.isDirectory())
            .slice(0, 200)
            .map((e) => ({ name: e.name, full: path.join(base, e.name) }))
          return jsonResponse({
            ok: true,
            value: { base, parent: path.dirname(base), home: os.homedir(), dirs },
          })
        }

        return jsonResponse({ ok: false, error: '未知接口 ' + endpoint })
      } catch (e) {
        return jsonResponse({ ok: false, error: String((e && e.message) || e) })
      }
    },
  }
  ctx.connection.fetch.register(route)
  log('route registered at', ROUTE_PATH)
}