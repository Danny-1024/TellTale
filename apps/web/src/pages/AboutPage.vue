<script setup lang="ts">
import SitePage from './SitePage.vue';
</script>

<template>
  <SitePage title="关于 TellTale English">
    <section class="paper-card">
      <p>TellTale English 把一段中文经历变成可以阅读、练习和带回的英语小故事。</p>
      <p>
        1.2.0
        提供首页、六个静态示例、自编故事、成人审核、句子导航、浏览器朗读、本课报告和故事书图片。
      </p>
      <p>课程运行在 Cloudflare Workers 与 SQLite Durable Objects 上。页面使用 Vue。</p>
      <p>家庭账号、短信、生成配图、独立内容安全服务、语音识别和服务端语音合成尚未提供。</p>
    </section>
  </SitePage>
</template>
