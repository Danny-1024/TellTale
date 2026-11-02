<script setup lang="ts">
import { samplesByTheme } from '../course/sampleCatalog';
import StatusBanner from './StatusBanner.vue';

const groups = samplesByTheme();
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
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">课程体验</p>
          <h1 data-title tabindex="-1">选一个故事，马上开始</h1>
          <p class="lead">六个示例可以直接学习。想讲自己的经历时，由成人输入中文并检查生成结果。</p>
          <RouterLink class="button primary large" to="/course?mode=custom"
            >写自己的故事</RouterLink
          >
          <p class="soft small">无需注册。本课结束后仍按临时课堂清理。</p>
        </div>
      </section>
      <section v-if="groups.length === 0" class="paper-card">
        <h2>暂时没有示例</h2>
        <p>可以先从自己的故事开始。</p>
      </section>
      <section
        v-for="group in groups"
        :key="group.theme"
        class="sample-theme"
        :aria-label="group.theme"
      >
        <h2>{{ group.theme }}</h2>
        <div class="sample-grid">
          <article v-for="item in group.items" :key="item.id" class="paper-card sample-card">
            <p class="eyebrow">{{ item.difficultyLabel }}</p>
            <h3>{{ item.title }}</h3>
            <p lang="en">{{ item.titleEn }}</p>
            <p class="soft" lang="en">{{ item.preview }}</p>
            <RouterLink class="button primary" :to="`/course?sample=${item.id}`"
              >开始学习</RouterLink
            >
          </article>
        </div>
      </section>
    </main>
    <footer class="home-footer">
      <RouterLink to="/guide">课堂准备</RouterLink>
      <RouterLink to="/privacy">隐私说明</RouterLink>
      <p>示例故事保存在应用内，不会为此调用故事生成服务。</p>
    </footer>
  </div>
</template>
