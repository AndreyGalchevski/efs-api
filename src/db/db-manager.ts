import { Collection, Db, Document, MongoClient } from 'mongodb';

import { AppCollection, appCollections } from '../types';

let dbInstance: Db;

const dbManager = {
  setupIndexes: async (db: Db): Promise<void> => {
    await db
      .collection(appCollections.files)
      .createIndex({ expirationDate: 1 }, { expireAfterSeconds: 0 });
  },

  init: async (): Promise<void> => {
    if (dbInstance) {
      console.warn('DB already initialized. Call getInstance()');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const client = await new MongoClient(process.env.DB_URI!).connect();

    console.log('Connected to DB');

    dbInstance = client.db();

    await dbManager.setupIndexes(dbInstance);
  },

  getInstance: (): Db => {
    if (!dbInstance) {
      throw new Error('DB not initialized. Call init() first');
    }

    return dbInstance;
  },

  getCollection: <T extends Document>(collectionName: AppCollection): Collection<T> =>
    dbManager.getInstance().collection<T>(collectionName),
};

export default dbManager;
