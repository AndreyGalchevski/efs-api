import { readFile, unlink } from 'fs/promises';
import { Binary } from 'mongodb';

import AppError from '../../utils/app-error';
import { UPLOADS_FOLDER } from '../../utils/constants';
import filesDAL from './files-dal';
import { FileDocument } from './files-types';

const filesService = {
  createFile: async (fileData: Express.Multer.File, ttlInSeconds = 60): Promise<string> => {
    const file = await readFile(`${UPLOADS_FOLDER}/${fileData.filename}`);

    const newFileID = await filesDAL.create({
      name: fileData.originalname,
      body: new Binary(file),
      contentType: fileData.mimetype,
      expirationDate: new Date(Date.now() + ttlInSeconds * 1000),
    });

    await unlink(`${UPLOADS_FOLDER}/${fileData.filename}`);

    return `${process.env.API_URL}/v1/${newFileID}`;
  },

  getFile: async (fileID: string): Promise<FileDocument> => {
    const file = await filesDAL.retrieve(fileID);

    if (!file) {
      throw new AppError({
        message: 'File not found',
        status: 404,
        clientError: { message: 'The requested file not found' },
      });
    }

    return file;
  },
};

export default filesService;
