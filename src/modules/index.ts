import { Application } from 'express';

import { Middleware } from '../types';
import filesRouter from './files/files-router';

const modules: Middleware = {
  init: (app: Application): void => {
    app.use('/', filesRouter);
    app.use('/status', (_, res) => res.json("I'm rather well"));
  },
};

export default modules;
