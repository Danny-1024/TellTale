<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import ChildPage from '../components/ChildPage.vue'
import LessonStatus from '../components/LessonStatus.vue'
import WordSpot from '../components/WordSpot.vue'
import { onLessonAudioStop, playLessonAudio, stopLessonAudio } from '../learn/audio'
import { canSubmit } from '../learn/drafts'
import { nextPracticeIndex, parseStepIndex, routeParam } from '../learn/steps'
import { useLearnStore } from '../stores/learn'
import { useSampleStore } from '../stores/sample'

const route = useRoute()
const router = useRouter()
const sample = useSampleStore()
const learn = useLearnStore()
const playing = ref(false)
let stopWatchingAudio: (() => void) | null = null

const helpLines = ['先点一张卡片。选错了可以改。', '准备好了，按下面的蓝色按钮。']
const spotForZh: Record<string, string> = {
  狗: 'dog',
  球: 'ball',
  妈妈: 'mom',
  公园: 'park',
  尾巴: 'tail',
}

const lessonId = computed(() => routeParam(route.params.lessonId))
const step = computed(() => parseStepIndex(route.params.index))
const lessonMatches = computed(() => sample.lesson?.id === lessonId.value)
const exercise = computed(() => {
  const lesson = sample.lesson
  const index = step.value
  if (!lesson || index === null) return null
  return lesson.exercises[index - 1] ?? null
})
const draft = computed(() => {
  const current = exercise.value
  if (!current) return null
  return learn.drafts[current.id] ?? null
})
const clozeSentence = computed(() => {
  const current = exercise.value
  if (current?.type !== 'cloze') return null
  return current.sentence
})
const options = computed(() => {
  const current = exercise.value
  if (current?.type === 'zh_to_en') return current.options
  if (current?.type === 'cloze') return current.bank
  return []
})
const matchWords = computed(() => (exercise.value?.type === 'match' ? exercise.value.words : []))
const matchMeanings = computed(() =>
  exercise.value?.type === 'match' ? exercise.value.meanings : [],
)
const replaySentence = computed(() => {
  const current = exercise.value
  const lesson = sample.lesson
  if (!current?.replaySentenceIndex || !lesson) return null
  return lesson.sentences.find((item) => item.index === current.replaySentenceIndex) ?? null
})

const progress = computed(() => {
  if (sample.status === 'loading' || sample.status === 'idle') return '请稍等'
  if (sample.status === 'error') return sample.errorKind === 'empty' ? '没有示例课' : '未打开'
  if (!lessonMatches.value) return '换一课'
  if (!exercise.value || step.value === null || !sample.lesson) return '不在这一课'
  return `小练习 ${step.value} / ${sample.lesson.exercises.length}`
})

const heading = computed(() => {
  const current = exercise.value
  if (!current) return ''
  if (current.type === 'match') return '帮单词找到朋友'
  if (current.type === 'cloze') return '选一个词填进去'
  return current.prompt
})

const lead = computed(() => {
  const current = exercise.value
  if (!current) return ''
  if (current.type === 'match') return '现在请选择对应的中文'
  if (current.type === 'cloze') return '点一个词，填进空格'
  return '点一个英语词'
})

const confirmLabel = computed(() => {
  const current = exercise.value
  if (current?.type === 'match') return '确认配对'
  if (current?.type === 'cloze') return '确认填空'
  return '确认选择'
})

const advanceLabel = computed(() => {
  if (sample.status === 'error') return '再试一次'
  if (sample.status !== 'ready') return '请稍等'
  if (!lessonMatches.value || !exercise.value || !sample.lesson || step.value === null) {
    return '回到开头'
  }
  const current = draft.value
  if (current?.submitted && current.correct === false) return '再试一次'
  if (current?.submitted && current.correct) {
    return step.value < sample.lesson.exercises.length ? '下一题' : '看绘本'
  }
  return confirmLabel.value
})

