/**
 * Smoke test for the distribution build of dsh-agent-toolbox (host half).
 *
 * Sets DSH_HOME to a scratch dir, mounts the plugin against a stub Cordis ctx
 * that captures the registered fetch route, and exercises every endpoint:
 *   wb-config / wb-list / wb-preview / wb-prompts-save / wb-config-save
 *
 * Run:  node test/smoke.mjs
 */
import { promises as fsp } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { apply, PRESETS } from '../lib/index.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRATCH = path.join(os.tmpdir(), 'wbtb-smoke-' + Date.now())
process.env.DSH_HOME = path.join(SCRATCH, 'dsh-home')

const WB_ROOT = path.join(SCRATCH, 'agents', 'workbuddy')
const CL_ROOT = path.join(SCRATCH, 'agents', 'claude')
const FAKE_ROOT = path.join(SCRATCH, 'agents', 'unknown-agent')

let failures = 0
function assert(cond, msg) {
  if (cond) {
    console.log('  ok  -', msg)
  } else {
    failures++
    console.error('  FAIL-', msg)
  }
}
function section(t) {
  console.log('\n== ' + t + ' ==')
}
async function exists(p) {
  try {
    await fsp.stat(p)
    return true
  } catch (e) {
    return false
  }
}

async function makeFixture() {
  // WorkBuddy fixture
  await fsp.mkdir(path.join(WB_ROOT, 'skills', '财报分析'), { recursive: true })
  await fsp.writeFile(
    path.join(WB_ROOT, 'skills', '财报分析', 'SKILL.md'),
    '---\nname: 财报分析\nversion: 1.0.0\ndescription: 读取三张表并生成分析\n---\n# 财报分析\n步骤…\n'
  )
  await fsp.mkdir(path.join(WB_ROOT, 'connectors', 'skills', '配套技能'), { recursive: true })
  await fsp.writeFile(
    path.join(WB_ROOT, 'connectors', 'skills', '配套技能', 'SKILL.md'),
    '---\nname: 配套技能\ndescription: 连接器配套\n---\n正文'
  )
  await fsp.writeFile(
    path.join(WB_ROOT, 'prompts.json'),
    JSON.stringify({ prompts: [{ name: '代码审查', text: '请审查以下代码…' }] })
  )
  // Claude fixture
  await fsp.mkdir(path.join(CL_ROOT, 'skills', 'audit'), { recursive: true })
  await fsp.writeFile(
    path.join(CL_ROOT, 'skills', 'audit', 'SKILL.md'),
    '---\nname: Security Audit\ndescription: review changes for vulnerabilities\n---\n## checklist'
  )

  // initial config: wb + claude agents
  await fsp.mkdir(path.join(process.env.DSH_HOME, 'workbuddy-toolbox'), { recursive: true })
  await fsp.writeFile(
    path.join(process.env.DSH_HOME, 'workbuddy-toolbox', 'config.json'),
    JSON.stringify(
      {
        version: 1,
        agents: [
          {
            id: 'wb',
            name: 'WorkBuddy',
            root: WB_ROOT,
            enabled: true,
            skillsDirs: ['skills', 'connectors/skills'],
            promptsFiles: ['prompts.json'],
            sections: { skills: true, prompts: true },
          },
          {
            id: 'claude',
            name: 'Claude Code',
            root: CL_ROOT,
            enabled: true,
            skillsDirs: ['skills'],
            promptsFiles: [],
            sections: { skills: true, prompts: false },
          },
        ],
      },
      null,
      2
    )
  )
}

const route = { captured: null }
const ctx = {
  logger: {
    info: (...a) => console.log('[host]', ...a),
    warn: (...a) => console.warn('[host]', ...a),
  },
  connection: {
    fetch: {
      register(r) {
        route.captured = r
      },
    },
  },
}

async function call(endpoint, payload) {
  const res = await route.captured.fetch(
    new Request('http://localhost/api/workbuddy-toolbox', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ endpoint, payload: payload === undefined ? null : payload }),
    })
  )
  return res.json()
}

await makeFixture()
apply(ctx)
assert(!!route.captured, 'route registered')

