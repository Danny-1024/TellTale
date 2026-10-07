<script setup lang="ts">
import type { SampleErrorKind } from '../stores/sample'

defineProps<{
  status: 'idle' | 'loading' | 'ready' | 'error'
  errorKind: SampleErrorKind | null
}>()
</script>

<template>
  <article v-if="status === 'loading' || status === 'idle'" class="task">
    <h2 id="task-title">正在打开示例课</h2>
    <p>稍等一下。句子和图片都在这台电脑上。</p>
  </article>
  <article v-else-if="status === 'error' && errorKind === 'empty'" class="task">
    <h2 id="task-title">还没有示例课</h2>
    <p>这台电脑上还没有放好的故事。</p>
  </article>
  <article v-else-if="status === 'error'" class="task">
    <h2 id="task-title">示例课没有打开</h2>
    <p>可以按右下角「再试一次」。</p>
  </article>
  <slot v-else />
</template>
