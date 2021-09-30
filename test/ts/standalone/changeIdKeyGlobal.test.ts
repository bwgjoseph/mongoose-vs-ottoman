import assert from 'assert';
import { Ottoman, Schema, SearchConsistency } from 'ottoman';
import { removeDocuments } from '../setup/util';

let ottoman: Ottoman;

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ collectionName: '_default', idKey: '_id', consistency });
    assert.strictEqual(ottoman.config.consistency, consistency);

    await ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

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

describe('test model options', async () => {
    before(async () => {
        await initOttoman(SearchConsistency.LOCAL);
    });

    after(async () => {
        await ottoman.close();
    })

    it('ottoman - change global idKey', async () => {
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.LOCAL);

        const Options = ottoman.model('opts', schema );
        const OptData = new Options(opt);

        const created = await Options.create(OptData);
        assert.ok(created._id);
        assert.ok(!created.id);

        const find = await Options.find({});
        assert.ok(find.rows[0]._id);
        assert.ok(!find.rows[0].id);
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });
})