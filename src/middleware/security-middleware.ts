import { Application } from 'express';
import cors from 'cors';

import { Middleware } from '../types';

const securityMiddleware: Middleware = {
  init: (app: Application): void => {
    app.use(cors({ origin: process.env.WEB_APP_URL }));
  },
};

export default securityMiddleware;
