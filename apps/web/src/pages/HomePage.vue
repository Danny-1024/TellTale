<script setup lang="ts">
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
          <RouterLink class="button primary large" to="/course?mode=custom">创建课程</RouterLink>
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
        <li><strong>准备故事</strong><span>选择难度，检查生成的文字和配图。</span></li>
        <li><strong>陪伴学习</strong><span>逐句听读，查看词卡，完成本课练习。</span></li>
        <li><strong>保存成果</strong><span>下载本课绘本与练习报告。</span></li>
      </ol>
    </main>
  </div>
</template>
