import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';
import { eagle, hawk, vulture } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';

describe('test $skip function', async () => {
    it('mongoose - simple skip should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);

        const result = await Airplane.find({
            operational: true
        }).skip(1).exec();
        assert.ok(result.length === 1);
    });

    it('ottoman - simple skip should be able to work', async () => {
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
                skip: 1,
                consistency: SearchConsistency.LOCAL
            },
        );
        assert.ok(find.rows.length === 1);

        await removeDocuments();

    });
});