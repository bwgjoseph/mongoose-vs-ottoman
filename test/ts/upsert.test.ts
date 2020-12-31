import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { assertAirline, removeDocuments } from './setup/util';

describe('test upsert function', async () => {
    it.only('mongoose - upsert function', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);

        const upsert = await Airplane.findOneAndUpdate(
            {
                name: 'ABC Airlines',
            },
            {
                $set: {size: 'M'},
            },
            {
                upsert: true,
            }
            )
        .exec();
        const find = await Airplane.find();
        assert.strictEqual(find.length, 2);
    });

    //not working yet, look at issue #36
    it('ottoman - upsert function', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);

        const find = await Airplane.findOneAndUpdate(
            created.id,
            {
                assignedPilot: 'John'
            },
            {
                consistency: SearchConsistency.LOCAL,
                upsert: true,
            });
        //assert.strictEqual(find.rows.length, 1);
        console.log(find);

        await removeDocuments();
    });
})