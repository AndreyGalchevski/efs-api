import { StatusCodes } from 'http-status-codes';

interface ClientError {
  message: string;
  property?: string;
}

interface AppErrorParams {
  message: string;
  status?: number;
  clientError?: ClientError;
}

export default class AppError extends Error {
  status: number;

  clientError?: ClientError;

  constructor({
    message,
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    clientError,
  }: AppErrorParams) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;
    this.clientError = clientError;

    Error.captureStackTrace(this, this.constructor);
  }
}
