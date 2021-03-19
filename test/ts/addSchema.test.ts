import assert from 'assert';
import { Ottoman, Schema, SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';

let ottoman: Ottoman;

const initOttoman = async (searchConsistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ collectionName: '_default', searchConsistency });
    assert.strictEqual(ottoman.config.searchConsistency, searchConsistency);

    ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    await ottoman.start();

    await removeDocuments();
}

const baseSchema = new Schema({
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
    },
});

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    operational: {
        type: Boolean,
        default: true
    },
}).add(baseSchema);

const opt = {
    name: 'hello',
    operational: true,
};

describe('test schema add options', async () => {
    before(async () => {
        await initOttoman(SearchConsistency.LOCAL);
    });

    it('ottoman - add base schema', async () => {
        assert.strictEqual(ottoman.config.searchConsistency, SearchConsistency.LOCAL);

        const MySchema = ottoman.model('myschema', schema, { idKey: '_id' });
        const schemaData = new MySchema(opt);

        const created = await MySchema.create(schemaData);
        assert.ok(created.createdAt);
        assert.ok(created.updatedAt);

        const find = await MySchema.find({});
        assert.ok(find.rows[0].createdAt);
        assert.ok(find.rows[0].updatedAt);
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });
})