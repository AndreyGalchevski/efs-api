import { MongoMemoryServer } from 'mongodb-memory-server';

const setupTestDB = async (): Promise<{
  dbURI: string;
  closeConnection: () => Promise<void>;
}> => {
  const mongoMemoryServer = await MongoMemoryServer.create();

  const dbURI = mongoMemoryServer.getUri();

  const closeConnection = async (): Promise<void> => {
    await mongoMemoryServer.stop();
  };

  return { dbURI, closeConnection };
};

export default setupTestDB;
