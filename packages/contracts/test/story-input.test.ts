import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectStoryInput } from '../src/story-input.js';

test('story input counts normalized Unicode code points and trims surrounding whitespace', () => {
  for (const length of [20, 150, 300]) {
    const result = inspectStoryInput(` \n${'猫'.repeat(length)}\t `);
    assert.equal(result.count, length);
    assert.equal(result.issue, null);
  }
  assert.equal(inspectStoryInput('猫'.repeat(301)).issue?.code, 'INPUT_TOO_LONG');
  assert.equal(inspectStoryInput('🐈'.repeat(300)).count, 300);
  assert.equal(inspectStoryInput('🐈'.repeat(300)).issue, null);
  assert.equal(inspectStoryInput('🐈'.repeat(301)).issue?.code, 'INPUT_TOO_LONG');
  const decomposed = inspectStoryInput(` ${'e\u0301'.repeat(300)} `);
  assert.equal(decomposed.source, 'é'.repeat(300));
  assert.equal(decomposed.count, 300);
  assert.equal(decomposed.issue, null);
  assert.equal(inspectStoryInput('e\u0301'.repeat(301)).issue?.code, 'INPUT_TOO_LONG');
  assert.equal(inspectStoryInput('👩‍👩‍👧‍👦'.repeat(42)).count, 294);
  assert.equal(inspectStoryInput('👩‍👩‍👧‍👦'.repeat(43)).issue?.code, 'INPUT_TOO_LONG');
  assert.equal(inspectStoryInput('a\u0323\u0301'.repeat(150)).count, 300);
});

test('empty and insufficient visible story details require adult changes', () => {
  for (const value of ['', ' \n\t\u3000 ', '\u200b'.repeat(20), '\u0301'.repeat(20)])
    assert.equal(inspectStoryInput(value).issue?.code, 'INPUT_EMPTY');
  for (const value of ['猫', '🐈', '猫\u200b\u200b\u200b\u200b', '猫    狗'])
    assert.equal(inspectStoryInput(value).issue?.code, 'INPUT_NEEDS_DETAIL');
  assert.equal(inspectStoryInput('小猫在玩球').issue, null);
});

test('obvious contact details are rejected without echoing the source', () => {
  for (const value of [
    '请联系12345678901',
    '请联系123 4567 8901',
    '请联系123-4567-8901',
    '请联系１２３４５６７８９０１',
    '请联系123\u200b45678901',
    '请联系lesson@example.com',
    '请联系ｌｅｓｓｏｎ＠ｅｘａｍｐｌｅ．ｃｏｍ',
  ]) {
    const issue = inspectStoryInput(value).issue;
    assert.equal(issue?.code, 'PERSONAL_INFORMATION');
    assert.equal(issue?.message, '请删除故事中的联系方式。');
  }
  assert.equal(inspectStoryInput('小猫在2026年10月23日捡到3个球。').issue, null);
});
