import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { assertAirline, removeDocuments } from './setup/util';

describe('test create function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should create new doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);

        const created = await Airplane.create(hawkAirplane);
        assertAirline(created, hawkAirplane);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 1);

        await Airplane.remove({}).exec();
    });

    it('mongoose - should create many new doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);

        const created = await Airplane.create([hawkAirplane, eagleAirplane]);
        assertAirline(created[0], hawkAirplane);
        assertAirline(created[1], eagleAirplane);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 2);

        await Airplane.remove({}).exec();
    });

    it('ottoman - should create new doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        const created = await Airplane.create(hawkAirplane);
        assertAirline(created, hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });
})