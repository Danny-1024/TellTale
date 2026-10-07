<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    progress: string
    advanceLabel: string
    advanceDisabled?: boolean
    helpPressed?: boolean
    restPressed?: boolean
    hint?: string
    secondaryLabel?: string
    secondaryDisabled?: boolean
    restIcon?: 'sprout' | 'cup'
    advanceChevron?: boolean
  }>(),
  {
    advanceDisabled: false,
    helpPressed: false,
    restPressed: false,
    hint: '',
    secondaryLabel: '',
    secondaryDisabled: false,
    restIcon: 'sprout',
    advanceChevron: false,
  },
)

const emit = defineEmits<{
  help: []
  rest: []
  advance: []
  secondary: []
}>()

const adultOpen = ref(false)

function onAdvance(): void {
  if (props.advanceDisabled) return
  emit('advance')
}

function onSecondary(): void {
  if (props.secondaryDisabled) return
  emit('secondary')
}
</script>

<template>
  <div class="child-shell">
    <header class="child-shell__top">
      <div class="brand">
        <p class="brand__logo">TellTale English</p>
        <span class="brand__rule" aria-hidden="true" />
        <h1 class="brand__page">{{ title }}</h1>
      </div>
      <p class="pill" aria-live="polite">{{ progress }}</p>
      <button
        type="button"
        class="btn btn-outline settings"
        :aria-pressed="adultOpen"
        @click="adultOpen = !adultOpen"
      >
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M10.2 2h3.6l.4 2.2a7.2 7.2 0 0 1 1.8.8l2-1.1 2.5 2.5-1.1 2a7.2 7.2 0 0 1 .8 1.8L22 10.2v3.6l-2.2.4a7.2 7.2 0 0 1-.8 1.8l1.1 2-2.5 2.5-2-1.1a7.2 7.2 0 0 1-1.8.8L13.8 22h-3.6l-.4-2.2a7.2 7.2 0 0 1-1.8-.8l-2 1.1-2.5-2.5 1.1-2a7.2 7.2 0 0 1-.8-1.8L2 13.8v-3.6l2.2-.4a7.2 7.2 0 0 1 .8-1.8l-1.1-2 2.5-2.5 2 1.1a7.2 7.2 0 0 1 1.8-.8L10.2 2zM12 15.2A3.2 3.2 0 1 0 8.8 12 3.2 3.2 0 0 0 12 15.2z"
          />
        </svg>
        成人设置
      </button>
    </header>
    <main class="child-shell__main" aria-live="polite">
      <section v-if="adultOpen" class="adult-note">
        <h2>成人设置</h2>
        <p>这一页是儿童在学习。设置还没打开，不会改掉句子和已经选的答案。</p>
        <button type="button" class="btn btn-outline" @click="adultOpen = false">知道了</button>
      </section>
      <slot />
    </main>
    <footer class="child-shell__bottom">
      <div class="child-shell__support">
        <button
          type="button"
          class="btn btn-outline"
          :aria-pressed="helpPressed"
          @click="emit('help')"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
            <path
              fill="currentColor"
              d="M11 16.5h2v2h-2zM12 6.2a3.2 3.2 0 0 0-3.2 3.2h2a1.2 1.2 0 1 1 2.1.8c-.7.6-1.1 1-1.1 2.1V14h2v-1.1c0-.4.2-.7.7-1.1A3.2 3.2 0 0 0 12 6.2z"
            />
          </svg>
          我需要帮助
        </button>
        <button
          type="button"
          class="btn btn-outline"
          :aria-pressed="restPressed"
          @click="emit('rest')"
        >
          <svg v-if="restIcon === 'cup'" class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M5 8h10a4.5 4.5 0 0 1 0 9H8.2A2.2 2.2 0 0 1 6 14.8V8zm10 2h1.2a2.5 2.5 0 0 1 0 5H15v-5zM8 4.2c.5.9.5 1.5 0 2.4M11.2 3.8c.5.9.5 1.5 0 2.4"
            />
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="#3e9a56"
              stroke-width="2.2"
              stroke-linecap="round"
              d="M12 21V11"
            />
            <path fill="#3e9a56" d="M12 12c0-4.5 4.2-7.2 8.2-6.2C19 10.2 15.2 12.6 12 12z" />
            <path fill="#67b36a" d="M12 13.2C12 9 8.2 6.6 4.2 7.4 5.4 11.2 8.8 13.4 12 13.2z" />
          </svg>
          休息一下
        </button>
      </div>
      <p v-if="hint" class="child-shell__hint">{{ hint }}</p>
      <div class="child-shell__moves">
        <button
          v-if="secondaryLabel"
          type="button"
          class="btn btn-outline"
          :aria-disabled="secondaryDisabled ? 'true' : undefined"
          @click="onSecondary"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14 6 8 12l6 6"
            />
          </svg>
          {{ secondaryLabel }}
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :class="{ 'is-wait': advanceDisabled }"
          :aria-disabled="advanceDisabled ? 'true' : undefined"
          @click="onAdvance"
        >
          {{ advanceLabel }}
          <svg v-if="advanceChevron" class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m10 6 6 6-6 6"
            />
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.child-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: var(--color-bg);
  color: var(--color-text);
}

