import assert from 'assert';
import { SearchConsistency, ValidationError } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { assertAirline, removeDocuments } from './setup/util';

describe('test enum function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should create new doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);

        const created = await Airplane.create(hawkAirplane);
        assertAirline(created, hawkAirplane);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].size, 'S');

        await Airplane.remove({}).exec();
    });

    it('ottoman - should create new doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        const created = await Airplane.create(hawkAirplane);
        assertAirline(created, hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].size, 'S');

        await removeDocuments();
    });

    it('ottoman - should not create new doc when size is not part of enum', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane({ ...hawk, size: 'a' });

        try {
           await Airplane.create(hawkAirplane);
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.message, `Property 'size' value must be S,M,L`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });
})