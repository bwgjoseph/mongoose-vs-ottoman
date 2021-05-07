import sizeof from 'object-sizeof';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';
import assert from 'assert';

describe('test lean function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - run with lean option', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        const leanDoc = await Airplane.findById(created.id).lean().exec();
        const nonLeanDoc = await Airplane.findById(created.id).exec();
        const sizeOfLeanDoc = sizeof(leanDoc);
        const sizeOfNonLeanDoc = sizeof(nonLeanDoc);
        assert.ok(sizeOfLeanDoc <= sizeOfNonLeanDoc);

        await Airplane.remove({}).exec();
    });

    it('ottoman - run with lean option', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        const leanDoc = await Airplane.findById(created.id, { lean: true });
        const nonLeanDoc = await Airplane.findById(created.id);
        const sizeOfLeanDoc = sizeof(leanDoc);
        const sizeOfNonLeanDoc = sizeof(nonLeanDoc);
        assert.ok(sizeOfLeanDoc <= sizeOfNonLeanDoc);

        await removeDocuments();
    });
})