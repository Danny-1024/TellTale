import type { StoryLesson } from '@telltale/contracts';

export class LessonAudio {
  private audio: HTMLAudioElement | null = null;
  constructor(private changed: (playing: boolean) => void) {}
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.changed(false);
  }
  async play(url: string, volume: number) {
    this.stop();
    const audio = new Audio(url);
    this.audio = audio;
    audio.volume = volume;
    audio.addEventListener('ended', () => this.stop(), { once: true });
    await audio.play();
    if (this.audio === audio) this.changed(true);
  }
}

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('故事图片加载失败，请重新尝试。'));
    image.src = url;
  });

export async function renderBook(lesson: StoryLesson): Promise<Blob> {
  await document.fonts.load('800 36px Nunito');
  if (!document.fonts.check('800 36px Nunito')) throw new Error('绘本字体加载失败。');
  const images = await Promise.all(
    lesson.sentences.map((s) => (s.imageUrl ? loadImage(s.imageUrl) : null)),
  );
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('当前浏览器无法生成绘本。');
  const wrap = (text: string, font: string) => {
    context.font = font;
    const lines: string[] = [];
    let line = '';
    const parts = text.match(/\S+\s*|\s+/gu) ?? [];
    for (const part of parts) {
      if (context.measureText(line + part).width <= 920) {
        line += part;
        continue;
      }
      if (line) {
        lines.push(line.trimEnd());
        line = '';
      }
      for (const char of part) {
        if (context.measureText(line + char).width > 920) {
          lines.push(line);
          line = '';
        }
        line += char;
      }
    }
    if (line) lines.push(line.trimEnd());
    return lines;
  };
  const enFont = '800 40px Nunito, sans-serif';
  const zhFont = '28px "PingFang SC", sans-serif';
  const titleLines = wrap(lesson.title, '800 48px Nunito, sans-serif');
  const englishTitle = wrap(lesson.titleEn, enFont);
  const rows = lesson.sentences.map((s, i) => ({
    image: images[i],
    en: wrap(s.en, enFont),
    zh: wrap(s.zh, zhFont),
  }));
  const headerHeight = 130 + titleLines.length * 64 + englishTitle.length * 52;
  canvas.height =
    headerHeight +
    rows.reduce(
      (height, row) =>
        height +
        (row.image
          ? Math.round((920 * row.image.naturalHeight) / row.image.naturalWidth) + 32
          : 70) +
        row.en.length * 56 +
        row.zh.length * 42 +
        80,
      0,
    ) +
    100;
  context.fillStyle = '#fefbf4';
  context.fillRect(0, 0, 1080, canvas.height);
  context.textBaseline = 'top';
  context.fillStyle = '#1a2b4a';
  let y = 60;
  context.font = '800 48px Nunito, sans-serif';
  for (const line of titleLines) {
    context.fillText(line, 80, y);
    y += 64;
  }
  context.font = enFont;
  for (const line of englishTitle) {
    context.fillText(line, 80, y);
    y += 52;
  }
  context.font = zhFont;
  context.fillText(
    lesson.source === 'custom' ? 'AI 生成文字 · 成人已审核' : '示例故事 · TellTale English',
    80,
    y + 12,
  );
  y = headerHeight;
  rows.forEach((row, i) => {
    if (row.image) {
      const h = Math.round((920 * row.image.naturalHeight) / row.image.naturalWidth);
      context.drawImage(row.image, 80, y, 920, h);
      y += h + 32;
    } else {
      context.font = '800 30px Nunito';
      context.fillText(`${String(i + 1).padStart(2, '0')}  /  ${rows.length}`, 80, y);
      y += 70;
    }
    context.font = enFont;
    for (const line of row.en) {
      context.fillText(line, 80, y);
      y += 56;
    }
    context.font = zhFont;
    for (const line of row.zh) {
      context.fillText(line, 80, y);
      y += 42;
    }
    y += 80;
  });
  context.font = '700 24px Nunito';
  context.fillText('TellTale English · 我的故事，我的英语', 80, canvas.height - 70);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('绘本生成失败。'))),
      'image/png',
    ),
  );
}
