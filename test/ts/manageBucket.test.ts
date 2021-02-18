import { Ottoman, SearchConsistency } from 'ottoman';

let ottoman: Ottoman;

const initOttoman = async (searchConsistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ collectionName: '_default', searchConsistency });

    ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

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