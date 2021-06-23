import assert from 'assert';
import chai, { expect } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import { IManyQueryResponse, SearchConsistency } from 'ottoman';
import { bird, eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

chai.use(deepEqualInAnyOrder);

describe.skip('test createMany function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should create 2 new doc', async () => {
        const Airplane = getMongooseModel();
        await Airplane.insertMany([
            hawk,
            eagle
        ]);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 2);

        await Airplane.remove({}).exec();
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

        await Airplane.remove({}).exec();
    });

    it('ottoman - should create multi doc successfully', async () => {
        const Airplane = getOttomanModel();
        const response: IManyQueryResponse = await Airplane.createMany([
            hawk,
            eagle,
        ]);

        const expected: IManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 2,
                match_number: 2,
                data: [
                    response.message.data![0],
                    response.message.data![1]
                ],
                errors: [],
            }
        };

        expect(response).to.deep.equalInAnyOrder(expected);

        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 2);

        await removeDocuments();
    });

    // all required fields are given
    // sample output
    // IManyQueryResponse {
    //     status: 'SUCCESS',
    //     message: { success: 1, match_number: 2, errors: [ undefined ] }
    //   }
    it('ottoman - should create 1 new doc when using partial doc', async () => {
        const Airplane = getOttomanModel();

        const response: IManyQueryResponse = await Airplane.createMany([
            {
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

        const expected: IManyQueryResponse = {
            status: 'FAILURE',
            message: {
                success: 1,
                match_number: 2,
                data: [
                    response.message.data![0],
                ],
                errors: [
                    {
                        payload: {
                            callsign: 'Hawk',
                        },
                        status: 'FAILURE',
                        exception: 'ValidationError',
                        message: `Property 'name' is required, Property 'model' is required`
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
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });

    // partial doc is placed first in the array; the rest of the docs are still being created
    it('ottoman - should create 2 new doc, without creating the partial doc', async () => {
        const Airplane = getOttomanModel();
        const response: IManyQueryResponse = await Airplane.createMany([
            {
                callsign: 'Hawk',
            },
            hawk,
            eagle
        ]);

        const expected: IManyQueryResponse = {
            status: 'FAILURE',
            message: {
                success: 2,
                match_number: 3,
                data: [
                    response.message.data![0],
                    response.message.data![1],
                ],
                errors: [
                    {
                        payload: {
                            callsign: 'Hawk',
                        },
                        status: 'FAILURE',
                        exception: 'ValidationError',
                        message: `Property 'name' is required, Property 'model' is required`
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
        assert.strictEqual(find.rows.length, 2);

        await removeDocuments();
    });

    // partial doc is placed in the middle of the array; Behavior other docs would still be created
    it('ottoman - should create 3 new doc, without creating the partial doc', async () => {
        const Airplane = getOttomanModel();
        const response: IManyQueryResponse = await Airplane.createMany([
            bird,
            {
                callsign: 'Hawk',
            },
            hawk,
            eagle
        ]);

        const expected: IManyQueryResponse = {
            status: 'FAILURE',
            message: {
                success: 3,
                match_number: 4,
                data: [
                    response.message.data![0],
                    response.message.data![1],
                    response.message.data![2],
                ],
                errors: [
                    {
                        payload: {
                            callsign: 'Hawk',
                        },
                        status: 'FAILURE',
                        exception: 'ValidationError',
                        message: `Property 'name' is required, Property 'model' is required`
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
        assert.strictEqual(find.rows.length, 3);

        await removeDocuments();
    });

     // not all required fields are given
     it('ottoman - should not create new doc when using partial doc', async () => {
        const Airplane = getOttomanModel();
        const response: IManyQueryResponse = await Airplane.createMany([
            {
                callsign: 'Hawk',
            },
            {
                name: 'Couchbase Airline',
            }
        ]);

        const expected: IManyQueryResponse = {
            status: 'FAILURE',
            message: {
                success: 0,
                match_number: 2,
                data: [],
                errors: [
                    {
                        exception: 'ValidationError',
                        message: `Property 'name' is required, Property 'model' is required`,
                        payload: {
                            callsign: 'Hawk'
                        },
                        status: 'FAILURE'
                    },
                    {
                        exception: 'ValidationError',
                        message: `Property 'callsign' is required, Property 'model' is required`,
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
})