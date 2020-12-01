import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';

describe('test delete function', async () => {
    it('mongoose - should remove doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        await hawkAirplane.remove();
        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 0);
    });

    it('ottoman - should remove doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);

        await Airplane.remove(created.id);
        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });
})