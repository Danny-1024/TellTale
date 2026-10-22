<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useCourse } from './useCourse';
import type { StoryExercise } from '@telltale/contracts';

const {
  stage,
  session,
  review,
  busy,
  error,
  loading,
  playing,
  pin,
  confirmationPin,
  unlockPin,
  chosen,
  story,
  confirmed,
  difficulty,
  checks,
  settings,
  sentenceIndex,
  exerciseIndex,
  selected,
  leftId,
  resolved,
  feedback,
  hint,
  lastAttempt,
  dialog,
  bookUrl,
  lesson,
  sentence,
  word,
  exercise,
  targetId,
  exerciseDone,
  count,
  progress,
  isChild,
  move,
  create,
  chooseStory,
  generate,
  cancelGeneration,
  saveEdits,
  discardEdits,
  start,
  visitSentence,
  showWord,
  toggleAudio,
  practice,
  answer,
  retry,
  showHint,
  adultHelp,
  rest,
  resume,
  finish,
  nextQuestion,
  unlockAdult,
  makeBook,
  close,
} = useCourse();
const modal = ref<HTMLDialogElement | null>(null);
const editing = ref(false);
const checkLabels = [
  '故事表达了原来的意思',
  '英语、中文和词语释义正确',
  '句子难度适合本课',
  '每道练习的答案准确且唯一',
  '全部内容适合儿童阅读',
];
const title = computed(
  () =>
    ({
      home: '让故事陪伴英语学习',
      setup: '先由成人准备',
      choose: '今天想读什么？',
      input: '把故事讲给我们',
      waiting: '故事正在准备',
      review: '把关每一句话',
      cover: '今天的故事',
      listen: '听读故事',
      practice: '一起做练习',
      rest: '休息一下',
      summary: '把今天的收获带回家',
      book: '我的故事书',
      recover: '请成人回来一下',
      expired: '这一课已结束',
      'generation-error': '故事还没有准备好',
    })[stage.value] ?? 'TellTale English',
);
const replay = computed(() =>
  lesson.value?.sentences.find((s) => s.id === exercise.value?.replaySentenceId),
);
const wordExample = computed(
  () => lesson.value?.sentences.find((s) => s.id === word.value?.sentenceId)?.en,
);
const sourceLabel = computed(() =>
  lesson.value?.source === 'custom' ? '我的故事 · AI 生成文字' : '示例故事',
);
watch(dialog, async (value) => {
  await nextTick();
  if (value && !modal.value?.open) modal.value?.showModal();
  else if (!value && modal.value?.open) modal.value.close();
});
watch(
  () => review.value?.lesson.revision,
  () => {
    editing.value = false;
  },
);
function selectLeft(id: string) {
  leftId.value = leftId.value === id ? null : id;
  selected.value = null;
  feedback.value = '';
}
function selectOption(id: string) {
  selected.value = selected.value === id ? null : id;
  feedback.value = '';
}
function matchAnswer(item: StoryExercise, id: string) {
  const answers = review.value?.answers[item.id];
  return typeof answers === 'object'
    ? item.right.find((right) => right.id === answers[id])?.text
    : '';
}
</script>

