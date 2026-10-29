# TellTale English 技术规格文档 Spec

| 文档信息 | 内容 |
| --- | --- |
| 版本 | 1.2 |
| 编制日期 | 2026年10月19日 |
| 对应需求 | telltale-prd.md，PRD-001至PRD-034，NFR-01至NFR-10 |
| 系统形态 | 当前发布使用Vue响应式Web、Cloudflare Workers与SQLite Durable Objects |
| 文档用途 | 约定模块、数据、接口、状态、算法、部署和测试要求 |
| 状态说明 | 本文是目标设计；现有示例代码提供目录和技术参考，完整实现及真实服务集成以测试记录为准 |

## 当前发布实现：1.1.0

本节规定2026年10月22日发布的有效实现。后续章节的家庭账号、MongoDB、Redis、腾讯云媒体与语音服务等设计对应完整产品需求，尚未纳入当前部署。

2026年10月29日增加当前临时课程的重点词与逐词报告。`POST /api/v1/course/focus`接收operationId、当前revision和2–3个不同的当前wordId；仅成人审核状态允许。按词卡释义和Intl.Segmenter定位的原句重建题目，不调用模型；保留lesson、sentence和word编号及全文，新题编号与revision共同更新，重新确认五项检查。相同请求返回原回执，内容冲突、旧版本、未知词及儿童请求拒绝。reviewIssues由前后端共享，保存失败不替换原材料。

CourseAttempt增加当次support列表，分别记录hint、adultHelp和replay；只有提示及成人帮助改变supported条件，同题先前有尝试仍保留retry。服务端按choice/cloze的targetWordIds及match逐组leftId投影5个WordPracticeResult，保留每条尝试与时间，不根据最终正确覆盖先前结果。尚未提交的词显示unpracticed，单纯阅读不产生独立完成。

`GET /api/v1/course/report`仅允许有效成人访问已经结束的课堂，返回公开lesson和从原始事件、作答重建的summary，不返回私有答案。summary包含finishedAt及wordResults，既有1.0课堂可从原记录重建投影，缺失时间保持null。报告Canvas宽1080，根据真实字形宽度换行；包含审核版本、重点词、逐词结果与次数、实际支持条件和建议。取得当前服务端授权后生成预览与下载链接，过期、清理、离开及新运行释放Blob。生产服务绑定和迁移保持既有配置。

- 前端：Vue 3、TypeScript、Vite。复用原有demo的奶油色背景、蓝色主操作、薄荷色词卡、Nunito字体和固定操作栏，支持电脑、平板及手机。学习页面采用至少56像素主要操作区域、键盘焦点及减少动效选项。
- 发布：GitHub `Danny-1024/TellTale` 的main分支触发Workers Builds；构建命令`pnpm build:worker`，部署命令`pnpm exec wrangler deploy`。Worker名称`telltale`，生产域名`https://telltale.danny-dev.workers.dev`。静态资源与API同源。
- 服务端：`apps/worker/src/index.ts`处理API与Cookie；`CourseRoom`为每课独立的SQLite Durable Object，存储课程、成人审核、临时运行令牌、尝试与支持事件；`TrafficQuota`保存限额预留记录。迁移标识`v1-courses`，绑定`COURSES`与`QUOTAS`。
- 生成：服务端通过HTTPS调用DeepSeek `/chat/completions`，模型`deepseek-flash`，关闭思考模式，使用JSON输出及Zod严格校验。45秒总期限，最多三次尝试；取消后即使供应商返回也不会覆盖当前内容。供应商密钥通过`DEEPSEEK_API_KEY` Secret绑定注入，前端无法读取。
- 权限：随机会话Cookie为HttpOnly、SameSite=Lax，生产使用Secure与`__Host-`前缀。所有写请求校验Origin、JSON类型及CSRF。成人六位口令通过PBKDF2与随机盐保存，连续五次错误锁定十分钟。儿童页面内存保存独立运行令牌；成人审核返回私有答案，儿童响应投影仅提供已审核公开材料。
- 数据：请求正文限制32KB，输入故事最多300个Unicode字符，拦截联系方式；一课最多十次生成、全站24小时最多100次、每个来源IP每小时最多五次创建。课程闲置租约15分钟、绝对期限4小时，由持久闹钟清理；主动结束删除课程记录。平台恢复历史仍服从课程原始有效期。
- 作品：浏览器Canvas生成宽1080像素PNG。自编故事包含审核后文字，示例包含本地图片。文件由成人下载到设备，服务器不建立公开作品链接。

主要接口：`GET /api/v1/capabilities`、`POST/GET /api/v1/session`、`GET /api/v1/course/review`；`POST /api/v1/course/{sample,generate,cancel,edit,approve,event,answer,finish,unlock,heartbeat,close}`。涉及业务变更的请求使用UUID操作标识防止重复写入，同一标识与不同请求内容冲突返回409。练习提交携带审核版本，旧版本返回409。所有API响应禁止缓存。

课程状态为prepare、review、learning、finished；生成状态为queued、running、ready、failed、cancelled。审批进入儿童模式并生成运行令牌，刷新后必须成人验证；审核修改增加版本号。作答、跳过和支持使用真实服务端事件判定，未提交内容不计为错误。网络中断保留未确认操作标识，重试取得原结果。

测试使用真实本地workerd与SQLite实例验证进程重启、权限、幂等、版本冲突、判题、支持证据和清理；供应商验收单独使用真实DeepSeek请求。生产发布后核对GitHub提交、Workers部署版本及线上业务闭环。

当前学习界面的性能指标依2026年10月26日确认使用ICP：以真实可信点击的事件时间为起点，观察同一interactionId对应的interaction-contentful-paint条目，取最终最大内容候选的largestContentfulPaint.renderTime与起点之差，第75百分位≤2500毫秒，包含异步读取与资源加载。入口文档LCP另行测量；完整产品的标准学习页LCP和实体移动设备性能保留未验收。按钮选择状态的首次绘制第95百分位≤200毫秒，异步处理状态首次绘制第95百分位≤1000毫秒，普通API第95百分位≤800毫秒，生成期限45秒，固定网络与负载采用第14.2节并记录实际适用范围。

## 1 技术决策与约束

| 编号 | 领域 | 统一决定 |
| --- | --- | --- |
| DEC-01 | 客户端 | Vue 3、TypeScript、Vite、Vue Router、Pinia；使用响应式单页应用，公共项目页面生成静态页面 |
| DEC-02 | 服务端 | Node.js、TypeScript、Fastify；API与任务进程独立运行，统一服务层执行业务权限 |
| DEC-03 | 数据库 | MongoDB，使用支持事务的副本集；生产使用托管数据库，开发和测试保留相同事务能力 |
| DEC-04 | 异步任务 | Redis与BullMQ；MongoDB保存业务任务与持久投递记录，Redis只承担队列及短时协调 |
| DEC-05 | 媒体与文件 | 腾讯云COS私有存储；业务API检查权限后代理读取，敏感媒体不返回对象存储直链 |
| DEC-06 | 生成与语音 | 腾讯混元文字与图片能力、腾讯云ASR、TTS、文本与图片内容安全；通过独立服务适配模块调用 |
| DEC-07 | 登录与会话 | 手机验证码，服务端不透明会话，HttpOnly Cookie；儿童访问绑定当课运行实例 |
| DEC-08 | 发布 | 腾讯云服务器运行API和任务服务；HTTPS反向代理将静态站点和API置于同一站点来源 |
| DEC-09 | 作品 | 服务端使用Playwright与Chromium渲染固定宽度绘本，输出1080像素宽的单张PNG |
| DEC-10 | 恢复范围 | 本次页面运行内由Pinia保存学习草稿；提交的家庭证据写入数据库；刷新后结束草稿 |
| DEC-11 | 资料导出 | ZIP、JSON、CSV和PNG；使用成熟库生成和读取文件格式，CSV预防公式注入 |

Redis、BullMQ、MongoDB事务、服务端绘本和会话租约是本规格确定的实施细节。服务型号、正式域名和供应商模型标识通过环境配置提供，启用前使用真实账号验证，不将示例标识当作可调用配置。

依赖采用发布时仍受支持、经过兼容性验证的版本，安装后由pnpm-lock.yaml固定。Node.js遵循项目声明的最低22版本要求，交付时固定实际使用的受支持主版本与补丁版本。本文不将任何未安装版本称为已验证版本。

## 2 模块结构与运行关系

### 2.1 目录与职责

| 目录或模块 | 职责 |
| --- | --- |
| apps/web | 成人准备、儿童学习、家长记录、机构课堂、共享接收页面和公共介绍路由 |
| apps/api | HTTP路由、请求校验、会话、权限、业务服务和统一错误处理 |
| apps/worker | 生成、安全检测、语音、绘本、导出、删除、课堂清理与投递任务 |
| packages/contracts | TypeBox运行时Schema、TypeScript类型、枚举、难度参数和公开DTO |
| packages/domain | 内容校验、课程状态变更、作答判定、词语证据和建议选择规则 |
| packages/providers | 腾讯云SDK、对象存储、短信、生成、内容安全、ASR与TTS适配 |
| content/samples | 经审核的示例正文与公开媒体；答案保存在服务端私有资源中 |
| content/suggestions | 经人工维护的中文建议库及教学支持配置 |
| docs与design | PRD、Spec、接口说明、使用部署资料、测试记录、海报和授权清单 |

