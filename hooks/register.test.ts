import { expect, test } from 'claude-code/testing'
import { bar, compact, listPlugins, windowLabel } from './register'

test('one row per name, on if any copy is enabled', () => {
  expect(listPlugins(['sp@a', 'sp@b', 'x@m'], { 'sp@b': true, 'c@x': false })).toEqual([
    { name: 'c', isOn: false }, { name: 'sp', isOn: true }, { name: 'x', isOn: false },
  ])
})

test('bar fills by halves and keeps its width', () => {
  expect(bar(0, 10)).toBe('          ')
  expect(bar(50, 10)).toBe('█████     ')
  expect(bar(5, 10)).toBe('▌         ')
  expect(bar(150, 10)).toBe('██████████')
})

test('labels and compact numbers', () => {
  expect(windowLabel('five_hour')).toBe('Sesión actual')
  expect(windowLabel('seven_day_fable')).toBe('Semana (Fable)')
  expect(compact(236741061)).toBe('236.7M')
})

import { contextGrid } from './register'

test('context grid: 1% per cell, used first, buffer last, free between', () => {
  const grid = contextGrid([
    { name: 'Messages', tokens: 86000, color: 'claude', kind: 'used' },
    { name: 'MCP', tokens: 700, color: 'success', kind: 'used' },
    { name: 'Free space', tokens: 880000, color: 'x', kind: 'free' },
    { name: 'Autocompact buffer', tokens: 33000, color: 'x', kind: 'buffer' },
  ], 1_000_000)
  const flat = grid.flat().map(c => c.glyph).join('')
  expect(grid.length).toBe(10)
  expect(flat.length).toBe(100)
  expect(flat).toBe('⛁'.repeat(9) + '⛀' + '⛶'.repeat(87) + '⛝'.repeat(3))
})

import { walkFrame } from './register'

test('walk frame: Clawd at x on rows 0-2, floor on row 3, legs alternate', () => {
  const cols = 12
  const glyphs = (w: Uint32Array) =>
    Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: cols }, (_, c) => String.fromCodePoint(w[(r * cols + c) * 3]!)).join(''))
  const a = glyphs(walkFrame(cols, 2, 0))
  expect(a[0]).toBe('   ▐▛███▜▌  ')
  expect(a[1]).toBe('  ▝▜█████▛▘ ')
  expect(a[2]).toBe('    ▘▘ ▝▝   ')
  expect(a[3]).toBe('▔'.repeat(cols))
  expect(glyphs(walkFrame(cols, 2, 1))[2]).toBe('    ▝▘ ▘▝   ')
  expect(walkFrame(cols, 2, 0)[(1 * cols + 2) * 3 + 1]).toBe(0xd97757)
})
