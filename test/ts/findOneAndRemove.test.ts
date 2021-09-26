import assert from 'assert';
import { DocumentNotFoundError, SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test findOneAndRemove function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('ottoman - should be able to findOneAndRemove', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        const total = await Airplane.find({}, { consistency: SearchConsistency.LOCAL });
        assert.strictEqual(total.rows.length, 2);

        await Airplane.findOneAndRemove({ extension: 'abc' });

        const total2 = await Airplane.find({}, { consistency: SearchConsistency.LOCAL });
        assert.strictEqual(total2.rows.length, 1);

        await removeDocuments();
    });

    it('ottoman - should get DocumentNotFound exception when unable to find doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        const total = await Airplane.find({}, { consistency: SearchConsistency.LOCAL });
        assert.strictEqual(total.rows.length, 2);

        try {
            await Airplane.findOneAndRemove({ extension: 'abc1' });
        } catch (error) {
            if (error instanceof DocumentNotFoundError) {
                assert.strictEqual(error.name, 'DocumentNotFoundError');
                assert.strictEqual(error.message, 'document not found');
            } else {
                assert.fail('unexpected exception');
            }
        }
    });
})