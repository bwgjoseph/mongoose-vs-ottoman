import assert from 'assert';
import { hawk } from './setup/fixtures';
import { getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

// this test should test for all API thrown error
describe('test error message', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('ottoman - test create error', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        try {
            await Airplane.create({ ...hawkAirplane, capacity: 1000 });
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
            assert.strictEqual(error.message, `1000 is more than 550`);
        }

        await removeDocuments();
    });

    it('ottoman - test createMany error', async () => {

    });

    it('ottoman - test find error', async () => {

    });

    it('ottoman - test findById error', async () => {

    });

    it('ottoman - test findOne error', async () => {

    });

    it('ottoman - test findOneAndUpdate error', async () => {

    });

    it('ottoman - test removeById error', async () => {

    });

    it('ottoman - test removeMany error', async () => {

    });

    it('ottoman - test replaceById error', async () => {

    });

    it('ottoman - test updateById error', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        try {
            await Airplane.updateById('nosuchid', { callsign: 'abc' });
        } catch (error) {
            console.log(error);
            console.log(error.name);
            console.log(error.message);
            // assert.strictEqual(error.name, 'ValidationError');
            // assert.strictEqual(error.message, 'document not found');
        }

        await removeDocuments();
    });

    it('ottoman - test updateMany error', async () => {

    });
});