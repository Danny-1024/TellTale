import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import {
  countEnglishWords,
  DIFFICULTY_WORD_LIMIT,
  isDifficulty,
  type ChildClozeExercise,
  type ChildExercise,
  type ChildMatchExercise,
  type ChildSampleLesson,
  type ChildZhToEnExercise,
  type Difficulty,
  type ExerciseGrade,
  type SampleSentence,
  type SampleSummary,
  type VocabCard,
} from '@telltale/shared'

export class SampleInvalidError extends Error {
  readonly code: string

  constructor(code: string) {
    super(code)
    this.name = 'SampleInvalidError'
    this.code = code
  }
}

interface StoredAnswer {
  type: 'zh_to_en' | 'cloze' | 'match'
  answer?: string
  options?: string[]
  bank?: string[]
  sentence?: string
  words?: string[]
  meanings?: string[]
  pairs?: { word: string; zh: string }[]
}

interface LoadedSample {
  summary: SampleSummary
  lesson: ChildSampleLesson
  answers: Map<string, StoredAnswer>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function expectString(value: unknown, code: string): string {
  if (typeof value !== 'string' || value.trim() === '') throw new SampleInvalidError(code)
  return value
}

function optionalString(value: unknown, code: string): string | undefined {
  if (value === undefined) return undefined
  return expectString(value, code)
}

function expectStringArray(value: unknown, code: string): string[] {
  if (!Array.isArray(value) || value.length === 0) throw new SampleInvalidError(code)
  return value.map((item, index) => expectString(item, `${code}_${index}`))
}

function assetPath(sampleDir: string, relativePath: string, kind: 'image' | 'audio'): string {
  const pattern = kind === 'image' ? /^images\/[a-z0-9-]+\.svg$/ : /^audio\/[a-z0-9-]+\.wav$/
  if (!pattern.test(relativePath)) throw new SampleInvalidError(`bad_${kind}_path`)
  const full = path.resolve(sampleDir, relativePath)
  const root = path.resolve(sampleDir) + path.sep
  if (!full.startsWith(root)) throw new SampleInvalidError(`bad_${kind}_path`)
  if (!existsSync(full)) throw new SampleInvalidError(`missing_${kind}`)
  return full
}

function withinLimit(sentence: string, difficulty: Difficulty, code: string): void {
  const count = countEnglishWords(sentence)
  if (count > DIFFICULTY_WORD_LIMIT[difficulty]) throw new SampleInvalidError(code)
}

function unpairedMeanings(pairs: { word: string; zh: string }[]): string[] {
  return pairs.map((_, index) => {
    const next = pairs[(index + 1) % pairs.length]
    if (!next) throw new SampleInvalidError('match_pairs')
    return next.zh
  })
}

function readReplay(item: Record<string, unknown>): number | undefined {
  if (item.replaySentenceIndex === undefined) return undefined
  if (
    typeof item.replaySentenceIndex !== 'number' ||
    !Number.isInteger(item.replaySentenceIndex) ||
    item.replaySentenceIndex < 1
  ) {
    throw new SampleInvalidError('replay_index')
  }
  return item.replaySentenceIndex
}

function readExercises(
  value: unknown,
  difficulty: Difficulty,
): { exercises: ChildExercise[]; answers: Map<string, StoredAnswer> } {
  if (!Array.isArray(value) || value.length !== 3) throw new SampleInvalidError('exercise_count')

  const exercises: ChildExercise[] = []
  const answers = new Map<string, StoredAnswer>()
  const types = new Set<string>()

  for (const item of value) {
    if (!isRecord(item)) throw new SampleInvalidError('exercise_shape')
    const id = expectString(item.id, 'exercise_id')
    const type = expectString(item.type, 'exercise_type')
    const prompt = expectString(item.prompt, 'exercise_prompt')
    const hint = expectString(item.hint, 'exercise_hint')
    const replaySentenceIndex = readReplay(item)
    if (types.has(type)) throw new SampleInvalidError('exercise_duplicate_type')
    types.add(type)

    if (type === 'zh_to_en') {
      const options = expectStringArray(item.options, 'exercise_options')
      const answerKey = expectString(item.answerKey, 'exercise_answer')
      if (!options.includes(answerKey)) throw new SampleInvalidError('exercise_answer_missing')
      const exercise: ChildZhToEnExercise = { id, type, prompt, options, hint }
      if (replaySentenceIndex !== undefined) exercise.replaySentenceIndex = replaySentenceIndex
      exercises.push(exercise)
      answers.set(id, { type, answer: answerKey, options })
      continue
    }

    if (type === 'match') {
      if (!Array.isArray(item.pairs) || item.pairs.length < 2) {
        throw new SampleInvalidError('match_pairs')
      }
      const pairs = item.pairs.map((pair) => {
        if (!isRecord(pair)) throw new SampleInvalidError('match_pairs')
        return {
          word: expectString(pair.word, 'match_word'),
          zh: expectString(pair.zh, 'match_zh'),
        }
      })
      const meanings = unpairedMeanings(pairs)
      const exercise: ChildMatchExercise = {
        id,
        type,
        prompt,
        hint,
        words: pairs.map((pair) => pair.word),
        meanings,
      }
      if (replaySentenceIndex !== undefined) exercise.replaySentenceIndex = replaySentenceIndex
      exercises.push(exercise)
      answers.set(id, {
        type,
        pairs,
        words: exercise.words,
        meanings,
      })
      continue
    }

    if (type === 'cloze') {
      const sentence = expectString(item.sentence, 'cloze_sentence')
      const bank = expectStringArray(item.bank, 'cloze_bank')
      const answerKey = expectString(item.answerKey, 'exercise_answer')
      if (!sentence.includes('____')) throw new SampleInvalidError('cloze_blank')
      if (!bank.includes(answerKey)) throw new SampleInvalidError('exercise_answer_missing')
      withinLimit(sentence.replace('____', answerKey), difficulty, 'cloze_too_long')
      const exercise: ChildClozeExercise = { id, type, prompt, sentence, bank, hint }
      if (replaySentenceIndex !== undefined) exercise.replaySentenceIndex = replaySentenceIndex
      exercises.push(exercise)
      answers.set(id, { type, answer: answerKey, bank, sentence })
      continue
    }

    throw new SampleInvalidError('exercise_type')
  }

  for (const required of ['zh_to_en', 'match', 'cloze']) {
    if (!types.has(required)) throw new SampleInvalidError('exercise_type_missing')
  }

  return { exercises, answers }
}

function readLessonFile(sampleDir: string, id: string): LoadedSample {
  const lessonPath = path.join(sampleDir, 'lesson.json')
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(lessonPath, 'utf8')) as unknown
  } catch {
    throw new SampleInvalidError('lesson_unreadable')
  }
  if (!isRecord(parsed)) throw new SampleInvalidError('lesson_shape')
  if (expectString(parsed.id, 'id') !== id) throw new SampleInvalidError('id_mismatch')

  const title = expectString(parsed.title, 'title')
  const titleEn = expectString(parsed.titleEn, 'title_en')
  const difficultyValue = parsed.difficulty
  if (!isDifficulty(difficultyValue)) throw new SampleInvalidError('difficulty')
  const difficulty = difficultyValue
  const gradeBand = expectString(parsed.gradeBand, 'grade_band')

  if (
    !Array.isArray(parsed.sentences) ||
    parsed.sentences.length < 3 ||
    parsed.sentences.length > 5
  ) {
    throw new SampleInvalidError('sentence_count')
  }

  const sentences: SampleSentence[] = parsed.sentences.map((item, offset) => {
    if (!isRecord(item)) throw new SampleInvalidError('sentence_shape')
    const index = item.index
    if (index !== offset + 1) throw new SampleInvalidError('sentence_index')
    const en = expectString(item.en, 'sentence_en')
    withinLimit(en, difficulty, 'sentence_too_long')
    const image = expectString(item.image, 'sentence_image')
    const audio = expectString(item.audio, 'sentence_audio')
    assetPath(sampleDir, image, 'image')
    assetPath(sampleDir, audio, 'audio')
    return {
      index,
      en,
      zh: expectString(item.zh, 'sentence_zh'),
      imageAlt: expectString(item.imageAlt, 'sentence_alt'),
      imageUrl: `/media/${id}/${image}`,
      audioUrl: `/media/${id}/${audio}`,
    }
  })

  if (!Array.isArray(parsed.vocabCards) || parsed.vocabCards.length !== 5) {
    throw new SampleInvalidError('vocab_count')
  }
  const vocabCards: VocabCard[] = parsed.vocabCards.map((item) => {
    if (!isRecord(item)) throw new SampleInvalidError('vocab_shape')
    const example = optionalString(item.example, 'vocab_example')
    if (example) withinLimit(example, difficulty, 'vocab_example_too_long')
    const card: VocabCard = {
      word: expectString(item.word, 'vocab_word'),
      zh: expectString(item.zh, 'vocab_zh'),
    }
    const ipa = optionalString(item.ipa, 'vocab_ipa')
    if (ipa) card.ipa = ipa
    if (example) card.example = example
    return card
  })

  const { exercises, answers } = readExercises(parsed.exercises, difficulty)
  if (!isRecord(parsed.source) || parsed.source.type !== 'sample') {
    throw new SampleInvalidError('source')
  }
  expectString(parsed.source.zhText, 'source_text')

  const summary: SampleSummary = { id, title, titleEn, difficulty, gradeBand }
  return {
    summary,
    lesson: { id, title, titleEn, difficulty, gradeBand, sentences, vocabCards, exercises },
    answers,
  }
}

