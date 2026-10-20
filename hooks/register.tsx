import type { EngineInterface, Register } from 'claude-code'

const PANE = 'plugins'
const OPEN = { id: PANE, title: 'Session Info', columns: 26 }
const BAR = 22

// one row per plugin name (marketplace dropped); on if any copy is enabled
export function listPlugins(installed: string[], enabled: Record<string, unknown>) {
  const rows = new Map<string, boolean>()
  for (const id of [...installed, ...Object.keys(enabled)]) {
    const name = id.split('@')[0]!
    rows.set(name, rows.get(name) === true || enabled[id] === true)
  }
  return [...rows].sort().map(([name, isOn]) => ({ name, isOn }))
}

// same look as /usage: full blocks plus a half block, padded to the width
export function bar(percent: number, width = BAR) {
  const halves = Math.round((Math.min(100, Math.max(0, percent)) / 100) * width * 2)
  const s = '█'.repeat(Math.floor(halves / 2)) + (halves % 2 ? '▌' : '')
  return s.padEnd(width, ' ')
}

export function windowLabel(kind: string) {
  if (kind === 'five_hour') return 'Sesión actual'
  if (kind === 'seven_day') return 'Semana (todos)'
  const model = kind.match(/^seven_day_(.+)$/)?.[1]
  return model ? `Semana (${model[0]!.toUpperCase()}${model.slice(1)})` : kind
}

function resets(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const time = d.toLocaleTimeString('es-GT', { hour: 'numeric', minute: '2-digit' })
  return d.toDateString() === new Date().toDateString()
    ? time
    : `${d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })} ${time}`
}

