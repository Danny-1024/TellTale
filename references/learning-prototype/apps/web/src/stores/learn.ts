import type { ChildExercise, ChildMatchExercise, ExerciseGrade } from '@telltale/shared'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  canSubmit,
  emptyDraft,
  pairMeaning,
  pairWord,
  selectChoice,
  submissionBody,
  type ExerciseDraft,
} from '../learn/drafts'

function isGrade(value: unknown): value is ExerciseGrade {
  if (!value || typeof value !== 'object') return false
  const grade = value as Partial<ExerciseGrade>
  return typeof grade.correct === 'boolean' && typeof grade.feedback === 'string'
}

export const useLearnStore = defineStore('learn', () => {
  const drafts = ref<Record<string, ExerciseDraft>>({})
  const helpOpen = ref(false)
  const cardIndex = ref(0)
  const cardSentenceIndex = ref<number | null>(null)
  const resumePath = ref<string | null>(null)
  const submitBusy = ref(false)

  function write(id: string, next: ExerciseDraft): void {
    drafts.value = { ...drafts.value, [id]: next }
  }

  function ensureDraft(exercise: ChildExercise): ExerciseDraft {
    const existing = drafts.value[exercise.id]
    const kind = exercise.type === 'match' ? 'match' : 'choice'
    if (existing?.kind === kind) return existing
    const created = emptyDraft(exercise)
    write(exercise.id, created)
    return created
  }

  function choose(exercise: ChildExercise, choice: string): void {
    if (exercise.type === 'match') return
    const draft = ensureDraft(exercise)
    if (draft.kind !== 'choice') return
    write(exercise.id, selectChoice(draft, choice))
  }

  function tapWord(exercise: ChildMatchExercise, word: string): void {
    const draft = ensureDraft(exercise)
    if (draft.kind !== 'match') return
    write(exercise.id, pairWord(draft, word))
  }

  function tapMeaning(exercise: ChildMatchExercise, zh: string): void {
    const draft = ensureDraft(exercise)
    if (draft.kind !== 'match') return
    write(exercise.id, pairMeaning(draft, zh))
  }

  function openHint(id: string): void {
    const draft = drafts.value[id]
    if (!draft) return
    write(id, { ...draft, hintOpen: true })
  }

  function retry(id: string): void {
    const draft = drafts.value[id]
    if (!draft) return
    write(id, { ...draft, submitted: false, correct: null, feedback: '', error: '' })
  }

  async function submit(lessonId: string, exercise: ChildExercise): Promise<void> {
    const draft = ensureDraft(exercise)
    if (!canSubmit(exercise, draft) || submitBusy.value) return
    const body = submissionBody(exercise, draft)
    if (!body) return
    submitBusy.value = true
    write(exercise.id, { ...draft, error: '' })
    try {
      const response = await fetch(
        `/api/v1/samples/${encodeURIComponent(lessonId)}/exercises/${encodeURIComponent(exercise.id)}/submit`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        },
      )
      if (!response.ok) throw new Error('submit')
      const grade: unknown = await response.json()
      if (!isGrade(grade)) throw new Error('shape')
      const current = drafts.value[exercise.id]
      if (!current) return
      write(exercise.id, {
        ...current,
        submitted: true,
        correct: grade.correct,
        feedback: grade.feedback,
        error: '',
      })
    } catch {
      const current = drafts.value[exercise.id]
      if (!current) return
      write(exercise.id, {
        ...current,
        submitted: false,
        error: '这次没有送出去。可以再按一次。',
      })
    } finally {
      submitBusy.value = false
    }
  }

  function showCards(sentenceIndex: number): void {
    cardSentenceIndex.value = sentenceIndex
    cardIndex.value = 0
  }

  function hideCards(): void {
    cardSentenceIndex.value = null
    cardIndex.value = 0
  }

  function setCard(index: number): void {
    cardIndex.value = index
  }

  return {
    drafts,
    helpOpen,
    cardIndex,
    cardSentenceIndex,
    resumePath,
    submitBusy,
    ensureDraft,
    choose,
    tapWord,
    tapMeaning,
    openHint,
    retry,
    submit,
    showCards,
    hideCards,
    setCard,
  }
})
