<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MistakeReview, StoryExercise } from '@telltale/contracts';

const props = defineProps<{
  exercises: StoryExercise[];
  mistakes: MistakeReview[];
  interactive?: boolean;
  busy?: boolean;
}>();
const emit = defineEmits<{
  answer: [exerciseId: string, leftId: string | null, optionId: string];
}>();
const choices = ref<Record<string, string>>({});
const items = computed(() =>
  props.mistakes.map((mistake) => {
    const exercise = props.exercises.find((item) => item.id === mistake.exerciseId)!;
    // 配对题只显示此前答错的左侧词语。
    const left = exercise.left.find((item) => item.id === mistake.targetId);
    return { ...mistake, exercise, left, options: left ? exercise.right : exercise.options };
  }),
);
</script>

<template>
  <details class="mistake-review">
    <summary>本课错题回顾（{{ items.length }}）</summary>
    <p v-if="!items.length">本课还没有答错的题目。</p>
    <section v-for="item in items" :key="item.targetId">
      <h3>
        {{ item.exercise.prompt }} <span v-if="item.left" lang="en">{{ item.left.text }}</span>
      </h3>
      <p v-if="item.exercise.sentence" lang="en">{{ item.exercise.sentence }}</p>
      <p role="status">
        {{
          item.lastResult === 'correct'
            ? '回顾答对了'
            : item.lastResult === 'incorrect'
              ? '回顾时答错了，可以再试一次'
              : '还未回顾'
        }}
        · 已回顾 {{ item.reviews }} 次
      </p>
      <form
        v-if="interactive && item.lastResult !== 'correct'"
        @submit.prevent="
          emit('answer', item.exerciseId, item.left?.id ?? null, choices[item.targetId]!)
        "
      >
        <label
          >选择回顾答案
          <select v-model="choices[item.targetId]" :disabled="busy" required>
            <option disabled :value="undefined">请选择</option>
            <option v-for="option in item.options" :key="option.id" :value="option.id">
              {{ option.text }}
            </option>
          </select>
        </label>
        <button class="button outline compact" :disabled="busy || !choices[item.targetId]">
          提交回顾答案
        </button>
      </form>
    </section>
  </details>
</template>
