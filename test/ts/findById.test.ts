import assert from 'assert';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test findById function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should be able to findById', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const created = await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        await Airplane.findById(created.id).exec();
        assert.strictEqual(created._id, hawkAirplane._id);

        await Airplane.remove({}).exec();
    });

    it('ottoman - should be able to findById', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const created = await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        const find = await Airplane.findById(created.id);
        assert.strictEqual(find.id, created.id);
        await removeDocuments();
    });
})