function sampleDir(contentRoot: string, id: string): string | null {
  if (!/^[a-z0-9-]+$/.test(id)) return null
  const dir = path.resolve(contentRoot, id)
  const root = path.resolve(contentRoot) + path.sep
  if (!dir.startsWith(root)) return null
  if (!existsSync(path.join(dir, 'lesson.json'))) return null
  return dir
}

export function listSampleSummaries(contentRoot: string): SampleSummary[] {
  if (!existsSync(contentRoot)) throw new SampleInvalidError('content_root_missing')
  const ids = readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  const summaries: SampleSummary[] = []
  for (const id of ids) {
    const dir = sampleDir(contentRoot, id)
    if (!dir) continue
    summaries.push(readLessonFile(dir, id).summary)
  }
  return summaries
}

export function loadChildSample(contentRoot: string, id: string): ChildSampleLesson | null {
  const dir = sampleDir(contentRoot, id)
  if (!dir) return null
  return readLessonFile(dir, id).lesson
}

function pairKey(pair: { word: string; zh: string }): string {
  return `${pair.word}\0${pair.zh}`
}

function samePairs(
  expected: { word: string; zh: string }[],
  given: { word: string; zh: string }[],
): boolean {
  if (expected.length !== given.length) return false
  const wanted = new Set(expected.map(pairKey))
  const actual = new Set(given.map(pairKey))
  if (wanted.size !== expected.length || actual.size !== given.length) return false
  for (const key of wanted) {
    if (!actual.has(key)) return false
  }
  return true
}

