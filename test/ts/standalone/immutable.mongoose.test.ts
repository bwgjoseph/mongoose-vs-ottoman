import assert from 'assert';
import mongoose from 'mongoose';

const initMongoose = async () => {
    await mongoose.connect('mongodb://root:password@localhost:28017/test?authSource=admin', {
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
        const SModel = mongoose.models.MongooseImmutable || mongoose.model<SchemaModel>('MongooseImmutable', schema);
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
        const SModel = mongoose.models.MongooseImmutable || mongoose.model<SchemaModel>('MongooseImmutable', schema);
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
        const updated = await SModel.findByIdAndUpdate(created._id, {
            createdAt: changeDate,
            createdBy: 'Edwin',
            updatedAt: changeDate,
            updatedBy: 'Edwin',
        }, { new: true }).exec();
        if (updated) {
            assert.strictEqual(+updated.createdAt, +defaultDate);
            assert.strictEqual(updated.createdBy, 'Joseph');
            assert.strictEqual(+updated.updatedAt, +changeDate);
            assert.strictEqual(updated.updatedBy, 'Edwin');
        }

        await SModel.findByIdAndRemove(created._id).exec();
    });
})