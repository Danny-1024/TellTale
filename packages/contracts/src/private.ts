import Type from "typebox";
import {
  IdentifierSchema,
  ChoiceExerciseSchema,
  MatchExerciseSchema,
  ClozeExerciseSchema,
} from "./schemas.js";

const closed = { additionalProperties: false } as const;
export const FamilyOwnerSchema = Type.Object(
  {
    kind: Type.Literal("family"),
    adultId: IdentifierSchema,
    childId: IdentifierSchema,
  },
  closed,
);
export const ClassOwnerSchema = Type.Object(
  {
    kind: Type.Literal("class"),
    classSessionId: IdentifierSchema,
    childId: Type.Null(),
  },
  closed,
);
export const SampleOwnerSchema = Type.Object(
  {
    kind: Type.Literal("sample"),
    sampleSessionId: IdentifierSchema,
    childId: Type.Null(),
  },
  closed,
);
export const OwnerSchema = Type.Union([
  FamilyOwnerSchema,
  ClassOwnerSchema,
  SampleOwnerSchema,
]);
export const PrivateChoiceExerciseSchema = Type.Object(
  { ...ChoiceExerciseSchema.properties, correctOptionId: IdentifierSchema },
  closed,
);
export const PrivateMatchExerciseSchema = Type.Object(
  {
    ...MatchExerciseSchema.properties,
    correctPairs: Type.Array(
      Type.Object(
        { leftId: IdentifierSchema, rightId: IdentifierSchema },
        closed,
      ),
      { minItems: 2, maxItems: 3, uniqueItems: true },
    ),
  },
  closed,
);
export const PrivateClozeExerciseSchema = Type.Object(
  { ...ClozeExerciseSchema.properties, correctOptionId: IdentifierSchema },
  closed,
);
export const PrivateSchemas = {
  Owner: OwnerSchema,
  PrivateExercise: Type.Union([
    PrivateChoiceExerciseSchema,
    PrivateMatchExerciseSchema,
    PrivateClozeExerciseSchema,
  ]),
};
export type Owner = Type.Static<typeof OwnerSchema>;