浏览器通过同源HTTPS访问API。API只处理短请求，将耗时工作写入业务任务和投递记录；投递程序将任务提交到BullMQ，Worker执行供应商调用。文件写入私有COS，MongoDB保存其业务归属、校验值和状态。浏览器按任务状态更新页面，任何供应商凭据均留在服务端。

公共页面和经核验的示例媒体允许缓存。家庭故事、审核结果、题目、记录、私有媒体、共享和导出响应均使用Cache-Control: private, no-store。不得将家庭资源写入公共静态目录、共享CDN缓存或前端构建产物。

### 2.2 服务适配合同

适配模块统一接收requestId、operationId、deadline、AbortSignal和实际输入，返回供应商请求编号、业务结果、耗时和可重试分类。LLM、Image、ASR、TTS、Safety、SMS、Storage分别独立实现，业务层不直接引用供应商响应格式。

启动时校验环境变量、模型标识、数据库事务能力和存储权限。缺少必需配置立即终止启动并给出配置字段名称。可预期的输入错误、供应商异常、取消及资源清理按明确规则处理；非预期异常保留原始错误原因和关联编号，不转换成成功或虚构内容。

## 3 身份 会话与权限

### 3.1 家庭登录

手机号按E.164规范处理，界面默认中国大陆区号。服务端保存应用层加密手机号和用于查询的密钥HMAC，不把手机号写入日志。短信验证码为随机6位，5分钟有效，单次使用；Redis只保存带服务端密钥的校验值。每个验证码最多校验5次，发送间隔60秒，每手机号每小时最多5次，每来源IP每小时最多20次；异常流量通过明确的请求限制和告警处理。

验证码用途区分login、reverify、share_access，challengeId绑定用途、手机号、会话或共享对象；一种用途的验证码无法用于其他操作。校验成功后失效。真实短信供应商返回错误时保留错误编号并显示服务暂不可用，生产不提供固定验证码。

登录Cookie使用__Host-telltale_session，Secure、HttpOnly、SameSite=Lax、Path=/，只保存随机不透明凭据，服务端保存其摘要。会话绝对有效期7天，连续24小时无活动后过期；退出和账号删除立即撤销。写操作校验CSRF令牌、Origin和Content-Type，跨站来源拒绝访问。

### 3.2 成人与儿童切换

服务端会话包含mode: adult或child。进入儿童学习后，原成人会话切换为child，旧成人页面下一次请求同样受限制。儿童页面另持内存中的runtimeToken，仅授予当前runId、lessonId和contentVersionId的学习与提交权限。runtimeToken不放在URL、localStorage、sessionStorage或埋点中。

返回成人准备须再次校验家长短信验证码。查看家长记录按每次打开记录视图完成验证，签发仅用于该视图的10分钟只读授权；刷新视图、切换儿童或过期需要重新验证。共享创建和撤销、导出、删除及注销各自使用一次性操作授权，绑定action、目标对象和请求摘要，5分钟有效，提交成功后消费，重复请求通过幂等结果返回。

机构创建时设置6位成人口令，使用Argon2id保存摘要，口令不传入儿童数据。每次进入机构成人设置须校验，5次错误后锁定10分钟；绝对有效期随课堂结束。课堂成人身份通过HttpOnly Cookie保存，切换儿童模式后同样锁定成人接口。创建课堂每来源IP每小时最多5次、同时活动课堂最多2个，容量受第14章限制。

### 3.3 访问矩阵

| 资源或操作 | 家庭成人 | 当课儿童 | 机构成人 | 共享接收人 |
| --- | --- | --- | --- | --- |
| 本家庭档案与授权 | 本账号可访问 | 拒绝 | 拒绝 | 拒绝 |
| 故事输入和内容审核 含答案 | 所属课程 成人模式 | 拒绝 | 本课堂 成人模式 | 拒绝 |
| 已审核学习材料 无答案 | 所属课程 | 绑定运行实例 | 本课堂 | 拒绝 |
| 题目提交 | 不代替儿童提交 | 绑定课程 当前版本 | 可标明成人示范 | 拒绝 |
| 家长记录 | 档案归属 加记录视图授权 | 拒绝 | 拒绝 | 仅所授权快照 |
| 机构小组摘要 | 拒绝 | 仅儿童本课反馈 | 本课堂 成人验证 | 拒绝 |
| 绘本生成与个人下载 | 所属课程 成人模式 | 仅预览 | 本课堂 成人模式 | 仅授权作品读取 |
| 共享 导出 删除 | 本账号 一次性操作授权 | 拒绝 | 仅结束本课堂 | 拒绝 |

每次访问均检查主体、会话模式、对象归属、授权状态、课程和版本状态、删除状态。未获授权的资源统一返回404，避免透露对象是否存在。缺少合法会话返回401，已知主体缺少操作能力返回403。

### 3.4 临时运行实例

运行实例由浏览器内存中的随机runtimeId绑定，前台每30秒发送心跳，服务端将leaseExpiresAt延长至最后有效活动后15分钟，绝对有效期为创建后4小时。休息页处于前台时继续心跳；页面隐藏先停止声音，并尝试发送一次当前活动通知。后台计时可能受到浏览器限制，返回后首先验证租约，再恢复画面。

学习结束将运行实例改为完成或提前结束，立即禁止继续作答，仅保留本课成果预览能力；家庭历史访问由成人账号负责。机构成人在查看摘要和下载后显式结束课堂，服务端原子撤销全部课堂访问、取消未完成任务并发起清理。pagehide和刷新只用于尽力通知，资源清理不能依赖这些事件。页面重新加载不找回内存token，不能重新接管旧运行实例；成人进入后创建新课，遗留实例依租约关闭。家庭已提交证据继续保留，无记录授权与机构数据执行临时清理。

## 4 数据模型与约束

### 4.1 公共规则

所有业务标识使用随机UUID，时间使用服务端UTC的ISO 8601格式；中文界面和日期筛选按Asia/Shanghai解释。所有持久文档包含id、schemaVersion、createdAt、updatedAt。可被修改的聚合另含revision，写入时比较版本。

家庭数据带adultId、childId；机构数据带classSessionId且childId为空；无长期记录授权的示例带sampleSessionId且childId为空。三种归属互斥，临时示例使用机构成人相同的当课能力和口令规则，sourceType只能为sample。所有文件元数据携带相同归属，访问对象文件时重新检查。输入Schema拒绝未知字段和不合法枚举，归属只能由服务端根据会话和已验证目标推导，客户端不能自由指定。

### 4.2 主要集合

| 集合 | 关键字段 | 约束和用途 |
| --- | --- | --- |
| adults | phoneCiphertext、phoneLookupHmac、guardianDeclaredAt、status | 手机查询摘要唯一；注销状态禁止访问 |
| consents | adultId、kind、granted、policyVersion、changedAt | 按授权类型保存事件；当前状态单独索引；撤回即时生效 |
| children | adultId、nickname、gradeBand、englishStart、avatarId、status | 昵称1–20字符；使用预置头像；不保存诊断与学校 |
| authSessions | tokenHash、principalType、principalId、mode、lastSeenAt、expiresAt、revokedAt | 会话可撤销；读写均检查时间 |
| classSessions | adminSessionId、pinHash、status、leaseExpiresAt、expiresAt、cleanupTaskId | 本课堂临时归属，不生成长期个人档案 |
| lessons | owner、settingsSnapshot、sourceType、sourceSnapshot、status、activeVersionId、revision | sourceSnapshot含确认中文、输入revision和时间；开课锁定设置 |
| contentVersions | lessonId、versionNo、sentences、vocabCards、exercisesPrivate、validation、safety、approval、status | 内容及答案私有；批准后内容不可变；音频状态单独记录 |
| runs | lessonId、contentVersionId、runtimeIdHash、tokenHash、mode、status、leaseExpiresAt、expiresAt | 仅恢复访问状态，不保存未提交答案草稿 |
| jobs | owner、kind、inputVersionId、status、stage、attempts、deadline、errorCode、providerRequestId | 持久任务事实；不在队列复制故事正文 |
| outbox | eventId、aggregateId、kind、payloadRefs、publishedAt、attempts | 与业务写入同一事务，确保任务可投递 |
| attempts | principalId、runId、exerciseId、targetId、attemptNo、answer、result、supportSnapshot、actor、operationId | 不可变；区分儿童、成人示范、小组归属 |
| learningEvents | runId、eventType、sentenceId、vocabId、supports、operationId | 只记实际展示或点击事件；不采集点击速度画像 |
| wordEvidence | adultId、childId、wordKey、level、attemptId或eventId、previousEvidenceId、observedAt | 证据追加；最近表现和历史最高证据分开展示 |
| suggestions | childId、lessonId、suggestionId、reasonCodes、adopted、helpful | 来源为维护中的建议库；下一课按档案继承 |
| mediaAssets | owner、contentVersionId、kind、objectKey、sha256、mimeType、width、height、status、aiGenerated | 不保存永久公共URL；相同归属下才复用私有资源 |
| artworks | owner、lessonId、contentVersionId、assetId、status | 成果锁定版本，展示来源与AI标识 |
| shares | owner、recipientPhoneHmac、recipientPhoneCiphertext、scopeSnapshot、tokenHash、expiresAt、revokedAt | 指定接收人和对象；内容快照经过字段白名单 |
| dataTasks | owner、kind、scopeSnapshot、status、progress、assetId、expiresAt、errorCode | 导出、删除和课堂清理的真实进度 |
| deletionLedger | opaqueSubjectHash、scope、requestedAt、backupExpiresAt、completion | 用于备份恢复后重新应用删除，不保留故事或手机号 |
| idempotency | principalId、route、operationId、requestHash、responseRef、expiresAt | 请求去重；相同编号不同请求返回冲突 |

