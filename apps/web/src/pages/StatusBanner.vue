<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useConnection } from '../entry/connection';

const connection = useConnection();
const hidden = ref(false);

onMounted(() => {
  void connection.check();
});
</script>

<template>
  <p v-if="connection.status === 'loading'" class="status-line" role="status" aria-live="polite">
    正在检查连接。
  </p>
  <div v-else-if="connection.status === 'unavailable' && !hidden" class="error-banner" role="alert">
    连接暂时不可用，请稍后重新检查。
    <button type="button" @click="connection.check()">重新检查</button>
    <button type="button" aria-label="关闭错误提示" @click="hidden = true">关闭</button>
  </div>
</template>
