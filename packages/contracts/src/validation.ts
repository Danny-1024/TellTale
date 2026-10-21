import validators from './generated/public.js';
import type { PublicContractMap } from './schemas.js';

export class ContractValidationError extends Error {
  readonly contract: keyof PublicContractMap;
  readonly issues: readonly { path: string; keyword: string }[];

  constructor(
    contract: keyof PublicContractMap,
    issues: readonly { instancePath: string; keyword: string }[],
  ) {
    super(`合同校验失败：${contract}`);
    this.name = 'ContractValidationError';
    this.contract = contract;
    this.issues = issues.map((issue) => ({
      path: issue.instancePath,
      keyword: issue.keyword,
    }));
  }
}

export function validateContract<Name extends keyof PublicContractMap>(
  name: Name,
  value: unknown,
): value is PublicContractMap[Name] {
  return validators[name](value);
}

export function assertContract<Name extends keyof PublicContractMap>(
  name: Name,
  value: unknown,
): asserts value is PublicContractMap[Name] {
  const check = validators[name];
  if (!check(value)) {
    if (!check.errors) throw new Error(`校验函数缺少错误资料：${name}`);
    throw new ContractValidationError(name, check.errors);
  }
}