const advanceDisabled = computed(() => {
  if (sample.status === 'loading' || sample.status === 'idle') return true
  if (learn.submitBusy) return true
  const currentExercise = exercise.value
  const currentDraft = draft.value
  if (sample.status === 'ready' && currentExercise && currentDraft && !currentDraft.submitted) {
    return !canSubmit(currentExercise, currentDraft)
  }
  if (sample.status === 'ready' && currentExercise && !currentDraft) return true
  return false
})

const showRecovery = computed(
  () => draft.value?.submitted === true && draft.value.correct === false,
)

watch(
  exercise,
  (value) => {
    if (value) learn.ensureDraft(value)
  },
  { immediate: true },
)

onMounted(() => {
  void sample.ensure()
  stopWatchingAudio = onLessonAudioStop(() => {
    playing.value = false
  })
})

onUnmounted(() => {
  stopWatchingAudio?.()
  stopWatchingAudio = null
})

onBeforeRouteLeave(() => {
  stopLessonAudio()
})

function spotsFor(word: string): boolean {
  return word === 'park' || word === 'ball' || word === 'mom' || word === 'dog' || word === 'tail' || word === 'wags'
}

function pendingWord(): string | null {
  const current = draft.value
  if (current?.kind !== 'match') return null
  return current.pendingWord
}

function wordPressed(word: string): boolean {
  const current = draft.value
  if (current?.kind !== 'match') return false
  return current.pendingWord === word || current.pairs.some((pair) => pair.word === word)
}

function meaningPressed(zh: string): boolean {
  const current = draft.value
  if (current?.kind !== 'match') return false
  return current.pairs.some((pair) => pair.zh === zh)
}

function onChoice(choice: string): void {
  const current = exercise.value
  if (!current || current.type === 'match') return
  learn.choose(current, choice)
}

function onWord(word: string): void {
  const current = exercise.value
  if (current?.type !== 'match') return
  learn.tapWord(current, word)
}

function onMeaning(zh: string): void {
  const current = exercise.value
  if (current?.type !== 'match') return
  learn.tapMeaning(current, zh)
}

function openHint(): void {
  const current = exercise.value
  if (!current) return
  learn.openHint(current.id)
}

function toggleReplay(): void {
  const url = replaySentence.value?.audioUrl
  if (!url) return
  if (playing.value) {
    stopLessonAudio()
    return
  }
  playLessonAudio(url)
  playing.value = true
}

function goNext(): void {
  stopLessonAudio()
  const lesson = sample.lesson
  const index = step.value
  if (!lesson || index === null) {
    void router.push('/')
    return
  }
  const next = nextPracticeIndex(index, lesson.exercises.length)
  if (next === null) {
    void router.push({ name: 'book', params: { lessonId: lesson.id } })
    return
  }
  void router.push({ name: 'practice', params: { lessonId: lesson.id, index: String(next) } })
}

function onAdvance(): void {
  if (sample.status === 'error') {
    void sample.load()
    return
  }
  const lesson = sample.lesson
  const current = exercise.value
  if (!lesson || !lessonMatches.value || !current || step.value === null) {
    void router.push('/')
    return
  }
  const currentDraft = learn.drafts[current.id]
  if (!currentDraft || !currentDraft.submitted) {
    void learn.submit(lesson.id, current)
    return
  }
  if (currentDraft.correct === false) {
    learn.retry(current.id)
    return
  }
  goNext()
}
</script>

