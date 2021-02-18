import assert from 'assert';
import mongoose from 'mongoose';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $select function', async () => {
    before(async () => {
        await removeDocuments();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    }) ;

    it('mongoose - simple $select should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find()
            .select('name')
            .exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].name, 'Couchbase Airlines');

        const find2 = await Airplane.find()
            .select(['name', 'callsign', 'destination'])
            .exec();
        assert.strictEqual(find2.length, 1);
        assert.strictEqual(find2[0].callsign, 'Hawk');
        assert.strictEqual(find2[0].name, 'Couchbase Airlines');
        assert.strictEqual(find2[0].destination.length, 1);

        await Airplane.remove({}).exec();
    });

    it('mongoose - $select field in nested object', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find()
            .select('info.numberOfFlightsSince')
            .exec();

        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].info.numberOfFlightsSince, 10000);

        await Airplane.remove({}).exec();
    });

    // select only 'callsign' but 'operational', 'capacity' and 'scheduledAt' is shown too
    //select only 'operational', 'capacity' and 'scheduledAt' will be shown. Both scenarios would give default values
    it('ottoman - simple $select should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                select: 'name',
                consistency: SearchConsistency.LOCAL
            });

        assert.strictEqual(find.rows[0].name, 'Couchbase Airlines');

        const find2 = await Airplane.find(
            {},
            {
                select: 'operational, callsign, name, destination',
                consistency: SearchConsistency.LOCAL
            });

        assert.strictEqual(find2.rows[0].name, 'Couchbase Airlines');
        assert.strictEqual(find2.rows[0].callsign, 'Hawk');
        assert.strictEqual(find2.rows[0].operational, true);
        assert.strictEqual(find2.rows[0].destination.length, 1);

        await removeDocuments();

    });

    it('ottoman - $select a nested object', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                select: 'info',
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 1);
        assert.ok(find.rows[0].info);
        assert.ok(find.rows[0].info.firstFlightAt);
        assert.ok(find.rows[0].info.numberOfFlightsSince);
        assert.ok(find.rows[0].info.callsign);

        await removeDocuments();
    });

    //results shown differs from mongoose
    it('ottoman - $select a field in a nested object', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                select: 'info.numberOfFlightsSince',
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].numberOfFlightsSince, 10000);

        const find2 = await Airplane.find(
            {},
            {
                select: 'operational, callsign, name, info.numberOfFlightsSince',
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find2.rows.length, 1);
        assert.strictEqual(find2.rows[0].name, 'Couchbase Airlines');
        assert.strictEqual(find2.rows[0].callsign, 'Hawk');
        assert.strictEqual(find2.rows[0].operational, true);
        assert.strictEqual(find2.rows[0].numberOfFlightsSince, 10000);

        await removeDocuments();
    });

    ///

    it('ottoman - $select using array of 1 string delimit with comma', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                select: 'info.numberOfFlightsSince',
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].numberOfFlightsSince, 10000);

        const find2 = await Airplane.find(
            {},
            {
                select: ['operational, callsign, name, info.numberOfFlightsSince'],
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find2.rows.length, 1);
        assert.strictEqual(find2.rows[0].name, 'Couchbase Airlines');
        assert.strictEqual(find2.rows[0].callsign, 'Hawk');
        assert.strictEqual(find2.rows[0].operational, true);
        assert.strictEqual(find2.rows[0].numberOfFlightsSince, 10000);

        await removeDocuments();
    });

    it('ottoman - $select using string delimit with comma', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                select: 'info.numberOfFlightsSince',
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].numberOfFlightsSince, 10000);

        const find2 = await Airplane.find(
            {},
            {
                select: 'operational, callsign, name, info.numberOfFlightsSince',
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find2.rows.length, 1);
        assert.strictEqual(find2.rows[0].name, 'Couchbase Airlines');
        assert.strictEqual(find2.rows[0].callsign, 'Hawk');
        assert.strictEqual(find2.rows[0].operational, true);
        assert.strictEqual(find2.rows[0].numberOfFlightsSince, 10000);

        await removeDocuments();
    });

    it('ottoman - $select using array of string', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                select: 'info.numberOfFlightsSince',
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].numberOfFlightsSince, 10000);

        const find2 = await Airplane.find(
            {},
            {
                select: ['operational', 'callsign', 'name', 'info.numberOfFlightsSince'],
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find2.rows.length, 1);
        assert.strictEqual(find2.rows[0].name, 'Couchbase Airlines');
        assert.strictEqual(find2.rows[0].callsign, 'Hawk');
        assert.strictEqual(find2.rows[0].operational, true);
        assert.strictEqual(find2.rows[0].numberOfFlightsSince, 10000);

        await removeDocuments();
    });

    it('ottoman - $select root and nested object with same field name', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find(
            {},
            {
                select: ['callsign', '{ info.callsign, info.numberOfFlightsSince } as info'],
                // select: 'callsign, { info.callsign, info.numberOfFlightsSince } as info',
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].callsign, 'Hawk');
        assert.strictEqual(find.rows[0].info.callsign, 'Hawk2');
        assert.strictEqual(find.rows[0].info.numberOfFlightsSince, 10000);

        await removeDocuments();
    });
});