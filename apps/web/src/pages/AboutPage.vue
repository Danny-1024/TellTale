<script setup lang="ts">
import SitePage from './SitePage.vue';
import { TELLTALE_VERSION } from '@telltale/contracts';
</script>

<template>
  <SitePage title="关于 TellTale English">
    <section class="paper-card">
      <p>TellTale English 把一段中文经历变成可以阅读、练习和带回的英语小故事。</p>
      <p>
        版本 {{ TELLTALE_VERSION }}。支持创建分级英语课堂、成人审核、听读练习、下载绘本与练习报告。
      </p>
      <p>启用配图服务时，自编故事可生成经过安全检查的句子插图和词卡图，供成人审核。</p>
    </section>
  </SitePage>
</template>
