import { Request, Response } from 'express';
import joi from 'joi';

import { RequestSchema } from '../../types';
import AppError from '../../utils/app-error';
import filesService from './files-service';

export const handleGetFileSchema: RequestSchema = {
  params: joi.object({
    fileID: joi.string().required().messages({
      'string.empty': '"fileID" is required',
    }),
  }),
};

interface HandlePutFileResponse {
  data: { fileURL: string };
}

interface HandleGetFileRequest {
  params: {
    fileID: string;
  };
}

const filesController = {
  handlePutFile: async (
    { file, headers }: Request,
    res: Response<HandlePutFileResponse>
  ): Promise<void> => {
    if (!file) {
      throw new AppError({
        message: 'File is empty',
        status: 400,
        clientError: { message: 'Please attach a file' },
      });
    }

    const ttl = headers['x-ttl'] ? Number(headers['x-ttl']) : undefined;
    const fileURL = await filesService.createFile(file, ttl);

    res.json({ data: { fileURL } });
  },

  handleGetFile: async (
    { params: { fileID } }: Request<HandleGetFileRequest['params']>,
    res: Response<Buffer>
  ): Promise<void> => {
    const file = await filesService.getFile(fileID);

    res.set('Content-Type', file.contentType);
    res.send(Buffer.from(file.body.buffer));
  },
};

export default filesController;
