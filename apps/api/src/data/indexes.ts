import type { IndexDescription } from 'mongodb';
import type { DatabaseRole } from './connection.js';

export const COLLECTIONS = [
  'adults',
  'consents',
  'children',
  'authSessions',
  'classSessions',
  'lessons',
  'contentVersions',
  'runs',
  'jobs',
  'outbox',
  'attempts',
  'learningEvents',
  'wordEvidence',
  'suggestions',
  'mediaAssets',
  'artworks',
  'shares',
  'dataTasks',
  'deletionLedger',
  'idempotency',
] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

function index(
  key: IndexDescription['key'],
  name: string,
  options: Omit<IndexDescription, 'key' | 'name'> = {},
): IndexDescription {
  return { key, name, ...options };
}

const owner = {
  'owner.kind': 1,
  'owner.adultId': 1,
  'owner.childId': 1,
  'owner.classSessionId': 1,
  'owner.sampleSessionId': 1,
} as const;

const extra: Partial<Record<CollectionName, IndexDescription[]>> = {
  adults: [index({ phoneLookupHmac: 1 }, 'phone_lookup_unique', { unique: true })],
  consents: [index({ adultId: 1, kind: 1, changedAt: -1, id: -1 }, 'consent_current_lookup')],
  children: [index({ adultId: 1, status: 1, createdAt: -1, id: -1 }, 'children_owner_page')],
  authSessions: [index({ tokenHash: 1 }, 'session_token_unique', { unique: true })],
  contentVersions: [
    index({ lessonId: 1, versionNo: 1 }, 'lesson_version_unique', { unique: true }),
  ],
  runs: [
    index({ lessonId: 1 }, 'active_lesson_unique', {
      unique: true,
      partialFilterExpression: { status: { $in: ['active', 'resting'] } },
    }),
    index({ tokenHash: 1 }, 'run_token_unique', { unique: true }),
  ],
  attempts: [
    index({ runId: 1, exerciseId: 1, targetId: 1, attemptNo: 1 }, 'attempt_sequence_unique', {
      unique: true,
    }),
    index({ principalId: 1, operationId: 1 }, 'attempt_operation_unique', { unique: true }),
  ],
  wordEvidence: [
    index({ childId: 1, wordKey: 1, observedAt: -1, id: -1 }, 'word_history'),
    index({ attemptId: 1, wordKey: 1 }, 'word_attempt_unique', {
      unique: true,
      partialFilterExpression: { attemptId: { $type: 'string' } },
    }),
    index({ eventId: 1, wordKey: 1 }, 'word_event_unique', {
      unique: true,
      partialFilterExpression: { eventId: { $type: 'string' } },
    }),
  ],
  jobs: [
    index({ ...owner, kind: 1, inputVersionId: 1, generationRevision: 1 }, 'active_job_unique', {
      unique: true,
      partialFilterExpression: { status: { $in: ['queued', 'running'] } },
    }),
  ],
  outbox: [index({ eventId: 1 }, 'outbox_event_unique', { unique: true })],
  idempotency: [
    index({ principalId: 1, route: 1, operationId: 1 }, 'request_operation_unique', {
      unique: true,
    }),
  ],
  shares: [
    index({ tokenHash: 1 }, 'share_token_unique', { unique: true }),
    index({ ...owner, revokedAt: 1, expiresAt: 1 }, 'share_owner_expiry'),
  ],
  lessons: [
    index(
      { 'owner.adultId': 1, 'owner.childId': 1, status: 1, createdAt: -1, id: -1 },
      'family_lesson_page',
    ),
    index({ 'owner.classSessionId': 1, status: 1, createdAt: -1, id: -1 }, 'class_lesson_page'),
  ],
};

const familyExpiring = new Set<CollectionName>([
  'authSessions',
  'classSessions',
  'runs',
  'shares',
  'dataTasks',
  'idempotency',
]);

export function collectionIndexes(
  collection: CollectionName,
  role: DatabaseRole,
): IndexDescription[] {
  const indexes = [
    index({ id: 1 }, 'business_id_unique', { unique: true }),
    ...(extra[collection] ?? []),
  ];
  if ((role === 'temporary' && collection !== 'deletionLedger') || familyExpiring.has(collection)) {
    indexes.push(
      index({ expiresAt: 1 }, 'expiry_lookup'),
      index({ purgeAt: 1 }, 'purge_after_cleanup', { expireAfterSeconds: 0 }),
    );
  }
  return indexes;
}
