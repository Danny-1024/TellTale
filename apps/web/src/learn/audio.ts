type StopListener = () => void

let current: HTMLAudioElement | null = null
const listeners = new Set<StopListener>()

function notifyStop(): void {
  for (const listener of listeners) listener()
}

export function onLessonAudioStop(listener: StopListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function stopLessonAudio(): void {
  const audio = current
  current = null
  if (audio) {
    audio.onended = null
    audio.onerror = null
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
  }
  notifyStop()
}

export function playLessonAudio(url: string): void {
  stopLessonAudio()
  const audio = new Audio()
  audio.preload = 'none'
  current = audio
  audio.onended = () => stopLessonAudio()
  audio.onerror = () => stopLessonAudio()
  audio.src = url
  void audio.play().catch(() => stopLessonAudio())
}