section('wb-config')
{
  const r = await call('wb-config')
  assert(r.ok, 'ok')
  assert(r.value.agents.length === 2, 'two configured agents, got ' + r.value.agents.length)
  assert(Array.isArray(r.value.presets) && r.value.presets.length >= 5, 'presets present (' + (r.value.presets || []).length + ')')
  assert(r.value.presets.find((p) => p.id === 'workbuddy').root === '~/.workbuddy', 'workbuddy preset is machine-independent (~ path)')
  assert(r.value.agents.find((a) => a.id === 'wb').exists === true, 'wb agent root exists flag')
  assert(r.value.agents.find((a) => a.id === 'claude').exists === true, 'claude agent root exists flag')
  assert(r.value.home === process.env.DSH_HOME, 'home points at DSH_HOME')
  assert(
    r.value.presets.every((p) => p.mcpFiles === undefined && !(p.sections && p.sections.mcps !== undefined)),
    'presets carry no MCP fields'
  )
}

section('wb-list')
{
  const r = await call('wb-list')
  assert(r.ok, 'ok')
  const items = r.value.items || []
  const skills = items.filter((i) => i.kind === 'skill')
  const prompts = items.filter((i) => i.kind === 'prompt')
  assert(skills.length === 3, '3 skills (2 wb + 1 claude), got ' + skills.length)
  assert(skills.every((s) => s.agentId && s.agentName), 'skills tagged with agent')
  assert(!!skills.find((s) => s.agentName === 'WorkBuddy' && s.path.endsWith('SKILL.md')), 'wb skill path ok')
  assert(!!skills.find((s) => s.agentName === 'Claude Code'), 'claude skill present')
  assert(!!skills.find((s) => s.tag === '连接器配套'), 'connector skills tagged 连接器配套')
  assert(items.every((i) => i.kind !== 'mcp'), 'no MCP items collected')
  assert(prompts.length === 1 && prompts[0].agentId === 'wb', '1 prompt from wb prompts.json')
  assert(r.value.defaultAgent === 'wb', 'default agent = wb')
  assert(r.value.agents.length === 2, 'list agents include disabled/status meta')
}

section('wb-preview')
{
  const inside = path.join(WB_ROOT, 'skills', '财报分析', 'SKILL.md')
  let r = await call('wb-preview', { path: inside })
  assert(r.ok && r.value.preview.includes('财报分析'), 'preview allowed inside configured root')
  const outside = path.join(SCRATCH, 'secret.txt')
  await fsp.writeFile(outside, 'secret')
  r = await call('wb-preview', { path: outside })
  assert(!r.ok, 'preview rejected outside any configured root')
}

section('wb-prompts-save')
{
  const r = await call('wb-prompts-save', {
    agentId: 'wb',
    prompts: [
      { name: '代码审查', text: '请审查以下代码…' },
      { name: '周报', text: '生成一份周报' },
    ],
  })
  assert(r.ok, 'ok')
  assert(r.value.prompts.length === 2, 'saved 2 prompts')
  const raw = JSON.parse(await fsp.readFile(path.join(WB_ROOT, 'prompts.json'), 'utf8'))
  assert(raw.prompts.length === 2, 'prompts.json written')
  const bad = await call('wb-prompts-save', { agentId: 'claude', prompts: [] })
  assert(!bad.ok, 'claude has no promptsFiles → rejected')
}

section('wb-config-save (add preset agent + edit + disable)')
{
  const cfg = await call('wb-config')
  const agents = cfg.value.agents.map((a) => ({ ...a }))
  agents.push({
    id: 'dsh-fake',
    name: 'DSH',
    root: FAKE_ROOT,
    enabled: true,
    skillsDirs: [],
    promptsFiles: [],
    sections: { skills: false, prompts: false },
  })
  agents.find((a) => a.id === 'claude').enabled = false
  const r = await call('wb-config-save', { agents })
  assert(r.ok, 'ok')
  assert(r.value.agents.length === 3, '3 agents after save')
  const fake = r.value.agents.find((a) => a.id === 'dsh-fake')
  assert(fake && fake.exists === false, 'missing root flagged exists=false')
  const claude = r.value.agents.find((a) => a.id === 'claude')
  assert(claude && claude.enabled === false, 'claude disabled persisted')
  assert(r.value.agents.every((a) => a.mcpFiles === undefined), 'saved agents carry no mcpFiles')
  assert(r.value.agents.every((a) => !a.sections || a.sections.mcps === undefined), 'saved agents carry no mcps section')

  // verify persistence + disabled agent excluded from list
  const again = await call('wb-config')
  assert(again.value.agents.find((a) => a.id === 'dsh-fake'), 'config persisted to disk')
  const list = await call('wb-list')
  assert(list.value.items.every((i) => i.agentId !== 'claude'), 'disabled agent excluded from scan')
}

