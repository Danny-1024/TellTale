import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  assertContract,
  ContractValidationError,
  validateContract,
} from "../src/validation.js";
import { DIFFICULTY_WORD_LIMIT, SUPPORT_DEFAULTS } from "../src/parameters.js";
import { OwnerSchema, PrivateChoiceExerciseSchema } from "../src/private.js";
import type { ChildLearningMaterial, CourseSettings } from "../src/schemas.js";

const settings = (): CourseSettings => ({
  gradeBand: "1-2",
  englishStart: "new",
  difficulty: "L",
  ...SUPPORT_DEFAULTS,
  reviewWordKeys: [],
});

// 人工构造资料只验证结构合同，不作为真实生成、媒体或教学内容验收。
function material(): ChildLearningMaterial {
  const sentenceId = randomUUID();
  const vocabId = randomUUID();
  const base = {
    id: randomUUID(),
    targetVocabIds: [vocabId],
    promptZh: "选择一个词语",
    instructionAudioAssetId: null,
    hintId: randomUUID(),
  };
  const options = ["cat", "dog", "ball"].map((text) => ({
    id: randomUUID(),
    text,
  }));
  return {
    id: randomUUID(),
    lessonId: randomUUID(),
    difficulty: "L",
    sentences: [1, 2, 3].map((order) => ({
      id: order === 1 ? sentenceId : randomUUID(),
      order,
      en: "The cat sees a ball.",
      zh: "小猫看见一个球。",
      imageAssetId: randomUUID(),
      audioAssetId: null,
    })),
    vocabCards: ["cat", "sees", "ball", "the", "a"].map((word, index) => ({
      id: index === 0 ? vocabId : randomUUID(),
      word,
      wordKey: `${word}:fixture`,
      zhMeaning: "结构检查词义",
      exampleSentenceId: sentenceId,
      imageAssetId: randomUUID(),
      audioAssetId: null,
    })),
    exercises: [
      { ...base, type: "choice", options },
      {
        ...base,
        id: randomUUID(),
        type: "match",
        leftItems: options.slice(0, 2),
        rightItems: ["猫", "狗"].map((text) => ({ id: randomUUID(), text })),
      },
      {
        ...base,
        id: randomUUID(),
        type: "cloze",
        sentenceEn: "The cat sees a ____.",
        options: options.slice(0, 2),
      },
    ],
  };
}

test("三档参数与教学支持默认值独立且不可修改", () => {
  assert.deepEqual(DIFFICULTY_WORD_LIMIT, { L: 8, M: 12, H: 16 });
  assert.deepEqual(SUPPORT_DEFAULTS, {
    showChinese: true,
    volume: 0.8,
    reduceMotion: true,
  });
  for (const difficulty of ["L", "M", "H"])
    assertContract("CourseSettings", { ...settings(), difficulty });
  assert(
    Object.isFrozen(DIFFICULTY_WORD_LIMIT) && Object.isFrozen(SUPPORT_DEFAULTS),
  );
});

test("配置拒绝未知字段、类型转换和缺失值，原始资料保持不变", () => {
  const input = {
    ...settings(),
    volume: "0.8",
    extra: "untrusted-input-marker",
  };
  const before = structuredClone(input);
  assert.throws(
    () => assertContract("CourseSettings", input),
    ContractValidationError,
  );
  assert.deepEqual(input, before);
  const missing: Record<string, unknown> = settings();
  delete missing.showChinese;
  assert.equal(validateContract("CourseSettings", missing), false);
  assert.equal("showChinese" in missing, false);
});

test("音量、复习词数量、唯一性和枚举边界正确", () => {
  for (const volume of [0, 1])
    assertContract("CourseSettings", { ...settings(), volume });
  for (const volume of [-0.1, 1.1, Number.NaN, Number.POSITIVE_INFINITY])
    assert.equal(
      validateContract("CourseSettings", { ...settings(), volume }),
      false,
    );
  for (const reviewWordKeys of [["a", "b", "c", "d"], ["cat", "cat"], ["   "]])
    assert.equal(
      validateContract("CourseSettings", { ...settings(), reviewWordKeys }),
      false,
    );
  for (const invalid of [
    { difficulty: "A" },
    { gradeBand: "7-8" },
    { englishStart: "automatic" },
  ])
    assert.equal(
      validateContract("CourseSettings", { ...settings(), ...invalid }),
      false,
    );
  assertContract("CourseSettings", {
    ...settings(),
    reviewWordKeys: ["cat", "ball", "dog"],
  });
});