.child-shell__top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 18px 22px 8px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand__logo,
.brand__page,
.pill,
.child-shell__hint {
  margin: 0;
}

.brand__logo {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
  white-space: nowrap;
}

.brand__rule {
  width: 2px;
  height: 26px;
  background: #d5deea;
}

.brand__page {
  font-size: var(--font-body);
  font-weight: 800;
  white-space: nowrap;
}

.pill {
  justify-self: center;
  padding: 8px 18px;
  background: var(--color-pill);
  border-radius: 999px;
  font-size: 20px;
  font-weight: 800;
  white-space: nowrap;
}

.settings {
  justify-self: end;
}

.child-shell__main {
  position: relative;
  min-height: 0;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 12px 22px 28px;
}

.adult-note {
  position: absolute;
  z-index: 2;
  top: 84px;
  right: 22px;
  width: min(100% - 44px, 24rem);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--color-surface);
  border: 2px solid #d5deea;
  border-radius: 24px;
}

.adult-note h2,
.adult-note p {
  margin: 0;
}

.child-shell__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 22px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--color-line);
}

.child-shell__support,
.child-shell__moves {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.child-shell__hint {
  flex: 1;
  min-width: 12rem;
  color: #3d4c66;
  font-size: 20px;
  font-weight: 700;
}

.child-shell__moves {
  margin-left: auto;
}

.btn {
  min-width: var(--hit-min);
  min-height: var(--hit-min);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 18px;
  border: 2px solid var(--color-text);
  font-size: var(--font-body);
  font-weight: 800;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  touch-action: manipulation;
}

.icon {
  width: 26px;
  height: 26px;
  flex: none;
}

.btn-outline {
  background: var(--color-surface);
  color: var(--color-text);
}

.btn-outline[aria-pressed='true'] {
  background: var(--color-press);
}

.btn-outline[aria-disabled='true'] {
  color: #4a5870;
  border-color: #c5cedb;
  cursor: default;
}

.btn-primary {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding-inline: 22px;
}

.btn-primary.is-wait {
  border-color: var(--color-wait);
  background: var(--color-wait);
  color: var(--color-text);
  cursor: default;
}

@media (max-width: 800px) {
  .child-shell__top {
    grid-template-columns: 1fr auto;
  }

  .brand {
    flex-wrap: wrap;
  }

  .brand__logo,
  .brand__page {
    font-size: 20px;
    white-space: normal;
  }

  .pill {
    grid-column: 1 / -1;
    order: 3;
    justify-self: start;
  }

  .child-shell__moves {
    width: 100%;
    margin-left: 0;
  }

  .child-shell__moves .btn {
    flex: 1;
  }
}
</style>
