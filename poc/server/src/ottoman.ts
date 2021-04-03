import { getDefaultInstance, Ottoman, Schema, SearchConsistency } from 'ottoman';
import { Application } from './declarations';

let ottoman: Ottoman;

const removeDocuments = async () => {
  const query = `
    DELETE FROM \`testBucket\`
    `;
  try {
    await getDefaultInstance().query(query);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const schema = new Schema({
  name: String,
  data: String,
});

const initOttoman = async (searchConsistency: SearchConsistency = SearchConsistency.GLOBAL) => {
  ottoman = new Ottoman({ collectionName: '_default', searchConsistency });

  ottoman.connect({
    connectionString: 'couchbase://localhost',
    bucketName: 'testBucket',
    username: 'user',
    password: 'password'
  });

  ottoman.model('data', schema, { idKey: '_id' });

  await ottoman.start();

  await removeDocuments();
};

export default function (app: Application) {
  initOttoman().then(() => app.set('ottomanClient', ottoman));
}