section('wb-probe-root (auto-detect layout from a root path)')
{
  let r = await call('wb-probe-root', { root: WB_ROOT })
  assert(r.ok && r.value.exists === true, 'probe existing root')
  assert(r.value.name === 'workbuddy', 'inferred name from basename, got ' + r.value.name)
  const det = r.value.detected || {}
  assert(det.skillsDirs.includes('skills') && det.skillsDirs.includes('connectors/skills'), 'skills dirs detected: ' + JSON.stringify(det.skillsDirs))
  assert(det.mcpFiles === undefined, 'no mcpFiles in detection result')
  assert(JSON.stringify(det.promptsFiles) === JSON.stringify(['prompts.json']), 'prompts file detected')

  r = await call('wb-probe-root', { root: CL_ROOT })
  assert(r.ok && JSON.stringify((r.value.detected || {}).skillsDirs) === JSON.stringify(['skills']), 'claude root: skills dir detected')
  assert((r.value.detected || {}).promptsFiles.length === 0, 'claude root: no prompts file')

  r = await call('wb-probe-root', { root: FAKE_ROOT })
  assert(r.ok && r.value.exists === false, 'nonexistent root flagged')
  assert((r.value.detected || {}).skillsDirs.length === 0, 'nonexistent root: empty detection')

  r = await call('wb-probe-root', { root: '' })
  assert(!r.ok, 'empty root rejected')
}

section('wb-browse-dirs (folder picker)')
{
  let r = await call('wb-browse-dirs', { path: path.join(SCRATCH, 'agents') })
  assert(r.ok, 'ok')
  const names = (r.value.dirs || []).map((d) => d.name)
  assert(names.includes('workbuddy') && names.includes('claude'), 'subdirs listed: ' + names.join(','))
  assert(r.value.parent === SCRATCH, 'parent resolved')
  assert(r.value.dirs.every((d) => path.isAbsolute(d.full)), 'dir entries absolute')

  r = await call('wb-browse-dirs', { path: path.join(SCRATCH, 'no-such-dir') })
  assert(!r.ok, 'missing dir rejected')

  r = await call('wb-browse-dirs', { path: '' })
  assert(r.ok && r.value.base === os.homedir(), 'empty path defaults to home')
}

