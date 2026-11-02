<script setup lang="ts">
import SitePage from './SitePage.vue';
</script>

<template>
  <SitePage title="使用指南">
    <section class="paper-card">
      <h2>课堂准备</h2>
      <ol>
        <li>打开首页，选择一个示例，或进入“写自己的故事”。</li>
        <li>成人确认本课显示设置。自编故事需要选择难度、检查全文并确认发送。</li>
        <li>成人查看故事、词卡、练习和重点词。五项都确认后，孩子才进入学习。</li>
        <li>准备一个安静的位置。孩子可以休息、求助或提前结束。</li>
      </ol>
    </section>
    <section class="paper-card">
      <h2>家长陪同</h2>
      <p>示例课程可以直接阅读。自编故事的英语、词卡和练习来自文字生成，需要成人逐项检查。</p>
      <p>句子和词卡可以使用浏览器自带语音朗读。没有可用语音时，页面仍保留文字。</p>
      <p>本课报告和故事书可以下载为 PNG。文件保存在当前设备上。</p>
    </section>
    <section class="paper-card">
      <h2>常见问题</h2>
      <h3>需要注册吗？</h3>
      <p>不需要。当前版本没有家庭账号，也不保存跨课程的学习档案。</p>
      <h3>刷新后课还在吗？</h3>
      <p>同一浏览器里尚未结束的临时课堂可以继续。清理或过期后，原来的课程地址不再打开。</p>
      <h3>示例会消耗生成次数吗？</h3>
      <p>不会。六个示例是应用内的静态内容。</p>
    </section>
  </SitePage>
</template>
