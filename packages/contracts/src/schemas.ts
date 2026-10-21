import Type from "typebox";

const closed = { additionalProperties: false } as const;
export const IdentifierSchema = Type.String({
  format: "uuid",
  minLength: 36,
  maxLength: 36,
});
export const UtcTimestampSchema = Type.String({
  format: "date-time",
  pattern: "Z$",
  maxLength: 30,
});
const shortText = () =>
  Type.String({ minLength: 1, maxLength: 200, pattern: "\\S" });
const nullableId = () => Type.Union([IdentifierSchema, Type.Null()]);

export const DifficultySchema = Type.Union([
  Type.Literal("L"),
  Type.Literal("M"),
  Type.Literal("H"),
]);
export const GradeBandSchema = Type.Union([
  Type.Literal("1-2"),
  Type.Literal("3-4"),
  Type.Literal("5-6"),
]);
export const EnglishStartSchema = Type.Union([
  Type.Literal("new"),
  Type.Literal("words"),
  Type.Literal("sentences"),
]);
export const ExerciseTypeSchema = Type.Union([
  Type.Literal("choice"),
  Type.Literal("match"),
  Type.Literal("cloze"),
]);
export const SourceTypeSchema = Type.Union([
  Type.Literal("custom"),
  Type.Literal("sample"),
]);
export const SafetyStatusSchema = Type.Union(
  (["unknown", "pass", "review", "reject", "timeout"] as const).map((value) =>
    Type.Literal(value),
  ),
);

export const CourseSettingsSchema = Type.Object(
  {
    gradeBand: GradeBandSchema,
    englishStart: EnglishStartSchema,
    difficulty: DifficultySchema,
    showChinese: Type.Boolean(),
    volume: Type.Number({ minimum: 0, maximum: 1 }),
    reduceMotion: Type.Boolean(),
    reviewWordKeys: Type.Array(shortText(), { maxItems: 3, uniqueItems: true }),
  },
  closed,
);

export const SettingsSnapshotSchema = Type.Object(
  {
    ...CourseSettingsSchema.properties,
    focusVocabIds: Type.Union([
      Type.Array(IdentifierSchema, { maxItems: 0 }),
      Type.Array(IdentifierSchema, {
        minItems: 2,
        maxItems: 3,
        uniqueItems: true,
      }),
    ]),
    adoptedSuggestionId: nullableId(),
  },
  closed,
);

export const RevisionSchema = Type.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER,
});
export const SentenceSchema = Type.Object(
  {
    id: IdentifierSchema,
    order: Type.Integer({ minimum: 1, maximum: 5 }),
    en: Type.String({ minLength: 1, maxLength: 500, pattern: "\\S" }),
    zh: Type.String({ minLength: 1, maxLength: 300, pattern: "\\S" }),
    imageAssetId: IdentifierSchema,
    audioAssetId: nullableId(),
  },
  closed,
);
export const VocabCardSchema = Type.Object(
  {
    id: IdentifierSchema,
    word: Type.String({ minLength: 1, maxLength: 80, pattern: "\\S" }),
    wordKey: shortText(),
    zhMeaning: shortText(),
    exampleSentenceId: IdentifierSchema,
    imageAssetId: IdentifierSchema,
    audioAssetId: nullableId(),
  },
  closed,
);

