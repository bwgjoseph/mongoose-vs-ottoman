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
});