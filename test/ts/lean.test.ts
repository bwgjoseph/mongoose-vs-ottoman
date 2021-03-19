import assert from 'assert';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test lean function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - run with lean option', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const created = await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        const find = await Airplane.findById(created.id).lean().exec();
        const find2 = await Airplane.findById(created.id).exec();
        console.log('mongoose1', find);
        console.log('mongoose2', find2);
        assert.strictEqual(created._id, hawkAirplane._id);

        await Airplane.remove({}).exec();
    });

    it('ottoman - run with lean option', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const created = await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        const find = await Airplane.findById(created.id, {lean: true});
        const find2 = await Airplane.findById(created.id);
        console.log('ottoman1', find);
        console.log('ottoman2', find2);
        assert.strictEqual(find.id, created.id);
        await removeDocuments();
    });
})