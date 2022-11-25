import { NextFunction, Request, Response } from 'express';

interface RouteController<Params> {
  (req: Request<Params>, res: Response, next: NextFunction, ...rest: unknown[]): Promise<void>;
}

function catchAsyncExceptions<Params>(fn: RouteController<Params>) {
  return function asyncWrapper(
    req: Request<Params>,
    res: Response,
    next: NextFunction,
    ...rest: unknown[]
  ): Promise<void> {
    return Promise.resolve(fn(req, res, next, ...rest)).catch(next);
  };
}

export default catchAsyncExceptions;