const exerciseFields = {
  id: IdentifierSchema,
  targetVocabIds: Type.Array(IdentifierSchema, {
    minItems: 1,
    maxItems: 3,
    uniqueItems: true,
  }),
  promptZh: shortText(),
  instructionAudioAssetId: nullableId(),
  hintId: IdentifierSchema,
};
const option = Type.Object({ id: IdentifierSchema, text: shortText() }, closed);
export const ChoiceExerciseSchema = Type.Object(
  {
    ...exerciseFields,
    type: Type.Literal("choice"),
    options: Type.Array(option, {
      minItems: 3,
      maxItems: 3,
      uniqueItems: true,
    }),
  },
  closed,
);
export const MatchExerciseSchema = Type.Object(
  {
    ...exerciseFields,
    type: Type.Literal("match"),
    leftItems: Type.Array(option, {
      minItems: 2,
      maxItems: 3,
      uniqueItems: true,
    }),
    rightItems: Type.Array(option, {
      minItems: 2,
      maxItems: 3,
      uniqueItems: true,
    }),
  },
  closed,
);
export const ClozeExerciseSchema = Type.Object(
  {
    ...exerciseFields,
    type: Type.Literal("cloze"),
    sentenceEn: Type.String({ minLength: 1, maxLength: 500, pattern: "\\S" }),
    options: Type.Array(option, {
      minItems: 2,
      maxItems: 3,
      uniqueItems: true,
    }),
  },
  closed,
);
export const ExerciseSchema = Type.Union([
  ChoiceExerciseSchema,
  MatchExerciseSchema,
  ClozeExerciseSchema,
]);
export const ChildLearningMaterialSchema = Type.Object(
  {
    id: IdentifierSchema,
    lessonId: IdentifierSchema,
    difficulty: DifficultySchema,
    sentences: Type.Array(SentenceSchema, { minItems: 3, maxItems: 5 }),
    vocabCards: Type.Array(VocabCardSchema, { minItems: 5, maxItems: 5 }),
    exercises: Type.Array(ExerciseSchema, {
      minItems: 3,
      maxItems: 3,
      allOf: [
        { contains: ChoiceExerciseSchema },
        { contains: MatchExerciseSchema },
        { contains: ClozeExerciseSchema },
      ],
    }),
  },
  closed,
);

export const LiveResponseSchema = Type.Object(
  {
    status: Type.Literal("alive"),
    service: Type.Literal("telltale-api"),
    requestId: IdentifierSchema,
  },
  closed,
);
export const ErrorCodeSchema = Type.Union(
  (
    [
      "INPUT_INVALID",
      "INPUT_NEEDS_DETAIL",
      "SESSION_EXPIRED",
      "CONSENT_REQUIRED",
      "ADULT_REQUIRED",
      "RESOURCE_NOT_FOUND",
      "REVISION_CONFLICT",
      "IDEMPOTENCY_CONFLICT",
      "CONTENT_VERSION_MISMATCH",
      "INVALID_TRANSITION",
      "RUN_EXPIRED",
      "SHARE_REVOKED",
      "VOICE_TOO_LARGE",
      "CONTENT_INVALID",
      "SAFETY_REJECTED",
      "RATE_LIMITED",
      "PROVIDER_FAILED",
      "PROVIDER_RESULT_UNKNOWN",
      "JOB_DEADLINE_EXCEEDED",
      "INTERNAL_ERROR",
    ] as const
  ).map((value) => Type.Literal(value)),
);
export const ErrorResponseSchema = Type.Object(
  {
    error: Type.Object(
      {
        code: ErrorCodeSchema,
        message: Type.String({ minLength: 1, maxLength: 300 }),
        retryable: Type.Boolean(),
        fieldErrors: Type.Optional(
          Type.Array(
            Type.Object({ field: shortText(), code: shortText() }, closed),
            { maxItems: 100 },
          ),
        ),
      },
      closed,
    ),
    requestId: IdentifierSchema,
  },
  closed,
);

export const PublicSchemas = {
  Identifier: IdentifierSchema,
  UtcTimestamp: UtcTimestampSchema,
  Difficulty: DifficultySchema,
  GradeBand: GradeBandSchema,
  EnglishStart: EnglishStartSchema,
  ExerciseType: ExerciseTypeSchema,
  SourceType: SourceTypeSchema,
  SafetyStatus: SafetyStatusSchema,
  CourseSettings: CourseSettingsSchema,
  SettingsSnapshot: SettingsSnapshotSchema,
  Revision: RevisionSchema,
  ChildLearningMaterial: ChildLearningMaterialSchema,
  LiveResponse: LiveResponseSchema,
  ErrorResponse: ErrorResponseSchema,
};
export type PublicContractMap = {
  [Name in keyof typeof PublicSchemas]: Type.Static<
    (typeof PublicSchemas)[Name]
  >;
};
export type LiveResponse = Type.Static<typeof LiveResponseSchema>;
export type Difficulty = Type.Static<typeof DifficultySchema>;
export type CourseSettings = Type.Static<typeof CourseSettingsSchema>;
export type SettingsSnapshot = Type.Static<typeof SettingsSnapshotSchema>;
export type ChildLearningMaterial = Type.Static<
  typeof ChildLearningMaterialSchema
>;
