import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { contrastRatio } from '@telltale/shared'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readScssAssignments(source: string): Record<string, string> {
  const values: Record<string, string> = {}
  for (const match of source.matchAll(/^\$([a-z0-9-]+):\s*([^;]+);/gm)) {
    const name = match[1]
    const value = match[2]
    if (!name || !value) continue
    values[name] = value.trim()
  }
  return values
}

describe('design tokens', () => {
  const tokens = readScssAssignments(
    readFileSync(path.join(root, 'src/styles/tokens.scss'), 'utf8'),
  )

  it('keeps type size and hit targets inside the ADHD rules', () => {
    const body = Number.parseInt(tokens['font-body'] ?? '', 10)
    const emphasis = Number.parseInt(tokens['font-emphasis'] ?? '', 10)
    const hit = Number.parseInt(tokens['hit-min'] ?? '', 10)
    assert.ok(body >= 20 && body <= 24)
    assert.ok(emphasis >= 24 && emphasis <= 32)
    assert.ok(hit >= 56)
  })

  it('keeps text contrast at 4.5:1 or better', () => {
    const text = tokens['color-text'] ?? ''
    const background = tokens['color-bg'] ?? ''
    const surface = tokens['color-surface'] ?? ''
    const primary = tokens['color-primary'] ?? ''
    const onPrimary = tokens['color-on-primary'] ?? ''
    const press = tokens['color-press'] ?? ''
    assert.ok(contrastRatio(text, background) >= 4.5)
    assert.ok(contrastRatio(text, surface) >= 4.5)
    assert.ok(contrastRatio(onPrimary, primary) >= 4.5)
    assert.ok(contrastRatio(text, press) >= 4.5)
  })
})

describe('ChildShell', () => {
  const source = readFileSync(path.join(root, 'src/components/ChildShell.vue'), 'utf8')
  const template = source.split('<style')[0] ?? ''

  it('places help, rest, and one solid advance button', () => {
    assert.match(template, /我需要帮助/)
    assert.match(template, /休息一下/)
    assert.equal(template.split('btn-primary').length - 1, 1)
    assert.match(source, /min-width:\s*var\(--hit-min\)/)
    assert.match(source, /min-height:\s*var\(--hit-min\)/)
  })
})

describe('emphasis type', () => {
  it('lets the English line use the emphasis size', () => {
    const task = readFileSync(path.join(root, 'src/styles/task.scss'), 'utf8')
    assert.match(task, /p\.task__en\s*\{[^}]*font-size:\s*var\(--font-emphasis\)/)
    assert.match(task, /min-height:\s*var\(--hit-min\)/)
  })
})

describe('reduced motion', () => {
  it('defines a mixin and uses it', () => {
    const mixin = readFileSync(path.join(root, 'src/styles/motion.scss'), 'utf8')
    const globalCss = readFileSync(path.join(root, 'src/styles/global.scss'), 'utf8')
    const task = readFileSync(path.join(root, 'src/styles/task.scss'), 'utf8')
    assert.match(mixin, /@mixin reduced-motion/)
    assert.match(mixin, /prefers-reduced-motion:\s*reduce/)
    assert.match(globalCss, /@include reduced-motion/)
    assert.match(task, /@include reduced-motion/)
  })
})
