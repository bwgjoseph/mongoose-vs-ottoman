import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { eagle, hawk, vulture } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $limit function', async () => {
    it('mongoose - simple limit should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);


        const limitResult = await Airplane.find({
             operational: true
        }).limit(2).exec();
        assert.ok(limitResult.length === 2);

        await Airplane.remove({}).exec();
    });

    it('ottoman - simple limit should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);


        const find = await Airplane.find(
            {
                operational: true
            },
            {
                limit: 2,
                consistency: SearchConsistency.LOCAL
            },
        );
        assert.ok(find.rows.length === 2, 'expected to have 2 result, with limit');

        await removeDocuments();
    });
});