import assert from 'assert';
import { Ottoman, Schema, SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';

let ottoman: Ottoman;

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ collectionName: '_default', consistency });
    assert.strictEqual(ottoman.config.consistency, consistency);

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
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.LOCAL);

        const ImmutableModel = ottoman.getModel('immutable') || ottoman.model('immutable', schema, { idKey: '_id' });
        const schemaData = new ImmutableModel(opt);

        const created = await ImmutableModel.create(schemaData);
        assert.ok(created.createdAt);
        assert.ok(created.createdBy);
        assert.ok(created.updatedAt);
        assert.ok(created.updatedBy);

        const find = await ImmutableModel.find({});
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
        assert.strictEqual(+updated.createdAt, +defaultDate);
        assert.strictEqual(updated.createdBy, 'Joseph');
        assert.strictEqual(+updated.updatedAt, +changeDate);
        assert.strictEqual(updated.updatedBy, 'Edwin');

        await removeDocuments();
    });

    it('ottoman - ensure immutable fields does not get change using updateById', async () => {
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.LOCAL);

        const Immutable2Model = ottoman.getModel('immutable2') ||  ottoman.model('immutable2', schema, { idKey: '_id' });
        const schemaData = new Immutable2Model(opt);

        const created = await Immutable2Model.create(schemaData);
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
        assert.strictEqual(+updated.createdAt, +defaultDate);
        assert.strictEqual(updated.createdBy, 'Joseph');
        assert.strictEqual(+updated.updatedAt, +changeDate);
        assert.strictEqual(updated.updatedBy, 'Edwin');

        await removeDocuments();
    });

    it('ottoman - ensure immutable fields does not get change using findOneAndUpdate', async () => {
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.LOCAL);

        const Immutable3Model = ottoman.getModel('immutable3') || ottoman.model('immutable3', schema, { idKey: '_id' });
        const schemaData = new Immutable3Model(opt);

        const created = await Immutable3Model.create(schemaData);
        const changeDate = new Date();
        const findOneAndUpdate = await Immutable3Model.findOneAndUpdate({ _id: created._id }, {
            name: 'test',
            createdAt: changeDate,
            createdBy: 'Edwin',
            updatedAt: changeDate,
            updatedBy: 'Edwin',
        }, { new: true });

        assert.strictEqual(+findOneAndUpdate.createdAt, +defaultDate);
        assert.strictEqual(findOneAndUpdate.createdBy, 'Joseph');
        assert.strictEqual(+findOneAndUpdate.updatedAt, +changeDate);
        assert.strictEqual(findOneAndUpdate.updatedBy, 'Edwin');

        await removeDocuments();
    });

    it('ottoman - ensure immutable fields does not get change using replaceById', async () => {
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.LOCAL);

        const Immutable3Model = ottoman.getModel('immutable3') ||  ottoman.model('immutable3', schema, { idKey: '_id' });
        const schemaData = new Immutable3Model(opt);

        const created = await Immutable3Model.create(schemaData);
        const changeDate = new Date();
        const replaced = await Immutable3Model.replaceById(created._id, {
            ...created,
            createdAt: changeDate,
            createdBy: 'Edwin',
            updatedAt: changeDate,
            updatedBy: 'Edwin',
        });

        assert.strictEqual(+replaced.createdAt, +defaultDate);
        assert.strictEqual(replaced.createdBy, 'Joseph');
        assert.strictEqual(+replaced.updatedAt, +changeDate);
        assert.strictEqual(replaced.updatedBy, 'Edwin');

        await removeDocuments();
    });

    it('ottoman - ensure immutable fields does not get change using updateMany', async () => {
        assert.strictEqual(ottoman.config.consistency, SearchConsistency.LOCAL);

        const Immutable3Model = ottoman.getModel('immutable3') || ottoman.model('immutable3', schema, { idKey: '_id' });
        const schemaData = new Immutable3Model(opt);
        const schemaData2 = new Immutable3Model(opt);

        await Immutable3Model.create(schemaData);
        await Immutable3Model.create(schemaData2);
        const changeDate = new Date();
        await Immutable3Model.updateMany({ operational: true }, {
            createdAt: changeDate,
            createdBy: 'Edwin',
            updatedAt: changeDate,
            updatedBy: 'Edwin',
        });

        const docs = await Immutable3Model.find();

        assert.strictEqual(+docs.rows[0].createdAt, +defaultDate);
        assert.strictEqual(docs.rows[0].createdBy, 'Joseph');
        assert.strictEqual(+docs.rows[0].updatedAt, +changeDate);
        assert.strictEqual(docs.rows[0].updatedBy, 'Edwin');

        assert.strictEqual(+docs.rows[1].createdAt, +defaultDate);
        assert.strictEqual(docs.rows[1].createdBy, 'Joseph');
        assert.strictEqual(+docs.rows[1].updatedAt, +changeDate);
        assert.strictEqual(docs.rows[1].updatedBy, 'Edwin');

        await removeDocuments();
    });
})