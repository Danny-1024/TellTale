import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import type { ChildExercise } from '@telltale/shared'
import {
  canSubmit,
  emptyDraft,
  pairMeaning,
  pairWord,
  selectChoice,
  submissionBody,
  type ChoiceDraft,
  type MatchDraft,
} from '../src/learn/drafts'
import { nextListenIndex, nextPracticeIndex, parseStepIndex } from '../src/learn/steps'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const zhExercise: ChildExercise = {
  id: 'zh',
  type: 'zh_to_en',
  prompt: '公园',
  options: ['park', 'ball'],
  hint: '草地',
}

const matchExercise: ChildExercise = {
  id: 'match',
  type: 'match',
  prompt: '配对',
  words: ['dog', 'ball', 'mom'],
  meanings: ['球', '妈妈', '狗'],
  hint: '妈妈',
}

describe('lesson steps', () => {
  it('parses sentence and question indexes', () => {
    assert.equal(parseStepIndex('1'), 1)
    assert.equal(parseStepIndex('12'), 12)
    assert.equal(parseStepIndex('0'), null)
    assert.equal(parseStepIndex('01'), null)
    assert.equal(parseStepIndex('nope'), null)
    assert.equal(parseStepIndex(['3']), 3)
  })

  it('moves to the next sentence or question and then stops', () => {
    assert.equal(nextListenIndex(4, 5), 5)
    assert.equal(nextListenIndex(5, 5), null)
    assert.equal(nextPracticeIndex(2, 3), 3)
    assert.equal(nextPracticeIndex(3, 3), null)
  })
})

describe('practice drafts', () => {
  it('lets a choice change until it is submitted', () => {
    const draft = emptyDraft(zhExercise)
    assert.equal(draft.kind, 'choice')
    if (draft.kind !== 'choice') return
    const picked = selectChoice(draft, 'ball')
    assert.equal(picked.choice, 'ball')
    assert.equal(canSubmit(zhExercise, picked), true)
    const changed = selectChoice(picked, 'park')
    assert.equal(changed.choice, 'park')
    const submitted: ChoiceDraft = { ...changed, submitted: true, correct: false }
    assert.equal(selectChoice(submitted, 'ball'), submitted)
    assert.equal(canSubmit(zhExercise, submitted), false)
    assert.deepEqual(submissionBody(zhExercise, changed), { type: 'zh_to_en', choice: 'park' })
  })

  it('pairs by tapping English and then Chinese, and can change a pair', () => {
    const draft = emptyDraft(matchExercise)
    assert.equal(draft.kind, 'match')
    if (draft.kind !== 'match') return
    assert.equal(pairMeaning(draft, '狗'), draft)
    const pending = pairWord(draft, 'dog')
    assert.equal(pending.pendingWord, 'dog')
    const paired = pairMeaning(pending, '妈妈')
    assert.deepEqual(paired.pairs, [{ word: 'dog', zh: '妈妈' }])
    const again = pairWord(paired, 'dog')
    assert.equal(again.pendingWord, 'dog')
    assert.deepEqual(again.pairs, [])
    const fixed = pairMeaning(again, '狗')
    const withBall = pairMeaning(pairWord(fixed, 'ball'), '球')
    const complete = pairMeaning(pairWord(withBall, 'mom'), '妈妈')
    assert.equal(canSubmit(matchExercise, complete), true)
    const submitted: MatchDraft = { ...complete, submitted: true, correct: true }
    assert.equal(pairWord(submitted, 'dog'), submitted)
    assert.deepEqual(submissionBody(matchExercise, complete), {
      type: 'match',
      pairs: [
        { word: 'dog', zh: '狗' },
        { word: 'ball', zh: '球' },
        { word: 'mom', zh: '妈妈' },
      ],
    })
  })
})

describe('phase 1 boundaries', () => {
  it('does not autoplay, time the child, or ship answer keys in the client', () => {
    const files = [
      ...readdirSync(path.join(root, 'src/views')).map((name) =>
        path.join(root, 'src/views', name),
      ),
      ...readdirSync(path.join(root, 'src/learn')).map((name) =>
        path.join(root, 'src/learn', name),
      ),
      ...readdirSync(path.join(root, 'src/stores')).map((name) =>
        path.join(root, 'src/stores', name),
      ),
    ]
    const source = files.map((file) => readFileSync(file, 'utf8')).join('\n')
    assert.doesNotMatch(source, /autoplay/)
    assert.doesNotMatch(source, /setInterval|setTimeout/)
    assert.doesNotMatch(source, /answerKey/)
    assert.doesNotMatch(source, /❌|✕|#ff0000|#f00\b/i)
    assert.match(readFileSync(path.join(root, 'src/learn/audio.ts'), 'utf8'), /preload = 'none'/)
    const book = readFileSync(path.join(root, 'src/learn/book.ts'), 'utf8')
    assert.match(book, /BOOK_WIDTH = 1080/)
    assert.match(book, /示例示意/)
    assert.doesNotMatch(book, /devicePixelRatio/)
  })
})
