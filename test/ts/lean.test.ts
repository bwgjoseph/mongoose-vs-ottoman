import assert from 'assert';
import sizeof from 'object-sizeof';
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
        const created = await Airplane.create(hawkAirplane);
        const find = await Airplane.findById(created.id).lean().exec();
        const find2 = await Airplane.findById(created.id).exec();
        const checkFind = sizeof(find);
        const checkFind2 = sizeof(find2);
        console.log('leanDoc', checkFind);
        console.log('normalDoc', checkFind2);

        await Airplane.remove({}).exec();
    });

    it('ottoman - run with lean option', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        const find = await Airplane.findById(created.id, {lean: true});
        const find2 = await Airplane.findById(created.id);
        const checkFind = sizeof(find);
        const checkFind2 = sizeof(find2);
        console.log('leanDoc', checkFind);
        console.log('normalDoc', checkFind2);
        await removeDocuments();
    });
})