import assert from 'assert';
import mongoose from 'mongoose';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $select function', async () => {
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
        console.log(find2);
        assert.strictEqual(find2.length, 1);
        assert.strictEqual(find2[0].callsign, 'Hawk');
        assert.strictEqual(find2[0].name, 'Couchbase Airlines');
        assert.strictEqual(find2[0].destination.length, 1);
    });

    it('mongoose - $select field in nested object', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find()
            .select('info.numberOfFlightsSince')
            .exec();

        console.log(find);
        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].info.numberOfFlightsSince, 10000);
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
        console.log(JSON.stringify(find));

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
                select: 'callsign, info.callsign',
                consistency: SearchConsistency.LOCAL
            });
        console.log(JSON.stringify(find));

        await removeDocuments();
    });
});