export function inspectStoryInput(input: string) {
  const source = input.normalize('NFC').trim();
  const count = [...source].length;
  const visibleCount = [...source.replace(/[\s\p{M}\p{Default_Ignorable_Code_Point}]/gu, '')]
    .length;
  // 联系方式检查兼容全角输入及不可见分隔符，发送正文保持NFC形式。
  const contactText = source.normalize('NFKC').replace(/\p{Default_Ignorable_Code_Point}/gu, '');
  const issue =
    visibleCount === 0
      ? { code: 'INPUT_EMPTY', message: '请填写故事内容。' }
      : count > 300
        ? { code: 'INPUT_TOO_LONG', message: '故事最多300个字符。' }
        : visibleCount < 5
          ? { code: 'INPUT_NEEDS_DETAIL', message: '请补充人物和发生的事情。' }
          : /(?:\d[\s().+-]?){7,}|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(contactText)
            ? { code: 'PERSONAL_INFORMATION', message: '请删除故事中的联系方式。' }
            : null;
  return { source, count, issue };
}
