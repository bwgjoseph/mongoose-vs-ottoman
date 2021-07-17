import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $in function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - simple $in should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        const find = await Airplane.find({
            model: {
                $in : ['767-300F']
            }
        }).exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].model, '767-300F');

        await Airplane.remove({}).exec();
    });

    it('ottoman - simple $in should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            model: {
                $in : ['767-300F']
            }
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].model, '767-300F');

        await removeDocuments();
    });
});