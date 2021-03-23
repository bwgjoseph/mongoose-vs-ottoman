import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk, eagle } from './setup/fixtures';
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

    it.only('ottoman - validation error msg test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        try {
            await Airplane.updateById(created.id, { capacity: 560 });
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
            assert.strictEqual(error.message, '560 is more than 550'); 
        }  
        
        const eagleAirplane = new Airplane({...eagle, capacity: 560});
        try {
            const created2 = await Airplane.create(eagleAirplane);
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
            assert.strictEqual(error.message, '560 is more than 550'); 
        }  
        await removeDocuments();
    });
});