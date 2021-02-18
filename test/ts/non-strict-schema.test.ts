import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getMongooseNonStrictModel, getOttomanModel, getOttomanNonStrictModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test create function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should not save the additional field when strict: true', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        assert.ok(!created.notInSchema);

        const find = await Airplane.find().exec();
        assert.ok(!find[0].notInSchema);

        await Airplane.remove({}).exec();
    });

    it.skip('mongoose - should save the additional field when strict: false', async () => {
        const Airplane = getMongooseNonStrictModel();
        const hawkAirplane = new Airplane({...hawk, notInSchema: true});
        const created = await Airplane.create(hawkAirplane);
        assert.ok(created.notInSchema);
        assert.strictEqual(created.notInSchema, true);

        const find = await Airplane.find().exec();
        // mongoose bug? print and show notInSchema, but cannot assert
        assert.strictEqual(find[0].notInSchema, true);

        await Airplane.remove({}).exec();
    });

    it('ottoman - should not save new field when strict: true', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane({...hawk, notInSchema: true});
        const created = await Airplane.create(hawkAirplane);
        assert.ok(!created.notInSchema);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.ok(!find.rows[0].notInSchema);

        await removeDocuments();
    });

    it('ottoman - should save new field when strict: false', async () => {
        const Airplane = getOttomanNonStrictModel();
        const hawkAirplane = new Airplane({...hawk, notInSchema: true});
        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.notInSchema, true);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].notInSchema, true);


        await removeDocuments();
    });
})