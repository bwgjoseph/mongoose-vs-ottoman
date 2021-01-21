import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { falcon, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $eq function', async () => {
    it('mongoose - simple $eq should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const falconAirplane = new Airplane(falcon);
        await Airplane.create(falconAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            name : {
                $eq : 'Couchbase Airlines'
            }
        }).exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].name, 'Couchbase Airlines');

        await Airplane.remove({});
    });

    // @fixed: 2.0.0-alpha.10
    it('ottoman - simple $eq should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const falconAirplane = new Airplane(falcon);
        await Airplane.create(falconAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            capacity : {
                $eq : 250
            }
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].capacity, 250);

        const find2 = await Airplane.find({
            name : {
                $eq : 'Couchbase Airlines'
            }
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        assert.strictEqual(find2.rows.length, 1);
        assert.strictEqual(find2.rows[0].name, 'Couchbase Airlines');

        await removeDocuments();

    });
});