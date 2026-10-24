window.__ModuleLoader__.load({
  id: "dsh-agent-toolbox",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var react = require("react");
    var React = react;

    function injectCss(css) {
      if (typeof document === "undefined") return;
      var tagId = "dsh-agent-toolbox/styles";
      if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
      var tag = document.createElement("style");
      tag.dataset.plugin = "dsh-agent-toolbox";
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
    }

    const CSS = `
.wbtb-btn {
  flex: none;
  border: 1px solid var(--dsw-alias-border-l2, #3a3f47);
  background: transparent;
  color: var(--dsw-alias-label-primary, #e6e8eb);
  border-radius: 8px;
  padding: 3px 10px;
  font-size: 12.5px;
  line-height: 1.6;
  cursor: pointer;
  white-space: nowrap;
}
.wbtb-btn:hover {
  border-color: var(--dsw-alias-brand-primary, #4f8cff);
  color: var(--dsw-alias-brand-primary, #4f8cff);
}
.wbtb-mask {
  position: fixed;
  inset: 0;
  background: rgba(12, 14, 18, 0.45);
  pointer-events: auto;
  z-index: 12000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wbtb-panel {
  width: min(820px, calc(100vw - 40px));
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background: var(--dsw-alias-bg-overlay, #1e2127);
  border: 1px solid var(--dsw-alias-border-l2, #3a3f47);
  border-radius: 12px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
  color: var(--dsw-alias-label-primary, #e6e8eb);
  overflow: hidden;
}
.wbtb-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, #2c3138);
}
.wbtb-title {
  font-size: 15px;
  font-weight: 600;
}
.wbtb-sub {
  flex: 1;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wbtb-close {
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  font-size: 15px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
}
.wbtb-close:hover {
  background: var(--dsw-alias-bg-layer-2, #2c3138);
  color: var(--dsw-alias-label-primary, #e6e8eb);
}
.wbtb-tabs {
  display: flex;
  gap: 6px;
  padding: 10px 14px 0;
  flex-wrap: wrap;
}
.wbtb-tab {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1, #2c3138);
  background: transparent;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  font-size: 12.5px;
  cursor: pointer;
}
.wbtb-tab.on {
  background: var(--dsw-alias-bg-layer-1, #262b33);
  color: var(--dsw-alias-label-primary, #e6e8eb);
  border-color: var(--dsw-alias-brand-primary, #4f8cff);
}
.wbtb-agentsel {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px 0;
  flex-wrap: wrap;
}
.wbtb-agent-chip {
  padding: 4px 11px;
  border-radius: 999px;
  border: 1px solid var(--dsw-alias-border-l1, #2c3138);
  background: transparent;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  font-size: 12px;
  cursor: pointer;
}
.wbtb-agent-chip.on {
  background: var(--dsw-alias-bg-layer-1, #262b33);
  border-color: var(--dsw-alias-brand-primary, #4f8cff);
  color: var(--dsw-alias-label-primary, #e6e8eb);
}
.wbtb-agent-chip.off {
  opacity: 0.55;
}
.wbtb-search {
  margin: 10px 14px 0;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1, #2c3138);
  background: var(--dsw-alias-bg-layer-1, #262b33);
  color: inherit;
  font-size: 13px;
  outline: none;
}
.wbtb-search:focus {
  border-color: var(--dsw-alias-brand-primary, #4f8cff);
}
.wbtb-list {
  flex: 1;
  overflow: auto;
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wbtb-group {
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-alias-brand-primary, #f0b429);
  padding: 6px 2px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.wbtb-item {
  border: 1px solid var(--dsw-alias-border-l1, #2c3138);
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--dsw-alias-bg-layer-1, #262b33);
}
.wbtb-item.fav {
  border-color: rgba(240, 180, 41, 0.45);
}
.wbtb-item-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.wbtb-item-name {
  font-weight: 600;
  font-size: 13.5px;
}
.wbtb-fav {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  padding: 0 2px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  flex: none;
}
.wbtb-fav:hover {
  color: #f0b429;
  transform: scale(1.1);
}
.wbtb-fav.on {
  color: #f0b429;
}
.wbtb-badge {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid var(--dsw-alias-border-l2, #3a3f47);
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  white-space: nowrap;
}
.wbtb-badge.warn {
  border-color: var(--dsw-alias-state-warn-primary, #d9a020);
  color: var(--dsw-alias-state-warn-primary, #d9a020);
}
.wbtb-badge.ok {
  border-color: var(--dsw-alias-state-success-primary, #34b36b);
  color: var(--dsw-alias-state-success-primary, #34b36b);
}
.wbtb-badge.agent {
  border-color: var(--dsw-alias-brand-primary, #4f8cff);
  color: var(--dsw-alias-brand-primary, #4f8cff);
}
.wbtb-item-desc {
  margin-top: 6px;
  font-size: 12.5px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wbtb-item-meta {
  margin-top: 6px;
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  overflow-wrap: anywhere;
}
.wbtb-actions {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}
.wbtb-btn2 {
  padding: 4px 12px;
  border-radius: 7px;
  border: 1px solid var(--dsw-alias-border-l2, #3a3f47);
  background: transparent;
  color: var(--dsw-alias-label-primary, #e6e8eb);
  cursor: pointer;
  font-size: 12.5px;
}
.wbtb-btn2.primary {
  background: var(--dsw-alias-brand-primary, #4f8cff);
  border-color: var(--dsw-alias-brand-primary, #4f8cff);
  color: #fff;
}
.wbtb-btn2:hover {
  filter: brightness(1.12);
}
.wbtb-btn2.danger {
  border-color: var(--dsw-alias-state-error-primary, #ef6a6a);
  color: var(--dsw-alias-state-error-primary, #ef6a6a);
}
.wbtb-btn2.small {
  padding: 2px 9px;
  font-size: 12px;
}
.wbtb-preview {
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--dsw-alias-bg-base, #17191d);
  border: 1px solid var(--dsw-alias-border-l1, #2c3138);
  white-space: pre-wrap;
  font-size: 12px;
  max-height: 260px;
  overflow: auto;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
}
.wbtb-empty {
  padding: 24px;
  text-align: center;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  font-size: 13px;
}
.wbtb-err {
  color: var(--dsw-alias-state-error-primary, #ef6a6a);
  font-size: 12.5px;
  padding: 12px 14px;
}
.wbtb-note {
  margin: 10px 14px 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(52, 179, 107, 0.12);
  color: var(--dsw-alias-state-success-primary, #34b36b);
  font-size: 12.5px;
}
.wbtb-hint {
  margin: 10px 14px 0;
  padding: 7px 10px;
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2, #2c3138);
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  font-size: 12px;
  line-height: 1.5;
}
.wbtb-prompt {
  cursor: pointer;
}
.wbtb-addrow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 0;
}
.wbtb-form {
  border: 1px dashed var(--dsw-alias-border-l2, #3a3f47);
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--dsw-alias-bg-layer-1, #262b33);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wbtb-form-title {
  font-size: 13px;
  font-weight: 600;
}
.wbtb-field {
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}
.wbtb-tarea {
  resize: vertical;
  min-height: 56px;
  font: inherit;
  line-height: 1.5;
}
.wbtb-form-btns {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}
.wbtb-clickable {
  cursor: pointer;
}
.wbtb-clickable:hover {
  color: var(--dsw-alias-brand-primary, #4f8cff);
}
.wbtb-handle {
  flex: none;
  cursor: grab;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  font-size: 13px;
  padding: 0 3px;
  user-select: none;
  -webkit-user-select: none;
}
.wbtb-handle:active {
  cursor: grabbing;
}
.wbtb-dragging {
  opacity: 0.45;
}
.wbtb-drop-target {
  box-shadow: inset 0 2px 0 0 var(--dsw-alias-brand-primary, #4f8cff);
}
/* ---- settings ---- */
.wbtb-set-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 4px;
  flex-wrap: wrap;
}
.wbtb-set-title {
  font-size: 13px;
  font-weight: 600;
}
.wbtb-set-sub {
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
}
.wbtb-agent-row {
  border: 1px solid var(--dsw-alias-border-l1, #2c3138);
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--dsw-alias-bg-layer-1, #262b33);
}
.wbtb-agent-row.off {
  opacity: 0.6;
}
.wbtb-agent-name {
  font-weight: 600;
  font-size: 13.5px;
}
.wbtb-agent-root {
  margin-top: 4px;
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
.wbtb-agent-actions {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
.wbtb-check-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  cursor: pointer;
}
.wbtb-preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}
.wbtb-preset-card {
  border: 1px solid var(--dsw-alias-border-l1, #2c3138);
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--dsw-alias-bg-layer-1, #262b33);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.wbtb-preset-name {
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.wbtb-preset-desc {
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  line-height: 1.45;
}
.wbtb-preset-root {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
.wbtb-form-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.wbtb-form-label {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #9aa3ad);
}
.wbtb-form-checkrow {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
}
.wbtb-less {
  opacity: 0.8;
}
`;

    const DEFAULT_PROMPTS = [
      { id: 'prompt:default-0', name: '代码审查', text: '请以资深工程师视角审查这段代码，重点关注正确性、边界情况、可读性与性能，并给出具体可落地的修改建议。' },
      { id: 'prompt:default-1', name: '解释代码', text: '请用通俗易懂的语言解释这段代码的用途和工作原理，先讲整体流程，再讲关键细节。' },
      { id: 'prompt:default-2', name: '内容总结', text: '请对以下内容做简洁总结，提炼核心要点与结论，列出 3-5 条要点。' },
      { id: 'prompt:default-3', name: '翻译为英文', text: '请将以下内容翻译为地道、专业的英文，保持原意与语气。' },
      { id: 'prompt:default-4', name: '生成周报', text: '请基于以下工作内容生成一份周报，按「本周完成 / 进行中 / 下周计划 / 风险与求助」组织。' },
      { id: 'prompt:default-5', name: '文档草稿', text: '请将以下要点扩写为一份结构清晰、用词专业的中文文档草稿，包含标题层级和小节。' },
    ];

    const FAV_KEY = 'wbtb-favorites-v2';

    function migrateFavorites() {
      try {
        if (typeof localStorage === 'undefined') return []
        const cur = localStorage.getItem(FAV_KEY)
        if (cur) {
          const arr = JSON.parse(cur)
          return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : []
        }
        // migrate v1 ids (skill:/mcp:/prompt:) to the default 'wb' agent scope
        const old = localStorage.getItem('wbtb-favorites-v1')
        if (!old) return []
        const arr = JSON.parse(old)
        if (!Array.isArray(arr)) return []
        const mapped = arr
          .filter((x) => typeof x === 'string')
          .map((id) => {
            if (id.startsWith('skill:') || id.startsWith('mcp:') || id.startsWith('prompt:')) {
              return 'wb:' + id
            }
            return id
          })
        localStorage.setItem(FAV_KEY, JSON.stringify(mapped))
        return mapped
      } catch (e) {
        return []
      }
    }

    function apply(ctx) {
      injectCss(CSS)
      const slots = ctx.get('slots')
      if (!slots) return
      const h = React.createElement

      function rpc(endpoint, payload) {
        return fetch('/api/workbuddy-toolbox', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ endpoint: endpoint, payload: payload === undefined ? null : payload }),
        })
          .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then((data) => {
            if (data && data.ok) {
              const value = data.value && typeof data.value === 'object' ? data.value : {}
              return Object.assign({ ok: true }, value)
            }
            return { ok: false, error: (data && data.error) || '请求失败' }
          })
      }

      const store = (() => {
        let open = false
        let items = [] // flat items: skills + prompts, each tagged agentId/agentName
        let agents = [] // list-scope agents (scanned)
        let cfgAgents = [] // config-scope agents (full settings, incl. disabled)
        let presets = []
        let home = ''
        let configFile = ''
        let status = 'idle'
        let error = ''
        let actions = null
        let favorites = migrateFavorites()
        let selAgent = ''
        let draft = ''
        const listeners = new Set()
        const emit = () => {
          listeners.forEach((fn) => fn())
        }
        return {
          subscribe(fn) {
            listeners.add(fn)
            return () => {
              listeners.delete(fn)
            }
          },
          snapshot() {
            return {
              open,
              items,
              agents,
              cfgAgents,
              presets,
              home,
              configFile,
              status,
              error,
              favorites: favorites.slice(),
              selAgent,
            }
          },
          setActions(a) {
            actions = a
          },
          getActions() {
            return actions
          },
          setDraft(text) {
            const v = typeof text === 'string' ? text : ''
            if (draft !== v) {
              draft = v
              emit()
            }
          },
          getDraft() {
            return draft
          },
          openPanel() {
            if (!open) {
              open = true
              emit()
            }
          },
          closePanel() {
            if (open) {
              open = false
              emit()
            }
          },
          setLoading() {
            status = 'loading'
            items = []
            error = ''
            emit()
          },
          setReady(listData) {
            items = Array.isArray(listData.items) ? listData.items : []
            agents = Array.isArray(listData.agents) ? listData.agents : []
            status = 'ready'
            error = ''
            if (!selAgent && listData.defaultAgent) selAgent = listData.defaultAgent
            emit()
          },
          setConfig(cfg) {
            cfgAgents = Array.isArray(cfg.agents) ? cfg.agents : cfgAgents
            presets = Array.isArray(cfg.presets) ? cfg.presets : presets
            home = cfg.home || home
            configFile = cfg.configFile || configFile
            if (!selAgent && cfgAgents.length) {
              const first = cfgAgents.find((a) => a.enabled) || cfgAgents[0]
              if (first) selAgent = first.id
            }
            if (selAgent && !cfgAgents.some((a) => a.id === selAgent)) {
              const first = cfgAgents.find((a) => a.enabled) || cfgAgents[0]
              selAgent = first ? first.id : ''
            }
            emit()
          },
          setError(msg) {
            status = 'error'
            error = msg
            emit()
          },
          setSel(id) {
            const v = typeof id === 'string' ? id : ''
            if (selAgent !== v) {
              selAgent = v
              emit()
            }
          },
          toggleFavorite(id) {
            const idx = favorites.indexOf(id)
            if (idx >= 0) favorites.splice(idx, 1)
            else favorites.push(id)
            try {
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
              }
            } catch (e) {}
            emit()
          },
          isFavorite(id) {
            return favorites.indexOf(id) >= 0
          },
          updateList(kind, arr) {
            const drop = (x) => x.kind === kind && (selAgent ? x.agentId === selAgent : true)
            const rest = items.filter((x) => !drop(x))
            items = rest.concat(arr)
            emit()
          },
        }
      })()

      function useStore() {
        const [, force] = React.useState(0)
        React.useEffect(() => store.subscribe(() => force((n) => n + 1)), [])
        return store.snapshot()
      }

      function load() {
        store.setLoading()
        Promise.all([rpc('wb-list'), rpc('wb-config')])
          .then(([listRes, cfgRes]) => {
            if (listRes && listRes.ok) {
              store.setReady(listRes)
              if (cfgRes && cfgRes.ok) store.setConfig(cfgRes)
            } else {
              store.setError((listRes && listRes.error) || '加载失败')
              if (cfgRes && cfgRes.ok) store.setConfig(cfgRes)
            }
          })
          .catch((err) => store.setError(String((err && err.message) || err)))
      }

      function buildSkillDraft(item) {
        const name = item.name || item.folder || ''
        return '"' + name + '":"' + item.path + '"\n任务结束后回写经验到使用的SKILL.md'
      }

      const selectDraft = (state) => (state && typeof state.draft === 'string' ? state.draft : '')

      function ToolbarButton(props) {
        /* Newer harness versions drop the `input` prop and hand session occupants the
           `useInput` selector hook instead; keep the `input` fallback for older ones. */
        const useInput = props && props.useInput
        const draftNow =
          typeof useInput === 'function'
            ? useInput(selectDraft)
            : props && props.input && typeof props.input.draft === 'string'
              ? props.input.draft
              : ''
        React.useEffect(() => {
          if (props && props.inputActions) store.setActions(props.inputActions)
          store.setDraft(draftNow)
        })
        const onClick = () => {
          store.setDraft(draftNow)
          if (store.snapshot().open) {
            store.closePanel()
            return
          }
          load()
          store.openPanel()
        }
        return h(
          'button',
          {
            className: 'wbtb-btn',
            title: 'WorkBuddy 工具箱（发行版）：列出各 Agent 的 Skill / 常用 Prompt，设置中可配置文件夹并一键添加预设 Agent',
            onClick: onClick,
          },
          '工具箱'
        )
      }

      function AgentBadge(props) {
        return h('span', { className: 'wbtb-badge agent' }, props.name)
      }

      function ItemRow(props) {
        const { item, onInvoke, onPreview, preview, favorite, onToggleFavorite, onDragDown, onDragEnd, onRowDragOver, isDragging, isDrop, showAgent, onMigrate, canMigrate } = props
        const badges = []
        if (showAgent) badges.push(h(AgentBadge, { key: 'a', name: item.agentName }))
        if (item.kind === 'skill' && item.tag) {
          badges.push(h('span', { key: 't', className: 'wbtb-badge warn' }, item.tag))
        }
        const meta =
          item.kind === 'skill' ? h('div', { className: 'wbtb-item-meta' }, item.path) : null
        return h(
          'div',
          {
            className:
              'wbtb-item' + (favorite ? ' fav' : '') + (isDragging ? ' wbtb-dragging' : '') + (isDrop ? ' wbtb-drop-target' : ''),
            'data-wb-id': item.id || item.name,
            onDragOver: onRowDragOver,
          },
          [
            h('div', { className: 'wbtb-item-head' }, [
              h(
                'span',
                {
                  className: 'wbtb-handle',
                  draggable: true,
                  title: '按住拖动排序',
                  onDragStart: (e) => onDragDown(e, item),
                  onDragEnd: onDragEnd,
                },
                '⠿'
              ),
              h(
                'button',
                {
                  className: 'wbtb-fav' + (favorite ? ' on' : ''),
                  title: favorite ? '取消收藏' : '收藏（置顶）',
                  onClick: (e) => {
                    e.stopPropagation()
                    onToggleFavorite(item)
                  },
                },
                favorite ? '★' : '☆'
              ),
              h('span', { className: 'wbtb-item-name' }, item.name),
              ...badges,
              h('div', { style: { flex: 1 } }),
              h('button', { className: 'wbtb-btn2 primary', onClick: () => onInvoke(item) }, '调用'),
              canMigrate
                ? h('button', { className: 'wbtb-btn2', title: '迁移/复制到另一个 Agent', onClick: () => onMigrate(item) }, '迁移')
                : null,
              item.kind === 'skill'
                ? h(
                    'button',
                    { className: 'wbtb-btn2', onClick: () => onPreview(item) },
                    preview && preview.id === item.id ? '收起' : '预览'
                  )
                : null,
            ]),
            item.description ? h('div', { className: 'wbtb-item-desc' }, item.description) : null,
            meta,
            preview && preview.id === item.id && preview.text
              ? h('pre', { className: 'wbtb-preview' }, preview.text)
              : null,
          ]
        )
      }

      function PromptRow(props) {
        const { item, onPick, onEdit, onDelete, armed, favorite, onToggleFavorite, onDragDown, onDragEnd, onRowDragOver, isDragging, isDrop, showAgent, canManage } = props
        return h(
          'div',
          {
            className:
              'wbtb-item wbtb-prompt' + (isDragging ? ' wbtb-dragging' : '') + (isDrop ? ' wbtb-drop-target' : ''),
            'data-wb-id': item.id || item.name,
            onDragOver: onRowDragOver,
          },
          [
            h('div', { className: 'wbtb-item-head' }, [
              h(
                'span',
                {
                  className: 'wbtb-handle',
                  draggable: true,
                  title: '按住拖动排序',
                  onDragStart: (e) => onDragDown(e, item),
                  onDragEnd: onDragEnd,
                },
                '⠿'
              ),
              h(
                'button',
                {
                  className: 'wbtb-fav' + (favorite ? ' on' : ''),
                  title: favorite ? '取消收藏' : '收藏（置顶）',
                  onClick: (e) => {
                    e.stopPropagation()
                    onToggleFavorite(item)
                  },
                },
                favorite ? '★' : '☆'
              ),
              h('span', { className: 'wbtb-item-name wbtb-clickable', title: '点击填入输入框', onClick: () => onPick(item) }, item.name),
              ...(showAgent ? [h(AgentBadge, { key: 'a', name: item.agentName })] : []),
              h('div', { style: { flex: 1 } }),
              canManage
                ? h('button', { className: 'wbtb-btn2 danger', onClick: () => onDelete(item, armed) }, armed ? '确认删除？' : '删除')
                : null,
              canManage ? h('button', { className: 'wbtb-btn2', onClick: () => onEdit(item) }, '编辑') : null,
              h('button', { className: 'wbtb-btn2 primary', onClick: () => onPick(item) }, '填入'),
            ]),
            item.text
              ? h(
                  'div',
                  {
                    className: 'wbtb-item-desc wbtb-clickable',
                    title: '点击填入输入框',
                    onClick: () => onPick(item),
                    style: { whiteSpace: 'pre-wrap', WebkitLineClamp: 3 },
                  },
                  item.text
                )
              : null,
          ]
        )
      }

      /* ---------------- Settings components ---------------- */

      function SettingsBody(props) {
        const s = useStore()
        const [form, setForm] = React.useState(null) // { mode:'add'|'edit', index, agent }
        const [cfgErr, setCfgErr] = React.useState('')
        const [cfgNote, setCfgNote] = React.useState('')
        const [saving, setSaving] = React.useState(false)
        const [armedDel, setArmedDel] = React.useState(null)
        const [bulk, setBulk] = React.useState(null)
        const [probe, setProbe] = React.useState(null)
        const [touched, setTouched] = React.useState({})
        const [browse, setBrowse] = React.useState(null)

        const buildAgent = (raw) => ({
          id: typeof raw.id === 'string' ? raw.id : '',
          name: typeof raw.name === 'string' ? raw.name : '',
          root: typeof raw.root === 'string' ? raw.root : '',
          enabled: raw.enabled !== false,
          skillsDirs: Array.isArray(raw.skillsDirs) ? raw.skillsDirs : [],
          promptsFiles: Array.isArray(raw.promptsFiles) ? raw.promptsFiles : [],
          sections: {
            skills: !raw.sections || raw.sections.skills !== false,
            prompts: !raw.sections || raw.sections.prompts !== false,
          },
        })

        const save = (nextAgents, note) => {
          setSaving(true)
          setCfgErr('')
          rpc('wb-config-save', { agents: nextAgents })
            .then((res) => {
              setSaving(false)
              if (res && res.ok) {
                store.setConfig({ agents: res.agents })
                setForm(null)
                setArmedDel(null)
                setCfgNote(note || '已保存')
                load()
              } else {
                setCfgErr((res && res.error) || '保存失败')
              }
            })
            .catch((err) => {
              setSaving(false)
              setCfgErr(String((err && err.message) || err))
            })
        }

        const toggleEnabled = (index) => {
          const next = s.cfgAgents.map((a, i) => (i === index ? { ...a, enabled: !a.enabled } : a))
          save(next, next[index].enabled ? '已启用 ' + next[index].name : '已停用 ' + next[index].name)
        }

        const removeAgent = (index) => {
          if (armedDel !== index) {
            setArmedDel(index)
            return
          }
          setArmedDel(null)
          const next = s.cfgAgents.filter((_, i) => i !== index)
          save(next, '已删除')
        }

        const saveForm = () => {
          if (!form) return
          const a = form.agent
          if (!a.name.trim()) {
            setCfgErr('请输入名称')
            return
          }
          if (!a.root.trim()) {
            setCfgErr('请输入根目录')
            return
          }
          const next = s.cfgAgents.map((x, i) => (i === form.index ? buildAgent(a) : x))
          if (form.mode === 'add') {
            next.push(buildAgent(a))
          }
          save(next, form.mode === 'add' ? '已添加 Agent' : '已保存')
        }

        /* bulk migration: copy all skills of one agent into another */
        const bulkTargets = (fromId) =>
          (Array.isArray(s.cfgAgents) ? s.cfgAgents : []).filter(
            (a) =>
              a.enabled &&
              a.id !== fromId &&
              a.sections &&
              a.sections.skills &&
              Array.isArray(a.skillsDirs) &&
              a.skillsDirs.length
          )

        const runBulk = () => {
          if (!bulk || !bulk.target) {
            setCfgErr('请选择目标 Agent')
            return
          }
          setBulk({ ...bulk, running: true })
          setCfgErr('')
          rpc('wb-migrate', {
            kind: 'all',
            agentId: bulk.fromId,
            targetAgentId: bulk.target,
            move: false,
            overwrite: bulk.overwrite,
          })
            .then((res) => {
              setBulk(null)
              if (res && res.ok) {
                const su = res.summary || {}
                const sk = su.skillsCopied || 0
                const skipList = su.skillsSkipped || []
                let msg = '配套迁移完成：技能 ' + sk + ' 项已复制'
                if (skipList.length) {
                  msg +=
                    '；跳过 ' +
                    skipList.length +
                    ' 项：' +
                    skipList
                      .slice(0, 5)
                      .map((n) => n.name + (n.reason ? '（' + n.reason + '）' : ''))
                      .join('、') +
                    (skipList.length > 5 ? '…' : '')
                }
                setCfgNote(msg)
                load()
              } else {
                setCfgErr((res && res.error) || '迁移失败')
              }
            })
            .catch((err) => {
              setBulk(null)
              setCfgErr(String((err && err.message) || err))
            })
        }

        /* ----- automation: root input => auto-detect layout, fill the form ----- */
        const formRef = React.useRef(null)
        const touchedRef = React.useRef({})
        formRef.current = form
        touchedRef.current = touched

        const applyProbe = (res, root) => {
          const cur = formRef.current
          if (!cur || cur.mode !== 'add' || (cur.agent.root || '') !== root) return
          const t = touchedRef.current
          const det = (res && res.detected) || { skillsDirs: [], promptsFiles: [] }
          const agent = { ...cur.agent }
          let changed = false
          if (!t.name && !agent.name.trim() && res && res.name) {
            agent.name = res.name
            changed = true
          }
          const arrEq = (a, b) => JSON.stringify(a || []) === JSON.stringify(b || [])
          if (!t.skillsDirs && (det.skillsDirs || []).length && !arrEq(det.skillsDirs, agent.skillsDirs)) {
            agent.skillsDirs = det.skillsDirs
            changed = true
          }
          if (!t.promptsFiles && (det.promptsFiles || []).length && !arrEq(det.promptsFiles, agent.promptsFiles)) {
            agent.promptsFiles = det.promptsFiles
            changed = true
          }
          const setSec = (k, v) => {
            if (t[k]) return
            if (agent.sections[k] !== v) {
              agent.sections = { ...agent.sections, [k]: v }
              changed = true
            }
          }
          setSec('skills', (det.skillsDirs || []).length > 0)
          setSec('prompts', (det.promptsFiles || []).length > 0)
          if (changed) setForm({ ...cur, agent })
        }

        React.useEffect(() => {
          if (!form || form.mode !== 'add') {
            setProbe(null)
            setBrowse(null)
            return
          }
          const root = form.agent.root || ''
          if (!root.trim()) {
            setProbe(null)
            return
          }
          let cancelled = false
          const timer = setTimeout(() => {
            rpc('wb-probe-root', { root })
              .then((res) => {
                if (cancelled) return
                setProbe({
                  root,
                  exists: !!(res && res.ok && res.exists),
                  name: (res && res.name) || '',
                  detected:
                    (res && res.detected) || { skillsDirs: [], promptsFiles: [] },
                  probing: false,
                })
                applyProbe(res, root)
              })
              .catch(() => {
                if (!cancelled) setProbe({ root, exists: false, name: '', detected: {}, probing: false })
              })
          }, 350)
          return () => {
            cancelled = true
            clearTimeout(timer)
          }
        }, [form && form.mode, form && form.agent.root && form.agent.root.trim()])

        /* ----- directory browser (no manual path typing) ----- */
        const openBrowse = () => {
          const start = (form && form.agent.root && form.agent.root.trim()) || '~'
          setBrowse({ base: '', parent: '', home: '', dirs: [], loading: true, path: start })
          rpc('wb-browse-dirs', { path: start })
            .then((res) => {
              if (res && res.ok) setBrowse({ ...res, loading: false })
              else setBrowse(null)
            })
            .catch(() => setBrowse(null))
        }

        const browseInto = (d, e) => {
          e.stopPropagation()
          setBrowse({ base: '', parent: '', home: '', dirs: [], loading: true, path: d.full })
          rpc('wb-browse-dirs', { path: d.full })
            .then((res) => {
              if (res && res.ok) setBrowse({ ...res, loading: false })
              else setBrowse((b) => ({ ...b, loading: false }))
            })
            .catch(() => setBrowse(null))
        }

        const browseUp = () => {
          if (!browse || !browse.parent || browse.parent === browse.base) return
          rpc('wb-browse-dirs', { path: browse.parent }).then((res) => {
            if (res && res.ok) setBrowse({ ...res, loading: false })
          })
        }

        const useThisDir = () => {
          if (!browse || !browse.base) return
          const dir = browse.base === browse.home ? '~' : browse.base
          setTouched({})
          setForm({ ...form, agent: { ...form.agent, root: dir } })
          setBrowse(null)
        }

        /* ----- one-click: add every preset whose folder exists on this machine ----- */
        const autoAddDetected = () => {
          const missing = (s.presets || []).filter(
            (p) => p.exists && !(s.cfgAgents || []).some((a) => a.root === p.root)
          )
          if (!missing.length) {
            setCfgNote('暂无新的可自动添加的预设（均已添加或目录不存在）')
            return
          }
          const next = (s.cfgAgents || []).concat(
            missing.map((p) =>
              buildAgent({
                id: p.id + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                name: p.name,
                root: p.root,
                enabled: true,
                skillsDirs: p.skillsDirs || [],
                promptsFiles: p.promptsFiles || [],
                sections: p.sections,
              })
            )
          )
          save(
            next,
            '已自动添加 ' +
              missing.length +
              ' 个检测到的 Agent：' +
              missing.map((p) => p.name).join('、')
          )
        }

        const setField = (key) => (ev) => {
          const value = ev && ev.target ? ev.target.value : ''
          const agent = { ...form.agent }
          if (key === 'enabled') {
            agent.enabled = ev.target.checked
          } else if (key === 'skills' || key === 'prompts') {
            agent.sections = { ...(agent.sections || {}), [key]: ev.target.checked }
            setTouched((t) => ({ ...t, [key]: true }))
          } else if (key === 'root') {
            agent[key] = value
            setTouched({}) // new root → re-run auto-detection for the whole form
          } else {
            agent[key] = value
            setTouched((t) => ({ ...t, [key]: true }))
          }
          setForm({ ...form, agent })
        }

        const splitLines = (v) =>
          String(v || '')
            .split(/[\r\n]+/)
            .map((x) => x.trim())
            .filter(Boolean)

        // preset add
        const addPreset = (preset) => {
          const id = preset.id + '-' + Date.now().toString(36)
          const agent = buildAgent({
            id: id,
            name: preset.name,
            root: preset.root,
            enabled: true,
            skillsDirs: preset.skillsDirs || [],
            promptsFiles: preset.promptsFiles || [],
            sections: preset.sections,
          })
          const next = s.cfgAgents.concat([agent])
          save(next, '已添加：' + preset.name + '（可继续在下方编辑根目录等设置）')
        }

        // start editing an agent
        const startEdit = (index) => {
          setCfgErr('')
          setForm({ mode: 'edit', index, agent: buildAgent(s.cfgAgents[index]) })
        }

        const startAdd = () => {
          setCfgErr('')
          setForm({
            mode: 'add',
            index: -1,
            agent: buildAgent({ id: '', name: '', root: '~', enabled: true, skillsDirs: ['skills'], promptsFiles: ['prompts.json'], sections: { skills: true, prompts: true } }),
          })
        }

        const rows = s.cfgAgents.map((a, i) => {
          const secNames = []
          if (a.sections.skills) secNames.push('技能')
          if (a.sections.prompts) secNames.push('Prompt')
          return h('div', { key: a.id, className: 'wbtb-agent-row' + (a.enabled ? '' : ' off') }, [
            h('div', { className: 'wbtb-item-head' }, [
              h('span', { className: 'wbtb-agent-name' }, a.name),
              a.enabled
                ? h('span', { className: 'wbtb-badge ok' }, '已启用')
                : h('span', { className: 'wbtb-badge warn' }, '已停用'),
              h('span', { className: 'wbtb-badge ' + (a.exists ? 'ok' : 'warn') }, a.exists ? '目录存在' : '目录缺失'),
              ...secNames.map((x) => h('span', { key: x, className: 'wbtb-badge' }, x)),
              h('div', { style: { flex: 1 } }),
              h('button', { className: 'wbtb-btn2 small', title: '把该 Agent 的全部技能复制到另一个 Agent', onClick: () => setBulk({ key: a.id, fromId: a.id, target: '', overwrite: false, running: false }) }, '⇒ 迁移全部'),
              h('button', { className: 'wbtb-btn2 small', onClick: () => startEdit(i) }, '编辑'),
              h('button', { className: 'wbtb-btn2 small danger', onClick: () => removeAgent(i) }, armedDel === i ? '确认删除？' : '删除'),
            ]),
            h('div', { className: 'wbtb-agent-root' }, a.root),
            h('div', { className: 'wbtb-agent-actions' }, [
              h('label', { className: 'wbtb-check-label' }, [
                h('input', { type: 'checkbox', checked: a.enabled, onChange: () => toggleEnabled(i) }),
                '启用',
              ]),
            ]),
            bulk && bulk.key === a.id
              ? h('div', { className: 'wbtb-form', key: 'bulk' }, [
                  h('div', { className: 'wbtb-form-title' }, '配套迁移：' + a.name + ' → 目标 Agent（技能复制）'),
                  h('div', { className: 'wbtb-form-row' }, [
                    h('span', { className: 'wbtb-form-label' }, '目标 Agent'),
                    h(
                      'select',
                      {
                        className: 'wbtb-search wbtb-field',
                        value: bulk.target,
                        disabled: bulk.running,
                        onChange: (e) => setBulk({ ...bulk, target: e.target.value }),
                      },
                      bulkTargets(a.id).map((t) => h('option', { key: t.id, value: t.id }, t.name + '（' + t.root + '）'))
                    ),
                  ]),
                  h('div', { className: 'wbtb-form-checkrow' }, [
                    h('label', { className: 'wbtb-check-label' }, [
                      h('input', {
                        type: 'checkbox',
                        checked: bulk.overwrite,
                        disabled: bulk.running,
                        onChange: (e) => setBulk({ ...bulk, overwrite: e.target.checked }),
                      }),
                      '覆盖同名冲突',
                    ]),
                    h('span', { className: 'wbtb-set-sub' }, '同名已存在项将跳过，除非勾选覆盖'),
                  ]),
                  h('div', { className: 'wbtb-form-btns' }, [
                    h('button', { className: 'wbtb-btn2 primary', onClick: runBulk, disabled: bulk.running }, bulk.running ? '迁移中…' : '开始迁移'),
                    h('button', { className: 'wbtb-btn2', onClick: () => setBulk(null) }, '取消'),
                  ]),
                ])
              : null,
          ])
        })

        const presetCards = s.presets.map((p) =>
          h('div', { key: p.id, className: 'wbtb-preset-card' }, [
            h('div', { className: 'wbtb-preset-name' }, [
              p.name,
              p.exists
                ? h('span', { className: 'wbtb-badge ok' }, '本机可用')
                : h('span', { className: 'wbtb-badge warn' }, '目录缺失'),
            ]),
            p.desc ? h('div', { className: 'wbtb-preset-desc' }, p.desc) : null,
            h('div', { className: 'wbtb-preset-root' }, p.rootResolved || p.root),
            h('div', { style: { display: 'flex', justifyContent: 'flex-end' } }, [
              h('button', { className: 'wbtb-btn2 small primary', onClick: () => addPreset(p) }, '＋ 添加此 Agent'),
            ]),
          ])
        )

        const formEl = form
          ? h('div', { className: 'wbtb-form', key: 'agent-form' }, [
              h('div', { className: 'wbtb-form-title' }, form.mode === 'add' ? '添加 Agent' : '编辑 Agent：' + (form.agent.name || '')),
              h('div', { className: 'wbtb-form-row' }, [
                h('span', { className: 'wbtb-form-label' }, '名称'),
                h('input', { className: 'wbtb-search wbtb-field', value: form.agent.name, placeholder: '例如 WorkBuddy / Claude Code', onChange: setField('name') }),
              ]),
              h('div', { className: 'wbtb-form-row' }, [
                h('span', { className: 'wbtb-form-label' }, '根目录（支持 ~、%USERPROFILE% 等；输入后自动识别目录布局）'),
                h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, [
                  h('input', { className: 'wbtb-search wbtb-field', value: form.agent.root, placeholder: '~/.workbuddy', onChange: setField('root') }),
                  h('button', { className: 'wbtb-btn2 small', title: '目录浏览器：免手输路径', onClick: openBrowse }, '浏览…'),
                ]),
                probe && probe.root === (form.agent.root || '')
                  ? h('div', { className: 'wbtb-set-sub' }, [
                      probe.probing
                        ? '正在识别目录布局…'
                        : probe.exists
                          ? '已自动识别：' +
                            [
                              (probe.detected.skillsDirs || []).length
                                ? '技能 ' + probe.detected.skillsDirs.join('、')
                                : '',
                              (probe.detected.promptsFiles || []).length
                                ? 'Prompt ' + probe.detected.promptsFiles.join('、')
                                : '',
                            ].filter(Boolean).join('；') || '未识别到内容（可手动填写下方路径）'
                          : h('span', { className: 'wbtb-set-sub' }, '目录不存在（仍可保存，扫描时自动跳过）'),
                    ])
                  : null,
                browse
                  ? h('div', { className: 'wbtb-hint', style: { display: 'flex', flexDirection: 'column', gap: 6 } }, [
                      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' } }, [
                        h('span', { className: 'wbtb-set-sub' }, browse.loading ? '加载中…' : String(browse.base || '')),
                        h('div', { style: { flex: 1 } }),
                        h(
                          'button',
                          { className: 'wbtb-btn2 small primary', onClick: useThisDir, disabled: browse.loading || !browse.base },
                          '使用此目录'
                        ),
                        h('button', { className: 'wbtb-btn2 small', onClick: () => setBrowse(null) }, '关闭'),
                      ]),
                      browse.loading
                        ? null
                        : h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, [
                            browse.parent && browse.parent !== browse.base
                              ? h('button', { className: 'wbtb-btn2 small', onClick: browseUp }, '⬆ 上级')
                              : null,
                            (browse.dirs || []).map((d) =>
                              h('button', { key: d.full, className: 'wbtb-btn2 small', title: d.full, onClick: (e) => browseInto(d, e) }, d.name)
                            ),
                          ]),
                      (browse.dirs || []).length === 0 && !browse.loading
                        ? h('div', { className: 'wbtb-set-sub' }, '（无子目录）')
                        : null,
                    ])
                  : null,
              ]),
              h('div', { className: 'wbtb-form-checkrow' }, [
                h('label', { className: 'wbtb-check-label' }, [
                  h('input', { type: 'checkbox', checked: form.agent.enabled, onChange: setField('enabled') }),
                  '启用',
                ]),
                h('label', { className: 'wbtb-check-label' }, [
                  h('input', { type: 'checkbox', checked: form.agent.sections.skills, onChange: setField('skills') }),
                  '扫描技能',
                ]),
                h('label', { className: 'wbtb-check-label' }, [
                  h('input', { type: 'checkbox', checked: form.agent.sections.prompts, onChange: setField('prompts') }),
                  '常用 Prompt',
                ]),
              ]),
              h('div', { className: 'wbtb-form-row' }, [
                h('span', { className: 'wbtb-form-label' }, '技能目录（每行一个，相对根目录或绝对路径，含 SKILL.md 的子目录会被列出）'),
                h('textarea', { className: 'wbtb-tarea wbtb-field', value: form.agent.skillsDirs.join('\n'), rows: 2, placeholder: 'skills\nconnectors/skills', onChange: (ev) => { setTouched((t) => ({ ...t, skillsDirs: true })); const agent = { ...form.agent, skillsDirs: splitLines(ev.target.value) }; setForm({ ...form, agent }) } }),
              ]),
              h('div', { className: 'wbtb-form-row' }, [
                h('span', { className: 'wbtb-form-label' }, 'Prompt 文件（每行一个，取第一个存在的；保存时写入第一个）'),
                h('textarea', { className: 'wbtb-tarea wbtb-field', value: form.agent.promptsFiles.join('\n'), rows: 2, placeholder: 'prompts.json', onChange: (ev) => { setTouched((t) => ({ ...t, promptsFiles: true })); const agent = { ...form.agent, promptsFiles: splitLines(ev.target.value) }; setForm({ ...form, agent }) } }),
              ]),
              h('div', { className: 'wbtb-form-btns' }, [
                h('button', { className: 'wbtb-btn2 primary', onClick: saveForm }, saving ? '保存中…' : '保存'),
                h('button', { className: 'wbtb-btn2', onClick: () => { setForm(null); setCfgErr('') } }, '取消'),
              ]),
            ])
          : null

        return [
          h('div', { className: 'wbtb-set-head', key: 'head' }, [
            h('span', { className: 'wbtb-set-title' }, 'Agent 文件夹设置'),
            h(
              'span',
              { className: 'wbtb-set-sub' },
              '输入根目录即自动识别布局；或用目录浏览器选择。配置文件：' + (s.configFile || '')
            ),
            h('div', { style: { flex: 1 } }),
            h('button', { className: 'wbtb-btn2', title: '把本机已存在的预设目录（如 ~/.workbuddy）一键添加为 Agent', onClick: autoAddDetected }, '⚡ 自动添加已检测预设'),
            h('button', { className: 'wbtb-btn2 primary', onClick: startAdd }, '＋ 添加 Agent'),
          ]),
          s.cfgAgents.length === 0
            ? h('div', { className: 'wbtb-empty', key: 'empty' }, '暂无 Agent，请添加或从预设选择')
            : h('div', { key: 'rows', style: { display: 'flex', flexDirection: 'column', gap: 8 } }, rows),
          formEl,
          cfgErr ? h('div', { className: 'wbtb-err', key: 'err' }, cfgErr) : null,
          cfgNote ? h('div', { className: 'wbtb-note', key: 'note' }, cfgNote) : null,
          h('div', { className: 'wbtb-set-head', key: 'preset-head' }, [
            h('span', { className: 'wbtb-set-title' }, '从预设添加（几个可用的设置选项）'),
            h('span', { className: 'wbtb-set-sub' }, '预设会自动套用该 Agent 的目录布局，根目录可随后编辑'),
          ]),
          h('div', { className: 'wbtb-preset-grid', key: 'presets' }, presetCards),
        ]
      }

      /* ---------------- Overlay ---------------- */

      function Overlay(props) {
        const s = useStore()
        const [tab, setTab] = React.useState('skills')
        const [q, setQ] = React.useState('')
        const [preview, setPreview] = React.useState(null)
        const [note, setNote] = React.useState('')
        const [form, setForm] = React.useState(null)
        const [saving, setSaving] = React.useState(false)
        const [formErr, setFormErr] = React.useState('')
        const [armedDelete, setArmedDelete] = React.useState(null)
        const listRef = React.useRef(null)
        const [drag, setDrag] = React.useState(null)
        const [hoverIdx, setHoverIdx] = React.useState(-1)
        const [mig, setMig] = React.useState(null)

        React.useEffect(() => {
          if (s.open) setQ('')
        }, [s.open])

        if (!s.open) return null

        const items = Array.isArray(s.items) ? s.items : []
        const showAgent = !s.selAgent
        const itemSel = (it) => (s.selAgent ? it.agentId === s.selAgent : true)
        const skills = items.filter((it) => it.kind === 'skill' && itemSel(it))
        const prompts = items.filter((it) => it.kind === 'prompt' && itemSel(it))

        const selCfg = s.cfgAgents.find((a) => a.id === s.selAgent) || null
        const canManagePrompts = !!s.selAgent && !!selCfg && selCfg.sections.prompts && (selCfg.promptsFiles || []).length > 0

        const switchTab = (t) => {
          setTab(t)
          setQ('')
          setForm(null)
          setArmedDelete(null)
          setDrag(null)
          setHoverIdx(-1)
          setMig(null)
        }

        const fillDraft = (text) => {
          const actions = store.getActions()
          if (!actions || typeof actions.setDraft !== 'function') {
            setNote('未获取到输入框句柄，请关闭后重试')
            return
          }
          const cur = store.getDraft() || ''
          const merged = cur && cur.trim() ? cur + '\n\n' + text : text
          actions.setDraft(merged)
          store.closePanel()
        }

        const onInvoke = (item) => {
          fillDraft(buildSkillDraft(item))
        }

        const onPickPrompt = (item) => {
          fillDraft(item.text)
        }

        const persistPrompts = (agentId, arr) => {
          setSaving(true)
          setFormErr('')
          rpc('wb-prompts-save', { agentId: agentId, prompts: arr })
            .then((res) => {
              setSaving(false)
              if (res && res.ok) {
                store.updateList('prompt', res.prompts || [])
                setForm(null)
              } else {
                setFormErr((res && res.error) || '保存失败')
              }
            })
            .catch((err) => {
              setSaving(false)
              setFormErr(String((err && err.message) || err))
            })
        }

        const savePrompt = () => {
          if (!form || !s.selAgent) return
          const name = String(form.name || '').trim()
          const text = String(form.text || '').trim()
          if (!name) {
            setFormErr('请输入名称')
            return
          }
          if (!text) {
            setFormErr('请输入 Prompt 内容')
            return
          }
          const arr = prompts.slice()
          if (form.mode === 'add') {
            arr.push({ name: name, text: text })
          } else {
            const idx = arr.findIndex((x) => x.id === form.itemId || x.name === form.origName)
            if (idx < 0) {
              setFormErr('未找到该项，已取消')
              setForm(null)
              return
            }
            arr[idx] = { name: name, text: text }
          }
          persistPrompts(s.selAgent, arr)
        }

        const startEdit = (item) => {
          setArmedDelete(null)
          setFormErr('')
          setForm({ mode: 'edit', itemId: item.id, origName: item.name, name: item.name, text: item.text })
        }

        const deletePrompt = (item, confirmed) => {
          if (!confirmed) {
            setArmedDelete(item.id)
            return
          }
          setArmedDelete(null)
          const arr = prompts.slice()
          const idx = arr.findIndex((x) => x.id === item.id)
          if (idx < 0) return
          arr.splice(idx, 1)
          persistPrompts(item.agentId, arr)
        }

        const onPreview = (item) => {
          if (preview && preview.id === item.id) {
            setPreview(null)
            return
          }
          setPreview({ id: item.id, text: '加载中…', loading: true })
          rpc('wb-preview', { path: item.path })
            .then((res) => {
              setPreview({
                id: item.id,
                text: res && res.ok ? String(res.preview || '') : '预览失败：' + ((res && res.error) || ''),
                loading: false,
              })
            })
            .catch((err) => setPreview({ id: item.id, text: '预览失败：' + String((err && err.message) || err), loading: false }))
        }

        const onToggleFavorite = (item) => store.toggleFavorite(item.id)

        /* ----- skill migration between agents ----- */
        const migrateCandidates = (item) =>
          (Array.isArray(s.cfgAgents) ? s.cfgAgents : []).filter((a) => {
            if (!a.enabled || a.id === (item && item.agentId)) return false
            return !!(a.sections && a.sections.skills && Array.isArray(a.skillsDirs) && a.skillsDirs.length)
          })

        const onMigrateRequest = (item) => {
          const cands = migrateCandidates(item)
          if (!cands.length) {
            setNote('没有可迁移的目标 Agent（需已启用且配置了技能目录）')
            return
          }
          setNote('')
          setMig({ item, kind: item.kind, cands, target: cands[0].id, move: false, overwrite: false, running: false })
        }

        const runMigrate = () => {
          if (!mig || !mig.target) {
            setNote('请选择目标 Agent')
            return
          }
          setMig({ ...mig, running: true })
          rpc('wb-migrate', {
            kind: mig.kind,
            itemId: mig.item.id,
            agentId: mig.item.agentId,
            targetAgentId: mig.target,
            move: mig.move,
            overwrite: mig.overwrite,
          })
            .then((res) => {
              setMig(null)
              if (res && res.ok) {
                const su = res.summary || {}
                const done = (su.skillsCopied || 0) + (su.skillsMoved || 0)
                const skip = (su.skillsSkipped || []).length
                const extra = skip > 0 ? '；' + skip + ' 项跳过（目标同名/未配置目录等）' : ''
                setNote('迁移完成：' + done + ' 项已' + (mig.move ? '移动' : '复制') + extra)
                load()
              } else {
                setNote('迁移失败：' + ((res && res.error) || '未知错误'))
              }
            })
            .catch((err) => {
              setMig(null)
              setNote('迁移失败：' + String((err && err.message) || err))
            })
        }

        const ql = q.trim().toLowerCase()
        const filterList = (list) =>
          ql
            ? list.filter((it) =>
                (it.name + ' ' + (it.description || '') + ' ' + (it.agentName || ''))
                  .toLowerCase()
                  .includes(ql)
              )
            : list

        const filtered = filterList(skills)
        const fPrompts = ql ? prompts.filter((p) => (p.name + ' ' + p.text + ' ' + (p.agentName || '')).toLowerCase().includes(ql)) : prompts

        const baseFor = (kind) => (kind === 'prompts' ? prompts : skills)

        const startDrag = (e, item) => {
          e.stopPropagation()
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', item.id || item.name)
            e.dataTransfer.effectAllowed = 'move'
          }
          setDrag({ id: item.id || item.name, kind: tab })
        }

        const onRowDragOver = (e) => {
          if (!drag) return
          e.preventDefault()
          e.stopPropagation()
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
          const el = listRef.current
          if (!el) return
          const rows = Array.prototype.slice.call(el.querySelectorAll('[data-wb-id]'))
          let idx = rows.length
          for (let i = 0; i < rows.length; i++) {
            const r = rows[i].getBoundingClientRect()
            if (e.clientY < r.top + r.height / 2) {
              idx = i
              break
            }
          }
          if (idx !== hoverIdx) setHoverIdx(idx)
        }

        const endDrag = () => {
          setDrag(null)
          setHoverIdx(-1)
        }

        const dropAt = (e) => {
          if (!drag) return
          e.preventDefault()
          e.stopPropagation()
          const kind = drag.kind
          const base = baseFor(kind)
          const fromIdx = base.findIndex((x) => (x.id || x.name) === drag.id)
          setDrag(null)
          setHoverIdx(-1)
          if (fromIdx < 0) return
          const src = kind === 'prompts' ? fPrompts : filtered
          const visible = src
            .filter((x) => store.isFavorite(x.id || x.name))
            .concat(src.filter((x) => !store.isFavorite(x.id || x.name)))
          let toIdx = fromIdx
          if (hoverIdx >= 0 && hoverIdx < visible.length) {
            const target = visible[hoverIdx]
            toIdx = base.findIndex((x) => (x.id || x.name) === (target.id || target.name))
            if (toIdx < 0) toIdx = fromIdx
            else if (fromIdx < toIdx) toIdx -= 1
          } else if (hoverIdx >= visible.length) {
            toIdx = base.length - 1
          }
          if (toIdx === fromIdx) return
          const arr = base.slice()
          const [moved] = arr.splice(fromIdx, 1)
          arr.splice(toIdx, 0, moved)
          store.updateList(kind, arr)
          if (kind === 'prompts' && s.selAgent) persistPrompts(s.selAgent, arr)
        }

        /* ----- prompts tab body ----- */
        const promptBody = (() => {
          if (s.selAgent && !canManagePrompts) {
            return h(
              'div',
              { className: 'wbtb-hint' },
              selCfg && selCfg.sections.prompts
                ? '该 Agent 的 Prompt 展示/保存需要配置 promptsFiles（设置页可修改，例如 prompts.json）。'
                : '该 Agent 已关闭「常用 Prompt」（设置页可开启）。'
            )
          }
          return [
            h(
              'div',
              { className: 'wbtb-addrow', key: 'add' },
              [
                h(
                  'button',
                  {
                    className: 'wbtb-btn2 primary',
                    onClick: () => {
                      if (!s.selAgent) {
                        setNote('请先在顶部选择具体的 Agent 后再添加 Prompt')
                        return
                      }
                      setArmedDelete(null)
                      setFormErr('')
                      setForm({ mode: 'add', name: '', text: '' })
                    },
                  },
                  '＋ 添加 Prompt'
                ),
                !s.selAgent
                  ? h('span', { className: 'wbtb-sub', style: { fontSize: 12 } }, '当前为「全部」视图：选择一个 Agent 后可新建 / 编辑 / 删除')
                  : null,
              ]
            ),
            form
              ? h('div', { className: 'wbtb-form', key: 'form' }, [
                  h('div', { className: 'wbtb-form-title' }, form.mode === 'add' ? '添加 Prompt' : '编辑 Prompt'),
                  h('input', {
                    className: 'wbtb-search wbtb-field',
                    value: form.name,
                    placeholder: '名称',
                    onChange: (e) => setForm({ ...form, name: e.target.value }),
                  }),
                  h('textarea', {
                    className: 'wbtb-tarea wbtb-field',
                    value: form.text,
                    placeholder: 'Prompt 内容…',
                    rows: 4,
                    onChange: (e) => setForm({ ...form, text: e.target.value }),
                  }),
                  formErr ? h('div', { className: 'wbtb-err', style: { padding: 0 } }, formErr) : null,
                  h('div', { className: 'wbtb-form-btns' }, [
                    h('button', { className: 'wbtb-btn2 primary', onClick: savePrompt }, saving ? '保存中…' : '保存'),
                    h('button', { className: 'wbtb-btn2', onClick: () => { setForm(null); setFormErr('') } }, '取消'),
                  ]),
                ])
              : null,
            fPrompts.length === 0
              ? h('div', { className: 'wbtb-empty', key: 'empty' }, ql ? '没有匹配项' : s.selAgent ? '暂无 Prompt，点击上方「＋ 添加 Prompt」创建一个' : '暂无 Prompt')
              : (() => {
                  const pFavs = fPrompts.filter((p) => store.isFavorite(p.id || p.name))
                  const pRests = fPrompts.filter((p) => !store.isFavorite(p.id || p.name))
                  const pAll = pFavs.concat(pRests)
                  const pDropId = hoverIdx >= 0 && hoverIdx < pAll.length ? pAll[hoverIdx].id || pAll[hoverIdx].name : null
                  const rows = []
                  if (pFavs.length) {
                    rows.push(h('div', { className: 'wbtb-group', key: 'g-fav' }, '★ 已收藏 (' + pFavs.length + ')'))
                    pFavs.forEach((p) =>
                      rows.push(
                        h(PromptRow, {
                          key: p.id || p.name,
                          item: p,
                          onPick: onPickPrompt,
                          onEdit: startEdit,
                          onDelete: deletePrompt,
                          armed: armedDelete === p.id,
                          favorite: true,
                          onToggleFavorite: onToggleFavorite,
                          onDragDown: startDrag,
                          onDragEnd: endDrag,
                          onRowDragOver: onRowDragOver,
                          isDragging: drag && drag.id === (p.id || p.name),
                          isDrop: (p.id || p.name) === pDropId,
                          showAgent: showAgent,
                          canManage: canManagePrompts,
                        })
                      )
                    )
                  }
                  if (pRests.length) {
                    if (pFavs.length) rows.push(h('div', { className: 'wbtb-group', key: 'g-rest' }, '其他'))
                    pRests.forEach((p) =>
                      rows.push(
                        h(PromptRow, {
                          key: p.id || p.name,
                          item: p,
                          onPick: onPickPrompt,
                          onEdit: startEdit,
                          onDelete: deletePrompt,
                          armed: armedDelete === p.id,
                          favorite: false,
                          onToggleFavorite: onToggleFavorite,
                          onDragDown: startDrag,
                          onDragEnd: endDrag,
                          onRowDragOver: onRowDragOver,
                          isDragging: drag && drag.id === (p.id || p.name),
                          isDrop: (p.id || p.name) === pDropId,
                          showAgent: showAgent,
                          canManage: canManagePrompts,
                        })
                      )
                    )
                  }
                  return rows
                })(),
          ]
        })()

        const itemBody =
          filtered.length === 0
            ? h('div', { className: 'wbtb-empty' }, ql ? '没有匹配项' : '未找到 Skill')
            : (() => {
                const favs = filtered.filter((it) => store.isFavorite(it.id))
                const rests = filtered.filter((it) => !store.isFavorite(it.id))
                const all = favs.concat(rests)
                const dropId = hoverIdx >= 0 && hoverIdx < all.length ? all[hoverIdx].id || all[hoverIdx].name : null
                const rows = []
                if (favs.length) {
                  rows.push(h('div', { className: 'wbtb-group', key: 'g-fav' }, '★ 已收藏 (' + favs.length + ')'))
                  favs.forEach((it) =>
                    rows.push(
                      h(ItemRow, {
                        key: it.id,
                        item: it,
                        onInvoke: onInvoke,
                        onPreview: onPreview,
                        favorite: true,
                        onToggleFavorite: onToggleFavorite,
                        preview: preview && preview.id === it.id ? preview : null,
                        onDragDown: startDrag,
                        onDragEnd: endDrag,
                        onRowDragOver: onRowDragOver,
                        isDragging: drag && drag.id === it.id,
                        isDrop: (it.id || it.name) === dropId,
                        showAgent: showAgent,
                        onMigrate: onMigrateRequest,
                        canMigrate: migrateCandidates(it).length > 0,
                      })
                    )
                  )
                }
                if (rests.length) {
                  if (favs.length) rows.push(h('div', { className: 'wbtb-group', key: 'g-rest' }, '其他'))
                  rests.forEach((it) =>
                    rows.push(
                      h(ItemRow, {
                        key: it.id,
                        item: it,
                        onInvoke: onInvoke,
                        onPreview: onPreview,
                        favorite: false,
                        onToggleFavorite: onToggleFavorite,
                        preview: preview && preview.id === it.id ? preview : null,
                        onDragDown: startDrag,
                        onDragEnd: endDrag,
                        onRowDragOver: onRowDragOver,
                        isDragging: drag && drag.id === it.id,
                        isDrop: (it.id || it.name) === dropId,
                        showAgent: showAgent,
                        onMigrate: onMigrateRequest,
                        canMigrate: migrateCandidates(it).length > 0,
                      })
                    )
                  )
                }
                return rows
              })()

        const body =
          s.status === 'loading'
            ? h('div', { className: 'wbtb-empty' }, '加载中…')
            : s.status === 'error'
              ? h(
                  'div',
                  { className: 'wbtb-err' },
                  h('div', null, [String(s.error), h('button', { className: 'wbtb-btn2', onClick: load, style: { marginLeft: 8 } }, '重试')])
                )
              : tab === 'settings'
                ? h(SettingsBody, {})
                : tab === 'prompts'
                  ? promptBody
                  : itemBody

        const migBlock = mig
          ? h('div', { className: 'wbtb-form', key: 'mig' }, [
              h('div', { className: 'wbtb-form-title' }, '迁移：' + mig.item.name + '（技能）'),
              h('div', { className: 'wbtb-form-row' }, [
                h('span', { className: 'wbtb-form-label' }, '目标 Agent'),
                h(
                  'select',
                  {
                    className: 'wbtb-search wbtb-field',
                    value: mig.target,
                    disabled: mig.running,
                    onChange: (e) => setMig({ ...mig, target: e.target.value }),
                  },
                  mig.cands.map((a) => h('option', { key: a.id, value: a.id }, a.name + '（' + a.root + '）'))
                ),
              ]),
              h('div', { className: 'wbtb-form-checkrow' }, [
                h('label', { className: 'wbtb-check-label' }, [
                  h('input', {
                    type: 'checkbox',
                    checked: mig.move,
                    disabled: mig.running,
                    onChange: (e) => setMig({ ...mig, move: e.target.checked }),
                  }),
                  '迁移后删除源（移动）',
                ]),
                h('label', { className: 'wbtb-check-label' }, [
                  h('input', {
                    type: 'checkbox',
                    checked: mig.overwrite,
                    disabled: mig.running,
                    onChange: (e) => setMig({ ...mig, overwrite: e.target.checked }),
                  }),
                  '覆盖同名冲突',
                ]),
              ]),
              h('div', { className: 'wbtb-form-btns' }, [
                h(
                  'button',
                  { className: 'wbtb-btn2 primary', onClick: runMigrate, disabled: mig.running },
                  mig.running ? '迁移中…' : '执行迁移'
                ),
                h('button', { className: 'wbtb-btn2', onClick: () => setMig(null) }, '取消'),
              ]),
            ])
          : null

        const totalAgents = s.agents.length
        const headerSummary =
          s.status === 'ready'
            ? totalAgents + ' 个 Agent · 技能 ' + skills.length + ' · Prompt ' + prompts.length
            : ''

        const agentChips = s.agents.map((a) => {
          const on = s.selAgent === a.id
          return h(
            'button',
            {
              key: a.id,
              className: 'wbtb-agent-chip' + (on ? ' on' : '') + (a.enabled ? '' : ' off'),
              title: a.enabled ? a.root : a.root + '（已停用）',
              onClick: () => store.setSel(on ? '' : a.id),
            },
            a.name + (a.enabled ? '' : ' (停用)')
          )
        })

        return h('div', { className: 'wbtb-mask', onClick: () => store.closePanel() }, [
          h('div', { className: 'wbtb-panel', onClick: (e) => e.stopPropagation() }, [
            h('div', { className: 'wbtb-head' }, [
              h('span', { className: 'wbtb-title' }, 'WorkBuddy 工具箱'),
              h('span', { className: 'wbtb-sub' }, headerSummary),
              h('button', { className: 'wbtb-close', onClick: () => store.closePanel() }, '✕'),
            ]),
            h('div', { className: 'wbtb-tabs' }, [
              h('button', { className: 'wbtb-tab' + (tab === 'skills' ? ' on' : ''), onClick: () => switchTab('skills') }, '技能 (' + skills.length + ')'),
              h('button', { className: 'wbtb-tab' + (tab === 'prompts' ? ' on' : ''), onClick: () => switchTab('prompts') }, '常用 Prompt (' + prompts.length + ')'),
              h('button', { className: 'wbtb-tab' + (tab === 'settings' ? ' on' : ''), onClick: () => switchTab('settings') }, '⚙ 设置'),
            ]),
            tab !== 'settings' && totalAgents > 0
              ? h('div', { className: 'wbtb-agentsel' }, [
                  h(
                    'button',
                    { className: 'wbtb-agent-chip' + (!s.selAgent ? ' on' : ''), onClick: () => store.setSel('') },
                    '全部'
                  ),
                  ...agentChips,
                ])
              : null,
            h('input', {
              className: 'wbtb-search',
              placeholder: '搜索名称 / 描述 / Prompt / Agent…',
              value: q,
              onChange: (e) => setQ(e.target.value),
            }),
            note ? h('div', { className: 'wbtb-note' }, note) : null,
            h(
              'div',
              {
                className: 'wbtb-list',
                ref: listRef,
                onDragOver: (e) => {
                  if (drag) e.preventDefault()
                },
                onDrop: dropAt,
              },
              [migBlock, body]
            ),
          ]),
        ])
      }

      slots.inject('conversation.input.left', () =>
        slots.register(
          { name: 'conversation.input.left', id: 'workbuddy-toolbox-button', order: 100, label: () => '工具箱' },
          (props) => h(ToolbarButton, props)
        )
      )

      slots.inject('shell.overlay', () =>
        slots.register(
          { name: 'shell.overlay', id: 'workbuddy-toolbox-overlay', order: 1000 },
          (props) => h(Overlay, props)
        )
      )
    }

    exports.name = 'workbuddy-toolbox'
    exports.inject = ['slots']
    exports.apply = apply
    return module.exports
  },
})