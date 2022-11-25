import { ObjectId } from 'mongodb';

import dbManager from '../../db/db-manager';
import { appCollections } from '../../types';
import { FileDocument } from './files-types';

const filesDAL = {
  retrieve: (id: string): Promise<FileDocument | null> => {
    const collection = dbManager.getCollection<FileDocument>(appCollections.files);
    return collection.findOne({ _id: new ObjectId(id) });
  },

  create: async (data: Omit<FileDocument, '_id'>): Promise<string> => {
    const collection = dbManager.getCollection<FileDocument>(appCollections.files);
    const { insertedId } = await collection.insertOne({ _id: new ObjectId(), ...data });
    return insertedId.toHexString();
  },
};

export default filesDAL;