### 4.3 内容字段

sentences含id、order、en、zh、imageAssetId、audioAssetId。vocabCards含id、word、wordKey、zhMeaning、exampleSentenceId、imageAssetId、audioAssetId。题目共享id、type、targetVocabIds、promptZh、instructionAudioAssetId、hintId；私有字段包括correctOptionId或correctPairs。词卡例句引用真实故事句，不允许使用无关联的额外经历。

settingsSnapshot包含gradeBand、englishStart、difficulty、showChinese、volume、reduceMotion、reviewWordKeys、focusVocabIds、adoptedSuggestionId。reviewWordKeys最多3个，focusVocabIds为2–3个，引用本课5张词卡。音量0–1，默认0.8；中文默认显示，减少动效默认开启；系统减少动效偏好为真时强制减少动效。

supportSnapshot包含replayed、hintViewed、adultHelp、zhVisible、hadPriorIncorrect、attemptKind。支持条件由服务器已接收事件与当前请求合并，客户端不得把已经使用过的提示改回false。

### 4.4 必须建立的索引

| 集合 | 索引或唯一条件 |
| --- | --- |
| adults | phoneLookupHmac唯一 |
| contentVersions | lessonId与versionNo组合唯一 |
| runs | 同一lessonId至多1个active或resting运行实例；tokenHash唯一 |
| attempts | runId、exerciseId、targetId、attemptNo组合唯一；principalId与operationId操作唯一 |
| wordEvidence | childId、wordKey、observedAt；attemptId或eventId及wordKey组合唯一 |
| jobs | owner、kind、inputVersionId、generationRevision的活动任务去重键 |
| outbox与idempotency | eventId唯一；principalId、route、operationId组合唯一 |
| shares | tokenHash唯一；owner、revokedAt、expiresAt |
| children与lessons | adultId、childId、status、createdAt分页索引 |
| 临时记录 | expiresAt清理索引；应用请求同时检查过期时间 |

TTL索引用于最终回收，不作为权限过期判断或完整级联删除依据。文件和关联集合由清理任务逐项删除。attempts、证据和任务状态的原子关联通过MongoDB事务实现；外部服务调用在事务之外执行。[MongoDB事务要求](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/)

### 4.5 字段类型与关系

| 字段类别 | 类型与约束 |
| --- | --- |
| id和关联id | UUID字符串；必需关联存在且归属相同；跨归属引用拒绝 |
| revision与versionNo | 正整数；新建为1；条件更新成功后增加1 |
| createdAt updatedAt expiresAt | UTC日期时间；可选时间为空值，不使用空字符串 |
| status type mode kind | 由合同声明的字符串枚举；禁止任意字符串 |
| en zh promptZh zhMeaning | NFC字符串；故事英语每句1–500字符，逐句中文1–300字符；题干与释义1–200字符 |
| sourceSnapshot | confirmedZh为1–300码点；inputRevision为正整数；confirmedAt为服务端时间 |
| answer | choice或cloze为optionId；match为leftId和rightId；均为当前题目中的UUID |
| result | correct或incorrect或skipped；未作答没有attempt文档 |
| attemptNo | 每个run与题目target的正整数序号，从1开始，重做由服务端递增 |
| approval | adultPrincipalId、approvedAt、contentHash、checklistVersion；未批准为空 |
| safety | 输入文字、输出文字、各图片分别记录status、policyVersion、checkedAt和检测请求编号 |
| mediaAssets尺寸 | 图片width和height为正整数；音频durationMs为正整数；无关字段为空 |

课程拥有多个内容版本，版本拥有固定句子、词卡和题目；run只引用一个版本；attempt只引用该run中的题目target；wordEvidence引用一个已提交attempt或真实展示event；作品固定引用一个版本；共享固定引用对象清单。关系删除由第13章任务按清单执行。

## 5 学习内容合同与校验

### 5.1 生成输入

输入含成人确认的中文sourceZh、difficulty、gradeBand、englishStart、reviewWordKeys、promptVersion和settingsHash。sourceZh先做Unicode NFC规范化并去除首尾空白，使用Unicode码点计数，长度1–300；20–150作为编辑建议。空白、明显联系方式及不安全输入在调用生成前返回需要修改的原因。

只向供应商发送经成人确认的必要故事和教学参数，不发送手机号、儿童昵称、账号标识、诊断或家庭背景。故事中的指令一律按学习素材处理，不能修改系统指令、调用工具或改变输出Schema。输入信息不足时返回INPUT_NEEDS_DETAIL，请成人补充。

### 5.2 结构与语言约束

LLM返回结构化JSON，通过TypeBox与Ajv验证，禁止静默补足缺失字段。3–5句英语按序编号，逐句有中文和配图描述；词卡恰好5张、wordKey不重复；恰好3道不同类型练习。3种练习类型为choice、match、cloze。

