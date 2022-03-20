import {Collection } from "mongodb";

type ErrorCallback = (err: any) => void;

export async function insertDocument<T>(
  newDoc: T,
  collection: Collection,
  errCallBack: ErrorCallback | undefined = undefined
) {

  try {
    const insertedDoc = await collection.insertOne(newDoc);
    console.log(insertedDoc);
    return insertedDoc;
  } catch (err: any) {
    if (errCallBack) {
      errCallBack(err);
    } else {
      console.log(err);
    }
  }
}
