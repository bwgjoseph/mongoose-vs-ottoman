import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $nin function', async () => {
    it('mongoose - simple $nin should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            model : {
                $nin : ['767-300F']
            }
        }).exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].model, 'A380');


    });

    it('ottoman - simple $nin should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        const find = await Airplane.find({
            $not: [{
                $in : {
                    search_expr: 'model',
                    target_expr: ['767-300F'],
                }
            }]
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
        assert.strictEqual(find.rows[0].model, 'A380');
    });
});