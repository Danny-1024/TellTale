import { isChildSampleLesson, type ChildSampleLesson } from '@telltale/shared'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type SampleErrorKind = 'empty' | 'network'

async function checkAsset(url: string, expected: 'image' | 'audio'): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('asset')
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes(expected)) throw new Error('asset-type')
  const body = await response.arrayBuffer()
  if (body.byteLength < 32) throw new Error('asset-empty')
}

export const useSampleStore = defineStore('sample', () => {
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const errorKind = ref<SampleErrorKind | null>(null)
  const lesson = ref<ChildSampleLesson | null>(null)
  let requestId = 0
  let inflight: Promise<void> | null = null

  async function load(): Promise<void> {
    const current = ++requestId
    status.value = 'loading'
    errorKind.value = null
    lesson.value = null

    try {
      const listResponse = await fetch('/api/v1/samples')
      if (!listResponse.ok) throw new Error('list')
      const list = (await listResponse.json()) as { samples?: { id?: string }[] }
      const first = list.samples?.[0]
      if (!first?.id) {
        if (current !== requestId) return
        status.value = 'error'
        errorKind.value = 'empty'
        return
      }

      const detailResponse = await fetch(`/api/v1/samples/${encodeURIComponent(first.id)}`)
      if (!detailResponse.ok) throw new Error('detail')
      const detail: unknown = await detailResponse.json()
      if (!isChildSampleLesson(detail)) throw new Error('shape')

      // Read the files to prove they load. Do not attach an <audio> element.
      await Promise.all(
        detail.sentences.flatMap((sentence) => [
          checkAsset(sentence.imageUrl, 'image'),
          checkAsset(sentence.audioUrl, 'audio'),
        ]),
      )

      if (current !== requestId) return
      lesson.value = detail
      status.value = 'ready'
    } catch {
      if (current !== requestId) return
      lesson.value = null
      status.value = 'error'
      errorKind.value = 'network'
    }
  }

  async function ensure(): Promise<void> {
    if (status.value === 'ready' && lesson.value) return
    if (inflight) return inflight
    const pending = load()
    inflight = pending
    try {
      await pending
    } finally {
      if (inflight === pending) inflight = null
    }
  }

  return { status, errorKind, lesson, load, ensure }
})