<template>
  <ChildPage
    title="做练习"
    :progress="progress"
    :advance-label="advanceLabel"
    :advance-disabled="advanceDisabled"
    :hint="exercise?.type === 'match' ? '选好两张卡片后确认' : '选好后按右边的按钮确认'"
    rest-icon="cup"
    :help-lines="helpLines"
    @advance="onAdvance"
  >
    <LessonStatus :status="sample.status" :error-kind="sample.errorKind">
      <article v-if="!lessonMatches" class="task">
        <h2 id="task-title">这一课不在这台电脑上。</h2>
        <p>可以回到开头。</p>
      </article>
      <article v-else-if="!exercise || !draft" class="task">
        <h2 id="task-title">这一题不在这一课里。</h2>
        <p>可以回到开头。</p>
      </article>
      <article v-else-if="draft.submitted && draft.correct" class="practice">
        <h2 id="task-title" class="practice__title">{{ draft.feedback }}</h2>
      </article>
      <article v-else class="practice">
        <h2 id="task-title" class="practice__title">{{ heading }}</h2>
        <p class="practice__lead">{{ lead }}</p>
        <p v-if="clozeSentence" class="task__display" lang="en">{{ clozeSentence }}</p>
        <div v-if="exercise.type === 'match'" class="match-board">
          <div class="match-board__col">
            <button
              v-for="word in matchWords"
              :key="word"
              type="button"
              class="word-card"
              :class="{ 'is-chosen': wordPressed(word) }"
              lang="en"
              :aria-pressed="wordPressed(word)"
              @click="onWord(word)"
            >
              <span class="word-card__main">
                {{ word }}
                <span v-if="pendingWord() === word" class="chosen-mark">
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="#2166e8" />
                    <path
                      fill="none"
                      stroke="#fff"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      d="m7 12 3.2 3.2L17 8.5"
                    />
                  </svg>
                  已选择
                </span>
              </span>
            </button>
          </div>
          <div class="match-board__col">
            <button
              v-for="meaning in matchMeanings"
              :key="meaning"
              type="button"
              class="word-card word-card--zh"
              :class="{ 'is-chosen': meaningPressed(meaning) }"
              :aria-pressed="meaningPressed(meaning)"
              @click="onMeaning(meaning)"
            >
              <span class="word-card__main">
                {{ meaning }}
                <WordSpot :word="spotForZh[meaning] ?? 'dog'" />
              </span>
            </button>
          </div>
        </div>
        <div v-else class="choice-list">
          <button
            v-for="option in options"
            :key="option"
            type="button"
            class="word-card"
            :class="{ 'is-chosen': draft.kind === 'choice' && draft.choice === option }"
            lang="en"
            :aria-pressed="draft.kind === 'choice' && draft.choice === option"
            @click="onChoice(option)"
          >
            <span class="word-card__main">
              {{ option }}
              <span
                v-if="draft.kind === 'choice' && draft.choice === option"
                class="chosen-mark"
              >
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#2166e8" />
                  <path
                    fill="none"
                    stroke="#fff"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    d="m7 12 3.2 3.2L17 8.5"
                  />
                </svg>
                已选择
              </span>
              <WordSpot v-else-if="spotsFor(option)" :word="option" />
            </span>
          </button>
        </div>
        <p v-if="draft.kind === 'match' && draft.pendingWord">再点一个中文。</p>
        <p v-for="pair in draft.kind === 'match' ? draft.pairs : []" :key="pair.word">
          <span lang="en">{{ pair.word }}</span> — {{ pair.zh }}
        </p>
        <p v-if="draft.feedback" class="feedback">{{ draft.feedback }}</p>
        <p v-if="draft.hintOpen" class="feedback">{{ exercise.hint }}</p>
        <p v-if="draft.error">{{ draft.error }}</p>
        <p v-if="showRecovery">按「再试一次」，就可以改。</p>
        <div class="recovery">
          <button
            v-if="replaySentence"
            type="button"
            class="replay-btn"
            @click="toggleReplay"
          >
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#2166e8" d="M4 10v4h3l5 4V6L7 10H4z" />
              <path
                fill="none"
                stroke="#2166e8"
                stroke-width="2"
                stroke-linecap="round"
                d="M16 9a4 4 0 0 1 0 6"
              />
            </svg>
            {{ playing ? '停下来' : '再听一次' }}
          </button>
          <button
            v-if="showRecovery"
            type="button"
            class="replay-btn"
            :aria-pressed="draft.hintOpen"
            @click="openHint"
          >
            看提示
          </button>
          <button v-if="showRecovery" type="button" class="replay-btn" @click="goNext">跳过</button>
        </div>
      </article>
    </LessonStatus>
  </ChildPage>
</template>
