import { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import AppError from '../utils/app-error';

const errorMiddleware = {
  init: (app: Application): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
      console.error(err.message);
      console.error(err.stack);

      if (err instanceof AppError) {
        res.status(err.status);

        if (err.clientError) {
          res.json({ error: err.clientError });
          return;
        }

        res.json({});
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((_req: Request, res: Response, _next: NextFunction): void => {
      res.status(StatusCodes.NOT_FOUND).json({ error: getReasonPhrase(StatusCodes.NOT_FOUND) });
    });
  },
};

export default errorMiddleware;
