<script setup lang="ts">
import StatusBanner from './StatusBanner.vue';

defineProps<{ title: string }>();
</script>

<template>
  <div class="course-app">
    <a class="skip-link" href="#page-main">跳到主要内容</a>
    <header class="topbar">
      <RouterLink to="/" class="brand"
        ><span class="brand-mark" aria-hidden="true">t</span> TellTale
        <span>English</span></RouterLink
      >
      <nav class="top-links" aria-label="页面">
        <RouterLink to="/course">开始课程</RouterLink>
        <RouterLink to="/guide">使用指南</RouterLink>
        <RouterLink to="/privacy">隐私说明</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
    </header>
    <StatusBanner />
    <main id="page-main" class="content">
      <h1 data-title tabindex="-1">{{ title }}</h1>
      <slot />
    </main>
    <footer class="home-footer">
      <RouterLink to="/">返回首页</RouterLink>
      <p>当前课堂是临时的。结束或清理后，本课链接不再打开。</p>
    </footer>
  </div>
</template>
