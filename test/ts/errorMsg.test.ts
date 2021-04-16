import assert from 'assert';
import { expect } from 'chai';
import { IManyQueryResponse, SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
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
            assert.strictEqual(error.message, `Property 'capacity' is more than the maximum allowed value of '550'`);
        }

        await removeDocuments();
    });

    it('ottoman - test createMany error', async () => {
        const Airplane = getOttomanModel();

        const response = await Airplane.createMany({callsign: 'Hawk', capacity: 1000 });
        const expected: IManyQueryResponse = {
            status: 'FAILURE',
            message: {
                success: 0,
                match_number: 2,
                errors: [
                    {
                        exception: 'ValidationError',
                        message: 'Property name is required, Property model is required',
                        payload: {
                            callsign: 'Hawk'
                        },
                        status: 'FAILURE'
                    },
                    {
                        exception: 'ValidationError',
                        message: 'Property callsign is required, Property model is required',
                        payload: {
                            name: 'Couchbase Airline'
                        },
                        status: 'FAILURE'
                    }
                ]
            }
        };

        expect(response).to.deep.equalInAnyOrder(expected);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });

    // See Github #55
    it('ottoman - test findOneAndUpdate error', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        try {
            const created = await Airplane.create(hawkAirplane);
            assert.strictEqual(created.callsign, hawkAirplane.callsign);

            await Airplane.findOneAndUpdate({ callsign: 'Eagle' }, { callsign: 'BabyHawk' });
        } catch (error) {
            // printed the error out and the name is DocumentNotFoundError but when doing assertion, it is Error
            assert.strictEqual(error.name, 'DocumentNotFoundError');
            assert.strictEqual(error.message, 'document not found');
        }

        await removeDocuments();
    });

    // See Github #55
    it('ottoman - test removeById error', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        try {
            await Airplane.create(hawkAirplane);
            await Airplane.removeById('nonExistenceID');
        } catch (error) {
            // printed the error out and the name is DocumentNotFoundError but when doing assertion, it is Error
            assert.strictEqual(error.name, 'DocumentNotFoundError');
            assert.strictEqual(error.message, `document not found`);
        }

        await removeDocuments();
    });

    // removeMany has no error message as the status will be SUCCESS even when no docs are removed
    // this should be valid since it does not match the filters
    it('ottoman - test removeMany error', async () => {
        const Airplane = getOttomanModel();

        try {
            await Airplane.createMany([ hawk, eagle ]);
            const a = await Airplane.removeMany({ callsign: 'plane' });
            console.log(a);
        } catch(error) {
            console.log(error);
        }

        await removeDocuments();
    });

    // See Github #55
    it('ottoman - test replaceById error', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        try {
            await Airplane.create(hawkAirplane);
            await Airplane.replaceById('nosuchid', { callsign: 'hello' });
        } catch(error){
            // printed the error out and the name is DocumentNotFoundError but when doing assertion, it is Error
            assert.strictEqual(error.name, 'DocumentNotFoundError');
            assert.strictEqual(error.message, `document not found`);
        }

        await removeDocuments();
    });

    // See Github #55
    it('ottoman - test updateById error', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        try {
            await Airplane.create(hawkAirplane);
            await Airplane.updateById('nosuchid', { callsign: 'abc' });
        } catch (error) {
            assert.strictEqual(error.name, 'DocumentNotFoundError');
            assert.strictEqual(error.message, 'document not found');
        }

        await removeDocuments();
    });

    it('ottoman - test updateById error 2', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        try {
            const created = await Airplane.create(hawkAirplane);
            await Airplane.updateById(created.id, { capacity: -1 });
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
            assert.strictEqual(error.message, `Property 'capacity' is less than the minimum allowed value of '0'`);
        }

        await removeDocuments();
    });

    it('ottoman - test updateMany error', async () => {

    });
});