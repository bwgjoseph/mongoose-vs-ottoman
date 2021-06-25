import { assert } from 'chai';
import { SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe.only('test $within function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('ottoman - $within should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            $within: {
                search_expr: 'model',
                target_expr: ['767-300F']
                }
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].model, '767-300F');

        await removeDocuments();
    });
    it('ottoman - $within should not be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            $within: {
                search_expr: 'model',
                target_expr: ['767-300']
                }
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });
});