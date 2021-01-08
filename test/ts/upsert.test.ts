import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test upsert function', async () => {
    it('mongoose - upsert function', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        await Airplane.findOneAndUpdate({
                callsign: 'Pigeon',
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
        assert.strictEqual(find[1].size, 'M');
    });

    //not working yet, look at issue #36
    it('ottoman - upsert function', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.findOneAndUpdate({
            callsign: 'Pigeon',
        },
            {
                size: 'M'
            },
            {
                consistency: SearchConsistency.LOCAL,
                upsert: true,
            });
        assert.strictEqual(find.rows.length, 2);

        await removeDocuments();
    });
})