<template>
  <div class="course-app" :class="{ 'reduce-motion': settings.reduceMotion }">
    <header class="topbar">
      <a href="/" class="brand" @click.prevent="session ? (dialog = 'close') : move('home')"
        ><span class="brand-mark" aria-hidden="true">t</span> TellTale <span>English</span></a
      >
      <p class="progress-pill">{{ isChild ? progress : '一个故事，一次小小的发现' }}</p>
      <button v-if="session && isChild" class="button outline compact" @click="dialog = 'adult'">
        成人设置
      </button>
      <nav v-else class="top-links" aria-label="使用帮助">
        <button @click="dialog = 'guide'">使用指南</button
        ><button @click="dialog = 'privacy'">隐私说明</button>
      </nav>
    </header>
    <div v-if="error" class="error-banner" role="alert">
      {{ error }}<button aria-label="关闭错误提示" @click="error = ''">关闭</button>
    </div>
    <main v-if="loading" class="content narrow"><h1>正在打开 TellTale…</h1></main>
    <main
      v-else
      class="content"
      :class="{
        narrow: [
          'setup',
          'input',
          'waiting',
          'rest',
          'recover',
          'expired',
          'generation-error',
        ].includes(stage),
      }"
      :aria-busy="busy"
    >
      <template v-if="stage === 'home'">
        <section class="hero">
          <div class="hero-copy">
            <p class="eyebrow">小小的经历，也能成为故事</p>
            <h1 data-title tabindex="-1">我的故事，<br /><span>我的英语。</span></h1>
            <p class="lead">
              讲一个自己的故事，读几句英语，<br class="desktop-break" />把新的词语带进今天的生活。
            </p>
            <button class="button primary large" @click="move('setup')">
              准备今天的故事 <span aria-hidden="true">→</span>
            </button>
            <p class="soft small">由成人准备与审核，再交给孩子。无需注册。</p>
          </div>
          <div class="hero-art">
            <span class="art-label">今天的小故事</span
            ><img src="/samples/park-morning/images/01.svg" alt="小明和妈妈一起去公园" />
            <div class="floating-word">
              <img src="/spots/park.svg" alt="" /><span
                ><strong lang="en">park</strong><small>公园</small></span
              >
            </div>
            <div class="hero-caption"><span class="dot" />每次一点点，跟着自己的节奏</div>
          </div>
        </section>
        <section class="steps-section" aria-label="学习步骤">
          <article>
            <span>01</span>
            <h2>讲一个故事</h2>
            <p>真实经历或想象，都可以。</p>
          </article>
          <article>
            <span>02</span>
            <h2>读一读，试一试</h2>
            <p>一句英语，一张词卡，一道练习。</p>
          </article>
          <article>
            <span>03</span>
            <h2>留下一本故事书</h2>
            <p>保存本课的故事，随时翻一翻。</p>
          </article>
        </section>
        <footer class="home-footer">
          <span>为 7–12 岁儿童设计 · 每课 3–5 句</span><span>可以求助，可以休息，也可以结束</span>
        </footer>
      </template>

      <section v-else-if="stage === 'setup'" class="paper-card">
        <p class="eyebrow">成人准备 · 1 / 2</p>
        <h1 data-title tabindex="-1">{{ title }}</h1>
        <p>设置本课的成人口令。交给孩子后，查看审核和下载故事书需要再次验证。</p>
        <form @submit.prevent="create">
          <label
            >6位成人口令<input
              v-model="pin"
              type="password"
              inputmode="numeric"
              pattern="[0-9]{6}"
              maxlength="6"
              autocomplete="new-password"
              required /></label
          ><label
            >再次输入口令<input
              v-model="confirmationPin"
              type="password"
              inputmode="numeric"
              pattern="[0-9]{6}"
              maxlength="6"
              autocomplete="new-password"
              required
          /></label>
          <fieldset class="settings">
            <legend>学习支持</legend>
            <label class="check"
              ><input v-model="settings.showChinese" type="checkbox" />显示中文解释</label
            ><label class="check"
              ><input v-model="settings.reduceMotion" type="checkbox" />减少页面动效</label
            ><label
              >示例音量<input
                v-model.number="settings.volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
            /></label>
          </fieldset>
          <p class="notice">
            本课最多保留4小时，连续15分钟无活动后结束。未提交的选择只保留在当前页面；关闭或刷新页面后需要成人重新进入。
          </p>
          <button
            class="button primary"
            :disabled="busy || pin.length !== 6 || pin !== confirmationPin"
          >
            {{ busy ? '正在准备…' : '继续选择故事' }}
          </button>
        </form>
      </section>

      <section v-else-if="stage === 'choose'" class="choice-page">
        <p class="eyebrow">成人准备 · 2 / 2</p>
        <h1 data-title tabindex="-1">{{ title }}</h1>
        <p class="lead">选择后再开始。故事由成人检查，孩子可以慢慢读。</p>
        <div class="story-choices">
          <button
            class="story-choice"
            :class="{ chosen: chosen === 'custom' }"
            :aria-pressed="chosen === 'custom'"
            @click="chosen = 'custom'"
          >
            <span class="story-symbol" aria-hidden="true">✎</span>
            <h2>我的故事</h2>
            <p>把中文经历变成英语故事</p>
            <span class="selection-mark">{{
              chosen === 'custom' ? '✓ 已选择' : '选择这个故事'
            }}</span></button
          ><button
            class="story-choice mint"
            :class="{ chosen: chosen === 'sample' }"
            :aria-pressed="chosen === 'sample'"
            @click="chosen = 'sample'"
          >
            <img src="/spots/park.svg" alt="公园" />
            <h2>公园的早晨</h2>
            <p>示例故事 · 配有图片与音频</p>
            <span class="selection-mark">{{
              chosen === 'sample' ? '✓ 已选择' : '选择这个故事'
            }}</span>
          </button>
        </div>
        <div class="action-row">
          <p class="soft">读故事 → 看词卡 → 做练习 → 保存故事书</p>
          <button class="button primary" :disabled="busy" @click="chooseStory">
            继续 <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section v-else-if="stage === 'input'" class="paper-card">
        <p class="eyebrow">我的故事 · 成人录入</p>
        <h1 data-title tabindex="-1">{{ title }}</h1>
        <p>今天发生了什么？也可以编一个小故事。建议20–150字。</p>
        <label for="story">中文故事</label
        ><textarea
          id="story"
          v-model="story"
          rows="6"
          placeholder="例如：今天我和妈妈去了公园，看见一只小狗在追球。我捡起球，轻轻地扔给它。"
        />
        <p class="character-count" :class="{ invalid: count > 300 }">{{ count }} / 300 字</p>
        <fieldset>
          <legend>句子难度</legend>
          <div class="difficulty-options">
            <label
              v-for="level in ['L', 'M', 'H'] as const"
              :key="level"
              :class="{ chosen: difficulty === level }"
              ><input
                v-model="difficulty"
                type="radio"
                :value="level"
                name="difficulty"
              /><strong>{{ { L: '短句起步', M: '简单表达', H: '丰富表达' }[level] }}</strong
              ><small>每句最多 {{ { L: 8, M: 12, H: 16 }[level] }} 词</small></label
            >
          </div>
        </fieldset>
        <div class="notice">
          <strong>发送前请检查</strong>
          <p>
            只会将上方故事与难度发送给
            DeepSeek，用于生成本课文字。请删除真实姓名、学校、详细住址和联系方式。
          </p>
          <label class="check"
            ><input v-model="confirmed" type="checkbox" />我已检查全文，并同意发送给 DeepSeek</label
          >
        </div>
        <div class="action-row">
          <button class="button outline" :disabled="busy" @click="move('choose')">返回选择</button
          ><button
            class="button primary"
            :disabled="busy || !confirmed || count < 5 || count > 300"
            @click="generate"
          >
            生成我的故事
          </button>
        </div>
      </section>

      <section v-else-if="stage === 'waiting'" class="paper-card center">
        <span class="waiting-orbit" aria-hidden="true">✦</span>
        <p class="eyebrow">我的故事</p>
        <h1 data-title tabindex="-1">{{ title }}</h1>
        <p role="status">{{ session?.job?.stage }}</p>
        <p class="soft">生成完成后，请成人检查每句话和每道练习。</p>
        <button class="button outline" :disabled="busy" @click="cancelGeneration">取消生成</button>
      </section>
      <section v-else-if="stage === 'generation-error'" class="paper-card">
        <h1 data-title tabindex="-1">{{ title }}</h1>
        <p>这次生成未完成，你的输入仍保留在当前页面。</p>
        <p class="small">原因：{{ session?.job?.error }}</p>
        <div class="action-row">
          <button class="button outline" @click="move('choose')">选择其他故事</button
          ><button class="button primary" @click="move('input')">检查故事并重试</button>
        </div>
      </section>

      <section v-else-if="stage === 'review' && review" class="review-page">
        <div class="review-heading">
          <div>
            <p class="eyebrow">
              成人审核 · {{ review.lesson.source === 'custom' ? 'AI 生成文字' : '示例故事' }}
            </p>
            <h1 data-title tabindex="-1">{{ title }}</h1>
            <p>请检查原意、英文、词卡与答案，确认后再交给孩子。</p>
          </div>
          <button
            v-if="review.raw && !editing"
            class="button outline"
            @click="
              editing = true;
              checks.fill(false);
            "
          >
            编辑内容
          </button>
        </div>
        <template v-if="editing && review.raw">
          <div class="paper-card edit-form">
            <label>中文标题<input v-model="review.raw.title" /></label
            ><label>英文标题<input v-model="review.raw.titleEn" /></label>
            <fieldset v-for="(line, index) in review.raw.sentences" :key="index">
              <legend>第 {{ index + 1 }} 句</legend>
              <label>英文<input v-model="line.en" /></label
              ><label>中文<input v-model="line.zh" /></label>
            </fieldset>
            <fieldset v-for="(item, index) in review.raw.words" :key="index">
              <legend>词卡 {{ index + 1 }}</legend>
              <label>英文词语<input v-model="item.word" /></label
              ><label>语境中文<input v-model="item.meaning" /></label
              ><label
                >故事例句<select v-model.number="item.sentenceIndex">
                  <option v-for="(line, i) in review.raw.sentences" :key="i" :value="i">
                    {{ i + 1 }}. {{ line.en }}
                  </option>
                </select></label
              >
            </fieldset>
            <fieldset>
              <legend>看中文选英文</legend>
              <label
                >目标词语<select v-model.number="review.raw.choice.wordIndex">
                  <option v-for="(item, i) in review.raw.words" :key="i" :value="i">
                    {{ item.word }}
                  </option>
                </select></label
              >
              <label>提示<input v-model="review.raw.choice.hint" /></label>
              <label>题目<input v-model="review.raw.choice.prompt" /></label
              ><label v-for="(_, i) in review.raw.choice.options" :key="i"
                >选项 {{ i + 1 }}<input v-model="review.raw.choice.options[i]" /></label
              ><label
                >正确选项<select v-model.number="review.raw.choice.correct">
                  <option v-for="(option, i) in review.raw.choice.options" :key="i" :value="i">
                    {{ option }}
                  </option>
                </select></label
              >
            </fieldset>
            <fieldset>
              <legend>词语配对</legend>
              <label v-for="(_, index) in review.raw.match.wordIndices" :key="index"
                >配对词语 {{ index + 1
                }}<select v-model.number="review.raw.match.wordIndices[index]">
                  <option v-for="(item, i) in review.raw.words" :key="i" :value="i">
                    {{ item.word }} · {{ item.meaning }}
                  </option>
                </select></label
              >
              <label>提示<input v-model="review.raw.match.hint" /></label>
            </fieldset>
            <fieldset>
              <legend>词库填空</legend>
              <label
                >原始例句<select v-model.number="review.raw.cloze.sentenceIndex">
                  <option v-for="(line, i) in review.raw.sentences" :key="i" :value="i">
                    {{ line.en }}
                  </option>
                </select></label
              >
              <label
                >目标词语<select v-model.number="review.raw.cloze.wordIndex">
                  <option v-for="(item, i) in review.raw.words" :key="i" :value="i">
                    {{ item.word }}
                  </option>
                </select></label
              >
              <label>提示<input v-model="review.raw.cloze.hint" /></label>
              <label>句子（空格使用 ____）<input v-model="review.raw.cloze.sentence" /></label
              ><label v-for="(_, i) in review.raw.cloze.options" :key="i"
                >选项 {{ i + 1 }}<input v-model="review.raw.cloze.options[i]" /></label
              ><label
                >正确选项<select v-model.number="review.raw.cloze.correct">
                  <option v-for="(option, i) in review.raw.cloze.options" :key="i" :value="i">
                    {{ option }}
                  </option>
                </select></label
              >
            </fieldset>
            <p>修改词语或句子时，请同时更新相关例句、练习和正确答案。保存后需要重新审核。</p>
            <button class="button primary" :disabled="busy" @click="saveEdits">
              保存并重新检查
            </button>
            <button class="button outline" :disabled="busy" @click="discardEdits">放弃修改</button>
          </div>
        </template>
        <template v-else>
          <div class="review-grid">
            <div class="review-story paper-card">
              <h2>{{ review.lesson.title }}</h2>
              <p lang="en">{{ review.lesson.titleEn }}</p>
              <article
                v-for="(line, index) in review.lesson.sentences"
                :key="line.id"
                class="review-sentence"
              >
                <span>{{ String(index + 1).padStart(2, '0') }}</span>
                <div>
                  <p lang="en">{{ line.en }}</p>
                  <p class="soft">{{ line.zh }}</p>
                </div>
                <img v-if="line.imageUrl" :src="line.imageUrl" :alt="line.imageAlt ?? ''" />
              </article>
            </div>
            <div class="review-side">
              <div class="paper-card">
                <h2>5个故事词语</h2>
                <p v-for="item in review.lesson.words" :key="item.id">
                  <strong lang="en">{{ item.word }}</strong> · {{ item.meaning }}
                </p>
              </div>
              <div class="paper-card">
                <h2>3道练习</h2>
                <article
                  v-for="item in review.lesson.exercises"
                  :key="item.id"
                  class="review-exercise"
                >
                  <h3>{{ item.prompt }}</h3>
                  <p v-if="item.sentence" lang="en">{{ item.sentence }}</p>
                  <template v-if="item.type === 'match'"
                    ><p v-for="left in item.left" :key="left.id">
                      {{ left.text }} → {{ matchAnswer(item, left.id) }}
                    </p></template
                  ><template v-else
                    ><p>选项：{{ item.options.map((option) => option.text).join(' / ') }}</p>
                    <p>
                      答案：<strong>{{
                        item.options.find((option) => option.id === review!.answers[item.id])?.text
                      }}</strong>
                    </p></template
                  >
                </article>
              </div>
            </div>
          </div>
          <section class="approval paper-card">
            <h2>我已逐项检查</h2>
            <label v-for="(label, index) in checkLabels" :key="label" class="check"
              ><input v-model="checks[index]" type="checkbox" />{{ label }}</label
            >
            <div class="action-row">
              <button class="button outline" :disabled="busy" @click="move('choose')">
                重新准备故事</button
              ><button
                class="button primary"
                :disabled="busy || !checks.every(Boolean)"
                @click="start"
              >
                确认内容，交给孩子
              </button>
            </div>
          </section>
        </template>
      </section>

      <section v-else-if="stage === 'cover' && lesson" class="learning-stage">
        <div class="story-art">
          <img
            v-if="lesson.sentences[0]?.imageUrl"
            :src="lesson.sentences[0].imageUrl"
            :alt="lesson.sentences[0].imageAlt ?? ''"
          />
          <div v-else class="text-art">
            <span aria-hidden="true">Aa</span>
            <p>每一句，都是你的故事</p>
          </div>
        </div>
        <div class="story-copy">
          <p class="eyebrow">{{ sourceLabel }}</p>
          <h1 data-title tabindex="-1" lang="en">{{ lesson.titleEn }}</h1>
          <h2>{{ lesson.title }}</h2>
          <p>{{ lesson.sentences.length }} 句 · 5 张词卡 · 3 道练习</p>
          <p class="soft">
            {{
              lesson.source === 'sample'
                ? '想听的时候，按一下播放。'
                : '可以自己读，也可以请成人陪你读。'
            }}
          </p>
        </div>
      </section>

      <section v-else-if="stage === 'listen' && sentence" class="learning-stage">
        <div class="story-art">
          <img v-if="sentence.imageUrl" :src="sentence.imageUrl" :alt="sentence.imageAlt ?? ''" />
          <div v-else class="text-art">
            <span class="sentence-number">{{ String(sentenceIndex + 1).padStart(2, '0') }}</span>
            <p>{{ lesson?.title }}</p>
          </div>
        </div>
        <div class="story-copy">
          <p class="eyebrow">{{ sourceLabel }}</p>
          <h1 data-title tabindex="-1" class="english-sentence" lang="en">{{ sentence.en }}</h1>
          <p v-if="settings.showChinese" class="translation">{{ sentence.zh }}</p>
          <button
            v-if="sentence.audioUrl"
            class="button play-button"
            :disabled="busy"
            @click="toggleAudio(sentence.audioUrl)"
          >
            {{ playing ? '■ 停止播放' : '▶ 播放这句话' }}
          </button>
          <div class="word-tabs" aria-label="故事词卡">
            <button
              v-for="(item, index) in lesson?.words"
              :key="item.id"
              :aria-pressed="word?.id === item.id"
              :class="{ chosen: word?.id === item.id }"
              @click="showWord(word?.id === item.id ? null : index)"
            >
              {{ item.word }}
            </button>
          </div>
          <section v-if="word" class="word-detail" :aria-label="`词卡 ${word.word}`">
            <img v-if="word.imageUrl" :src="word.imageUrl" :alt="word.meaning" />
            <div>
              <h2 lang="en">{{ word.word }}</h2>
              <p>{{ word.meaning }}</p>
              <p lang="en" class="word-example">{{ wordExample }}</p>
            </div>
            <button class="word-close" aria-label="关闭词卡" @click="showWord(null)">×</button>
          </section>
          <p v-else class="soft small">点击一个词语，看看它在故事里的意思。</p>
        </div>
      </section>

      <section v-else-if="stage === 'practice' && exercise" class="practice-stage">
        <p class="eyebrow">{{ sourceLabel }} · 练习 {{ exerciseIndex + 1 }}</p>
        <h1 data-title tabindex="-1">{{ exercise.prompt }}</h1>
        <p v-if="exercise.sentence" class="cloze-sentence" lang="en">{{ exercise.sentence }}</p>
        <p class="soft">
          {{
            exercise.type === 'match'
              ? '先选一个英文，再选对应的中文，然后确认。'
              : '选择一个词语，准备好后再确认。'
          }}
        </p>
        <div v-if="exercise.type === 'match'" class="match-board">
          <div>
            <button
              v-for="item in exercise.left"
              :key="item.id"
              class="answer-card"
              :class="{ chosen: leftId === item.id, solved: resolved[item.id] }"
              :disabled="busy || Boolean(resolved[item.id])"
              :aria-pressed="leftId === item.id"
              @click="selectLeft(item.id)"
            >
              <span lang="en">{{ item.text }}</span
              ><small>{{
                resolved[item.id]
                  ? resolved[item.id] === 'correct'
                    ? '✓ 已完成'
                    : '已跳过'
                  : leftId === item.id
                    ? '✓ 已选择'
                    : ''
              }}</small>
            </button>
          </div>
          <div>
            <button
              v-for="item in exercise.right"
              :key="item.id"
              class="answer-card mint"
              :class="{ chosen: selected === item.id }"
              :disabled="busy || !leftId"
              :aria-pressed="selected === item.id"
              @click="selectOption(item.id)"
            >
              {{ item.text }}<small v-if="selected === item.id">✓ 已选择</small>
            </button>
          </div>
        </div>
        <div v-else class="answer-options">
          <button
            v-for="option in exercise.options"
            :key="option.id"
            class="answer-card"
            :class="{ chosen: selected === option.id }"
            :aria-pressed="selected === option.id"
            :disabled="busy || exerciseDone"
            @click="selectOption(option.id)"
          >
            <span lang="en">{{ option.text }}</span
            ><small v-if="selected === option.id">✓ 已选择</small>
          </button>
        </div>
        <p v-if="hint" class="notice" role="status">提示：{{ hint }}</p>
        <div v-if="feedback" class="feedback" role="status">
          <p>{{ feedback }}</p>
          <button v-if="lastAttempt?.result === 'incorrect'" class="button outline" @click="retry">
            再试一次
          </button>
        </div>
        <div class="practice-tools">
          <button
            v-if="replay?.audioUrl"
            class="button outline"
            @click="toggleAudio(replay.audioUrl, true)"
          >
            {{ playing ? '停止播放' : '再听一句' }}</button
          ><button class="button outline" :disabled="busy" @click="showHint">看看提示</button
          ><button
            class="button text-button"
            :disabled="busy || exerciseDone || !targetId"
            @click="answer(true)"
          >
            先跳过这一项
          </button>
        </div>
      </section>

      <section v-else-if="stage === 'rest'" class="paper-card center rest-card">
        <span class="rest-symbol" aria-hidden="true">☘</span>
        <p class="eyebrow">跟着自己的节奏</p>
        <h1 data-title tabindex="-1">休息一下，没关系。</h1>
        <p>可以喝口水、伸伸懒腰。<br />准备好了，就回到刚才的地方。</p>
        <p class="soft small">保持这个页面打开，刚才的选择会留在这里。</p>
        <button class="button primary" :disabled="busy" @click="resume">我准备好了，继续</button
        ><button class="button text-button" @click="dialog = 'end'">今天先到这里</button>
      </section>

      <section v-else-if="stage === 'summary' && session?.summary" class="summary-page">
        <p class="eyebrow">{{ sourceLabel }}</p>
        <h1 data-title tabindex="-1">
          {{
            session.summary.reason === 'early' ? '今天先到这里，也很好。' : '你完成了今天的故事。'
          }}
        </h1>
        <p class="lead">每一次阅读和尝试，都值得留下。</p>
        <div class="summary-grid">
          <article>
            <strong>{{ session.summary.sentences }}</strong
            ><span>句故事已阅读</span>
          </article>
          <article>
            <strong>{{ session.summary.words }}</strong
            ><span>张词卡已查看</span>
          </article>
          <article>
            <strong>{{ session.summary.completed }}</strong
            ><span>项练习已完成</span>
          </article>
          <article>
            <strong>{{ session.summary.skipped }}</strong
            ><span>项练习先放一放</span>
          </article>
        </div>
        <div class="summary-bottom">
          <article class="paper-card">
            <p class="eyebrow">给陪伴者的一句话</p>
            <h2>下次也这样慢慢来</h2>
            <p>{{ session.summary.suggestion }}</p>
            <details>
              <summary>查看本课练习记录</summary>
              <p v-for="attempt in session.summary.attempts" :key="attempt.id" class="small">
                练习
                {{
                  (lesson?.exercises.findIndex((item) => item.id === attempt.exerciseId) ?? 0) + 1
                }}
                ·
                {{ { correct: '完成', incorrect: '继续尝试', skipped: '跳过' }[attempt.result] }} ·
                {{
                  {
                    independent: '独立尝试',
                    supported: '使用了支持',
                    retry: '再次尝试',
                    skipped: '本次未作答',
                  }[attempt.evidence]
                }}
              </p>
              <p v-if="!session.summary.attempts.length">本课还没有提交练习。</p>
            </details>
          </article>
          <article class="paper-card book-callout">
            <span aria-hidden="true">▤</span>
            <h2>把故事带回家</h2>
            <p>
              {{
                lesson?.source === 'custom'
                  ? '保存一张包含本课英中句子的故事长图。'
                  : '保存一张包含故事配图与英中句子的绘本。'
              }}
            </p>
            <button class="button primary" :disabled="busy" @click="makeBook">
              {{ session.mode === 'adult' ? '生成故事书' : '请成人验证并保存' }}
            </button>
          </article>
        </div>
        <div class="action-row">
          <p class="soft small">本课记录只在当前课堂保留，请在结束前保存作品。</p>
          <button
            class="button outline"
            @click="session.mode === 'adult' ? (dialog = 'close') : (dialog = 'adult')"
          >
            结束并清理本课
          </button>
        </div>
      </section>

      <section v-else-if="stage === 'book' && bookUrl" class="book-page">
        <p class="eyebrow">我的故事书</p>
        <h1 data-title tabindex="-1">{{ lesson?.title }}</h1>
        <img :src="bookUrl" class="book-preview" :alt="`${lesson?.title}的完整故事书预览`" />
        <div class="action-row">
          <button class="button outline" @click="move('summary')">回到本课结果</button
          ><a class="button primary" :href="bookUrl" download="TellTale-story.png"
            >下载故事书 PNG</a
          >
        </div>
        <p class="soft small">作品宽1080像素。下载的文件由你保管，课堂结束不会删除设备上的文件。</p>
      </section>
      <section v-else-if="stage === 'recover'" class="paper-card">
        <h1 data-title tabindex="-1">{{ title }}</h1>
        <p>页面已重新打开，未提交的选择已结束。请成人输入本课口令，查看已提交的结果并重新准备。</p>
        <button class="button primary" @click="dialog = 'adult'">验证成人身份</button>
      </section>
      <section v-else-if="stage === 'expired'" class="paper-card">
        <h1 data-title tabindex="-1">{{ title }}</h1>
        <p>课程有效期已结束。可以由成人重新准备一节课。</p>
        <button class="button primary" @click="move('setup')">准备新课</button>
      </section>
    </main>

    <footer v-if="['cover', 'listen', 'practice'].includes(stage)" class="learning-footer">
      <div class="support-actions">
        <button class="button outline" @click="dialog = 'help'">? 我需要帮助</button
        ><button class="button outline" :disabled="busy" @click="rest">☘ 休息一下</button
        ><button class="button text-button" @click="dialog = 'end'">结束本课</button>
      </div>
      <p class="footer-hint">
        {{
          stage === 'practice'
            ? !selected && !exerciseDone
              ? '选择后，才能确认。'
              : '跟着自己的节奏。'
            : '可以跟读，也可以慢慢看。'
        }}
      </p>
      <div class="advance-actions">
        <template v-if="stage === 'cover'"
          ><button class="button primary" :disabled="busy" @click="visitSentence(0)">
            开始读故事 →
          </button></template
        ><template v-else-if="stage === 'listen'"
          ><button
            class="button outline"
            :disabled="busy || sentenceIndex === 0"
            @click="visitSentence(sentenceIndex - 1)"
          >
            上一句</button
          ><button
            class="button primary"
            :disabled="busy"
            @click="
              sentenceIndex < (lesson?.sentences.length ?? 0) - 1
                ? visitSentence(sentenceIndex + 1)
                : practice()
            "
          >
            {{ sentenceIndex < (lesson?.sentences.length ?? 0) - 1 ? '下一句 →' : '去做练习 →' }}
          </button></template
        ><template v-else
          ><button
            v-if="exerciseDone"
            class="button primary"
            :disabled="busy"
            @click="nextQuestion"
          >
            {{ exerciseIndex < 2 ? '下一题 →' : '完成本课 →' }}</button
          ><button
            v-else
            class="button primary"
            :disabled="busy || !selected || !targetId"
            @click="answer(false)"
          >
            {{ busy ? '正在确认…' : '确认选择' }}
          </button></template
        >
      </div>
    </footer>

    <dialog ref="modal" class="app-dialog" @cancel.prevent="dialog = null" @close="dialog = null">
      <button class="dialog-close" aria-label="关闭对话框" @click="dialog = null">×</button>
      <template v-if="dialog === 'adult'"
        ><h2>请成人输入本课口令</h2>
        <p>学习中的课程会在验证后结束，已提交的练习仍可查看。</p>
        <form @submit.prevent="unlockAdult">
          <label
            >6位成人口令<input
              v-model="unlockPin"
              type="password"
              inputmode="numeric"
              maxlength="6"
              pattern="[0-9]{6}"
              autocomplete="current-password"
              required
          /></label>
          <p v-if="error" role="alert" class="invalid">{{ error }}</p>
          <button class="button primary" :disabled="busy || unlockPin.length !== 6">
            验证并进入
          </button>
        </form></template
      >
      <template v-else-if="dialog === 'help'"
        ><h2>我们一步一步来</h2>
        <p>
          {{
            stage === 'practice'
              ? exercise?.type === 'match'
                ? '先点英文，再点中文，最后按「确认选择」。'
                : '点一个词语，再按「确认选择」。'
              : '看一句英语，点下面的词语查看意思，准备好后进入下一句。'
          }}
        </p>
        <button
          v-if="stage === 'practice'"
          class="button outline"
          :disabled="busy"
          @click="showHint"
        >
          查看本题提示</button
        ><button class="button outline" :disabled="busy" @click="adultHelp">请成人陪我看一看</button
        ><button class="button primary" @click="dialog = null">我知道了</button></template
      >
      <template v-else-if="dialog === 'end'"
        ><h2>今天先到这里？</h2>
        <p>本课已经提交的练习会出现在结果页。还没有选择的题目不会算作答错。</p>
        <button class="button outline" @click="dialog = null">继续学习</button
        ><button class="button primary" :disabled="busy" @click="finish('early')">
          结束并看看收获
        </button></template
      >
      <template v-else-if="dialog === 'close'"
        ><h2>结束并清理本课</h2>
        <p>本课故事、练习和记录将关闭访问并从在线课堂清理。请先下载需要保留的作品。</p>
        <button class="button outline" @click="dialog = null">留在本课</button
        ><button
          v-if="session?.mode === 'adult'"
          class="button primary"
          :disabled="busy"
          @click="close"
        >
          确认结束本课</button
        ><button v-else class="button primary" @click="dialog = 'adult'">
          先验证成人口令
        </button></template
      >
      <template v-else-if="dialog === 'guide'"
        ><h2>如何开始一节故事课</h2>
        <ol>
          <li>成人设置本课口令，选择自编故事或示例。</li>
          <li>输入中文故事，确认发送范围后生成。</li>
          <li>成人检查全部文字、词卡和练习，再交给孩子。</li>
          <li>逐句阅读，查看词卡，完成三类练习。随时可以求助、休息或结束。</li>
          <li>成人验证后保存故事书，并结束、清理课堂。</li>
        </ol>
        <p>
          自编故事提供文字学习，示例配有图片与音频。刷新页面后需要成人验证，未提交的选择无法恢复。
        </p>
        <button class="button primary" @click="dialog = null">知道了</button></template
      >
      <template v-else-if="dialog === 'privacy'"
        ><h2>本课的数据怎样使用</h2>
        <p>无需注册，不收集儿童姓名、学校、生日或诊断信息。成人设置的口令只用于本课权限验证。</p>
        <p>
          自编故事仅在成人确认后发送给
          DeepSeek，生成英语句子、词卡和练习。请使用虚构情节，并删除可识别个人的信息。模型输出需要成人逐项审核。
        </p>
        <p>
          课堂内容存储在
          Cloudflare，最多保留4小时；连续15分钟无活动后关闭。结束课堂会清理在线课程数据。Cloudflare
          的恢复机制可能保留最近30天的存储历史，恢复后的课程仍受原有效期限制。
        </p>
        <p>
          本版本不保存跨课程的个人学习档案。下载的故事书由设备使用者保管。DeepSeek
          对已接收输入的处理遵循其服务政策。
        </p>
        <button class="button primary" @click="dialog = null">我已了解</button></template
      >
    </dialog>
  </div>
</template>
