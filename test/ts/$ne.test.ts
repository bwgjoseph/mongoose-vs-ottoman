import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { falcon, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $ne function', async () => {
    it('mongoose - simple $ne should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const falconAirplane = new Airplane(falcon);
        await Airplane.create(falconAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            name : {
                $ne : 'Couchbase Airlines'
            }
        }).exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].name, 'Mongo Airlines');

        await Airplane.remove({});
    });

    // @fixed: 2.0.0-alpha.10
    it('ottoman - simple $neq should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const falconAirplane = new Airplane(falcon);
        await Airplane.create(falconAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            capacity : {
                $neq : 250
            }
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].capacity, 550);

        const find2 = await Airplane.find({
            name : {
                $neq : 'Couchbase Airlines'
            }
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find2.rows.length, 1);
        assert.strictEqual(find2.rows[0].name, 'Mongo Airlines');


        await removeDocuments();
    });
});