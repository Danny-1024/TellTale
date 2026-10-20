<script setup lang="ts">
import { onMounted } from 'vue'
import { useConnection } from './connection'

const connection = useConnection()
onMounted(() => {
  void connection.check()
})
</script>

<template>
  <main class="entry" aria-labelledby="entry-title">
    <p class="brand">TellTale English</p>
    <h1 id="entry-title">让故事陪伴英语学习</h1>
    <p>课程功能正在准备中。</p>
    <p role="status" aria-live="polite" data-testid="connection-status">
      <template v-if="connection.status === 'connected'">应用已连接。</template>
      <template v-else-if="connection.status === 'unavailable'"
        >连接暂时不可用，请稍后重新检查。</template
      >
      <template v-else>正在连接应用。</template>
    </p>
    <button
      type="button"
      :disabled="connection.status === 'loading'"
      @click="connection.check()"
    >
      重新检查连接
    </button>
  </main>
</template>
