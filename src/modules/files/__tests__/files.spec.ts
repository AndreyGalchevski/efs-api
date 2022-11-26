import request from 'supertest';
import { Application } from 'express';

import createApp from '../../../create-app';
import setupTestDB from '../../../db/setup-test-db';
import dbManager from '../../../db/db-manager';
import { UPLOAD_FIELD_NAME } from '../../../utils/constants';
import sleep from '../../../utils/sleep';
import filesDAL from '../files-dal';

describe('files API tests', () => {
  let app: Application | undefined;
  let closeConnection: () => Promise<void> | undefined;

  beforeAll(async () => {
    const testDB = await setupTestDB();

    app = await createApp(testDB.dbURI);
    closeConnection = testDB.closeConnection;
  });

  afterAll(async () => {
    await dbManager.disconnect();
    await closeConnection?.();
  });

  describe('PUT /v1/file', () => {
    const testFilePath = `${__dirname}/test-data/me.png`;

    it('should respond with 400 when no file is provided', async () => {
      const response = await request(app).put('/v1/file');
      expect(response.status).toEqual(400);
      expect(response.body.error.message).toEqual('Please attach a file');
    });

    it('should respond with 201 and a shareable URL', async () => {
      const response = await request(app).put('/v1/file').attach(UPLOAD_FIELD_NAME, testFilePath);
      expect(response.status).toEqual(201);
      expect(response.body.data.fileURL).toBeDefined();
      expect(response.body.data.fileURL.length).toBeGreaterThan(0);
    });

    it('should automatically delete the uploaded file after 60 seconds (default)', async () => {
      const response = await request(app).put('/v1/file').attach(UPLOAD_FIELD_NAME, testFilePath);

      await sleep(61000);

      const fileID = response.body.data.fileURL.split('/').pop();
      const file = await filesDAL.retrieve(fileID);

      expect(file).toEqual(null);
    }, 62000);

    it('should automatically delete the uploaded file after 2 seconds', async () => {
      const response = await request(app)
        .put('/v1/file')
        .set('x-ttl', '2')
        .attach(UPLOAD_FIELD_NAME, testFilePath);

      await sleep(3000);

      const fileID = response.body.data.fileURL.split('/').pop();
      const file = await filesDAL.retrieve(fileID);

      expect(file).toEqual(null);
    }, 4000);
  });
});
