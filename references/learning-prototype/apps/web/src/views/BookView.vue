<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChildPage from '../components/ChildPage.vue'
import LessonStatus from '../components/LessonStatus.vue'
import { BOOK_BADGE, paintBook } from '../learn/book'
import { stopLessonAudio } from '../learn/audio'
import { routeParam } from '../learn/steps'
import { useSampleStore } from '../stores/sample'

const route = useRoute()
const router = useRouter()
const sample = useSampleStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const painted = ref(false)
const failed = ref(false)
const saved = ref(false)
let lastDownloadUrl: string | null = null

const helpLines = [
  '这是这一课的小绘本。',
  '按「保存图片」，可以存在这台电脑上。图上写着「示例示意」。',
]

const lessonId = computed(() => routeParam(route.params.lessonId))
const lessonMatches = computed(() => sample.lesson?.id === lessonId.value)
const bookLabel = computed(() =>
  sample.lesson ? `${sample.lesson.title}的小绘本，${BOOK_BADGE}` : BOOK_BADGE,
)

const progress = computed(() => {
  if (sample.status === 'loading' || sample.status === 'idle') return '请稍等'
  if (sample.status === 'error') return sample.errorKind === 'empty' ? '没有示例课' : '未打开'
  if (!lessonMatches.value) return '换一课'
  return '绘本'
})

const advanceLabel = computed(() => {
  if (sample.status === 'error' || failed.value) return '再试一次'
  if (!painted.value) return '请稍等'
  return '保存图片'
})

const advanceDisabled = computed(
  () =>
    sample.status === 'loading' ||
    sample.status === 'idle' ||
    (sample.status === 'ready' && lessonMatches.value && !painted.value && !failed.value),
)

onMounted(() => {
  stopLessonAudio()
  void draw()
})

async function draw(): Promise<void> {
  failed.value = false
  painted.value = false
  await sample.ensure()
  await nextTick()
  const canvas = canvasRef.value
  const lesson = sample.lesson
  if (!lesson || lesson.id !== lessonId.value) return
  if (!canvas) {
    failed.value = true
    return
  }
  try {
    if (document.fonts?.load) await document.fonts.load('800 48px Nunito')
    await paintBook(canvas, lesson)
    painted.value = true
    saved.value = false
  } catch {
    failed.value = true
  }
}

function download(): void {
  const canvas = canvasRef.value
  const lesson = sample.lesson
  if (!canvas || !lesson || !painted.value) return
  canvas.toBlob((blob) => {
    if (!blob) {
      failed.value = true
      return
    }
    if (lastDownloadUrl) URL.revokeObjectURL(lastDownloadUrl)
    const url = URL.createObjectURL(blob)
    lastDownloadUrl = url
    const link = document.createElement('a')
    link.href = url
    link.download = `${lesson.id}-book.png`
    link.rel = 'noopener'
    document.body.append(link)
    link.click()
    link.remove()
    saved.value = true
  }, 'image/png')
}

function onAdvance(): void {
  if (sample.status === 'error') {
    void draw()
    return
  }
  if (!sample.lesson || !lessonMatches.value) {
    void router.push('/')
    return
  }
  if (failed.value) {
    void draw()
    return
  }
  download()
}
</script>

<template>
  <ChildPage
    title="小绘本"
    :progress="progress"
    :advance-label="advanceLabel"
    :advance-disabled="advanceDisabled"
    :help-lines="helpLines"
    @advance="onAdvance"
  >
    <LessonStatus :status="sample.status" :error-kind="sample.errorKind">
      <article v-if="!lessonMatches" class="task">
        <h2 id="task-title">这一课不在这台电脑上。</h2>
        <p>可以回到开头。</p>
      </article>
      <article v-else-if="failed" class="task">
        <h2 id="task-title">绘本没有画出来</h2>
        <p>可以按右下角「再试一次」。</p>
      </article>
      <article v-else class="task">
        <h2 id="task-title" class="practice__title">这一课的小绘本</h2>
        <p>按保存图片，可以存在这台电脑上。</p>
        <p v-if="!painted">正在画这一课的小绘本。</p>
        <canvas
          v-show="painted"
          ref="canvasRef"
          class="task__book"
          role="img"
          :aria-label="bookLabel"
        />
        <p>{{ BOOK_BADGE }}</p>
        <p v-if="saved">已经交给浏览器保存。</p>
      </article>
    </LessonStatus>
  </ChildPage>
</template>
