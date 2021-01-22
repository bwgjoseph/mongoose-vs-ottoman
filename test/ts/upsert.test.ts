import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test upsert function', async () => {
    it('mongoose - upsert - doc is upserted', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.callsign, 'Hawk');

        await Airplane.findOneAndUpdate(
            {
                callsign: 'Hawk'
            },
            { ...hawk, callsign: 'HawkUpsert' },
            {
                // Make this update into an upsert
                upsert: true,
                // to return the document after update was applied.
                // new: true,
            }
        ).exec();
        const find = await Airplane.find().exec();
        assert.strictEqual(find[0].callsign, 'HawkUpsert');

        await Airplane.remove({}).exec();
    });

    it('mongoose - upsert - doc is created', async () => {
        const Airplane = getMongooseModel();
        const find = await Airplane.find().exec();
        assert.ok(find.length === 0);

        await Airplane.findOneAndUpdate(
            {
                callsign: 'Hawk'
            },
            { ...hawk, callsign: 'HawkCreated' },
            {
                // Make this update into an upsert
                upsert: true,
                // to return the document after update was applied.
                // new: true,
            }
        ).exec();
        const find2 = await Airplane.find().exec();
        assert.strictEqual(find2[0].callsign, 'HawkCreated');

        await Airplane.remove({}).exec();
    });

    it('ottoman - upsert - new option: true', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.callsign, 'Hawk');

        const find = await Airplane.findOneAndUpdate(
            {
                callsign: 'Hawk'
            },
            { ...hawk, callsign: 'HawkUpsert', operational: false },
            {
                // to return the document after update was applied if true
                new: true,
                consistency: SearchConsistency.LOCAL
            }
        );
        // should match after update
        assert.strictEqual(find.callsign, 'HawkUpsert');

        await removeDocuments();
    });

    it('ottoman - upsert - new option: false', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.callsign, 'Hawk');

        const find = await Airplane.findOneAndUpdate(
            {
                callsign: 'Hawk'
            },
            { ...hawk, callsign: 'HawkUpsert', operational: false },
            {
                // to return the document after update was applied if true
                new: false,
                consistency: SearchConsistency.LOCAL
            }
        );
        // should match before update
        assert.strictEqual(find.callsign, 'Hawk');

        await removeDocuments();
    });

    it('ottoman - upsert - no doc, doc is created (upsert: true)', async () => {
        const Airplane = getOttomanModel();
        const find = await Airplane.find({}, { consistency: SearchConsistency.LOCAL });
        assert.ok(find.rows.length === 0);

        const find2 = await Airplane.findOneAndUpdate(
            {
                callsign: 'Hawk'
            },
            { ...hawk, callsign: 'HawkCreated' },
            {
                // Make this update into an upsert (create if not exist)
                upsert: true,
            }
        );
        assert.strictEqual(find2.callsign, 'HawkCreated');

        const find3 = await Airplane.find({}, { consistency: SearchConsistency.LOCAL });
        assert.strictEqual(find3.rows[0].callsign, 'HawkCreated');

        await removeDocuments();
    });

    it('ottoman - upsert - no doc, doc is not created (upsert: false)', async () => {
        const Airplane = getOttomanModel();
        const find = await Airplane.find({}, { consistency: SearchConsistency.LOCAL });
        assert.ok(find.rows.length === 0);

        try {
            await Airplane.findOneAndUpdate(
                {
                    callsign: 'Hawk'
                },
                { ...hawk, callsign: 'HawkCreated' },
                {
                    // Make this update into an upsert (create if not exist)
                    upsert: false,
                }
            );
        } catch (err) {
            assert.ok(err.message === 'document not found');
        }

        const find2 = await Airplane.find({}, { consistency: SearchConsistency.LOCAL });
        assert.ok(find2.rows.length === 0);

        await removeDocuments();
    });

    it('ottoman - upsert - new: false, upsert; true', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.callsign, 'Hawk');

        const find = await Airplane.findOneAndUpdate(
            {
                callsign: 'Hawk'
            },
            { ...hawk, callsign: 'HawkUpsert', operational: false },
            {
                new: false,
                upsert: true,
                consistency: SearchConsistency.LOCAL
            }
        );
        assert.strictEqual(find.callsign, 'Hawk');

        await removeDocuments();
    });
})