import assert from 'assert';
import { Ottoman, Schema, SearchConsistency } from 'ottoman';
import { removeDocuments } from '../setup/util';

let ottoman: Ottoman;

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ collectionName: '_default', consistency });
    assert.strictEqual(ottoman.config.consistency, consistency);

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

describe('test global options', async () => {
    afterEach(async () => {
        await removeDocuments();
        await ottoman.close();
    })

    it('ottoman - should find doc [global is NONE, local is NONE]', async () => {
        await initOttoman();
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.NONE);

        const Options = ottoman.model('opts', schema);
        const OptData = new Options(opt);

        await Options.create(OptData);

        const find = await Options.find({});
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });

    it('ottoman - should find doc [global is NONE, local is local]', async () => {
        await initOttoman();
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.NONE);

        const Options = ottoman.model('opts', schema);
        const OptData = new Options(opt);

        await Options.create(OptData);

        const find = await Options.find(
            {},
            {
                consistency: SearchConsistency.LOCAL,
            });
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });

    it('ottoman - should find doc [global is NONE, local is GLOBAL]', async () => {
        await initOttoman();
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.NONE);

        const Options = ottoman.model('opts', schema);
        const OptData = new Options(opt);

        await Options.create(OptData);

        const find = await Options.find(
            {},
            {
                consistency: SearchConsistency.GLOBAL,
            });
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });

    it('ottoman - should find doc [global is LOCAL, local is not defined]', async () => {
        await initOttoman(SearchConsistency.LOCAL);
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.LOCAL);

        const Options = ottoman.model('opts', schema);
        const OptData = new Options(opt);

        await Options.create(OptData);

        const find = await Options.find({});
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });

    it('ottoman - should find doc [global is GLOBAL, local is not defined]', async () => {
        await initOttoman(SearchConsistency.GLOBAL);
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.GLOBAL);

        const Options = ottoman.model('opts', schema);
        const OptData = new Options(opt);

        await Options.create(OptData);

        const find = await Options.find({});
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });
})