import assert from 'assert';
import { Ottoman, Schema, SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';

let ottoman: Ottoman;

const initOttoman = async (searchConsistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ scopeName: 'testScope', collectionName: 'testCollection', searchConsistency });
    assert.strictEqual(ottoman.config.searchConsistency, searchConsistency);

    ottoman.connect({
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

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    operational: {
        type: Boolean,
        default: true
    },
});

const opt = {
    name: 'hello',
    operational: true,
};

describe('test drop scope', async () => {
    before(async () => {
        await initOttoman();
    });

    it('ottoman - should drop collection', async () => {
        await ottoman.dropCollection('testCollection', 'testScope');
    });

    it('ottoman - should drop scope', async () => {
        await ottoman.dropScope('testScope');
    });

    it('ottoman - should drop bucket', async () => {
        await ottoman.dropBucket('testBucket');
    });
});