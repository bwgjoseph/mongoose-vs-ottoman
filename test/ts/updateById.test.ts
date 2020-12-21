import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test updateById function', async () => {
    it('mongoose - should update doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);

        hawkAirplane.callsign = 'aab';
        await Airplane.updateOne({ _id: hawkAirplane._id }, hawkAirplane).exec();
        assert.strictEqual(created.callsign, hawkAirplane.callsign);
    });

    it('ottoman - should update doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        const change = await Airplane.updateById(created.id, { callsign: 'abc' });
        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].callsign, change.callsign);

        await removeDocuments();
    });
})