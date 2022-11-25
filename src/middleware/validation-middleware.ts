import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export type RequestProperty = 'params' | 'query' | 'body';

export type RequestSchema = Partial<Record<RequestProperty, ObjectSchema>>;

export const validateRequest =
  (requestSchema: RequestSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    (Object.keys(requestSchema) as Array<RequestProperty>).forEach((key) => {
      if (requestSchema[key]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { error } = requestSchema[key]!.validate(req[key]);

        if (error) {
          const {
            details: [{ message, context }],
          } = error;

          res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: { message, property: context?.label },
          });
        } else {
          next();
        }
      }
    });
  };
