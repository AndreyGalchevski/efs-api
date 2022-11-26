import express from 'express';
import dotenv from 'dotenv';

import dbManager from './db/db-manager';
import modules from './modules';
import errorMiddleware from './middleware/error-middleware';
import securityMiddleware from './middleware/security-middleware';

const app = express();

dotenv.config();

(async (): Promise<void> => {
  await dbManager.init().catch((e) => {
    console.error(`DB connection failed: ${e.message}, stack: ${e.stack}`);
    process.exit(1);
  });

  securityMiddleware.init(app);
  modules.init(app);
  errorMiddleware.init(app);
})();

export default app;