function readSubmissionPairs(value: unknown): { word: string; zh: string }[] | null {
  if (!Array.isArray(value)) return null
  const pairs: { word: string; zh: string }[] = []
  for (const item of value) {
    if (!isRecord(item) || typeof item.word !== 'string' || typeof item.zh !== 'string') return null
    pairs.push({ word: item.word, zh: item.zh })
  }
  return pairs
}

function gradeAnswer(answer: StoredAnswer, submission: unknown): ExerciseGrade | null {
  if (!isRecord(submission) || submission.type !== answer.type) return null

  if (answer.type === 'zh_to_en' || answer.type === 'cloze') {
    if (typeof submission.choice !== 'string') return null
    const allowed = answer.type === 'zh_to_en' ? answer.options : answer.bank
    if (!allowed?.includes(submission.choice)) return null
    const correct = submission.choice === answer.answer
    if (answer.type === 'zh_to_en') {
      return {
        correct,
        feedback: correct
          ? `你选了 ${submission.choice}。这就是这一题要的词。`
          : `你选了 ${submission.choice}。还可以再看看。`,
      }
    }
    const completed = answer.sentence?.replace('____', submission.choice) ?? submission.choice
    return {
      correct,
      feedback: correct
        ? `你填了 ${submission.choice}。${completed}`
        : `你填了 ${submission.choice}。还可以再选一个。`,
    }
  }

  const pairs = readSubmissionPairs(submission.pairs)
  if (!pairs || !answer.pairs || !answer.words || !answer.meanings) return null
  for (const pair of pairs) {
    if (!answer.words.includes(pair.word) || !answer.meanings.includes(pair.zh)) return null
  }
  const correct = samePairs(answer.pairs, pairs)
  const theirs = pairs.map((pair) => `${pair.word} 和${pair.zh}`).join('、')
  return {
    correct,
    feedback: correct
      ? `你把 ${theirs} 配在一起了。`
      : pairs.length === 0
        ? '还没有配好。可以再试一次。'
        : `你把 ${theirs} 配上了。还可以再改。`,
  }
}

export type GradeOutcome =
  { status: 200; body: ExerciseGrade } | { status: 400 | 404; body: { error: string } }

export function gradeSampleExercise(
  contentRoot: string,
  lessonId: string,
  exerciseId: string,
  submission: unknown,
): GradeOutcome {
  const dir = sampleDir(contentRoot, lessonId)
  if (!dir) return { status: 404, body: { error: 'not_found' } }
  const loaded = readLessonFile(dir, lessonId)
  const answer = loaded.answers.get(exerciseId)
  if (!answer) return { status: 404, body: { error: 'not_found' } }
  const graded = gradeAnswer(answer, submission)
  if (!graded) return { status: 400, body: { error: 'bad_submission' } }
  return { status: 200, body: graded }
}
