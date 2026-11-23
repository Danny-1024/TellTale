<script setup lang="ts">
import {
  AESOP_ART_CREDIT,
  AESOP_EDITION_URL,
  classicArtwork,
  CLASSIC_STORIES,
  CLASSIC_STORY_IDS,
} from '@telltale/contracts';
import StatusBanner from './StatusBanner.vue';
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
        <RouterLink to="/guide">使用指南</RouterLink>
        <RouterLink to="/privacy">隐私说明</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
    </header>
    <StatusBanner />
    <main id="page-main" class="content landing">
      <section class="landing-intro">
        <div class="hero-copy">
          <h1>把故事带进<br class="desktop-break" />英语课堂</h1>
          <p class="lead">
            成人准备和审核，孩子读故事、学词语、做练习。课后可以保存双语绘本和练习报告。
          </p>
          <div class="landing-actions">
            <RouterLink class="button primary large" to="/course?mode=custom">创建课程</RouterLink>
            <a class="button outline" href="#classic-stories">浏览经典故事</a>
          </div>
          <p class="soft small">为 7–12 岁儿童设计 · 无需注册</p>
        </div>
        <div class="landing-cover" aria-hidden="true">
          <div class="cover-leaf">
            <span class="cover-name" lang="en">TellTale<br />English</span>
            <span class="cover-caption">双语故事绘本</span>
          </div>
        </div>
      </section>
      <ol class="landing-flow" aria-label="课堂流程">
        <li><strong>准备故事</strong><span>从故事库选书，或创建自己的配图故事。</span></li>
        <li><strong>陪伴学习</strong><span>逐句听读，查看词卡，完成本课练习。</span></li>
        <li><strong>保存成果</strong><span>下载本课绘本与练习报告。</span></li>
      </ol>
      <section id="classic-stories" class="classic-stories" aria-labelledby="classic-stories-title">
        <h2 id="classic-stories-title">经典故事</h2>
        <ul class="classic-story-grid">
          <li v-for="id in CLASSIC_STORY_IDS" :key="id">
            <RouterLink class="classic-story-card" :to="{ path: '/course', query: { sample: id } }">
              <img :src="classicArtwork(id)" alt="" loading="lazy" />
              <strong>{{ CLASSIC_STORIES[id].title }}</strong>
              <span lang="en">{{ CLASSIC_STORIES[id].titleEn }}</span>
            </RouterLink>
          </li>
        </ul>
        <p class="soft small">
          选自《伊索寓言》，课堂版为双语改编。插图 {{ AESOP_ART_CREDIT }}。
          <a :href="AESOP_EDITION_URL">查看馆藏原版</a>
        </p>
      </section>
    </main>
  </div>
</template>
