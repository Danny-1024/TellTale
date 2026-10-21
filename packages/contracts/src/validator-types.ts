import type { PublicContractMap } from './schemas.js';

export interface ValidationIssue {
  instancePath: string;
  keyword: string;
}
export interface ContractValidator<T> {
  (value: unknown): value is T;
  errors?: readonly ValidationIssue[] | null;
}
export type PublicValidators = {
  [Name in keyof PublicContractMap]: ContractValidator<PublicContractMap[Name]>;
};
