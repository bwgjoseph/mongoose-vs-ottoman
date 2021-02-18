import { Ottoman, SearchConsistency } from 'ottoman';

let ottoman: Ottoman;

const initOttoman = async (searchConsistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ scopeName: 'testDropScope', collectionName: 'testDropCollection', searchConsistency });

    ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testDropBucket',
        username: 'user',
        password: 'password'
    });

    await ottoman.start();
}

describe.skip('test drop bucket, scope and collection', async () => {
    before(async () => {
        await initOttoman();
    });

    it('ottoman - should drop collection', async () => {
        await ottoman.dropCollection('testDropCollection', 'testDropScope');
    });

    it('ottoman - should drop scope', async () => {
        await ottoman.dropScope('testDropScope');
    });

    it('ottoman - should drop bucket', async () => {
        await ottoman.dropBucket('testDropBucket');
    });
});