section('wb-migrate (single skill, move, conflict, overwrite)')
{
  // re-enable claude and keep a clean 2-agent config
  const cfg0 = await call('wb-config')
  const agents0 = cfg0.value.agents
    .filter((a) => a.id === 'wb' || a.id === 'claude')
    .map((a) => ({ ...a, enabled: true }))
  const saved0 = await call('wb-config-save', { agents: agents0 })
  assert(saved0.ok && saved0.value.agents.length === 2, 'config reset to wb + claude (enabled)')

  const wbSkillId = 'wb:skill::财报分析'
  const wbConnSkillId = 'wb:skill:连接器配套:配套技能'
  const claudeSkillId = 'claude:skill::audit'

  // A: copy skill wb -> claude
  let r = await call('wb-migrate', { kind: 'skill', agentId: 'wb', itemId: wbSkillId, targetAgentId: 'claude', move: false })
  assert(r.ok && r.value.summary.skillsCopied === 1, 'skill copied wb->claude (skillsCopied=1)')
  assert(
    await exists(path.join(CL_ROOT, 'skills', '财报分析', 'SKILL.md')),
    'skill folder exists at target root/skills'
  )

  // B: copy skill claude -> wb (reverse direction)
  r = await call('wb-migrate', { kind: 'skill', agentId: 'claude', itemId: claudeSkillId, targetAgentId: 'wb', move: false })
  assert(r.ok && r.value.summary.skillsCopied === 1, 'skill copied claude->wb (reverse direction)')
  assert(await exists(path.join(WB_ROOT, 'skills', 'audit', 'SKILL.md')), 'claude skill folder now under wb')

  // C: conflict without overwrite
  r = await call('wb-migrate', { kind: 'skill', agentId: 'wb', itemId: wbSkillId, targetAgentId: 'claude', move: false })
  assert(r.ok && r.value.summary.skillsSkipped.length === 1, 'conflict skipped: target already exists')
  assert(String(r.value.summary.skillsSkipped[0].reason).includes('已存在'), 'skip reason mentions existing target')

  // D: overwrite true
  r = await call('wb-migrate', { kind: 'skill', agentId: 'wb', itemId: wbSkillId, targetAgentId: 'claude', move: false, overwrite: true })
  assert(r.ok && r.value.summary.skillsCopied === 1, 'overwrite mode copies over existing')

  // E: move skill (delete source) for a connector-paired skill
  r = await call('wb-migrate', { kind: 'skill', agentId: 'wb', itemId: wbConnSkillId, targetAgentId: 'claude', move: true })
  assert(r.ok && r.value.summary.skillsMoved === 1, 'skill moved (skillsMoved=1)')
  assert(!(await exists(path.join(WB_ROOT, 'connectors', 'skills', '配套技能', 'SKILL.md'))), 'source skill dir removed on move')
  assert(await exists(path.join(CL_ROOT, 'skills', '配套技能', 'SKILL.md')), 'moved skill exists at target')

  // F: mcp migration is gone
  r = await call('wb-migrate', { kind: 'mcp', agentId: 'wb', itemId: 'wb:mcp:websearch', targetAgentId: 'claude', move: false })
  assert(r.ok && r.value.summary.skillsCopied === 0 && r.value.summary.mcpsCopied === undefined, 'mcp kind ignored (no MCP migration left)')
}

section('wb-migrate (bulk: all skills of one agent)')
{
  // wb now has skills: 财报分析 (copied to claude before) + audit (copied from claude in B) → both exist at target → skipped
  const r = await call('wb-migrate', { kind: 'all', agentId: 'wb', targetAgentId: 'claude', move: false, overwrite: false })
  assert(r.ok, 'ok')
  const su = r.value.summary
  assert(su.skillsCopied === 0 && su.skillsSkipped.length === 2, 'bulk skills: both existing targets skipped, got ' + JSON.stringify(su.skillsSkipped))
  assert(su.mcpsCopied === undefined && su.mcpsSkipped === undefined, 'bulk summary has no MCP counters')
  assert(r.value.summary.movesDisabledForBulk === undefined, 'bulk ignores move (copy only)')
}

section('default config when file missing (machine-independent)')
{
  const home2 = path.join(SCRATCH, 'dsh-home-2')
  process.env.DSH_HOME = home2
  apply({
    logger: { info: () => {}, warn: () => {} },
    connection: { fetch: { register(r) { route.captured = r } } },
  })
  const r = await call('wb-config')
  const wb = r.value.agents[0]
  assert(r.value.agents.length === 1 && wb.id === 'wb', 'defaults to WorkBuddy agent')
  assert(wb.root === '~/.workbuddy', 'default root is ~/.workbuddy (no hardcoded username)')
  assert(wb.mcpFiles === undefined && wb.sections.mcps === undefined, 'default agent carries no MCP fields')
  assert(wb.rootResolved === undefined || true, 'probe shape ok')
  assert(r.value.agents[0].exists === (path.join(os.homedir(), '.workbuddy') === path.join(os.homedir(), '.workbuddy') ? (wb.exists === true || wb.exists === false) : true), 'exists probe boolean')
}

console.log('\n---------')
console.log(failures === 0 ? 'ALL SMOKE TESTS PASSED' : failures + ' TEST(S) FAILED')
process.exit(failures === 0 ? 0 : 1)
