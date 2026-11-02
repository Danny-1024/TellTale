<script setup lang="ts">
import SitePage from './SitePage.vue';
</script>

<template>
  <SitePage title="隐私说明">
    <section class="paper-card">
      <p>无需注册，不收集儿童姓名、学校、生日或诊断信息。</p>
      <p>
        自编故事仅在成人确认后发送给
        DeepSeek，用于生成英语句子、词卡和练习。请使用虚构情节，并删除可识别个人的信息。生成结果需要成人逐项审核。
      </p>
      <p>
        课堂内容存储在 Cloudflare，最多保留 4 小时；连续 15
        分钟无活动后关闭。结束课堂会清理在线课程数据。Cloudflare 的恢复机制可能保留最近 30
        天的存储历史，恢复后的课程仍受原有效期限制。
      </p>
      <p>
        朗读使用浏览器或系统语音。TellTale 不为此新增音频接口，也不把朗读文本发送到故事生成服务。
      </p>
      <p>当前版本不提供家庭账号、短信登录、长期学习档案或跨课程记录。</p>
    </section>
  </SitePage>
</template>