test("重点词只能未选或已选2至3个，不接受重复编号", () => {
  for (const count of [0, 2, 3])
    assertContract("SettingsSnapshot", {
      ...settings(),
      focusVocabIds: Array.from({ length: count }, () => randomUUID()),
      adoptedSuggestionId: null,
    });
  for (const count of [1, 4])
    assert.equal(
      validateContract("SettingsSnapshot", {
        ...settings(),
        focusVocabIds: Array.from({ length: count }, () => randomUUID()),
        adoptedSuggestionId: null,
      }),
      false,
    );
  const id = randomUUID();
  assert.equal(
    validateContract("SettingsSnapshot", {
      ...settings(),
      focusVocabIds: [id, id],
      adoptedSuggestionId: null,
    }),
    false,
  );
});

test("标识、UTC时间和版本约束有效", () => {
  assertContract("Identifier", randomUUID());
  assertContract("UtcTimestamp", "2026-10-21T01:30:00.000Z");
  for (const invalid of [
    "2026-10-21",
    "2026-02-30T00:00:00Z",
    "2026-10-21T09:30:00+08:00",
  ])
    assert.equal(validateContract("UtcTimestamp", invalid), false);
  assert.equal(validateContract("Identifier", "not-an-id"), false);
  for (const invalid of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])
    assert.equal(validateContract("Revision", invalid), false);
});

test("学习材料数量及三类题目结构完整", () => {
  assertContract("ChildLearningMaterial", material());
  for (const count of [2, 6]) {
    const input = material();
    input.sentences = Array.from({ length: count }, () => input.sentences[0]!);
    assert.equal(validateContract("ChildLearningMaterial", input), false);
  }
  const input = material();
  input.vocabCards.pop();
  assert.equal(validateContract("ChildLearningMaterial", input), false);
  const duplicate = material();
  duplicate.exercises[1] = duplicate.exercises[0]!;
  assert.equal(validateContract("ChildLearningMaterial", duplicate), false);
});

test("公开材料在各层拒绝私人答案及成人字段", () => {
  const extraRoot = {
    ...material(),
    adultId: randomUUID(),
    sourceZh: "private-input-marker",
  };
  assert.equal(validateContract("ChildLearningMaterial", extraRoot), false);
  const extraChoice = material();
  Object.assign(extraChoice.exercises[0]!, { correctOptionId: randomUUID() });
  assert.equal(validateContract("ChildLearningMaterial", extraChoice), false);
  const extraMatch = material();
  Object.assign(extraMatch.exercises[1]!, { correctPairs: [] });
  assert.equal(validateContract("ChildLearningMaterial", extraMatch), false);
  const extraVocab = material();
  Object.assign(extraVocab.vocabCards[0]!, {
    providerResponse: "private-provider-marker",
  });
  assert.equal(validateContract("ChildLearningMaterial", extraVocab), false);
});

test("错误资料只保留合同和位置，不包含原始内容", () => {
  const marker = "private-payload-marker";
  try {
    assertContract("CourseSettings", { ...settings(), volume: marker });
    assert.fail("错误输入应当拒绝");
  } catch (error) {
    assert(error instanceof ContractValidationError);
    assert(error.issues.some((issue) => issue.path === "/volume"));
    assert(!JSON.stringify(error).includes(marker));
    assert(!error.message.includes(marker));
  }
});

test("私人合同限制互斥归属并允许服务端私有答案", () => {
  const ajv = new Ajv({ strict: true });
  addFormats(ajv, ["uuid"]);
  const owner = ajv.compile(OwnerSchema);
  assert(
    owner({ kind: "family", adultId: randomUUID(), childId: randomUUID() }),
  );
  assert(owner({ kind: "class", classSessionId: randomUUID(), childId: null }));
  assert(
    !owner({
      kind: "class",
      classSessionId: randomUUID(),
      childId: randomUUID(),
    }),
  );
  assert(
    !owner({
      kind: "family",
      adultId: randomUUID(),
      childId: randomUUID(),
      classSessionId: randomUUID(),
    }),
  );
  const choice = material().exercises[0]!;
  assert(
    ajv.compile(PrivateChoiceExerciseSchema)({
      ...choice,
      correctOptionId: randomUUID(),
    }),
  );
});

test("浏览器校验代码不使用动态编译或携带私人答案字段", () => {
  const source = readFileSync(
    new URL("../src/generated/public.js", import.meta.url),
    "utf8",
  );
  assert(!source.includes("new Function("));
  assert(
    !source.includes("correctOptionId") && !source.includes("correctPairs"),
  );
});
