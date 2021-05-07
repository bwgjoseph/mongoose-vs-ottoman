import assert from 'assert';
import chai, { expect } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import { IManyQueryResponse, SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

chai.use(deepEqualInAnyOrder);

describe('test updateMany function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should update many docs', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        // changing all docs with name: "Couchbase Airlines" operational to false
        await Airplane.updateMany({
            name: "Couchbase Airlines"
        },
        {
            operational: false
        },
        ).exec();
        const find = await Airplane.find().exec();
        assert.strictEqual(find[0].operational, false);
        assert.strictEqual(find[1].operational, false);

        await Airplane.remove({}).exec();
    });

    it('ottoman - changing all docs with "Couchbase" in the name field, size to M', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const hawkCreated = await Airplane.create(hawkAirplane);
        const eagleCreated = await Airplane.create(eagleAirplane);
        assert.strictEqual(hawkCreated.size, 'S');
        assert.strictEqual(eagleCreated.size, 'L');

        const updateDoc = {
            size: 'M'
        };
        const response: IManyQueryResponse = await Airplane.updateMany({
            name: {
                $like: '%Couchbase%'
            }
        },
            updateDoc,
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: IManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 2,
                match_number: 2,
                errors: []
            }
        };

        expect(response).to.deep.equalInAnyOrder(expected);

        const find = await Airplane.find();
        assert.strictEqual(find.rows[0].size, 'M');
        assert.strictEqual(find.rows[1].size, 'M');

        await removeDocuments();
    });

    it('ottoman - changing all docs with name: "Couchbase Airlines", operational: true to false', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const hawkCreated = await Airplane.create(hawkAirplane);
        const eagleCreated = await Airplane.create(eagleAirplane);
        assert.strictEqual(hawkCreated.operational, true);
        assert.strictEqual(eagleCreated.operational, true);

        const response: IManyQueryResponse = await Airplane.updateMany({
            name: 'Couchbase Airlines'
        },
        {
            operational: false,
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: IManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 2,
                match_number: 2,
                errors: []
            }
        };

        expect(response).to.deep.equalInAnyOrder(expected);

        const find2 = await Airplane.find();
        assert.strictEqual(find2.rows[0].operational, false);
        assert.strictEqual(find2.rows[1].operational, false);

        await removeDocuments();
    });

    it('ottoman - doc should not be updated when schema does not match', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const hawkCreated = await Airplane.create(hawkAirplane);
        const eagleCreated = await Airplane.create(eagleAirplane);
        assert.strictEqual(hawkCreated.operational, true);
        assert.strictEqual(eagleCreated.operational, true);

        const response: IManyQueryResponse = await Airplane.updateMany({
            name: 'Couchbase Airlines'
        },
        {
            operational: 'notmatch',
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: IManyQueryResponse = {
            status: 'FAILURE',
            message: {
                success: 0,
                match_number: 2,
                errors: [
                    {
                        payload: hawkCreated.id,
                        status: 'FAILURE',
                        exception: 'ValidationError',
                        message: `Property 'operational' must be of type 'Boolean'`
                    },
                    {
                        payload: eagleCreated.id,
                        status: 'FAILURE',
                        exception: 'ValidationError',
                        message: `Property 'operational' must be of type 'Boolean'`
                    }
                ]
            }
        };

        expect(response).to.deep.equalInAnyOrder(expected);

        const find2 = await Airplane.find();
        assert.strictEqual(find2.rows[0].operational, true);
        assert.strictEqual(find2.rows[1].operational, true);

        await removeDocuments();
    });

    it('ottoman - should update one matching doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const hawkCreated = await Airplane.create(hawkAirplane);
        const eagleCreated = await Airplane.create(eagleAirplane);
        assert.strictEqual(hawkCreated.operational, true);
        assert.strictEqual(eagleCreated.operational, true);

        const response: IManyQueryResponse = await Airplane.updateMany({
            capacity: 250
        },
        {
            operational: false,
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: IManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 1,
                match_number: 1,
                errors: []
            }
        };

        expect(response).to.deep.equalInAnyOrder(expected);

        const find2 = await Airplane.find();
        const opFalse = find2.rows.find((data: any) => data.capacity === 250);
        assert.strictEqual(opFalse.operational, false);
        const opTrue = find2.rows.find((data: any) => data.capacity !== 250);
        assert.strictEqual(opTrue.operational, true);

        await removeDocuments();
    });

    it('ottoman - should not update any docs as there is no matching', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const hawkCreated = await Airplane.create(hawkAirplane);
        const eagleCreated = await Airplane.create(eagleAirplane);
        assert.strictEqual(hawkCreated.operational, true);
        assert.strictEqual(eagleCreated.operational, true);

        const response: IManyQueryResponse = await Airplane.updateMany({
            name: 'abc'
        },
        {
            operational: false,
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: IManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 0,
                match_number: 0,
                errors: []
            }
        };

        expect(response).to.deep.equalInAnyOrder(expected);

        const find2 = await Airplane.find();
        assert.strictEqual(find2.rows[0].operational, true);
        assert.strictEqual(find2.rows[1].operational, true);

        await removeDocuments();
    });
})