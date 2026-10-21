<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import ChildPage from '../components/ChildPage.vue'
import LessonStatus from '../components/LessonStatus.vue'
import WordSpot from '../components/WordSpot.vue'
import { onLessonAudioStop, playLessonAudio, stopLessonAudio } from '../learn/audio'
import { nextListenIndex, parseStepIndex, routeParam } from '../learn/steps'
import { useLearnStore } from '../stores/learn'
import { useSampleStore } from '../stores/sample'

const route = useRoute()
const router = useRouter()
const sample = useSampleStore()
const learn = useLearnStore()
const playing = ref(false)
let stopWatchingAudio: (() => void) | null = null

const helpLines = [
  '看左边的图，读右边的句子。想听的时候，按「播放这句话」。',
  '这一页不会自己播放，也没有倒计时。',
]

const suggestedCard: Record<number, number> = { 1: 0, 2: 2, 3: 3, 4: 3, 5: 4 }

const lessonId = computed(() => routeParam(route.params.lessonId))
const step = computed(() => parseStepIndex(route.params.index))
const lessonMatches = computed(() => sample.lesson?.id === lessonId.value)
const sentence = computed(() => {
  const lesson = sample.lesson
  const index = step.value
  if (!lesson || index === null) return null
  return lesson.sentences.find((item) => item.index === index) ?? null
})
const cardIndex = computed(() => {
  const current = sentence.value
  const lesson = sample.lesson
  if (!current || !lesson) return 0
  if (learn.cardSentenceIndex === current.index) return learn.cardIndex
  return suggestedCard[current.index] ?? 0
})
const card = computed(() => sample.lesson?.vocabCards[cardIndex.value] ?? null)

const progress = computed(() => {
  if (sample.status === 'loading' || sample.status === 'idle') return '请稍等'
  if (sample.status === 'error') return sample.errorKind === 'empty' ? '没有示例课' : '未打开'
  if (!lessonMatches.value) return '换一课'
  if (!sentence.value || step.value === null || !sample.lesson) return '不在这一课'
  return `第 ${step.value} 句 / 共 ${sample.lesson.sentences.length} 句`
})

const advanceLabel = computed(() => {
  if (sample.status === 'error') return '再试一次'
  if (sample.status !== 'ready') return '请稍等'
  if (!lessonMatches.value || !sentence.value || !sample.lesson || step.value === null) {
    return '回到开头'
  }
  return step.value < sample.lesson.sentences.length ? '下一句' : '去做练习'
})

const advanceDisabled = computed(() => sample.status === 'loading' || sample.status === 'idle')
const secondaryDisabled = computed(
  () => advanceDisabled.value || step.value === null || step.value <= 1 || !sentence.value,
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

onBeforeRouteLeave((to) => {
  stopLessonAudio()
  if (to.name !== 'rest') learn.hideCards()
})

function toggleAudio(): void {
  const url = sentence.value?.audioUrl
  if (!url) return
  if (playing.value) {
    stopLessonAudio()
    return
  }
  playLessonAudio(url)
  playing.value = true
}

function pageCard(delta: number): void {
  const lesson = sample.lesson
  const current = sentence.value
  if (!lesson || !current) return
  const count = lesson.vocabCards.length
  const next = (cardIndex.value + delta + count) % count
  learn.showCards(current.index)
  learn.setCard(next)
}

function onBack(): void {
  const lesson = sample.lesson
  const index = step.value
  if (!lesson || index === null || index <= 1) return
  stopLessonAudio()
  void router.push({ name: 'listen', params: { lessonId: lesson.id, index: String(index - 1) } })
}

function onAdvance(): void {
  if (sample.status === 'error') {
    void sample.load()
    return
  }
  const lesson = sample.lesson
  const index = step.value
  if (!lesson || !lessonMatches.value || !sentence.value || index === null) {
    void router.push('/')
    return
  }
  stopLessonAudio()
  const next = nextListenIndex(index, lesson.sentences.length)
  if (next === null) {
    void router.push({ name: 'practice', params: { lessonId: lesson.id, index: '1' } })
    return
  }
  void router.push({ name: 'listen', params: { lessonId: lesson.id, index: String(next) } })
}
</script>

<template>
  <ChildPage
    title="听读故事"
    :progress="progress"
    :advance-label="advanceLabel"
    :advance-disabled="advanceDisabled"
    secondary-label="上一句"
    :secondary-disabled="secondaryDisabled"
    hint="可以跟读，也可以先听一听"
    advance-chevron
    :help-lines="helpLines"
    @advance="onAdvance"
    @secondary="onBack"
  >
    <LessonStatus :status="sample.status" :error-kind="sample.errorKind">
      <article v-if="!lessonMatches" class="task task--panel">
        <h2 id="task-title">这一课不在这台电脑上。</h2>
        <p>可以回到开头。</p>
      </article>
      <article v-else-if="!sentence" class="task task--panel">
        <h2 id="task-title">这一句不在这一课里。</h2>
        <p>可以回到开头。</p>
      </article>
      <div v-else class="stage">
        <img class="stage__art" :src="sentence.imageUrl" :alt="sentence.imageAlt" />
        <div class="stage__copy">
          <p class="task__display" lang="en">{{ sentence.en }}</p>
          <h2 id="task-title">{{ sentence.zh }}</h2>
          <button type="button" class="play-btn" @click="toggleAudio">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path v-if="playing" fill="#2166e8" d="M7 6h3v12H7zM14 6h3v12h-3z" />
              <path v-else fill="#2166e8" d="M8 5.5v13l11-6.5z" />
            </svg>
            {{ playing ? '停下来' : '播放这句话' }}
          </button>
          <section v-if="card" class="vocab" :aria-label="`词卡 ${card.word}`">
            <div class="vocab__thumb">
              <WordSpot :word="card.word" />
            </div>
            <div>
              <p class="vocab__word" lang="en">{{ card.word }}</p>
              <p class="vocab__zh">{{ card.zh }}</p>
              <p v-if="card.example" class="vocab__example" lang="en">{{ card.example }}</p>
            </div>
            <div class="vocab__pages">
              <button type="button" class="vocab__page" @click="pageCard(-1)">上一张</button>
              <button type="button" class="vocab__page" @click="pageCard(1)">下一张</button>
            </div>
          </section>
        </div>
      </div>
    </LessonStatus>
  </ChildPage>
</template>
