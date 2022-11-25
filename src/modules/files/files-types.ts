import { Binary, ObjectId } from 'mongodb';

export interface FileDocument {
  _id: ObjectId;
  name: string;
  body: Binary;
  contentType: string;
  expirationDate: Date;
}
