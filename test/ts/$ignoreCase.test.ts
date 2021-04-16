import { assert } from 'chai';
import { SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $ignoreCase function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('ottoman - should be able to find doc using find while ignoring case', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane({ ...eagle, name: 'mongoose airlinE' });
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        const result = await Airplane.find(
            { name: { $eq: 'couchbase airlines', $ignoreCase: true }},
            { consistency: SearchConsistency.LOCAL },
        );

        assert.ok(result.rows.length === 1);
        await removeDocuments();
    });

    it('ottoman - should NOT be able to find doc using find when case not match', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane({ ...eagle, name: 'mongoose airlinE' });
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        const result = await Airplane.find(
            { name: { $eq: 'couchbase airlines' }},
            { consistency: SearchConsistency.LOCAL },
        );

        assert.ok(result.rows.length === 0);
        await removeDocuments();
    });

    it('ottoman - should be able to find doc using findOne while ignoring case', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane({ ...eagle, name: 'mongoose airlinE' });
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        const result = await Airplane.findOne(
            { name: { $eq: 'couchbase airlines', $ignoreCase: true }},
            { consistency: SearchConsistency.LOCAL },
        );

        assert.ok(result);
        await removeDocuments();
    });

    it('ottoman - should NOT be able to find doc using findOne when case not match', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane({ ...eagle, name: 'mongoose airlinE' });
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        try {
            await Airplane.findOne(
                { name: { $eq: 'couchbase airlines' }},
                { consistency: SearchConsistency.LOCAL },
            );
        } catch (error) {
            // printed the error out and the name is DocumentNotFoundError but when doing assertion, it is Error
            assert.strictEqual(error.name, 'DocumentNotFoundError');
            assert.strictEqual(error.message, `document not found`);
        }

        await removeDocuments();
    });

    it('ottoman - should be able to find doc using findOneAndUpdate while ignoring case', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane({ ...eagle, name: 'mongoose airlinE' });
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        const result = await Airplane.findOneAndUpdate(
            { name: { $eq: 'couchbase airlines', $ignoreCase: true }},
            { capacity: 505 },
            { consistency: SearchConsistency.LOCAL, new: true },
        );

        assert.ok(result.capacity === 505);
        await removeDocuments();
    });

    it('ottoman - should NOT be able to find doc using findOneAndUpdate when case not match', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane({ ...eagle, name: 'mongoose airlinE' });
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        try {
            await Airplane.findOneAndUpdate(
                { name: { $eq: 'couchbase airlines' }},
                { capacity: 505 },
                { consistency: SearchConsistency.LOCAL, new: true },
            );
        } catch (err) {
            assert.ok(err.message === 'document not found');
        }

        await removeDocuments();
    });

    it('ottoman - should be able to find doc using updateMany while ignoring case', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        await Airplane.updateMany(
            { name: { $eq: 'couchbase airlines', $ignoreCase: true }},
            { capacity: 510 },
            { consistency: SearchConsistency.LOCAL },
        );

        const docs = await Airplane.find();

        assert.ok(docs.rows[0].capacity === 510);
        assert.ok(docs.rows[1].capacity === 510);
        await removeDocuments();
    });

    it('ottoman - should NOT be able to find doc using updateMany when case not match', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        await Airplane.updateMany(
            { name: { $eq: 'couchbase airlines' }},
            { capacity: 510 },
            { consistency: SearchConsistency.LOCAL },
        );

        const docs = await Airplane.find();

        assert.ok(docs.rows[0].capacity === 250);
        assert.ok(docs.rows[1].capacity === 500);
        await removeDocuments();
    });
})