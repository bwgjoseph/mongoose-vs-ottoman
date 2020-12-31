import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk, eagle } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test updateMany function', async () => {
    it('mongoose - should update many docs', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const created1 = await Airplane.create(hawkAirplane);
        const created2 = await Airplane.create(eagleAirplane); 

        const update = await Airplane.updateMany({
            name: "Couchbase Airlines"
        },
        {
            operational: false
        },
        ).exec();
        const find = await Airplane.find().exec();
        assert.strictEqual(find[0].operational, false);
        assert.strictEqual(find[1].operational, false);
    });

    it('ottoman - should update many docs', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const created1 = await Airplane.create(hawkAirplane);
        const created2 = await Airplane.create(eagleAirplane); 

    //changing all name with Couchbase, size to M
        const updateDoc = {
            size: 'M'
        };
        const update = await Airplane.updateMany({ 
            name: {
                $like: '%Couchbase%'
            }
         },
            updateDoc,
        {
            consistency: SearchConsistency.LOCAL
        });
        const find = await Airplane.find();
        assert.strictEqual(find.rows[0].size, 'M'); 
        assert.strictEqual(find.rows[1].size, 'M'); 

    //changing all name with Couchbase Airlines' operational: true to false
        const update2 = await Airplane.updateMany({ 
            name: 'Couchbase Airlines'
         },
        {
            operational: false,
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        const find2 = await Airplane.find();
        assert.strictEqual(find2.rows[0].operational, false);
        assert.strictEqual(find2.rows[1].operational, false);        

        await removeDocuments();
    });
})