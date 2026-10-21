import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const runtime = path.join(root, '.work-dev/mongodb/runtime');
const downloadDir = path.join(root, '.work-dev/mongodb/binaries');
mkdirSync(runtime, { recursive: true });
mkdirSync(downloadDir, { recursive: true });
process.env.TMPDIR = runtime;
process.env.MONGOMS_VALIDATE_BINARY_CHECKSUM = 'true';
const binary = { version: '8.2.6', downloadDir, checkMD5: true };

// 此工具启动真实mongod进程和WiredTiger数据库，只存放虚构集成测试资料。
export function startReplicaSet() {
  return MongoMemoryReplSet.create({
    binary,
    replSet: {
      count: 1,
      name: 'telltale-integration',
      ip: '127.0.0.1',
      storageEngine: 'wiredTiger',
    },
  });
}

export function startStandalone() {
  return MongoMemoryServer.create({
    binary,
    instance: { ip: '127.0.0.1', storageEngine: 'wiredTiger' },
  });
}
