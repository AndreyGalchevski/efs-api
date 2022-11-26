import express, { Application } from 'express';
import dotenv from 'dotenv';

import dbManager from './db/db-manager';
import modules from './modules';
import errorMiddleware from './middleware/error-middleware';
import securityMiddleware from './middleware/security-middleware';

const createApp = async (dbURI: string): Promise<Application> => {
  dotenv.config();

  await dbManager.init(dbURI).catch((e) => {
    console.error(`DB connection failed: ${e.message}, stack: ${e.stack}`);
    process.exit(1);
  });

  const app = express();

  securityMiddleware.init(app);
  modules.init(app);
  errorMiddleware.init(app);

  return app;
};

export default createApp;
