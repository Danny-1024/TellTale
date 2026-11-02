import assert from 'node:assert/strict';
import test from 'node:test';
import { LessonAudio, speechRate } from '../src/course/media';
import { SAMPLE_CATALOG, SAMPLE_IDS, samplesByTheme } from '../src/course/sampleCatalog';
import { resolveAppPath } from '../src/entry/routes';
import {
  adjacentSentence,
  appendStoryPrompt,
  courseEntry,
  REVIEW_TABS,
} from '../src/course/experience';

test('六个示例按主题提供并且标识不重复', () => {
  assert.equal(SAMPLE_CATALOG.length, 6);
  assert.deepEqual(
    SAMPLE_CATALOG.map((item) => item.id),
    [...SAMPLE_IDS],
  );
  assert.equal(new Set(SAMPLE_CATALOG.map((item) => item.title)).size, 6);
  const grouped = samplesByTheme().flatMap((group) => group.items);
  assert.equal(grouped.length, 6);
});

test('未知路径回到首页', () => {
  assert.equal(resolveAppPath('/course'), '/course');
  assert.equal(resolveAppPath('/guide/'), '/guide');
  assert.equal(resolveAppPath('/missing'), '/');
});

test('首页入口识别示例和自编故事', () => {
  assert.deepEqual(courseEntry({ sample: 'school-day' }), {
    chosen: 'sample',
    sampleId: 'school-day',
  });
  assert.deepEqual(courseEntry({ mode: 'custom' }), { chosen: 'custom', sampleId: null });
  assert.deepEqual(courseEntry({ sample: 'missing' }), { chosen: 'custom', sampleId: null });
});

test('故事提示不重复插入', () => {
  assert.equal(appendStoryPrompt('', '人物：'), '人物：');
  assert.equal(appendStoryPrompt('小明去公园', '地点：'), '小明去公园\n地点：');
  assert.equal(appendStoryPrompt('人物：小明', '人物：'), '人物：小明');
});

test('句子导航停在两端', () => {
  assert.equal(adjacentSentence(0, 5, -1), null);
  assert.equal(adjacentSentence(0, 5, 1), 1);
  assert.equal(adjacentSentence(4, 5, 1), null);
  assert.equal(adjacentSentence(2, 0, 1), null);
});

test('审核视图包含故事、词卡、练习和重点词', () => {
  assert.deepEqual(
    REVIEW_TABS.map(([id]) => id),
    ['story', 'words', 'exercises', 'focus'],
  );
});

test('朗读语速跟随难度，缺少语音时保留文字学习', async () => {
  assert.equal(speechRate('L'), 0.85);
  assert.equal(speechRate('M'), 1);
  assert.equal(speechRate('H'), 1.1);
  const audio = new LessonAudio(() => undefined);
  await assert.rejects(() => audio.speak('park', 1), /朗读语音/);
});
