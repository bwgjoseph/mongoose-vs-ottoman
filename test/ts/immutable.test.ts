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

const defaultDate = new Date();

const baseSchema = new Schema({
    createdAt: {
        type: Date,
        default: () => defaultDate,
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: () => defaultDate,
    },
    createdBy: {
        type: String,
        default: () => 'Joseph',
        immutable: true,
    },
    updatedBy: {
        type: String,
        default: () => 'Joseph'
    }
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

describe('test schema immutable options', async () => {
    before(async () => {
        await initOttoman(SearchConsistency.LOCAL);
    });

    it('ottoman - ensure immutable fields does not get change using save', async () => {
        assert.strictEqual(ottoman.config.searchConsistency, SearchConsistency.LOCAL);

        const ImmutableModel = ottoman.model('immutable', schema, { idKey: '_id' });
        const schemaData = new ImmutableModel(opt);

        const created = await ImmutableModel.create(schemaData);
        console.log(JSON.stringify(created, null, 2));
        assert.ok(created.createdAt);
        assert.ok(created.createdBy);
        assert.ok(created.updatedAt);
        assert.ok(created.updatedBy);

        const find = await ImmutableModel.find({});
        console.log(JSON.stringify(find, null, 2));
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(+find.rows[0].createdAt, +defaultDate);
        assert.strictEqual(find.rows[0].createdBy, 'Joseph');
        assert.strictEqual(+find.rows[0].updatedAt, +defaultDate);
        assert.strictEqual(find.rows[0].updatedBy, 'Joseph');

        const changeDate = new Date();
        created.createdAt = changeDate;
        created.createdBy = 'Edwin';
        created.updatedAt = changeDate;
        created.updatedBy = 'Edwin';

        const updated = await created.save();
        console.log(JSON.stringify(updated, null, 2));
        assert.strictEqual(+updated.createdAt, +defaultDate);
        assert.strictEqual(updated.createdBy, 'Joseph');
        assert.strictEqual(+updated.updatedAt, +changeDate);
        assert.strictEqual(updated.updatedBy, 'Edwin');

        await removeDocuments();
    });

    it('ottoman - ensure immutable fields does not get change using updateById', async () => {
        assert.strictEqual(ottoman.config.searchConsistency, SearchConsistency.LOCAL);

        const Immutable2Model = ottoman.model('immutable2', schema, { idKey: '_id' });
        const schemaData = new Immutable2Model(opt);

        const created = await Immutable2Model.create(schemaData);
        console.log(JSON.stringify(created, null, 2));
        assert.ok(created.createdAt);
        assert.ok(created.createdBy);
        assert.ok(created.updatedAt);
        assert.ok(created.updatedBy);

        const find = await Immutable2Model.find({});
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(+find.rows[0].createdAt, +defaultDate);
        assert.strictEqual(find.rows[0].createdBy, 'Joseph');
        assert.strictEqual(+find.rows[0].updatedAt, +defaultDate);
        assert.strictEqual(find.rows[0].updatedBy, 'Joseph');

        const changeDate = new Date();
        const updated = await Immutable2Model.updateById(created._id, {
            createdAt: changeDate,
            createdBy: 'Edwin',
            updatedAt: changeDate,
            updatedBy: 'Edwin',
        })
        console.log(JSON.stringify(updated, null, 2));
        assert.strictEqual(+updated.createdAt, +defaultDate);
        assert.strictEqual(updated.createdBy, 'Joseph');
        assert.strictEqual(+updated.updatedAt, +changeDate);
        assert.strictEqual(updated.updatedBy, 'Edwin');

        await removeDocuments();
    });

    it('ottoman - ensure immutable fields does not get change using updateById2', async () => {
        assert.strictEqual(ottoman.config.searchConsistency, SearchConsistency.LOCAL);

        const Immutable3Model = ottoman.model('immutable3', schema, { idKey: '_id' });
        const schemaData = new Immutable3Model({
            name: 'hello',
            operational: true,
        });

        const created = await Immutable3Model.create(schemaData);
        const changeDate = new Date();
        await Immutable3Model.updateById(created._id, {
            createdAt: changeDate,
            createdBy: 'Edwin',
            updatedAt: changeDate,
            updatedBy: 'Edwin',
        });

        await removeDocuments();
    });
})