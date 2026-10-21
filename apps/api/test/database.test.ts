import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { after, before, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { MongoServerError, type Db, type Document } from 'mongodb';
import type { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import {
  databaseCleanupDate,
  DatabaseConfigurationError,
  openDatabases,
  readDatabaseConfiguration,
  withDatabaseTransaction,
  type Databases,
} from '../src/data/connection.js';
import { migrateDatabase } from '../src/data/migrate.js';
import { startReplicaSet, startStandalone } from './support/mongodb.js';

// 资料只覆盖索引和事务需要的字段，不代表完整课程或账号业务已经验收。
function record(fields: Document): Document {
  const now = new Date().toISOString();
  return { id: randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, ...fields };
}

async function expectDuplicate(db: Db, collection: string, fields: Document, index: string) {
  await db.collection(collection).insertOne(record(fields));
  await assert.rejects(
    db.collection(collection).insertOne(record(fields)),
    (error: unknown) =>
      error instanceof MongoServerError && error.code === 11000 && error.message.includes(index),
  );
}

test('连接配置要求明确且分离的数据库，解析错误不保存输入内容', () => {
  assert.throws(() => readDatabaseConfiguration({}), /MONGODB_URI/);
  assert.throws(
    () => readDatabaseConfiguration({ MONGODB_URI: 'mongodb://127.0.0.1/family' }),
    /MONGODB_TEMPORARY_URI/,
  );
  assert.throws(
    () =>
      readDatabaseConfiguration({
        MONGODB_URI: 'mongodb://127.0.0.1',
        MONGODB_TEMPORARY_URI: 'mongodb://127.0.0.1/temporary',
      }),
    /数据库名称/,
  );
  assert.throws(
    () =>
      readDatabaseConfiguration({
        MONGODB_URI: 'mongodb://127.0.0.1/shared',
        MONGODB_TEMPORARY_URI: 'mongodb://127.0.0.1/shared',
      }),
    /不同数据库/,
  );
  const marker = 'private-invalid-connection-marker';
  assert.throws(
    () => readDatabaseConfiguration({ MONGODB_URI: marker }),
    (error: unknown) => {
      assert(error instanceof DatabaseConfigurationError);
      assert(!error.message.includes(marker));
      assert(!JSON.stringify(error).includes(marker));
      return true;
    },
  );
  assert.equal(
    databaseCleanupDate('2026-10-21T01:30:00.000Z').toISOString(),
    '2026-10-21T01:30:00.000Z',
  );
  assert.throws(() => databaseCleanupDate('2026-10-21T09:30:00+08:00'));
});

describe('真实MongoDB副本集与索引迁移', { timeout: 300_000 }, () => {
  let replicaSet: MongoMemoryReplSet | undefined;
  let databases: Databases;

  before(async () => {
    replicaSet = await startReplicaSet();
    databases = await openDatabases(
      readDatabaseConfiguration({
        MONGODB_URI: replicaSet.getUri('telltale_family_test'),
        MONGODB_TEMPORARY_URI: replicaSet.getUri('telltale_temporary_test'),
      }),
    );
    const build = await databases.family.db.admin().command({ buildInfo: 1 });
    const status = await databases.family.db.admin().command({ serverStatus: 1 });
    assert.equal(status.storageEngine.name, 'wiredTiger');
    console.info(
      JSON.stringify({
        actualMongoDB: build.version,
        storageEngine: status.storageEngine.name,
        replicaSet: databases.family.replicaSet,
      }),
    );
    await migrateDatabase(databases.family.db, 'family');
    await migrateDatabase(databases.temporary.db, 'temporary');
  });

  after(async () => {
    try {
      if (databases) await databases.close();
    } finally {
      if (replicaSet) await replicaSet.stop();
    }
  });

  test('迁移可重复执行，两个数据库的索引和迁移登记保持一致', async () => {
    for (const role of ['family', 'temporary'] as const) {
      const db = databases[role].db;
      const first = await migrateDatabase(db, role);
      const beforeIndexes = await db.collection('runs').listIndexes().toArray();
      const second = await migrateDatabase(db, role);
      assert.deepEqual(second, first);
      assert.deepEqual(await db.collection('runs').listIndexes().toArray(), beforeIndexes);
      assert.equal(first.collections, 20);
      assert.equal(await db.collection('schemaMigrations').countDocuments(), 1);
      assert.equal((await db.listCollections().toArray()).length, 21);
      console.info(JSON.stringify({ migration: first }));
    }
  });

  test('迁移命令真实读取环境并重复执行，配置缺失立即退出失败', () => {
    assert(replicaSet);
    const cwd = fileURLToPath(new URL('..', import.meta.url));
    const args = ['--env-file-if-exists=../../.env', '--import', 'tsx', 'src/commands/migrate.ts'];
    const environment = {
      ...process.env,
      NODE_ENV: 'test',
      MONGODB_URI: replicaSet.getUri('telltale_family_test'),
      MONGODB_TEMPORARY_URI: replicaSet.getUri('telltale_temporary_test'),
    };
    for (let iteration = 0; iteration < 2; iteration++) {
      const result = spawnSync(process.execPath, args, {
        cwd,
        env: environment,
        encoding: 'utf8',
        timeout: 20_000,
      });
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stderr);
      const output = JSON.parse(result.stdout);
      assert.equal(output.family.indexes, 51);
      assert.equal(output.temporary.indexes, 77);
      assert(!result.stdout.includes(environment.MONGODB_URI));
    }
    const missing = spawnSync(process.execPath, args, {
      cwd,
      env: { ...environment, MONGODB_URI: '' },
      encoding: 'utf8',
      timeout: 20_000,
    });
    assert.ifError(missing.error);
    assert.equal(missing.status, 1);
    assert(missing.stderr.includes('MONGODB_URI：必须配置连接字符串'));
  });

  test('真实事务提交同时保存业务记录和outbox事件', async () => {
    const lessonId = randomUUID();
    const eventId = randomUUID();
    const result = await withDatabaseTransaction(databases.family, async ({ db, session }) => {
      await db
        .collection('lessons')
        .insertOne(record({ id: lessonId, revision: 1, status: 'draft' }), { session });
      await db
        .collection('outbox')
        .insertOne(record({ eventId, aggregateId: lessonId, kind: 'fixture' }), { session });
      return lessonId;
    });
    assert.equal(result, lessonId);
    assert.equal(
      await databases.family.db.collection('lessons').countDocuments({ id: lessonId }),
      1,
    );
    assert.equal(await databases.family.db.collection('outbox').countDocuments({ eventId }), 1);
  });

  test('事务中断保留真实错误并撤销所有已执行写入', async () => {
    const lessonId = randomUUID();
    const eventId = randomUUID();
    const failure = new Error('隔离事务中断条件');
    await assert.rejects(
      withDatabaseTransaction(databases.family, async ({ db, session }) => {
        await db
          .collection('lessons')
          .insertOne(record({ id: lessonId, revision: 1 }), { session });
        await db
          .collection('outbox')
          .insertOne(record({ eventId, aggregateId: lessonId }), { session });
        throw failure;
      }),
      (error: unknown) => error === failure,
    );
    assert.equal(
      await databases.family.db.collection('lessons').countDocuments({ id: lessonId }),
      0,
    );
    assert.equal(await databases.family.db.collection('outbox').countDocuments({ eventId }), 0);
  });

  test('实际唯一索引错误使事务中先前写入一并撤销', async () => {
    const db = databases.family.db;
    const phoneLookupHmac = `fictional-hmac-${randomUUID()}`;
    await db.collection('adults').insertOne(record({ phoneLookupHmac }));
    const lessonId = randomUUID();
    await assert.rejects(
      withDatabaseTransaction(databases.family, async ({ db, session }) => {
        await db.collection('lessons').insertOne(record({ id: lessonId }), { session });
        await db.collection('adults').insertOne(record({ phoneLookupHmac }), { session });
      }),
      (error: unknown) =>
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.message.includes('phone_lookup_unique'),
    );
    assert.equal(await db.collection('lessons').countDocuments({ id: lessonId }), 0);
    assert.equal(await db.collection('adults').countDocuments({ phoneLookupHmac }), 1);
  });

  test('同课只能存在一个active或resting实例，终态保留后允许新实例', async () => {
    const runs = databases.family.db.collection('runs');
    const lessonId = randomUUID();
    const id = randomUUID();
    await runs.insertOne(record({ id, lessonId, status: 'active', tokenHash: randomUUID() }));
    await assert.rejects(
      runs.insertOne(record({ lessonId, status: 'resting', tokenHash: randomUUID() })),
      (error: unknown) =>
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.message.includes('active_lesson_unique'),
    );
    await runs.updateOne({ id }, { $set: { status: 'completed' } });
    await runs.insertOne(record({ lessonId, status: 'completed', tokenHash: randomUUID() }));
    await runs.insertOne(record({ lessonId, status: 'resting', tokenHash: randomUUID() }));
    assert.equal(await runs.countDocuments({ lessonId }), 3);
  });

  test('作答序号和操作编号分别由唯一索引约束', async () => {
    const attempts = databases.family.db.collection('attempts');
    const sequence = {
      runId: randomUUID(),
      exerciseId: randomUUID(),
      targetId: randomUUID(),
      attemptNo: 1,
    };
    const principalId = randomUUID();
    const operationId = randomUUID();
    await attempts.insertOne(record({ ...sequence, principalId, operationId }));
    await assert.rejects(
      attempts.insertOne(record({ ...sequence, principalId, operationId: randomUUID() })),
      (error: unknown) =>
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.message.includes('attempt_sequence_unique'),
    );
    await assert.rejects(
      attempts.insertOne(record({ ...sequence, attemptNo: 2, principalId, operationId })),
      (error: unknown) =>
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.message.includes('attempt_operation_unique'),
    );
    await attempts.insertOne(
      record({ ...sequence, attemptNo: 2, principalId, operationId: randomUUID() }),
    );
  });

  test('作答和展示证据的部分唯一索引分别生效', async () => {
    const db = databases.family.db;
    const wordKey = `fixture:${randomUUID()}`;
    await expectDuplicate(
      db,
      'wordEvidence',
      { attemptId: randomUUID(), wordKey },
      'word_attempt_unique',
    );
    await expectDuplicate(
      db,
      'wordEvidence',
      { eventId: randomUUID(), wordKey },
      'word_event_unique',
    );
    await db.collection('wordEvidence').insertOne(record({ eventId: randomUUID(), wordKey }));
    await db.collection('wordEvidence').insertOne(record({ attemptId: randomUUID(), wordKey }));
  });

  test('活动生成任务按归属及输入版本去重，终态和不同归属允许保存', async () => {
    const jobs = databases.family.db.collection('jobs');
    const owner = { kind: 'family', adultId: randomUUID(), childId: randomUUID() };
    const key = { owner, kind: 'generation', inputVersionId: randomUUID(), generationRevision: 1 };
    const id = randomUUID();
    await jobs.insertOne(record({ ...key, id, status: 'queued' }));
    await assert.rejects(
      jobs.insertOne(record({ ...key, status: 'running' })),
      (error: unknown) =>
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.message.includes('active_job_unique'),
    );
    await jobs.updateOne({ id }, { $set: { status: 'succeeded' } });
    await jobs.insertOne(record({ ...key, status: 'failed' }));
    await jobs.insertOne(record({ ...key, status: 'queued' }));
    await jobs.insertOne(
      record({ ...key, owner: { ...owner, childId: randomUUID() }, status: 'queued' }),
    );
  });

  test('内容版本、事件、幂等键、会话和共享令牌的唯一约束生效', async () => {
    const db = databases.family.db;
    await expectDuplicate(
      db,
      'contentVersions',
      { lessonId: randomUUID(), versionNo: 1 },
      'lesson_version_unique',
    );
    await expectDuplicate(db, 'outbox', { eventId: randomUUID() }, 'outbox_event_unique');
    await expectDuplicate(
      db,
      'idempotency',
      { principalId: randomUUID(), route: '/fixture', operationId: randomUUID() },
      'request_operation_unique',
    );
    await expectDuplicate(db, 'authSessions', { tokenHash: randomUUID() }, 'session_token_unique');
    await expectDuplicate(db, 'shares', { tokenHash: randomUUID() }, 'share_token_unique');
    const tokenHash = randomUUID();
    await db
      .collection('runs')
      .insertOne(record({ lessonId: randomUUID(), status: 'completed', tokenHash }));
    await assert.rejects(
      db
        .collection('runs')
        .insertOne(record({ lessonId: randomUUID(), status: 'completed', tokenHash })),
      (error: unknown) =>
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.message.includes('run_token_unique'),
    );
  });

  test('家庭与临时数据库隔离相同业务编号，业务编号自身保持唯一', async () => {
    const id = randomUUID();
    await databases.family.db.collection('learningEvents').insertOne(record({ id }));
    await databases.temporary.db.collection('learningEvents').insertOne(record({ id }));
    assert.equal(await databases.family.db.collection('learningEvents').countDocuments({ id }), 1);
    assert.equal(
      await databases.temporary.db.collection('learningEvents').countDocuments({ id }),
      1,
    );
    await assert.rejects(
      databases.family.db.collection('learningEvents').insertOne(record({ id })),
      (error: unknown) =>
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.message.includes('business_id_unique'),
    );
  });

  test('过期查询和清理完成后的TTL索引分别保存，UTC清理时间使用BSON Date', async () => {
    const db = databases.temporary.db;
    const indexes = await db.collection('mediaAssets').listIndexes().toArray();
    const expiry = indexes.find((item) => item.name === 'expiry_lookup');
    const purge = indexes.find((item) => item.name === 'purge_after_cleanup');
    assert.deepEqual(expiry?.key, { expiresAt: 1 });
    assert.equal(expiry?.expireAfterSeconds, undefined);
    assert.deepEqual(purge?.key, { purgeAt: 1 });
    assert.equal(purge?.expireAfterSeconds, 0);
    const id = randomUUID();
    const instant = new Date(Date.now() + 3_600_000).toISOString();
    await db
      .collection('mediaAssets')
      .insertOne(record({ id, expiresAt: instant, purgeAt: databaseCleanupDate(instant) }));
    const saved = await db.collection('mediaAssets').findOne({ id });
    assert(saved?.purgeAt instanceof Date);
    assert.equal(saved.purgeAt.toISOString(), instant);
    assert.equal(saved.expiresAt, instant);
  });

  test('现有索引定义不兼容时迁移立即失败且不登记完成', async () => {
    const db = databases.family.client.db(`telltale_conflict_${randomUUID().replaceAll('-', '')}`);
    try {
      await db
        .collection('adults')
        .createIndex({ phoneLookupHmac: 1 }, { name: 'phone_lookup_unique', unique: false });
      await assert.rejects(
        migrateDatabase(db, 'family'),
        (error: unknown) =>
          error instanceof MongoServerError &&
          error.code === 86 &&
          error.codeName === 'IndexKeySpecsConflict',
      );
      assert.equal(await db.collection('schemaMigrations').countDocuments(), 0);
    } finally {
      await db.dropDatabase();
    }
  });

  test('已经登记的迁移定义摘要发生变化时立即停止', async () => {
    const db = databases.family.client.db(
      `telltale_definition_${randomUUID().replaceAll('-', '')}`,
    );
    try {
      const migration = await migrateDatabase(db, 'family');
      await db
        .collection('schemaMigrations')
        .updateOne(
          { version: migration.version },
          { $set: { definitionHash: 'isolated-altered-definition' } },
        );
      await assert.rejects(migrateDatabase(db, 'family'), /必须使用新的迁移版本/);
      assert.equal(await db.collection('schemaMigrations').countDocuments(), 1);
    } finally {
      await db.dropDatabase();
    }
  });

  test('实际同一数据库的不同种子地址仍然拒绝混用', async () => {
    assert(replicaSet);
    const family = replicaSet.getUri('telltale_family_test');
    const configuration = readDatabaseConfiguration({
      MONGODB_URI: family,
      MONGODB_TEMPORARY_URI: family.replace('127.0.0.1', 'localhost'),
    });
    await assert.rejects(openDatabases(configuration), /同一副本集的同一数据库/);
  });

  test('真实单机MongoDB连接被拒绝，副本集要求保持有效', async () => {
    const standalone = await startStandalone();
    try {
      const configuration = readDatabaseConfiguration({
        MONGODB_URI: standalone.getUri('telltale_standalone_family'),
        MONGODB_TEMPORARY_URI: standalone.getUri('telltale_standalone_temporary'),
      });
      await assert.rejects(openDatabases(configuration), /必须连接可写MongoDB副本集/);
    } finally {
      await standalone.stop();
    }
  });
});
