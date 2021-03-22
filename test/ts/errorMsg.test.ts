import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test error message', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('ottoman - error message for ottoman should be more precise', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);
        try {
            await Airplane.updateById('nosuchid', { callsign: 'abc' });
        } catch (error) {
            assert.strictEqual(error.message, 'document not found');
        }

        await removeDocuments();
    });

    it('ottoman - validation error msg test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        try {
            await Airplane.updateById(created.id, { capacity: 560 });
        } catch (error) {
            console.log('error msg',error);
            assert.strictEqual(error.header, 'ValidationError');  
        }     
        // const find = await Airplane.findById(created.capacity);
        // console.log('ottoman2', find.capacity);
        // assert.strictEqual(find.capacity, created.capacity);
        await removeDocuments();
    });
});