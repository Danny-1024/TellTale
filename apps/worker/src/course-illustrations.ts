import { COURSE_MEDIA_PATH, type StoryLesson } from '@telltale/contracts';
import { generateIllustration, IMAGE_MIME } from './openai-images';
import { ProviderError } from './provider';

interface IllustrationTarget {
  id: string;
  kind: 'sentence' | 'word';
  position: number;
  description: string;
}

export type CourseImage = Awaited<ReturnType<typeof generateIllustration>> & {
  id: string;
  target: IllustrationTarget;
};

export function pictureTargets(lesson: StoryLesson): IllustrationTarget[] {
  return [
    ...lesson.sentences.map(({ id, en }, index) => ({
      id,
      kind: 'sentence' as const,
      position: index + 1,
      description: en,
    })),
    ...lesson.words.map(({ id, word, meaning, sentenceId }, index) => ({
      id,
      kind: 'word' as const,
      position: index + 1,
      description: `${word} (${meaning}) in the context of ${lesson.sentences.find((line) => line.id === sentenceId)!.en}`,
    })),
  ];
}

export async function makeCourseImage(
  key: string,
  target: IllustrationTarget,
  deadline: number,
  signal: AbortSignal,
  withSlot: (
    run: () => ReturnType<typeof generateIllustration>,
  ) => ReturnType<typeof generateIllustration>,
): Promise<CourseImage> {
  let repairs = 0;
  let networkRetries = 0;
  for (;;) {
    try {
      const image = await withSlot(() =>
        generateIllustration(key, target.description, deadline, signal, repairs > 0),
      );
      return { ...image, id: crypto.randomUUID(), target };
    } catch (error) {
      if (!(error instanceof ProviderError) || signal.aborted || Date.now() + 1000 >= deadline)
        throw error;
      // 审核拦截只修复这一张。网络失败与内容修复分别最多重试两次。
      if (error.code === 'IMAGE_FLAGGED' && repairs < 2) repairs++;
      else if (error.retryable && networkRetries < 2) networkRetries++;
      else throw error;
    }
  }
}

export class CourseImages {
  constructor(private readonly sql: SqlStorage) {
    sql.exec(`CREATE TABLE IF NOT EXISTS course_image (
      id TEXT PRIMARY KEY, lesson_id TEXT NOT NULL, revision INTEGER NOT NULL,
      job_id TEXT NOT NULL, target_id TEXT NOT NULL, kind TEXT NOT NULL,
      ai_generated INTEGER NOT NULL, mime TEXT NOT NULL, width INTEGER NOT NULL,
      height INTEGER NOT NULL, byte_count INTEGER NOT NULL, sha256 TEXT NOT NULL,
      model TEXT NOT NULL, request_id TEXT, safety_model TEXT NOT NULL,
      safety_id TEXT NOT NULL, safety_status TEXT NOT NULL, bytes BLOB NOT NULL,
      UNIQUE (lesson_id, revision, target_id)
    )`);
  }

  clear() {
    this.sql.exec('DELETE FROM course_image');
  }

  store(lesson: StoryLesson, jobId: string, images: CourseImage[]) {
    // 图片和对应的审核修订版本在同一事务中写入。每个目标具有独立的受限资源标识。
    for (const image of images) {
      this.sql.exec(
        `INSERT INTO course_image VALUES (?,?,?,?,?,?,1,?,?,?,?,?,?,?,?,?,'pass',?)`,
        image.id,
        lesson.id,
        lesson.revision,
        jobId,
        image.target.id,
        image.target.kind,
        IMAGE_MIME,
        image.width,
        image.height,
        image.bytes.byteLength,
        image.sha256,
        image.model,
        image.requestId,
        image.safetyModel,
        image.safetyId,
        image.bytes.buffer,
      );
    }
    const urls = new Map(images.map(({ id, target }) => [target.id, `${COURSE_MEDIA_PATH}${id}`]));
    for (const sentence of lesson.sentences) {
      sentence.imageUrl = urls.get(sentence.id)!;
      sentence.imageAlt = sentence.zh;
    }
    for (const word of lesson.words) word.imageUrl = urls.get(word.id)!;
  }

  count(lesson: StoryLesson) {
    return this.sql
      .exec<{ total: number }>(
        "SELECT COUNT(*) AS total FROM course_image WHERE lesson_id=? AND revision=? AND safety_status='pass'",
        lesson.id,
        lesson.revision,
      )
      .one().total;
  }

  read(lesson: StoryLesson, id: string) {
    return this.sql
      .exec<{ bytes: ArrayBuffer; mime: string }>(
        "SELECT bytes,mime FROM course_image WHERE id=? AND lesson_id=? AND revision=? AND safety_status='pass'",
        id,
        lesson.id,
        lesson.revision,
      )
      .toArray()[0];
  }
}
