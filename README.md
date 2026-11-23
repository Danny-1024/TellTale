# TellTale English

TellTale English 是面向 7–12 岁儿童的英语故事学习 Web 应用。成人可以从经典故事库选书，或把虚构的中文故事转化为英语学习材料，审核后交给孩子阅读和练习。

在线体验：[telltale.cc.cd](https://telltale.cc.cd/)

## 功能

- 经典故事库收录《龟兔赛跑》《狮子和老鼠》《乌鸦喝水》《狐狸和葡萄》，配有双语短句、原版插图、词卡和练习。故事改编自美国国会图书馆收藏的 [1919 年版《伊索寓言》](https://www.loc.gov/item/19014083/)，插图由 Milo Winter 绘制。
- 从首页创建课程，输入中文故事，使用 DeepSeek 生成分级英语故事、词卡和练习。
- 成人审核故事、词卡、题目和答案，从五个词中选择 2–3 个重点词并更新练习。启用配图后，成人另行确认教学内容已移除可识别的个人信息，系统为每句故事和五张词卡生成图片并审核文字和图片。
- 儿童逐句阅读、查看词卡，完成选择、配对和填空练习；学习时可以查看进度、使用浏览器本地朗读，也可以查看提示、请求帮助、休息或提前结束。
- 提供使用指南、隐私说明和关于页。临时课堂、本地朗读和结果页均无需注册。
- 查看逐词练习报告，下载报告与故事书 PNG，结束时清理本课数据。
- 课程最长保留 4 小时，连续 15 分钟没有活动后失效。课程设置入口提供操作确认，无法验证操作者身份。

家庭账号、语音识别和语音合成属于后续产品范围。

## 使用技术

前端使用 Vue 3、TypeScript 和 Vite。应用运行在 Cloudflare Workers，课程内容和审核后的配图保存在 SQLite Durable Objects。故事文字由 DeepSeek 生成，配图与安全检查使用 OpenAI API。

## 本地运行

需要 Node.js 24 或以上版本以及 pnpm 10.33.4。

```bash
pnpm install --frozen-lockfile
pnpm build:worker
pnpm exec wrangler dev --local
```

使用命令输出的本地地址访问应用。在本地忽略文件 `.dev.vars` 中配置 `DEEPSEEK_API_KEY` 以生成自编故事，配置 `OPENAI_API_KEY` 以启用配图和安全检查。正式环境从 Cloudflare Worker Secrets 读取。

## 验证与构建

```bash
pnpm check
pnpm test:worker
pnpm build:worker
```

`pnpm check` 包含类型检查、静态检查、格式检查、测试和构建；数据库集成测试需要可用的本地 MongoDB 副本集。`pnpm test:worker` 使用本地 workerd 与 SQLite 验证课程流程。

## 产品文档

- [产品需求文档](docs/telltale-prd.md)
- [技术规格文档](docs/telltale-spec.md)
