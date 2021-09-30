import { assert } from 'chai';
import { getModel, model, Ottoman, Schema, SearchConsistency } from 'ottoman';

let ottoman: Ottoman;

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ collectionName: '_default', consistency });

    await ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    const timestampSchema = new Schema({ name: String }, { timestamps: true });
    model('tsModel', timestampSchema);

    const timestampCustomSchema = new Schema({ name: String }, { timestamps: { createdAt: 'ca', updatedAt: 'ua' } });
    model('tscModel', timestampCustomSchema);

    await ottoman.start();
}

/**
 * To run standalone
 */
describe.skip('test timestamp feature', async () => {
    before(async () => {
        await initOttoman();
    });

    after(async () => {
        await ottoman.close();
    })

    it('ottoman - should activate timestamp option', async () => {
        const Model = getModel('tsModel');
        const created = await Model.create({ name: 'hello' });

        assert.isNotNull(created.createdAt);
        assert.isNotNull(created.updatedAt);
        assert.strictEqual(created.name, 'hello');
    });

    it('ottoman - should activate custom timestamp option', async () => {
        const Model = getModel('tscModel');
        const created = await Model.create({ name: 'hello' });

        assert.isNotNull(created.ca);
        assert.isNotNull(created.ua);
        assert.strictEqual(created.name, 'hello');
    });
});