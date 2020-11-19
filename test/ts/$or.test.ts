import { SearchConsistency } from 'ottoman';
import { doc, doc2 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';
import assert from 'assert';

describe('test $or function', async () => {
    it('mongoose - simple $or should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        //results should show 2 data set
        const find = await Airline.find({
            $or: [
                {
                    callsign: 'Couchbase'
                },
                {
                    callsign: 'Mongo'
                }
            ]
        }).exec();

        //results should show nothing
        const find2 = await Airline.find({
            $or: [
                {
                    callsign: 'Airbase'
                },
                {
                    callsign: 'Mango'
                }
            ]
        }).exec();
        console.log(find);
        assert.strictEqual(find.length, 2);
        assert.strictEqual(find2.length, 0);
    });

    it('ottoman - simple $or should be able to work', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);
        const options = { consistency: SearchConsistency.LOCAL }

        //results should show 2 data set
        const find = await Airline.find({
            $or: [
                {
                    callsign: 'Couchbase'
                },
                {
                    callsign: 'Mongo'
                }
            ]
        }, options);

        //results should show nothing
        const find2 = await Airline.find({
            $or: [
                {
                    callsign: 'Airbase'
                },
                {
                    callsign: 'Mango'
                }
            ]
        }, options);
        console.log(find);
        assert.strictEqual(find.rows.length, 2);
        assert.strictEqual(find2.rows.length, 0);

        await removeDocuments(); 
    });
});