export function compact(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`
  return String(n)
}

async function loadPlugins($: EngineInterface, home: string) {
  let installed: string[] = []
  try {
    installed = Object.keys(JSON.parse(await $.fs.read(`${home}/.claude/plugins/installed_plugins.json`)).plugins ?? {})
  } catch {}
  const enabled = ((await $.settings.read()).enabledPlugins ?? {}) as Record<string, unknown>
  return listPlugins(installed, enabled)
}

type Category = { name: string; tokens: number; color: string; kind: string }
type Cell = { glyph: string; color: string }

const NAMES: Record<string, string> = {
  'System prompt': 'Sistema', 'System tools': 'Herramientas', 'MCP tools': 'MCP',
  'MCP server instructions': 'MCP instr.', 'Memory files': 'Memoria', 'Custom agents': 'Agentes',
  Messages: 'Mensajes', 'Free space': 'Libre', 'Autocompact buffer': 'Reserva',
}
export const shortName = (name: string) => NAMES[name] ?? name

// /context's grid: one cell per 1% of the window; used categories first, the buffer last, free between
export function contextGrid(categories: Category[], window: number): Cell[][] {
  const pct = (t: number) => (t / window) * 100
  const used: Cell[] = []
  for (const c of categories.filter(c => c.kind === 'used' && c.tokens > 0)) {
    const p = pct(c.tokens)
    for (let i = 0; i < Math.max(1, Math.round(p)); i++) used.push({ glyph: p < 1 ? '⛀' : '⛁', color: c.color })
  }
  const buffer = categories.find(c => c.kind === 'buffer')
  const tail: Cell[] = Array.from({ length: buffer ? Math.round(pct(buffer.tokens)) : 0 }, () => ({ glyph: '⛝', color: 'inactive' }))
  const cells = used.slice(0, 100 - tail.length)
  while (cells.length < 100 - tail.length) cells.push({ glyph: '⛶', color: 'inactive' })
  cells.push(...tail)
  return Array.from({ length: 10 }, (_, r) => cells.slice(r * 10, r * 10 + 10))
}

// Clawd, the Claude Code mascot; two leg poses for the walk
const CLAWD = [' ▐▛███▜▌ ', '▝▜█████▛▘']
const LEGS = ['  ▘▘ ▝▝  ', '  ▝▘ ▘▝  ']
const ORANGE = 0xd97757
const FLOOR = 0x555555
const BLACK = 0x000000
const WALK = 4 // rows: 3 of Clawd, 1 of floor
let walkColumns = 0

// one frame of the walk as Raster cells: Clawd at column x, standing on the floor line
export function walkFrame(columns: number, x: number, step: number) {
  const art = [...CLAWD, LEGS[step % 2]!]
  const words = new Uint32Array(columns * WALK * 3)
  for (let row = 0; row < WALK; row++)
    for (let col = 0; col < columns; col++) {
      const i = (row * columns + col) * 3
      const ch = row < WALK - 1 ? art[row]?.[col - x] : undefined
      const isClawd = ch !== undefined && ch !== ' '
      const isFloor = row === WALK - 1 && !isClawd
      words[i] = isClawd ? ch.codePointAt(0)! : isFloor ? 0x2594 : 0x20 // ▔
      words[i + 1] = isClawd ? ORANGE : FLOOR
      words[i + 2] = BLACK
    }
  return words
}

// the engine's runtime has Uint8Array#toBase64; TS's lib doesn't type it yet
const toCells = (words: Uint32Array) => (new Uint8Array(words.buffer) as unknown as { toBase64(): string }).toBase64()

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'session-info', description: 'Show the Session Info sidebar' })
    void $.ui.open(OPEN)
    // ponytail: polls every 2s since no settings-change event exists; redraws only when plugins change
    let last = ''
    const home = $.plugin.root.split('/.claude/')[0]!
    // ponytail: walks back and forth at ~3 fps via blit (no full redraw)
    let tick = 0
    $.clock.every(350, () => {
      const span = Math.max(1, walkColumns - CLAWD[0]!.length)
      const pos = tick % (span * 2)
      const x = pos < span ? pos : span * 2 - pos
      if (walkColumns) void $.ui.blit({ requestId: PANE, key: 'clawd', cells: toCells(walkFrame(walkColumns, x, tick)) })
      tick++
    })
    $.clock.every(2000, async () => {
      const now = JSON.stringify(await loadPlugins($, home)) + (await $.session.model())
      if (now !== last) { last = now; $.ui.invalidate('ui.render') }
    })
    return next(e)
  })

  // usage moved (a limit window, context or cost): redraw
  on('session.measure', ($, e, next) => {
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('command.run', { command: 'session-info' }, async $ => {
    await $.ui.open(OPEN)
    return { text: 'Session Info opened.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const ui = $.ui.resolve(e)
    const { Box, Text } = ui
    const Raster = 'Raster' in ui ? ui.Raster : undefined // terminal only
    walkColumns = e.props.bodyColumns
    const home = $.plugin.root.split('/.claude/')[0]!
    const [list, usage, version, model] = await Promise.all([
      loadPlugins($, home), $.session.usage({ breakdown: 'summary' }), $.session.version(), $.session.model(),
    ])

    return (
      <Box flexDirection="column" backgroundColor="#000000" minHeight={e.props.scroll.bodyRows}>
        <Text bold color="#FCEE0A">SESSION INFO</Text>
        <Text color="#FCEE0A">{'━'.repeat(e.props.bodyColumns)}</Text>
        <Text bold>{list.filter(p => p.isOn).length}/{list.length} plugins activos</Text>
        {list.map(p => (
          <Text color={p.isOn ? 'success' : 'inactive'}>{p.isOn ? '●' : '○'} {p.name}</Text>
        ))}

        <Text> </Text>
        <Text bold>Uso</Text>
        {usage.rateLimits.length === 0 && <Text dimColor>Sin lectura todavía</Text>}
        {usage.rateLimits.map(w => (
          <Box flexDirection="column" marginBottom={1}>
            <Text>{windowLabel(w.kind)}</Text>
            <Text><Text color="#FCEE0A" backgroundColor="#1a1a00">{bar(w.percentUsed)}</Text></Text>
            <Text dimColor>{w.percentUsed}% · {resets(w.resetsAt)}</Text>
          </Box>
        ))}
        {usage.cost && <Text dimColor>Costo sesión ${usage.cost.usd.toFixed(2)}</Text>}

        <Text> </Text>
        <Text bold>Contexto</Text>
        {usage.context.breakdown ? (
          <Box flexDirection="column">
            {contextGrid(usage.context.breakdown.categories, usage.context.breakdown.rawMaxTokens).map(row => (
              <Text>{row.map(c => <Text color={c.color}>{c.glyph} </Text>)}</Text>
            ))}
            <Text dimColor>{compact(usage.context.breakdown.totalTokens)}/{compact(usage.context.breakdown.rawMaxTokens)} ({usage.context.breakdown.percentage}%)</Text>
            {usage.context.breakdown.categories.filter(c => c.kind !== 'deferred' && c.tokens > 0).map(c => (
              <Text>
                <Text color={c.kind === 'used' ? c.color : 'inactive'}>{c.kind === 'free' ? '⛶' : c.kind === 'buffer' ? '⛝' : '⛁'}</Text>
                <Text dimColor> {shortName(c.name)} {compact(c.tokens)}</Text>
              </Text>
            ))}
          </Box>
        ) : (
          <Text dimColor>{usage.context.percent ?? 0}% usado</Text>
        )}


        <Text> </Text>
        <Text bold>Status</Text>
        <Text dimColor>v{version.version}</Text>
        <Text dimColor>{model}</Text>
        <Box flexGrow={1} />
        {Raster && walkColumns > 0 && <Raster key="clawd" columns={walkColumns} rows={WALK} cells={toCells(walkFrame(walkColumns, 0, 0))} />}
      </Box>
    )
  })
}