英文词数统一采用Intl.Segmenter('en', {granularity: 'word'})，计数isWordLike为true的片段，标点不计数，数字片段计1词，连字符按该分词器结果计算。前后端共享测试样例，服务端结果为最终校验。L／M／H每句最多8／12／16词；TTS输入另限制每句最多500个英文字符，以符合所选基础合成接口。[腾讯云TTS接口](https://cloud.tencent.com/document/api/1073/37995)

每个词卡词必须完整匹配至少一个故事分词，比较时忽略大小写并规范化撇号，wordKey由规范化英文和语境词义标识组成；同形异义词分开记录。reviewWordKeys必须在本课词卡与故事中出现，否则返回内容约束错误。

choice题有3个互异选项且正确选项恰好1个。match有2–3个互异英文和2–3个互异中文项，私有答案是一一映射，逐组判定。cloze含1个空格、2–3个互异候选词，正确词来自故事且语义唯一。生成时预选2–3个候选重点词，成人可在审核时调整；调整后若题目不能覆盖所选词，重新生成并校验三道练习，清空原审核检查项。全部题目合计覆盖成人指定的2–3个重点词，每组配对可单独提供词语证据；未被题目检查的词只产生接触证据。

格式、引用和答案存在性由程序验证；语法、原意、干扰项合理性、语义唯一性与图片匹配由成人审核。程序不得宣称已经自动证明英语语义唯一。

### 5.3 图片与安全

每句关联1张故事图片，5张词卡分别关联图片；仅在同一归属、相同语义与图像内容适合时复用。所有图片具有来源、AI状态、尺寸、校验值及安全结果，不允许把任意模型返回URL直接交给浏览器读取。

Worker从供应商结果读取媒体时限制协议、目的主机、重定向次数、响应大小、类型和时间，阻止访问内网地址。图片重新编码为标准PNG或WebP并清除元数据。文字和图片安全检测均明确为pass后才进入待审核；unknown、timeout、review或reject状态均不能批准。

安全检测不通过只对相应部分重新生成，修复最多2轮并受任务总期限限制。输入本身不安全、配置错误和确定的权限错误不自动重试。检测服务不可用时任务失败，真实原因通过安全错误码保留。

### 5.4 审核与公开DTO

成人批准条件：结构有效、输入和输出安全通过、全部图片就绪、2–3个重点词已选、原意／语法／难度／唯一答案／图片检查项全部确认。批准提交携带expectedRevision；并发编辑后旧批准返回409。审批人和批准时间由服务端写入。

成人读取使用AdultContentDTO，包含私有答案及审核信息。儿童读取使用独立ChildLessonDTO白名单投影，只含显示文字、选项、词卡、经过授权的媒体标识及进度。禁止返回answerKey、correctOptionId、correctPairs、正确位置、供应商原始响应、内部审核备注、故事原始中文及成人信息。

儿童前端构建、公开JSON、source map和静态示例均不得携带答案。默认GET题目只提供普通指令；提示由单独授权接口取得并记录为已使用支持。提交后仅反馈该次是否正确及说明，不返回整题答案表。

## 6 状态与版本变更

### 6.1 内容版本状态

| 当前状态 | 允许的动作 | 后续状态和约束 |
| --- | --- | --- |
| draft | 确认输入并生成 | generating；保存输入摘要和设置快照 |
| generating | 文字及图片完成 | checking；不向儿童开放 |
| checking | 结构和安全全部通过 | review；否则在限额内修复或failed |
| review | 成人编辑 | 新建versionNo，执行受影响校验；原草稿状态superseded |
| review | 成人批准 | preparing_audio；写入不可变审核内容和审批记录 |
| preparing_audio | 全部音频合成并验证 | ready；音频均绑定本版本 |
| preparing_audio | 音频失败 | media_failed；允许仅重试失败媒体 |
| media_failed | 成人发起重试 | preparing_audio；内容未改动时保留批准 |
| ready | 创建学习运行实例 | 版本仍为ready，由run承担学习状态 |
| draft至media_failed | 取消或结束 | cancelled；迟到结果失去提交资格 |
| failed | 成人重新生成 | 新业务任务和新内容版本，保留当前确认输入 |

批准后的内容不可原地修改，需复制为新版本。儿童已经开始的run固定原版本直到结束；成人编辑另建课程草稿，无法把新内容注入当前run。未开始学习时切换到新版本即停止向新课程提供旧资源。家庭历史证据可保留其原版本引用，仅供有权成人追溯。

### 6.2 课程和运行实例状态

lesson.status为preparing、ready、learning、completed、ended_early、cancelled或deleting。run.status为active、resting、completed、ended_early、expired或revoked；phase为listen、practice或book，resting保留原phase。仅ready版本可创建run。

自然完成是3道练习均有completed或skipped的终态，展示各自实际结果；提前结束使用ended_early，未做项目保持not_started。跳过整道配对题时，未完成组标记skipped，已经完成组继续保留。completed不等于全部答对。

### 6.3 异步结果提交条件

Worker开始和提交结果前均检查任务状态、期限、归属授权、输入版本、当前generationRevision及删除状态。结果写入使用条件更新，只有预期revision和活动任务同时匹配时才能提交。取消先递增generationRevision并将任务置cancelled；即使供应商无法中止，返回结果也无法被接纳，其临时文件进入清理。

内容、媒体、题目、作品和作答一律携带contentVersionId。读取到不存在、失效或不匹配的版本返回CONTENT_VERSION_MISMATCH，界面停止推进并由成人处理，禁止静默切换材料。

### 6.4 任务状态

jobs.status为queued、running、succeeded、failed或cancelled。只有queued可以开始running；running可提交succeeded、failed或cancelled，queued可直接cancelled。终态不能被迟到响应修改，成人重试建立新job或显式增加当前媒体重试revision。等待成人审核属于contentVersion.status=review，不占用Worker运行锁。

dataTasks.status为queued、running、completed或failed。删除任务失败后访问继续关闭；重试从已经确认完成的清单项之后继续，不能把未删文件标记完成。课堂和运行租约过期与任务执行错误分别记录。

## 7 异步任务 幂等与重试

### 7.1 任务投递和查询

创建任务时以MongoDB事务写入jobs与outbox。投递程序使用eventId作为BullMQ jobId；投递确认后设置publishedAt。每30秒检查未投递事件和长时间无心跳任务。API崩溃后仍能根据outbox继续投递；Worker重启根据持久状态从尚未完成的阶段执行。[BullMQ幂等任务](https://docs.bullmq.io/patterns/idempotent-jobs)

前端轮询GET /jobs/:id，活动时每2秒查询，60秒后每5秒查询；页面隐藏停止轮询，返回后查询一次。任务阶段使用queued、input_check、text、images、safety、adult_review、audio、render、packaging、deleting、completed；只显示实际阶段，不编造完成百分比。

### 7.2 时间与次数

| 任务 | 单次调用或阶段期限 | 自动重试 | 任务期限与结果 |
| --- | --- | --- | --- |
| 文字生成及结构修复 | 每次最多15秒，实际使用剩余期限 | 最多3次重试，共最多4次尝试；间隔1、2、4秒 | 从任务受理开始共45秒，包含最多10秒排队；到期明确失败 |
| 图片与图片安全 | 每次最多60秒，并发2个 | 临时错误最多2次；内容修复最多2轮 | 整组180秒；不满足则失败，禁止审核批准 |
| 中文ASR | 每次最多30秒 | 临时错误最多1次 | 60秒，失败保留可编辑文字入口 |
| 审核后英语TTS | 每次最多20秒，并发2个 | 临时错误最多2次 | 全部音频120秒，失败为media_failed |
| 绘本 | 渲染阶段30秒 | 临时资源错误最多1次 | 60秒，保留预览与失败原因 |
| 家庭数据导出 | 分批读取与打包 | 存储或网络临时错误最多2次 | 10分钟，失败不返回不完整下载 |
| 在线数据删除 | 分批删除，每批有确认 | 清理可重入，失败告警后续执行 | 家庭24小时；课堂结束后15分钟，超期状态如实显示 |

45秒是文字目标和应用期限，失败同样按时返回。文字通过后图片继续生成，成人可查看只读草稿；图片与安全未全部通过时批准按钮禁用。API创建任务的受理响应仍遵守1秒内显示状态要求。

供应商429按Retry-After等待并受总期限约束，网络暂时错误和5xx可重试，错误输入、鉴权、余额不足和安全拒绝立即返回相应错误。重试次数按业务任务累计，BullMQ重投递不得重置业务计数。BullMQ的attempts表示包含首次执行的总次数；文字最多3次重试对应最多4次尝试。[BullMQ重试说明](https://docs.bullmq.io/guide/retrying-failing-jobs)

### 7.3 操作去重和不确定结果

所有产生副作用的业务请求携带Idempotency-Key，值为每个用户动作生成的UUID。相同主体、路由和编号的相同请求返回原响应；相同编号但请求体不同返回409 IDEMPOTENCY_CONFLICT。处理中返回原jobId，重复作答返回原attemptId。记录至少保留24小时，最终业务结果另有唯一索引防重复。

网络重发必须沿用原编号，儿童主动重做使用新编号与服务器认可的新attemptNo。生成同时按lessonId、确认输入、设置与generationRevision去重，防止不同编号的连续点击形成多份活动任务。

外部服务调用无法保证只收费一次。调用前持久记录operationId，记录供应商requestId；若服务支持查询则查询原任务，结果未知且无法查询时标记PROVIDER_RESULT_UNKNOWN，交由成人明确重新发起，避免后台无限重复调用。业务结果和作答证据仍只提交一次。

## 8 HTTP接口合同

### 8.1 公共约定

基址为/api/v1，JSON使用UTF-8。JSON请求体最大64 KB，录音上传3 MB；分页limit默认20、最大100，使用不透明cursor。普通更新携带If-Match或expectedRevision，版本不符返回409。所有返回包含requestId；201表示新对象，202表示已受理异步任务，成功删除受理返回202，立即操作成功返回200或204。

请求Schema与响应Schema由packages/contracts声明，Fastify编译校验并生成OpenAPI 3.1文件，开发和测试CI检查该文件与处理器Schema一致。错误响应为{error:{code,message,retryable,fieldErrors?},requestId}，message为可公开的中性描述，不包含私人输入和内部服务凭据。

后续表格中A表示家庭成人模式，I表示机构成人模式，C表示当前儿童运行实例，R表示已经验证的共享接收人；星号表示还需一次性操作授权，V表示需家长记录视图授权。

### 8.2 账号 授权与档案接口

| 方法与路径 | 身份 | 关键输入 | 成功响应 |
| --- | --- | --- | --- |
| POST /auth/sms/challenges | 公共 限流 | phone、purpose；共享用途另含shareId | 201 challengeId、expiresAt、resendAfter |
| POST /auth/sms/verify | 公共 | challengeId、code | 200 当前成人及授权状态；设置会话Cookie |
| GET /auth/session | 会话 | 无 | 200 principalType、mode、expiresAt；不返回凭据 |
| POST /auth/reverify | 家庭或机构会话 | challengeId与code，或课堂pin；action、targetId、requestHash | 200 一次性授权或记录viewId；切换成人模式时重新验证 |
| POST /auth/child-mode | A或I | runId | 200 mode=child；服务端锁定成人权限 |
| POST /auth/logout | 会话 | 无 | 204 撤销会话与运行访问 |
| GET /me/consents | A | 无 | 200 三项当前状态及说明版本 |
| PUT /me/consents/:kind | A | granted、policyVersion、guardianDeclared；撤回需操作验证 | 200 状态；需清理时附dataTaskId |
| GET或POST /children | A | 列表cursor；创建传nickname、gradeBand、englishStart、avatarId | 200 列表或201 child |
| PATCH /children/:id | A | 修改字段、expectedRevision | 200 child与revision |
| DELETE /children/:id | A* | deletionScopeConfirmation | 202 dataTaskId |
| DELETE /me | A* | accountScopeConfirmation | 202 dataTaskId；撤销其他会话 |

账号删除后提供仅能查询该删除任务状态的短期凭据，不能恢复账号数据访问。授权写入、账号创建及档案创建均检查监护声明和当前说明版本。

### 8.3 课程 内容与任务接口

| 方法与路径 | 身份 | 关键输入 | 成功响应 |
| --- | --- | --- | --- |
| GET /samples | 公共 | difficulty可选 | 200 可用示例摘要；不返回答案 |
| GET /samples/:id | 公共 | 无 | 200 安全示例显示DTO与公开媒体 |
| POST /lessons | A或I | childId或classSessionId、settingsSnapshot、sourceType | 201 lessonId、revision |
| PUT /lessons/:id/source | A或I | sourceZh、confirmed、processingNoticeVersion、expectedRevision | 200 输入摘要与revision |
| POST /lessons/:id/voice | A或I | multipart录音、durationMs、mimeType | 202 asrJobId |
| POST /lessons/:id/generations | A或I | confirmedSourceRevision、expectedRevision | 202 jobId、contentVersionId |
| GET /jobs/:id | 所属A或I | 无 | 200 kind、status、stage、attempts、errorCode、resultRef |
| POST /jobs/:id/cancel | 所属A或I | expectedRevision | 200 cancelled；清理临时媒体 |
| GET /lessons/:id/review | A或I | versionId | 200 AdultContentDTO |
| POST /lessons/:id/versions | A或I | baseVersionId、改动字段、expectedRevision | 201 新versionId与校验任务 |
| POST /content-versions/:id/approve | A或I | expectedRevision、focusVocabIds、reviewChecklist | 202 audioJobId；预置示例确认可直接200 ready |
| POST /content-versions/:id/media-retry | A或I | 失败媒体标识 | 202 jobId |
| POST /lessons/:id/runs | A或I | confirmedVersionId、runtimeId、ownerType | 201 runId、runtimeToken、expiresAt；随即切换儿童模式 |

示例当课模式由POST /sample-sessions建立临时成人会话，填写当课必要处理确认且不创建持久儿童档案；课程sourceType固定sample。家庭无记录授权和机构模式均不能伪造childId写入个人记录。机构语音和故事提交前须确认已取得当课必要授权，界面保存确认时间和说明版本。

### 8.4 儿童学习接口

| 方法与路径 | 身份 | 关键输入 | 成功响应 |
| --- | --- | --- | --- |
| GET /runs/:id/content | C | 无 | 200 ChildLessonDTO、contentVersionId |
| POST /runs/:id/heartbeat | C | runtimeId、phase | 200 leaseExpiresAt |
| POST /runs/:id/events | C | operationId、事件及资源标识 | 201 eventId；只接受白名单事件 |
| POST /runs/:id/exercises/:eid/hints | C | hintKind、targetId | 200 展示提示；服务端先记录支持 |
| POST /runs/:id/exercises/:eid/attempts | C | attemptNo、targetId、answer、supportFlags、contentVersionId | 201 attemptId、correct、feedback、nextAllowedActions |
| POST /runs/:id/exercises/:eid/retries | C | previousAttemptId | 200 nextAttemptNo；保留支持历史 |
| POST /runs/:id/exercises/:eid/skip | C | 未完成targetIds | 200 skipped项与当前结果 |
| POST /runs/:id/rest | C | 原phase、已提交事件位置 | 200 resting；草稿只保存在前端 |
| POST /runs/:id/continue | C | runtimeId | 200 active；失效返回410 |
| POST /runs/:id/finish | C | reason=completed或ended_early | 200 本课摘要、成果状态；关闭继续作答 |
| GET /media/:assetId | 所属A I C或R | 可选Range头 | 200或206媒体；每次重新检查权限 |

选择或填空的answer为{optionId}，配对的answer为{leftId,rightId}，逐组提交targetId。接口校验选项和配对项属于当前题目，attemptNo必须等于服务端当前允许值。重复同一操作返回原记录；提前提交后续题目返回INVALID_TRANSITION。

支持事件包括sentence_shown、vocab_opened、audio_replayed、hint_viewed、adult_help、rest_entered和rest_returned。提示接口返回成功前写入hint_viewed；前端作答请求同时携带尚待确认的支持条件，服务端只允许合并增加，防止请求乱序漏记提示。

### 8.5 作品 记录 共享与数据接口

| 方法与路径 | 身份 | 关键输入 | 成功响应 |
| --- | --- | --- | --- |
| GET /lessons/:id/summary | 所属A或I | 无 | 200 完成环节和实际作答摘要 |
| POST /lessons/:id/artworks | A或I | contentVersionId、adultConfirmed | 202 jobId或200已有artwork |
| GET /artworks/:id | 所属A或I | 无 | 200 状态与受控预览标识 |
| GET /artworks/:id/download | 所属A或I | 无 | 200 PNG文件流及Content-Disposition |
| GET /children/:id/word-records | A V | from、to、wordKey、cursor | 200 最近表现与证据列表 |
| GET /children/:id/lessons | A V | from、to、cursor | 200 本课记录、作品、支持条件 |
| GET /lessons/:id/suggestion | A V | 无 | 200 一条建议及reasonCodes |
| PUT /children/:id/adopted-suggestion | A | suggestionId或null、expectedRevision | 200 下次默认支持设置 |
| PUT /suggestions/:id/feedback | A | helpful=true或false或null | 200 当前反馈 |
| POST /shares | A* | scope、objectIds、recipientPhone、expiresInDays | 201 shareId与分享入口 |
| DELETE /shares/:id | A* | expectedRevision | 204 撤销并关闭接收会话 |
| POST /shared/:token/challenges | 公共 限流 | recipientPhone | 201 验证挑战；不透露完整手机号 |
| POST /shared/:token/verify | 公共 | challengeId、code | 200 scoped共享会话Cookie |
| GET /shared/:token/content | R | 无 | 200 字段白名单内的共享快照 |
| POST /data-exports | A* | childId、scope | 202 dataTaskId |
| GET /data-tasks/:id | 所属A I或任务凭据 | 无 | 200 status、progress、errorCode、expiry |
| POST /data-tasks/:id/retry | 所属A*或I | expectedRevision | 202 原任务继续执行 |
| POST /data-exports/:id/download-grants | A | 无 | 201 30分钟下载凭据，作用域仅该产物 |
| GET /data-exports/:id/download | A或下载凭据 | 无 | 200 ZIP流；产物状态与删除权限复查 |

### 8.6 机构接口

| 方法与路径 | 身份 | 输入与响应 |
| --- | --- | --- |
| POST /class-sessions | 公共 限流 | pin、processingNoticeAccepted；返回classId和临时成人Cookie |
| GET /class-sessions/:id | 本课堂I | 当前课堂状态、设置和租约 |
| POST /class-sessions/:id/heartbeat | 本课堂I或绑定C | 更新课堂租约；准备阶段同样保留活动心跳 |
| GET /class-sessions/:id/summary | 本课堂I 成人验证 | 本课匿名小组摘要，无个人记录 |
| POST /class-sessions/:id/end | 本课堂I 成人验证 | 原子关闭所有运行和访问，202 cleanupTaskId |

### 8.7 错误与界面动作

| 状态码与错误 | 含义 | 界面处理 |
| --- | --- | --- |
| 400 INPUT_INVALID或INPUT_NEEDS_DETAIL | 输入不完整或格式错误 | 定位输入项，保留已填内容 |
| 401 SESSION_EXPIRED | 会话缺失或过期 | 停止敏感读取，引导成人验证 |
| 403 CONSENT_REQUIRED或ADULT_REQUIRED | 授权或成人操作条件未满足 | 展示对应授权或验证入口 |
| 404 RESOURCE_NOT_FOUND | 不存在或无归属权限 | 通用无法访问说明 |
| 409 REVISION_CONFLICT或IDEMPOTENCY_CONFLICT | 旧版本写入或操作编号冲突 | 重新读取当前对象，保留本地编辑内容 |
| 409 CONTENT_VERSION_MISMATCH或INVALID_TRANSITION | 题目版本或步骤不合法 | 暂停推进，保留本地任务供成人处理 |
| 410 RUN_EXPIRED或SHARE_REVOKED | 临时访问已经终止 | 清除凭据与私有页面，显示结束原因 |
| 413 VOICE_TOO_LARGE | 录音超过3 MB | 保留说明，重新录音或输入文字 |
| 422 CONTENT_INVALID或SAFETY_REJECTED | 生成校验或安全未通过 | 不开放儿童内容，成人修改或结束 |
| 429 RATE_LIMITED | 请求或服务额度限制 | 尊重Retry-After，不重复自动提交 |
| 502 PROVIDER_FAILED或PROVIDER_RESULT_UNKNOWN | 外部服务失败或结果不确定 | 显示具体阶段与可用动作 |
| 504 JOB_DEADLINE_EXCEEDED | 任务达到总期限 | 明确失败，保留成人确认输入 |
| 500 INTERNAL_ERROR | 非预期故障 | 显示requestId供排查，原始原因保存在受控日志 |

## 9 前端路由 组件与状态

### 9.1 路由与页面

| 路由 | 页面 | 守卫条件 |
| --- | --- | --- |
| /intro /guide /faq /privacy /contact | 公共介绍与说明 | 公开，使用示例素材 |
| /login /consents /children | 家庭登录 授权 档案 | 按会话和授权控制 |
| /class/new /class/:id | 课堂创建和成人管理 | 限流或本课堂成人身份 |
| /setup /home | 设置和两个故事入口 | 成人设置；故事选择可交给儿童 |
| /story/new /story/:lessonId/jobs | 输入和任务等待 | 所属成人模式 |
| /story/review/:lessonId | 内容审核 | 所属成人模式及指定版本 |
| /learn/:runId/listen/:index | 听读 | 有效runtimeToken和审核版本 |
| /learn/:runId/practice/:index | 单题练习 | 同上，步骤校验 |
| /learn/:runId/rest | 休息 | 同一运行实例，保留原页面状态 |
| /learn/:runId/book /lesson/:id/complete | 绘本及本课成果 | 儿童只预览，下载须成人 |
| /parent/records /parent/lessons/:id | 家长证据与详情 | 成人模式加记录视图授权 |
| /parent/privacy /parent/data-tasks/:id | 共享与数据管理 | 成人模式及对应任务归属 |
| /shared/:token | 共享接收 | 指定接收人验证码 |

runId可以用于路由识别，不承担授权作用；runtimeToken仅在内存传递Authorization。路由守卫改善交互，服务端继续实施全部权限。未知路由显示404和安全返回入口，不静默打开其他家庭或课堂内容。

### 9.2 学习状态

Pinia的LearningRuntime集中保存runId、versionId、phase、sentenceIndex、exerciseIndex、openedVocabId、helpOpen、restSnapshot、drafts、feedbackStage与pendingOperationIds。每题draft包含选项、当前配对两侧、已确认配对、提交状态和反馈。休息先同步复制快照、停止声音再切换视图，不能等待网络成功后才停止声音。

未提交答案只在内存存在；网络失败保留草稿和同一operationId。提交成功才把界面改为已提交。若返回结果与当前runId或versionId不匹配则丢弃，记录技术错误并保持真实状态。重做时向服务端获取新attemptNo，不能仅清除页面反馈后覆盖原记录。

独立的sessionStore负责身份，lessonStore负责审核材料，learningStore只读取儿童DTO，recordsStore和dataTaskStore在退出、切换档案、撤回或访问过期时清空。多标签通过BroadcastChannel传递注销和模式变更通知，服务端状态始终为准。

### 9.3 布局组件与无障碍

ChildShell统一顶部、任务区、固定操作区，当前内容设置主标题和合理焦点。HelpPanel、RestView、SentenceCard、VocabCard、ChoiceQuestion、MatchQuestion、ClozeQuestion和InlineFeedback复用交互规则。成人页面使用语义化表单、字段错误和明确进度。

CSS使用rem表达字体并满足儿童正文20–24、英语24–32、成人至少16 CSS px的默认尺寸，缩放后允许换行。主要操作目标至少56×56 CSS px、间距12 CSS px，内容底部padding根据实际工具区高度和env(safe-area-inset-bottom)计算，键盘弹出时仍可滚动找到按钮。

所有操作支持Tab、Enter、Space和可见焦点，配对不依赖拖动。反馈区域使用aria-live=polite，错误关联aria-describedby；面板限制焦点并允许Escape关闭，关闭后恢复触发焦点。prefers-reduced-motion或成人设置任一要求减少动效即关闭非必要动画。禁止自动播放和自动推进。

## 10 浏览器录音 播放与下载

### 10.1 成人录音

录音前校验产品语音授权和HTTPS上下文，仅点击开始时调用getUserMedia({audio:true,video:false})。麦克风能力需要安全上下文和浏览器许可；权限对话框长期未处理时允许成人取消等待，之后迟到取得的流立即stop全部音轨。[MDN麦克风接口](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

MediaRecorder先用isTypeSupported探测audio/webm;codecs=opus、audio/mp4和audio/ogg;codecs=opus，选择第一个明确支持的格式，仍须处理开始和编码失败。服务器以ffprobe检查真实容器、音轨、时长和大小；不信任客户端扩展名。ffmpeg在受限进程中转为16 kHz单声道PCM WAV，最大执行15秒、限制内存、禁止外部网络输入。[MDN录音格式探测](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static)

原文件和规范化文件均不得超过60秒与3,000,000字节，录制按已收字节和时长任一达到上限即停止，最终超限返回明确错误。ASR采用腾讯云SentenceRecognition、16k_zh、VoiceFormat=wav，通过短期服务端私有地址读取，避免Base64扩大请求体。该服务明确支持60秒及3 MB以内短音频。[腾讯云一句话识别](https://cloud.tencent.com/document/product/1093/35646)

停止、取消、页面隐藏、离开页面或授权撤回时终止录音并释放所有MediaStreamTrack，撤销Blob URL。转写后展示可编辑文字，不直接提交生成。成功转写后立即删除原始和规范化录音；失败或异常中断的文件最迟24小时内清理。

### 10.2 单一音频播放器

使用一个HTMLAudioElement播放句子、词语或指令。每次手动播放前停止旧音频，将当前audioAssetId和播放序号绑定，处理play()返回Promise的成功与拒绝；只有实际开始播放后显示停止按钮。播放失败保持原任务并提供重试。[MDN音频播放](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)

切句、休息、关闭相关面板、退出、visibilitychange到hidden或pagehide时pause并复位当前时间，取消尚未完成的媒体请求，旧回调不能再次启动声音。回到前台仅恢复页面，声音继续停止。浏览器页面隐藏事件用于停止媒体，租约用于服务器清理；两者职责分别实施。[MDN页面可见性](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)

TTS按contentVersionId、句子或词卡文字、音色和语速生成资源索引，英语采用PrimaryLanguage=2，输出MP3；5张词卡同时生成单词音频，通用中文操作指令使用预先审核的真实指令音频。未变化文字的底层文件只在同一家庭或同一临时课堂内复用，新版本拥有独立访问引用；敏感音频不跨家庭复用。每段检查音频非空、可解码、时长合理以及文字摘要匹配，全部必需声音就绪后才开放学习。

儿童图片和音频先用携带内存runtimeToken的fetch读取，再建立仅本页使用的Blob URL交给img和audio元素；元素不直接访问需要Authorization头的接口。句子切换、离开页面和访问撤销时清理Blob URL，退出和切换档案清空私有资源内存。媒体获取失败不得自动播放上一句声音。

### 10.3 文件下载

绘本和导出由同源接口返回文件流，设置正确Content-Type、Content-Disposition和安全文件名。桌面和移动浏览器使用正常下载入口，iOS可打开文件预览并由成人使用浏览器提供的保存功能。

下载按钮只在服务端产物完成且读取成功后启用。浏览器是否显示保存提示、自动下载或打开文件由浏览器和设置决定，因此页面只说明已生成文件、已发起下载及保存操作，不将触发链接当作文件已写入设备的证据。[MDN下载行为](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)

## 11 作答判定 词语证据与建议

### 11.1 服务端判定

choice与cloze以optionId匹配私有唯一答案；match以当前leftId和rightId匹配私有映射。程序先校验版本、题目顺序、选项归属、targetId、attemptNo和运行状态，再在事务内写入attempt、词语证据和操作结果。

配对逐组确认，只有正确或明确跳过的组进入终态；错误组可重做，已完成组拒绝重复占用相同中文项。选择和填空答错后必须获取重做序号才允许再次作答。客户端传入的correct、level、adultId或历史提示清除字段均拒绝。

成人示范使用actor=adult_demo，机构集体作答使用actor=group；只有家庭模式、学习记录授权有效、归属明确且actor=child的作答才能生成个人表现证据。客户端不提供修改归属或把示范改为儿童作答的接口。

### 11.2 表现层级算法

| 层级 | 触发条件 | 保留条件 |
| --- | --- | --- |
| first 初次接触 | 首次实际展示句子或词卡，或词语有尚未独立完成的练习结果 | 展示事件或作答记录可追溯；错误和跳过另有完成状态 |
| with_hint 提示下完成 | 正确提交，且使用提示、成人协助，或同一题目标先前有错误 | 保留具体支持，不改写首次结果 |
| independent 独立完成 | 当前题目标首次有效提交正确，无额外提示、成人代答或同题错误 | 正常题干、配置中的中文与首次标准播放属于基线，条件同时展示 |
| delayed_independent 延迟复习中独立完成 | 已有independent证据，间隔至少24小时，另一次课程、另一道新题独立完成同词义 | previousEvidenceId关联前次证据；服务器UTC计算时间差 |

单纯重听正常示范不等于答案提示，replayed仍如实记录；打开包含答案线索的提示、请成人帮助、先前答错后重做均阻止本次计为independent。支持条件可以增加，不因关掉帮助面板而清除。仅打开帮助菜单而未使用具体支持不改变层级。

每条证据追加保存，按词汇语义wordKey归并。页面“最近表现”取最近有效事件，“历史证据”按时间列出；历史最高层级若显示，须明确其日期，不能掩盖最近一次提示或未完成。所有层级描述学习条件，不显示“已掌握”、专注分数或医疗判断。

### 11.3 延迟复习安排

成人从历史词中选择最多3个复习词，生成时强制进入故事和5张词卡；审核时将拟评估词列为重点练习词，3道练习的目标集合覆盖全部重点词。若短文难以同时满足词数、语义与复习词要求，返回CONTENT_CONSTRAINT_UNSATISFIED，由成人调整输入或复习词，不静默删掉复习要求。

延迟复习候选需存在至少24小时前的独立证据，新题exerciseId和课程lessonId与前次不同；服务端计算，客户端修改设备时间无效。同一语义通过提示完成继续记录with_hint，不升级。

### 11.4 建议选择

建议库每条包含id、textZh、supportedConditions、settingChanges和applicability。优先选择与本课真实支持条件对应且成人尚未标记无帮助的建议，按固定排序取1条；无对应证据时显示明确适用条件的一般陪伴建议。输出保存suggestionId和reasonCodes，不使用模型编造儿童行为。

采纳仅写入当前childId的nextLessonDefaults，保留成人手工修改；重复操作幂等。建议文本不得根据休息、用时和点击推断注意力、英语成绩或病情。

## 12 绘本 共享与数据导出

### 12.1 绘本生成

Worker只读取获准版本的英语句子、标题和图片，以统一HTML模板按宽1080 CSS px、deviceScaleFactor=1渲染；高度随3–5句完整内容增长，最高8000像素，超过限制报排版错误。每个句块包含对应图片和英文，正文使用已授权可嵌入字体，图中保留AI生成标识；示例另标示例故事。

渲染使用Playwright与Chromium，禁止HTML执行用户输入，所有文字通过模板转义。仅允许从受控内部媒体服务读取资产，禁用任意外部网络；等待全部图片decode和document.fonts.ready后截图。输出检查PNG可解码、宽度恰好1080、句子文本数量与版本一致、文件非空、素材引用相同版本。渲染失败不创建成功作品。

相同内容版本与模板版本使用唯一作品键，避免重复生成。存入COS并验证sha256后才将artwork置ready。无长期授权的示例或机构作品只能在有效会话期间下载，随当课清理。

### 12.2 指定对象共享

分享范围可选一张作品、指定课程或指定时间范围内的词语记录；创建时解析并固定对象清单，排除手机号、原始故事输入、内部答案、成人验证资料和其他档案数据。期限1–30天，默认7天。分享只生成入口，成人自行转交指定接收人，系统不自动发送私人消息。

共享入口使用高强度随机token，数据库保存摘要，页面设置Referrer-Policy: no-referrer且不加载第三方统计。接收人按指定手机号验证码建立仅该shareId有效的HttpOnly会话，无需建立家长账号。未匹配接收人无法读取内容，公开页面不泄露完整手机号。

所有共享内容及媒体请求通过API再次检查expiresAt、revokedAt、源数据删除状态与当前分享授权；禁止返回预签名直链或可公开缓存的资源。撤销事务设置revokedAt并撤销接收会话，下一次读取立即拒绝。已经发送到接收设备的字节和已下载文件无法由服务撤回，界面说明此范围。

### 12.3 家庭数据导出

导出以已确认childId及scope建立不可变对象清单，在任务开始和下载时复查权限和删除状态。ZIP包含manifest.json、profile.json、consents.json、lessons.json、content-versions.json、attempts.csv、word-evidence.csv、suggestions.json、artworks目录及字段说明，manifest记录schemaVersion、导出时间、范围、文件数量和sha256。

JSON使用标准序列化器；CSV使用csv-stringify，UTF-8带BOM，用户输入以=、+、-、@等可能形成公式的内容按文本转义；ZIP使用archiver流式打包。数据量按分页处理，文件未完全生成和校验前不提供下载。原始录音已按期限删除，导出不重建录音。

产物私有保存24小时，创建下载授权时签发30分钟有效的高强度下载凭据，只允许下载该产物；每次下载仍查询任务与源数据访问状态。删除源档案时同时使导出任务和下载授权失效，并清除产物。

## 13 授权撤回 删除与机构清理

### 13.1 授权撤回

撤回语音授权：停止浏览器录音、取消未完成ASR并删除录音，不影响已完成文字录入。撤回分享授权：拒绝新共享并立即撤销现有共享及接收会话。撤回学习记录授权：停止个人写入、结束个人课程运行、撤销相关共享，创建删除该儿童学习档案及关联学习数据的任务；保留成人登录账号和无内容授权事件，可继续临时示例学习。

每次API和Worker提交均读取当前有效授权，不能仅依赖任务创建时快照。供应商请求已经发出时立即请求取消，返回结果丢弃并清理；清楚记录外部服务已经接收的处理范围及供应商保存政策。

### 13.2 删除事务与清单

删除任务受理时，在事务内把目标标记deleting、递增访问版本、撤销会话和共享、写入deletionLedger与outbox。随后按清单取消任务、删除导出、作品、媒体、证据、作答、事件、内容版本、课程和档案，最后检查各类剩余数量。注销账号继续删除其全部档案、手机号密文和登录会话。

dataTask记录totalItems、processedItems和当前类别；只有可准确计数时才显示百分比。删除对象成功或确认不存在才计入完成。遇到网络或权限错误保留真实失败原因，状态failed，继续禁止访问，支持再次验证后重试。主数据库与对象在线数据目标24小时内完成，过期告警，不能把软删除标记当作全部删除完成。

deletionLedger只保存不可反向识别个人的随机主体摘要、范围和删除时间，在相关备份全部到期后清除。备份最长保存30天；恢复时在开放任何业务访问前重新执行删除清单，并验证已删除主体无可访问对象。

### 13.3 机构与临时示例

课堂结束前由成人查看小组摘要和下载作品。结束提交原子撤销课堂全部访问，取消活动任务，启动15分钟内完成的在线清理；摘要、草稿、录音、媒体、作答、作品和课堂口令均在清单内。小组摘要不写入长期统计，也不混入任何家庭证据。

异常关闭由每分钟执行的租约扫描触发结束，最长15分钟无活动后关闭，课堂绝对有效期4小时；无记录授权的示例采用相同运行清理规则。机构及临时内容使用独立数据库和COS存储范围，关闭对象版本保留和内容备份，避免临时内容进入30天家庭备份；后台清理需扫描全部对象版本和未完成分片上传。

清理失败时凭证继续失效，任务状态可由受限维护接口查看并告警。应用提醒成人自行处理共享设备的下载目录，无法以服务端清理证明本地文件已经删除。

## 14 配置 性能与可观测性

### 14.1 配置类别

| 配置组 | 必需内容 |
| --- | --- |
| Web与API | APP_ORIGIN、PUBLIC_SITE_URL、NODE_ENV、PORT、可信代理范围 |
| 数据与队列 | MONGODB_URI、临时数据库连接、REDIS_URL、队列前缀、加密密钥引用 |
| 存储 | COS地域、家庭与临时桶标识、服务身份凭据、生命周期策略 |
| 短信 | 签名、模板、发送地域、验证码及限流参数 |
| 生成 | 文本模型、图片模型、提示词版本、调用预算、并发、超时和重试参数 |
| ASR与TTS | ASR引擎、英语音色、语速、输出编码、供应商权限 |
| 内容安全 | 文本和图片检测服务配置、处置规则版本 |
| 数据任务 | 日志30天、备份30天、录音24小时、导出24小时、删除期限、课堂租约 |
| 监控 | 错误收集地址、告警接收配置、请求追踪采样；不包含内容正文 |

配置模板只列字段名、类型、用途和安全示例，不包含真实密钥。开发、测试和正式环境分别使用域名、数据库、Redis前缀、对象存储与服务凭据。正式服务启动后以受控健康检查核验依赖，外部内容服务另有真实冒烟验证记录。

### 14.2 验收负载与资源限制

性能测试固定50个同时活动学习会话、5个同时内容生成任务、每秒10次普通业务请求，持续15分钟。测试网络为下行10 Mbps、上行2 Mbps、往返延迟100毫秒，分别记录电脑和实际移动设备。普通API95百分位≤800毫秒，不含外部生成、文件流和排队；学习页LCP75百分位≤2.5秒，本地交互95百分位≤200毫秒。

每成人或课堂同时最多1个活动生成任务，平台文本并发5、图片并发2、TTS并发2、绘本并发1；单个成人每日自编故事生成上限20次、机构课堂最多10次。达到上限显示明确原因，不自动改用其他材料。并发和额度属于运行保护配置，交付压测验证后记录实际容量。

Redis启用持久化和noeviction，队列连接与普通缓存连接分别管理；任务结果以MongoDB为准。业务任务有租约和工作心跳，崩溃恢复后执行幂等检查；不能用进程内数组承担持久任务。[BullMQ生产部署](https://docs.bullmq.io/guide/going-to-production)

### 14.3 日志 指标与告警

日志白名单包括requestId、匿名主体摘要、route、codeVersion、promptVersion、stage、durationMs、status、errorCode和providerRequestId；禁止请求体、授权头、Cookie、手机号、验证码、共享token、故事、录音、图片原始地址和模型完整输出。错误对象在进入日志前移除敏感字段，内部根因和调用位置仍保留。

监控登录失败率、业务API延迟、任务积压、供应商错误、内容校验不通过、取消后结果拒绝、媒体播放错误、绘本失败和清理积压。安全检测服务失败、删除超过期限、课堂清理超过15分钟、队列不消费及磁盘不足触发告警。日志保存30天，机构内容和家庭故事不进入分析平台。

## 15 测试设计与需求对应

### 15.1 测试层级

领域测试覆盖字数、词数、内容Schema、唯一答案的结构约束、作答判定、配对进度、24小时间隔、建议选择和状态变更。接口集成测试使用真实MongoDB副本集、Redis、私有测试存储和HTTP服务，验证事务、权限、幂等、媒体访问及清理。浏览器测试使用Playwright覆盖页面和网络交互。

真实服务验收使用标注为测试的虚构故事与测试账号，分别连接真实短信、LLM、图片、安全、ASR、TTS和对象存储。用于隔离第三方或复现超时、权限错误、断网和迟到响应的模拟必须标明范围，不能作为真实集成通过证据。

### 15.2 测试用例矩阵

| 用例 | 需求 | 必测操作与结果 |
| --- | --- | --- |
| TC-01 | PRD-001、033 | 真实短信登录、错误／过期／限流、注销、成人锁定、跨标签权限撤销均正确 |
| TC-02 | PRD-002、003 | 三项授权分别拒绝和撤回、监护声明、档案隔离和切换，写入权限即时改变 |
| TC-03 | PRD-004、030 | 免注册课堂、成人口令错误锁定、租约过期、结束清理，旧Cookie及媒体读取失败 |
| TC-04 | PRD-005、006 | 三档难度、支持独立、复习词、下一课默认、首页两个入口与未选择禁用 |
| TC-05 | PRD-007、009 | 空白、1／20／150／300／301码点、身份信息提醒、确认后修改、信息不足 |
| TC-06 | PRD-008 | 真机录音、权限拒绝、WebM／MP4、60秒、3 MB、转写编辑、取消与释放麦克风 |
| TC-07 | PRD-010 | 重复提交、最多3次重试、45秒总期限、取消竞态、任务进程重启、结果未知不重复调用 |
| TC-08 | PRD-011 | 3–5句、5张词卡、三类题、答案结构、词语引用、检测超时和图片阻止，不能越过审核 |
| TC-09 | PRD-012、013 | 成人审批、并发编辑409、音频失败与重试、版本一致、示例标记、静态资源无答案 |
| TC-10 | PRD-014、015 | 手动播放、停止、切句、词卡、后台与恢复，只有一个音频且无自动播放 |
| TC-11 | PRD-016、017、018、019 | 三类题正确／错误／撤销／重做／跳过、每组配对、重复重发和旧版本提交 |
| TC-12 | PRD-020、021 | 听读、选择、配对各自帮助和休息，恢复选择与反馈；网络失败与刷新范围准确 |
| TC-13 | PRD-022、023 | 真图绘本宽1080、文字完整、AI标识、图片／字体失败、浏览器下载、提前结束摘要 |
| TC-14 | PRD-024、025 | 真实事件与证据、提示和成人帮助、同题重做、23小时59分与24小时边界、新课新题 |
| TC-15 | PRD-026 | 建议依据真实支持、采用／取消／反馈、隔离档案、下一课继承可修改 |
| TC-16 | PRD-027 | 接收人验证码、字段白名单、对象清单、有效期、撤销前后API和媒体、下载后范围提示 |
| TC-17 | PRD-028 | 实际ZIP解压、JSON／CSV标准解析、公式注入样本、文件数量与hash、下载授权与到期清理 |
| TC-18 | PRD-029 | 删除档案和账号、任务中断重试、对象不存在、撤销访问、全部在线数据数量为零、恢复删除清单 |
| TC-19 | PRD-031、032 | 所有公共路由、当前文案、联系信息、示例标注、海报二维码和素材授权 |
| TC-20 | PRD-034 | 每页单任务、唯一实色推进、按钮56×56及间距、对比度、200%缩放、键盘、读屏、减少动效 |
| TC-21 | NFR-01、02、10 | 规定桌面浏览器和真实iPhone、iPad、Android完整流程，横竖屏及软键盘 |
| TC-22 | NFR-03、04、05 | 固定负载与网络记录延迟、LCP、交互、生成阶段和失败期限 |
| TC-23 | NFR-06、07、08 | 越权、CSRF、答案泄漏、日志扫描、私有存储、乱序、幂等和取消结果提交 |
| TC-24 | NFR-09 | 全新环境部署、进程崩溃、outbox重投、数据库备份恢复、清理告警与配置缺失立即失败 |

### 15.3 浏览器与真实设备

正式交付记录电脑Chrome、Edge、Firefox当前及前一稳定主版本，macOS Safari当前及前一主版本。真实iPhone、iPad Safari和Android Chrome各完成家庭与机构主流程、录音、播放、后台切换、绘本下载和会话清理。手机读屏使用VoiceOver或TalkBack，电脑使用可用读屏与键盘检查。

Playwright的Chromium、Firefox和WebKit自动化结果单独记录，WebKit结果不能替代真实Safari、iOS录音与下载检查。若设备或服务不可用，完成其他可执行测试，缺项标记未执行并说明条件。

### 15.4 发布检查

需求追踪要求PRD-001至034、NFR-01至10和UAT-01至12全部找到测试证据。场景按以下关系组合执行，并记录同一交付版本的完整操作结果。

| PRD验收场景 | 主要技术用例 |
| --- | --- |
| UAT-01 | TC-01、02、04、05、08至15 |
| UAT-02 | TC-06 |
| UAT-03 | TC-04、08、09 |
| UAT-04 | TC-07、23、24 |
| UAT-05 | TC-11、14 |
| UAT-06 | TC-10、12、21 |
| UAT-07 | TC-02、09、13、18 |
| UAT-08 | TC-03、04、09、11、13 |
| UAT-09 | TC-01、16、23 |
| UAT-10 | TC-02、17、18、24 |
| UAT-11 | TC-20、21、22 |
| UAT-12 | TC-19、24 |

构建、类型检查、格式检查、领域和接口测试、浏览器测试、供应商冒烟、真实设备、无障碍和部署恢复全部执行。

测试报告包含用例编号、需求编号、提交版本、环境、实际设备／浏览器、操作、预期、实际、结果、执行时间和证据。数据权限、内容正确性、判定、状态恢复、作品生成及主流程问题全部关闭后才可正式交付。

## 16 部署 运维与交接

### 16.1 环境与网络

开发、测试和正式环境隔离。生产静态前端与公共页面由HTTPS反向代理提供，/api/v1路由至Fastify，Worker不开放公网入口。数据库、Redis与对象存储管理接口仅通过私有网络或受限管理通道访问，服务身份执行最小权限。

默认同源部署，设置Content-Security-Policy只允许本应用脚本和媒体、frame-ancestors 'none'、X-Content-Type-Options: nosniff、Referrer-Policy: no-referrer、Permissions-Policy: camera=(), microphone=(self)。生产禁用公开source map和调试接口，源文件用于受控错误追踪。

正式域名、TLS证书、短信签名模板、腾讯云服务开通和额度、存储生命周期、供应商保存政策、隐私说明、联系方式和素材授权在发布前逐项核实。根据实际部署地区完成相应域名和服务手续，不将未完成事项记为生产已就绪。

### 16.2 发布和健康检查

CI按锁文件安装依赖，执行类型检查、lint、格式检查、领域与集成测试、Web构建、OpenAPI生成差异检查和公开资源答案扫描。制品标注commitSha、buildId、schemaVersion、promptVersion和配置摘要，密钥通过部署环境注入。

启动次序为数据库及索引、Redis、API、Worker和前端。数据库变更通过显式迁移脚本执行，迁移前检查备份和兼容性；旧字段只有确认新版本不再读取后清理。发布制品、数据库结构和提示词版本的兼容关系写入部署说明，并在独立环境验证发布与故障恢复操作。

各健康接口为/health/live检查进程、/health/ready检查数据库、Redis和必要配置，Worker心跳由受限监控读取。供应商冒烟使用虚构短故事，测试文字、安全、图片、ASR、TTS、作品与删除，不访问真实儿童数据。

### 16.3 备份与恢复

家庭数据库每日加密备份，保留最长30天，家庭对象存储记录一致的版本清单，备份访问独立授权；临时机构和无记录授权内容不进入备份。目标RPO为24小时，目标RTO为4小时，通过独立环境演练记录实际时间。

恢复时先关闭业务访问，恢复数据库和媒体清单，应用deletionLedger，验证归属、授权与撤销状态，确认已删除资源不可访问，完成关键场景后开放服务。导出包和原始录音的过期策略在恢复环境继续执行。

### 16.4 交接清单

交付Web及服务端源码、锁文件、构建配置、数据Schema和索引迁移、OpenAPI、提示词与建议库版本、环境变量模板、部署和使用说明、测试报告、备份恢复记录、设计文件、海报电子版及授权清单。正式凭据通过另行约定的安全渠道交接，仓库、文档正文和公共页面均不保存真实密钥。

使用说明明确浏览器访问、语音许可、成人验证、同页休息恢复、刷新结束草稿、图片下载、机构结束和数据删除范围。公共介绍与海报保持与交付版本一致。

## 17 需求来源与设计追踪

| 来源或需求 | 规格章节 | 对应测试 |
| --- | --- | --- |
| 项目方案 v2 Web技术和用户最终决策 | 第1、2、9、10、16章 | TC-19、20、21、24 |
| 项目方案书P1 成人进入 | 第3、4、8、9章 | TC-01至04 |
| 项目方案书P2 内容与审核 | 第5、6、7、8、10章 | TC-05、06、08、09 |
| 项目方案书P3 等待失败取消 | 第6、7、8章 | TC-07、23、24 |
| 项目方案书P4 听读词卡 | 第9、10章 | TC-10、20、21 |
| 项目方案书P5 练习 | 第5、8、9、11章 | TC-11、14 |
| 项目方案书P6 帮助休息 | 第3、6、8、9、10章 | TC-12、21 |
| 项目方案书P7 作品与记录 | 第11、12、13章 | TC-13至18 |
| 项目方案书第3.5、3.6节 展示与交互 | 第9、14、15、16章 | TC-19、20、21 |
| 项目方案书第4至7章 工程与验收 | 第4、7、14、15、16章 | TC-22、23、24 |
| PRD确定的时间与产品参数 | 第3、5、7、11、12、13、14章 | TC-03、05、07、14、16、17、18、22 |

## 18 官方技术参考

技术参考核阅日期为2026年10月19日。以下页面用于核实浏览器和基础组件的行为，产品参数仍以PRD和本文为准。

| 参考 | 使用位置 |
| --- | --- |
| [MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) | 第10.1节 HTTPS、授权、异步权限和音轨释放 |
| [MDN MediaRecorder格式探测](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static) | 第10.1节 按浏览器能力选择录音格式 |
| [MDN页面可见性](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) | 第3.4及10.2节 页面隐藏与停止声音 |
| [MDN音频播放](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) | 第10.2节 播放Promise及失败处理 |
| [MDN下载链接](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) | 第10.3节 下载范围及浏览器保存行为 |
| [腾讯云一句话识别](https://cloud.tencent.com/document/product/1093/35646) | 第10.1节 60秒、3 MB、16k_zh与WAV输入 |
| [腾讯云基础语音合成](https://cloud.tencent.com/document/api/1073/37995) | 第5.2及10.2节 英语参数、MP3与输入长度 |
| [MongoDB事务要求](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/) | 第1及4章 副本集、短事务与外部调用分离 |
| [BullMQ重试](https://docs.bullmq.io/guide/retrying-failing-jobs) | 第7.2节 总尝试次数和退避 |
| [BullMQ幂等任务](https://docs.bullmq.io/patterns/idempotent-jobs) | 第7章 重复执行与业务唯一约束 |
| [BullMQ生产部署](https://docs.bullmq.io/guide/going-to-production) | 第14.2节 Redis持久化和noeviction |
