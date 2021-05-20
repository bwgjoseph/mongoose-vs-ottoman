import { model, Ottoman, Schema, SearchConsistency } from 'ottoman';

let ottoman: Ottoman;

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ scopeName: 'testScope123', collectionName: 'testCollection', consistency });

    ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    const testSchema = new Schema({ name: String });
    model('testModel', testSchema);
    await ottoman.start();
}

describe('test manage bucket, scope and collection', async () => {
    before(async () => {
        await initOttoman();
    });

    it('ottoman - should create scope and collection', async () => {
        await ottoman.collectionManager.dropScope('testScope')
        await ottoman.collectionManager.createScope('testScope')
        await ottoman.collectionManager.createCollection({ name: 'testCollection', scopeName: 'testScope' })
    });
});