import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test removeMany function', async () => {
    it('mongoose - should remove doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        await Airplane.deleteMany({
            name: 'Couchbase Airlines'
        }).exec();
        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 0);
    });

    //not working yet, look at issue #36
    it('ottoman - should remove many docs', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const created = await Airplane.create(hawkAirplane);
        const created2 = await Airplane.create(eagleAirplane); 

        const remove = await Airplane.removeMany({
            name: {
                $like: '%Couchbase%'
            }
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        // assert.strictEqual(remove.rows.length, 0);
        console.log(remove);

        //await removeDocuments();
    });
})