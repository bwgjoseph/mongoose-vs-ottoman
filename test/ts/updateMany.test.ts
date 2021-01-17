import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { GenericManyQueryResponse } from 'ottoman/lib/types/handler';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test updateMany function', async () => {
    it('mongoose - should update many docs', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const created1 = await Airplane.create(hawkAirplane);
        const created2 = await Airplane.create(eagleAirplane);

        // changing all docs with name: "Couchbase Airlines" operational to false
        const update = await Airplane.updateMany({
            name: "Couchbase Airlines"
        },
        {
            operational: false
        },
        ).exec();
        const find = await Airplane.find().exec();
        assert.strictEqual(find[0].operational, false);
        assert.strictEqual(find[1].operational, false);
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
        const response: GenericManyQueryResponse = await Airplane.updateMany({
            name: {
                $like: '%Couchbase%'
            }
        },
            updateDoc,
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: GenericManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                modified: 2,
                match_number: 2,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

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

        const response: GenericManyQueryResponse = await Airplane.updateMany({
            name: 'Couchbase Airlines'
        },
        {
            operational: false,
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: GenericManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                modified: 2,
                match_number: 2,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find2 = await Airplane.find();
        assert.strictEqual(find2.rows[0].operational, false);
        assert.strictEqual(find2.rows[1].operational, false);

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

        const response: GenericManyQueryResponse = await Airplane.updateMany({
            capacity: 250
        },
        {
            operational: false,
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: GenericManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                modified: 1,
                match_number: 1,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find2 = await Airplane.find();
        assert.strictEqual(find2.rows[0].operational, false);
        assert.strictEqual(find2.rows[1].operational, true);

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

        const response: GenericManyQueryResponse = await Airplane.updateMany({
            name: 'abc'
        },
        {
            operational: false,
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: GenericManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                modified: 0,
                match_number: 0,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find2 = await Airplane.find();
        assert.strictEqual(find2.rows[0].operational, true);
        assert.strictEqual(find2.rows[1].operational, true);

        await removeDocuments();
    });
})