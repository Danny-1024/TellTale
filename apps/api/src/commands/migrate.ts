import { openDatabases, readDatabaseConfiguration } from '../data/connection.js';
import { migrateDatabase } from '../data/migrate.js';

const databases = await openDatabases(readDatabaseConfiguration(process.env));
try {
  const family = await migrateDatabase(databases.family.db, 'family');
  const temporary = await migrateDatabase(databases.temporary.db, 'temporary');
  console.info(JSON.stringify({ family, temporary }));
} finally {
  await databases.close();
}
