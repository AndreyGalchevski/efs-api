import { Application } from 'express';
import { ObjectSchema } from 'joi';

export interface Middleware {
  init: (app: Application) => void;
}

export const appCollections = {
  files: 'files',
} as const;

export type AppCollection = keyof typeof appCollections;

export type RequestProperty = 'params' | 'query' | 'body';

export type RequestSchema = Partial<Record<RequestProperty, ObjectSchema>>;
