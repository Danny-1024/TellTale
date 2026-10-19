import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { countEnglishWords, DIFFICULTY_WORD_LIMIT } from '@telltale/shared'
import type { FastifyInstance } from 'fastify'
import { resolveContentRoot } from '../src/contentRoot'
import { buildServer } from '../src/server'

function collectKeys(value: unknown, keys = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, keys)
    return keys
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      keys.add(key)
      collectKeys(child, keys)
    }
  }
  return keys
}

describe('sample lesson', () => {
  let app: FastifyInstance

  before(async () => {
    app = await buildServer({ logger: false })
  })

  after(async () => {
    await app.close()
  })

  it('lists the local sample', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/samples' })
    assert.equal(response.statusCode, 200)
    const body = response.json<{ samples: { id: string; title: string }[] }>()
    assert.equal(body.samples.length, 1)
    assert.equal(body.samples[0]?.id, 'park-morning')
    assert.equal(body.samples[0]?.title, '公园的早晨')
  })

  it('serves a child lesson without answer keys and with local media', async () => {
    const rawPath = path.join(resolveContentRoot(), 'park-morning', 'lesson.json')
    const rawText = readFileSync(rawPath, 'utf8')
    assert.match(rawText, /answerKey/)

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/samples/park-morning',
    })
    assert.equal(response.statusCode, 200)
    const lesson = response.json<{
      id: string
      difficulty: 'L' | 'M' | 'H'
      sentences: {
        index: number
        en: string
        imageUrl: string
        audioUrl: string
      }[]
      vocabCards: { example?: string }[]
      exercises: {
        type: string
        words?: string[]
        meanings?: string[]
        replaySentenceIndex?: number
      }[]
    }>()

    const keys = collectKeys(lesson)
    assert.equal(keys.has('answerKey'), false)
    assert.equal(keys.has('pairs'), false)
    assert.equal(keys.has('source'), false)

    assert.equal(lesson.sentences.length, 5)
    assert.equal(lesson.vocabCards.length, 5)
    assert.deepEqual(
      lesson.exercises.map((exercise) => exercise.type),
      ['zh_to_en', 'match', 'cloze'],
    )

    const limit = DIFFICULTY_WORD_LIMIT[lesson.difficulty]
    for (const sentence of lesson.sentences) {
      assert.ok(countEnglishWords(sentence.en) <= limit)
    }
    for (const card of lesson.vocabCards) {
      if (card.example) assert.ok(countEnglishWords(card.example) <= limit)
    }

    const match = lesson.exercises.find((exercise) => exercise.type === 'match')
    assert.ok(match && match.type === 'match')
    assert.deepEqual(match.words, ['dog', 'ball', 'mom'])
    assert.deepEqual(match.meanings, ['球', '妈妈', '狗'])
    assert.deepEqual(
      lesson.exercises.map((exercise) => exercise.replaySentenceIndex),
      [1, 2, 5],
    )

    for (const sentence of lesson.sentences) {
      const image = await app.inject({ method: 'GET', url: sentence.imageUrl })
      assert.equal(image.statusCode, 200)
      assert.match(String(image.headers['content-type']), /image/)
      assert.match(image.body, /<svg/)

      const audio = await app.inject({ method: 'GET', url: sentence.audioUrl })
      assert.equal(audio.statusCode, 200)
      assert.match(String(audio.headers['content-type']), /audio/)
      assert.ok(audio.rawPayload.byteLength > 4000)
      assert.equal(audio.rawPayload.subarray(0, 4).toString(), 'RIFF')
    }
  })

  it('grades a submission without returning the answer key', async () => {
    const wrongChoice = await app.inject({
      method: 'POST',
      url: '/api/v1/samples/park-morning/exercises/park-zh-park/submit',
      payload: { type: 'zh_to_en', choice: 'ball' },
    })
    assert.equal(wrongChoice.statusCode, 200)
    const wrongBody = wrongChoice.json<{ correct: boolean; feedback: string }>()
    assert.equal(wrongBody.correct, false)
    assert.equal(JSON.stringify(wrongBody).includes('answerKey'), false)
    assert.doesNotMatch(wrongBody.feedback, /park/)

    const rightChoice = await app.inject({
      method: 'POST',
      url: '/api/v1/samples/park-morning/exercises/park-zh-park/submit',
      payload: { type: 'zh_to_en', choice: 'park' },
    })
    assert.equal(rightChoice.statusCode, 200)
    const rightBody = rightChoice.json<{ correct: boolean; feedback: string }>()
    assert.equal(rightBody.correct, true)
    assert.match(rightBody.feedback, /park/)
    assert.equal(JSON.stringify(rightBody).includes('answerKey'), false)

    const wrongCloze = await app.inject({
      method: 'POST',
      url: '/api/v1/samples/park-morning/exercises/park-cloze-wags/submit',
      payload: { type: 'cloze', choice: 'park' },
    })
    assert.equal(wrongCloze.statusCode, 200)
    const clozeBody = wrongCloze.json<{ correct: boolean; feedback: string }>()
    assert.equal(clozeBody.correct, false)
    assert.doesNotMatch(clozeBody.feedback, /wags/)

    const wrongMatch = await app.inject({
      method: 'POST',
      url: '/api/v1/samples/park-morning/exercises/park-match-words/submit',
      payload: {
        type: 'match',
        pairs: [
          { word: 'dog', zh: '妈妈' },
          { word: 'ball', zh: '狗' },
          { word: 'mom', zh: '球' },
        ],
      },
    })
    assert.equal(wrongMatch.statusCode, 200)
    const matchBody = wrongMatch.json<{ correct: boolean; feedback: string }>()
    assert.equal(matchBody.correct, false)
    assert.doesNotMatch(matchBody.feedback, /dog 和狗/)
    assert.doesNotMatch(matchBody.feedback, /ball 和球/)
    assert.doesNotMatch(matchBody.feedback, /mom 和妈妈/)

    const rightMatch = await app.inject({
      method: 'POST',
      url: '/api/v1/samples/park-morning/exercises/park-match-words/submit',
      payload: {
        type: 'match',
        pairs: [
          { word: 'mom', zh: '妈妈' },
          { word: 'dog', zh: '狗' },
          { word: 'ball', zh: '球' },
        ],
      },
    })
    assert.equal(rightMatch.json<{ correct: boolean }>().correct, true)

    const missing = await app.inject({
      method: 'POST',
      url: '/api/v1/samples/park-morning/exercises/missing/submit',
      payload: { type: 'zh_to_en', choice: 'park' },
    })
    assert.equal(missing.statusCode, 404)
  })

  it('does not expose files outside the sample folder', async () => {
    const missing = await app.inject({ method: 'GET', url: '/api/v1/samples/missing-lesson' })
    assert.equal(missing.statusCode, 404)

    const escaped = await app.inject({ method: 'GET', url: '/media/../package.json' })
    assert.notEqual(escaped.statusCode, 200)
  })
})
