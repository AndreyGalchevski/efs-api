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

    await dbManager.getInstance().admin().command({ setParameter: 1, ttlMonitorSleepSecs: 5 });
    // wait for the TTL thread to finish the default 60 seconds cycle before running the tests
    await sleep(60000);
  }, 61000);

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

    it('should automatically delete the uploaded file with 60 second duration (default)', async () => {
      const response = await request(app).put('/v1/file').attach(UPLOAD_FIELD_NAME, testFilePath);

      // wait for the file duration + the TTL thread 5-second cycle
      await sleep(65000);

      const fileID = response.body.data.fileURL.split('/').pop();
      const file = await filesDAL.retrieve(fileID);

      expect(file).toEqual(null);
    }, 66000);

    it('should automatically delete the uploaded file with 1 second duration', async () => {
      const response = await request(app)
        .put('/v1/file')
        .set('x-ttl', '1')
        .attach(UPLOAD_FIELD_NAME, testFilePath);

      // wait for the TTL thread 5-second cycle
      await sleep(5000);

      const fileID = response.body.data.fileURL.split('/').pop();
      const file = await filesDAL.retrieve(fileID);

      expect(file).toEqual(null);
    }, 6000);
  });
});
