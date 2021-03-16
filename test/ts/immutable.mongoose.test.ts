import assert from 'assert';
import mongoose from 'mongoose';
import { Ottoman, SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';

let ottoman: Ottoman;

const initMongoose = async () => {
    mongoose.set('useFindAndModify', false);

    await mongoose.connect('mongodb://root:password@localhost:28017/test?authSource=admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4
    });

    await mongoose.connection.dropDatabase();
}

const defaultDate = new Date();

interface SInt {
    name: string,
    operational: boolean,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string,
}
type SchemaModel = SInt & mongoose.Document;

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    operational: {
        type: Boolean,
        default: true
    },
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

const opt = {
    name: 'hello',
    operational: true,
};

describe('test schema immutable options', async () => {
    before(async () => {
        await initMongoose();
    });

    it('mongoose - ensure immutable fields does not get change using save', async () => {
        const SModel = mongoose.model<SchemaModel>('Airplane', schema);
        const schemaData = new SModel(opt);

        const created = await SModel.create(schemaData);
        assert.ok(created.createdAt);
        assert.ok(created.createdBy);
        assert.ok(created.updatedAt);
        assert.ok(created.updatedBy);

        const find = await SModel.find().exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(+find[0].createdAt, +defaultDate);
        assert.strictEqual(find[0].createdBy, 'Joseph');
        assert.strictEqual(+find[0].updatedAt, +defaultDate);
        assert.strictEqual(find[0].updatedBy, 'Joseph');

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

        await SModel.findByIdAndRemove(created._id).exec();
    });

    it('mongoose - ensure immutable fields does not get change using updateById', async () => {
        const SModel = mongoose.model<SchemaModel>('Airplane', schema);
        const schemaData = new SModel(opt);

        const created = await SModel.create(schemaData);
        assert.ok(created.createdAt);
        assert.ok(created.createdBy);
        assert.ok(created.updatedAt);
        assert.ok(created.updatedBy);
        console.log(created);

        const find = await SModel.find().exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(+find[0].createdAt, +defaultDate);
        assert.strictEqual(find[0].createdBy, 'Joseph');
        assert.strictEqual(+find[0].updatedAt, +defaultDate);
        assert.strictEqual(find[0].updatedBy, 'Joseph');

        const changeDate = new Date();
        console.log(changeDate);
        const updated = await SModel.findByIdAndUpdate(created._id, {
            createdAt: changeDate,
            createdBy: 'Edwin',
            updatedAt: changeDate,
            updatedBy: 'Edwin',
        }, { new: true }).exec();
        console.log(updated);
        if (updated) {
            assert.strictEqual(+updated.createdAt, +defaultDate);
            assert.strictEqual(updated.createdBy, 'Joseph');
            assert.strictEqual(+updated.updatedAt, +changeDate);
            assert.strictEqual(updated.updatedBy, 'Edwin');
        }

        await SModel.findByIdAndRemove(created._id).exec();
    });

    it('ottoman - ensure immutable fields does not get change using updateById2', async () => {
        assert.strictEqual(ottoman.config.searchConsistency, SearchConsistency.LOCAL);

        const Immutable2Model = ottoman.model('immutable2', schema, { idKey: '_id' });
        const schemaData = new Immutable2Model({
            name: 'hello',
            operational: true,
        });

        const created = await Immutable2Model.create(schemaData);
        const changeDate = new Date();
        await Immutable2Model.updateById(created._id, {
            createdAt: changeDate,
            createdBy: 'Edwin',
            updatedAt: changeDate,
            updatedBy: 'Edwin',
        });

        await removeDocuments();
    });
})