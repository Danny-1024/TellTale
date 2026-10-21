import { assertContract } from '@telltale/contracts';
import { MongoClient, type ClientSession, type Db } from 'mongodb';
import { ConnectionString } from 'mongodb-connection-string-url';

export type DatabaseRole = 'family' | 'temporary';
type ConfigurationField = 'MONGODB_URI' | 'MONGODB_TEMPORARY_URI';

interface DatabaseTarget {
  readonly uri: string;
  readonly databaseName: string;
  readonly endpointKey: string;
}

export interface DatabaseConfiguration {
  readonly family: DatabaseTarget;
  readonly temporary: DatabaseTarget;
}

export class DatabaseConfigurationError extends Error {
  constructor(
    readonly field: ConfigurationField,
    readonly rule: string,
  ) {
    super(`${field}：${rule}`);
    this.name = 'DatabaseConfigurationError';
  }
}

function readTarget(environment: NodeJS.ProcessEnv, field: ConfigurationField): DatabaseTarget {
  const uri = environment[field];
  if (!uri || !uri.trim()) throw new DatabaseConfigurationError(field, '必须配置连接字符串');
  let parsed: ConnectionString;
  let databaseName: string;
  try {
    parsed = new ConnectionString(uri);
    databaseName = decodeURIComponent(parsed.pathname.slice(1));
  } catch (error) {
    if (
      error instanceof Error &&
      ['MongoParseError', 'TypeError', 'URIError'].includes(error.name)
    ) {
      throw new DatabaseConfigurationError(field, `连接字符串解析失败，错误类别为${error.name}`);
    }
    throw error;
  }
  if (!databaseName) throw new DatabaseConfigurationError(field, '必须明确指定数据库名称');
  const endpointKey = JSON.stringify([parsed.protocol, [...parsed.hosts].sort(), databaseName]);
  return Object.freeze({ uri, databaseName, endpointKey });
}

export function readDatabaseConfiguration(environment: NodeJS.ProcessEnv): DatabaseConfiguration {
  const family = readTarget(environment, 'MONGODB_URI');
  const temporary = readTarget(environment, 'MONGODB_TEMPORARY_URI');
  if (family.endpointKey === temporary.endpointKey) {
    throw new DatabaseConfigurationError(
      'MONGODB_TEMPORARY_URI',
      '家庭与临时资料必须使用不同数据库',
    );
  }
  return Object.freeze({ family, temporary });
}

export interface DatabaseConnection {
  readonly client: MongoClient;
  readonly db: Db;
  readonly replicaSet: string;
}

export interface Databases {
  readonly family: DatabaseConnection;
  readonly temporary: DatabaseConnection;
  close(): Promise<void>;
}

async function closeClients(clients: readonly MongoClient[]): Promise<void> {
  const results = await Promise.allSettled(clients.map((client) => client.close()));
  const errors = results
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason);
  if (errors.length) throw new AggregateError(errors, '数据库连接关闭失败');
}

export async function openDatabases(configuration: DatabaseConfiguration): Promise<Databases> {
  const targets = [configuration.family, configuration.temporary] as const;
  const clients = targets.map(
    (target) =>
      new MongoClient(target.uri, {
        appName: 'telltale-api',
        maxPoolSize: 20,
        minPoolSize: 0,
        maxIdleTimeMS: 60_000,
        connectTimeoutMS: 5_000,
        serverSelectionTimeoutMS: 5_000,
        writeConcern: { w: 'majority', j: true },
        readPreference: 'primary',
      }),
  );
  const connections: DatabaseConnection[] = [];
  const clusterKeys: string[] = [];
  try {
    for (const [index, target] of targets.entries()) {
      const client = clients[index]!;
      await client.connect();
      const db = client.db(target.databaseName);
      const hello = await db.admin().command({ hello: 1 });
      if (
        typeof hello.setName !== 'string' ||
        !hello.isWritablePrimary ||
        typeof hello.logicalSessionTimeoutMinutes !== 'number' ||
        !Array.isArray(hello.hosts) ||
        !hello.hosts.every((host: unknown) => typeof host === 'string')
      ) {
        throw new Error(
          `${index === 0 ? '家庭' : '临时'}数据库必须连接可写MongoDB副本集并支持会话`,
        );
      }
      clusterKeys.push(JSON.stringify([hello.setName, [...hello.hosts].sort(), db.databaseName]));
      connections.push({ client, db, replicaSet: hello.setName });
    }
    if (clusterKeys[0] === clusterKeys[1]) {
      throw new DatabaseConfigurationError(
        'MONGODB_TEMPORARY_URI',
        '实际连接指向同一副本集的同一数据库',
      );
    }
    return {
      family: connections[0]!,
      temporary: connections[1]!,
      close: () => closeClients(clients),
    };
  } catch (error) {
    try {
      await closeClients(clients);
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], '数据库连接失败且资源关闭失败', {
        cause: cleanupError,
      });
    }
    throw error;
  }
}

export function withDatabaseTransaction<Result>(
  connection: DatabaseConnection,
  operation: (context: { db: Db; session: ClientSession }) => Promise<Result>,
): Promise<Result> {
  return connection.client.withSession((session) =>
    session.withTransaction(() => operation({ db: connection.db, session }), {
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority', j: true },
      readPreference: 'primary',
      timeoutMS: 15_000,
    }),
  );
}

export function databaseCleanupDate(value: unknown): Date {
  assertContract('UtcTimestamp', value);
  return new Date(value);
}
