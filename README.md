# TellTale English

TellTale English 是面向 7–12 岁儿童的英语故事学习 Web 应用。成人可以把虚构的中文故事转化为英语学习材料，检查内容后交给孩子阅读和练习。

在线体验：[telltale.cc.cd](https://telltale.cc.cd/)

## 功能

- 输入中文故事，使用 DeepSeek 生成分级英语故事、词卡和练习；也可以使用内置示例故事。
- 成人审核故事、词卡、题目和答案，从五个词中选择 2–3 个重点词并更新练习。
- 儿童逐句阅读、查看词卡，完成选择、配对和填空练习；学习时可以查看提示、请求帮助、休息或提前结束。
- 查看逐词练习报告，下载报告与故事书 PNG，结束时清理本课数据。
- 课程最长保留 4 小时，连续 15 分钟没有活动后失效。课程设置入口提供操作确认，无法验证操作者身份。

当前自编故事支持文字生成；家庭账号、生成配图、语音识别和语音合成属于后续产品范围。

## 使用技术

前端使用 Vue 3、TypeScript 和 Vite；应用运行在 Cloudflare Workers，课程数据保存在 SQLite Durable Objects。故事生成使用 DeepSeek API。

## 本地运行

需要 Node.js 24 或以上版本以及 pnpm 10.33.4。

```bash
pnpm install --frozen-lockfile
pnpm build:worker
pnpm exec wrangler dev --local
```

使用命令输出的本地地址访问应用。自编故事生成需要为本地 Worker 配置 `DEEPSEEK_API_KEY`；示例故事可在没有该密钥时使用。密钥应保存在本地私密配置中。

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
