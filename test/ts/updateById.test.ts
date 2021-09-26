import assert from 'assert';
import { DocumentNotFoundError, SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test updateById function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should update doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);

        hawkAirplane.callsign = 'aab';
        await Airplane.updateOne({ _id: hawkAirplane._id }, hawkAirplane).exec();
        assert.strictEqual(created.callsign, hawkAirplane.callsign);

        await Airplane.remove({}).exec();
    });

    it('ottoman - should update doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        const change = await Airplane.updateById(created.id, { callsign: 'abc' });
        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].callsign, change.callsign);

        await removeDocuments();
    });

    it('ottoman - should NOT update doc when id does not match', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);
        try {
            await Airplane.updateById('nosuchid', { callsign: 'abc' });
        } catch (error) {
            if (error instanceof DocumentNotFoundError) {
                // printed the error out and the name is DocumentNotFoundError but when doing assertion, it is Error
                // Wait for #55 to be resolved to switch
                assert.strictEqual(error.name, 'DocumentNotFoundError');
                assert.strictEqual(error.message, `document not found`);
            } else {
                assert.fail('unexpected exception');
            }
        }
        await removeDocuments();
    });
})