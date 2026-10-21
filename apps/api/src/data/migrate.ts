import { createHash, randomUUID } from 'node:crypto';
import type { Db } from 'mongodb';
import type { DatabaseRole } from './connection.js';
import { COLLECTIONS, collectionIndexes } from './indexes.js';

const version = '20261021-initial-indexes';

export async function migrateDatabase(db: Db, role: DatabaseRole) {
  const definitions = COLLECTIONS.map((name) => ({ name, indexes: collectionIndexes(name, role) }));
  const definitionHash = createHash('sha256').update(JSON.stringify(definitions)).digest('hex');
  const migrations = db.collection('schemaMigrations');
  await migrations.createIndex({ version: 1 }, { name: 'migration_version_unique', unique: true });
  const existing = await migrations.findOne({ version });
  if (existing && existing.definitionHash !== definitionHash) {
    throw new Error('已经执行的迁移定义发生变化，数据库变更必须使用新的迁移版本');
  }
  for (const definition of definitions) {
    await db.collection(definition.name).createIndexes(definition.indexes);
  }
  const now = new Date().toISOString();
  await migrations.updateOne(
    { version },
    {
      $setOnInsert: {
        id: randomUUID(),
        schemaVersion: 1,
        version,
        definitionHash,
        role,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  return {
    role,
    version,
    definitionHash,
    collections: definitions.length,
    indexes: definitions.reduce((total, definition) => total + definition.indexes.length, 0),
  };
}
