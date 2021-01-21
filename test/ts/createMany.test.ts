import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { GenericManyQueryResponse } from 'ottoman/lib/types/handler';
import { bird, eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test createMany function', async () => {
    it('mongoose - should create 2 new doc', async () => {
        const Airplane = getMongooseModel();
        await Airplane.insertMany([
            hawk,
            eagle
        ]);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 2);
    });

    // 3 documents are saved with 1 in partial doc form
    it('mongoose - should create 3 new doc', async () => {
        const Airplane = getMongooseModel();
        await Airplane.insertMany([
            hawk,
            {
                callsign: 'Bird',
                name: 'abc',
                model: 'A380',
                location: {
                    type: 'Point',
                    coordinates: [
                        1.22,
                        2.33,
                        1.11
                    ]
                },
            },
            eagle
        ]);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 3);
    });

    // all required fields are given
    // sample output
    // GenericManyQueryResponse {
    //     status: 'SUCCESS',
    //     message: { success: 1, match_number: 2, errors: [ undefined ] }
    //   }
    it('ottoman - should create 1 new doc when using partial doc', async () => {
        const Airplane = getOttomanModel();
        const response: GenericManyQueryResponse = await Airplane.createMany([{
                callsign: 'Hawk',
            },
            {
                callsign: 'Bird',
                name: 'abc',
                model: 'A380',
                location: {
                    type: 'Point',
                    coordinates: [
                        1.22,
                        2.33,
                        1.11
                    ]
                },
            }
        ]);

        const expected: GenericManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 1,
                match_number: 2,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });

    // partial doc is placed first in the array; the rest of the docs are still being created
    it('ottoman - should create 2 new doc, without creating the partial doc', async () => {
        const Airplane = getOttomanModel();
        const response: GenericManyQueryResponse = await Airplane.createMany([{
            callsign: 'Hawk',
            },
        hawk,
        eagle
        ]);

        const expected: GenericManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 2,
                match_number: 3,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 2);

        await removeDocuments();
    });

    // partial doc is placed in the middle of the array; Behavior other docs would still be created
    it('ottoman - should create 3 new doc, without creating the partial doc', async () => {
        const Airplane = getOttomanModel();
        const response: GenericManyQueryResponse = await Airplane.createMany([
        bird,
            {
            callsign: 'Hawk',
            },
        hawk,
        eagle
        ]);

        const expected: GenericManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 3,
                match_number: 4,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 3);

        await removeDocuments();
    });

     // not all required fields are given
     it('ottoman - should not create new doc when using partial doc', async () => {
        const Airplane = getOttomanModel();
        const response: GenericManyQueryResponse = await Airplane.createMany([{
                callsign: 'Hawk',
            },
            {
                name: 'Couchbase Airline',
            }
        ]);

        const expected: GenericManyQueryResponse = {
            status: 'FAILED',
            message: {
                success: 0,
                match_number: 2,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });
})