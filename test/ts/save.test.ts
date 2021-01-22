import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test save function', async () => {
    it('mongoose - should save doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);

        created.callsign = "Hello";
        await created.save();
        const find = await Airplane.find(hawkAirplane).exec();
        assert.strictEqual(find[0].callsign, created.callsign);

        await Airplane.remove({}).exec();
    })

    it('ottoman - should save doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);

        created.callsign = "Hello";
        await created.save();

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].callsign, created.callsign);

        await removeDocuments();
    })
})