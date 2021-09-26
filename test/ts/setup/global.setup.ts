import mongoose from 'mongoose';
import { getDefaultInstance, Ottoman } from 'ottoman';
import { removeDocuments } from './util';

const initMongoose = async () => {
    await mongoose.connect('mongodb://root:password@localhost:28017/test?authSource=admin', {
        family: 4
    });

    await mongoose.connection.dropDatabase();
}

const initOttoman = async () => {
    let ottoman = getDefaultInstance();

    if (!ottoman) {
        ottoman = new Ottoman({ collectionName: '_default' });
    }

    await ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    // how to drop the bucket/scope/collection?
    // how to remove all docs from a bucket/scope/collection?
    await ottoman.start();

    await removeDocuments();
}


export {
    initMongoose,
    initOttoman,
};
