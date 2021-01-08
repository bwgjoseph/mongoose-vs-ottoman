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

    it('ottoman - should remove many docs', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane); 

        // remove all docs with name: Couchbase
        await Airplane.removeMany({
            name: {
                $like: '%Couchbase%'
            }
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        const find = await Airplane.find();
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });
})