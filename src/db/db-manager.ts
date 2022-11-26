import { Collection, Db, Document, MongoClient } from 'mongodb';

import { AppCollection, appCollections } from '../types';

let dbClient: MongoClient;
let dbInstance: Db;

const dbManager = {
  setupIndexes: async (db: Db): Promise<void> => {
    await db
      .collection(appCollections.files)
      .createIndex({ expirationDate: 1 }, { expireAfterSeconds: 0 });
  },

  init: async (dbURI: string): Promise<void> => {
    if (dbInstance) {
      console.warn('DB already initialized. Call getInstance()');
      return;
    }

    dbClient = await new MongoClient(dbURI).connect();

    console.log('Connected to DB');

    dbInstance = dbClient.db();

    await dbManager.setupIndexes(dbInstance);
  },

  disconnect: async (): Promise<void> => {
    if (!dbClient) {
      throw new Error('DB not initialized. Call init() first');
    }

    await dbClient.close();
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
