import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { ManyQueryResponse } from 'ottoman/lib/types/handler';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test removeMany function', async () => {
    it('mongoose - should remove doc', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);
        const findbefore = await Airplane.find().exec();
        assert.strictEqual(findbefore.length, 1);

        await Airplane.deleteMany({
            name: 'Couchbase Airlines'
        }).exec();
        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 0);
    });

    it('ottoman - should remove many docs', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        const findbefore = await Airplane.find({}, {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(findbefore.rows.length, 2);

        // remove all docs with name: Couchbase
        const response: ManyQueryResponse = await Airplane.removeMany({
            name: 'Couchbase Airlines'
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: ManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 2,
                match_number: 2,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find = await Airplane.find();
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });

    it('ottoman - should remove one matching doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        const findbefore = await Airplane.find({}, {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(findbefore.rows.length, 2);

        // remove all docs with name: Couchbase
        const response: ManyQueryResponse = await Airplane.removeMany({
            capacity: 250
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: ManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 1,
                match_number: 1,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find = await Airplane.find();
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });

    it('ottoman - should remove many docs using $like', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        const findbefore = await Airplane.find({}, {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(findbefore.rows.length, 2);

        // remove all docs with name: Couchbase
        const response: ManyQueryResponse = await Airplane.removeMany({
            name: {
                $like: '%Couchbase%',
            }
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: ManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 2,
                match_number: 2,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);

        const find = await Airplane.find();
        assert.strictEqual(find.rows.length, 0);

        await removeDocuments();
    });

    it('ottoman - should NOT remove many docs (does not match)', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        const findbefore = await Airplane.find({}, {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(findbefore.rows.length, 2);

        // remove all docs with name: Couchbase
        const response: ManyQueryResponse = await Airplane.removeMany({
            name: 'should not find any'
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        const expected: ManyQueryResponse = {
            status: 'SUCCESS',
            message: {
                success: 0,
                match_number: 0,
                errors: []
            }
        };

        assert.strictEqual(response.status, expected.status);
        assert.deepStrictEqual(response.message, expected.message);
        const find = await Airplane.find();
        assert.strictEqual(find.rows.length, 2);

        await removeDocuments();
    });
})