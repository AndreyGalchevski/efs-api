import { Router } from 'express';
import multer from 'multer';

import { validateRequest } from '../../middleware/validation-middleware';
import AppError from '../../utils/app-error';
import { MAX_FILE_SIZE_IN_BYTES, UPLOADS_FOLDER, UPLOAD_FIELD_NAME } from '../../utils/constants';
import catchAsyncExceptions from '../../utils/catch-async-exceptions';
import filesController, { handleGetFileSchema } from './files-controller';

const upload = multer({
  dest: UPLOADS_FOLDER,
  limits: { fileSize: MAX_FILE_SIZE_IN_BYTES },
  fileFilter(_req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(
        new AppError({
          message: 'Received invalid file',
          status: 400,
          clientError: { message: 'Please upload an image.' },
        })
      );
    }
    cb(null, true);
  },
});

const filesRouter = Router();

filesRouter.put(
  '/v1/file',
  upload.single(UPLOAD_FIELD_NAME),
  catchAsyncExceptions(filesController.handlePutFile)
);

filesRouter.get(
  '/v1/:fileID',
  validateRequest(handleGetFileSchema),
  catchAsyncExceptions(filesController.handleGetFile)
);

export default filesRouter;
