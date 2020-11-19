import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc, doc2 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';

describe('test $and function', async () => {
    it('mongoose - simple $and should be able to work. There should be no findings as no data has callsign Mongo & Malaysia', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find({
            $and: [
                {
                    callsign: 'Mongo'
                },
                {
                    country: 'Malaysia'
                }
            ]
        }).exec();
        assert.strictEqual(find.length, 0);
        console.log(find);
    });

    it('ottoman - simple $and should be able to work', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const options = { consistency: SearchConsistency.LOCAL }
        const find = await Airline.find({
            $and: [
                {
                    callsign: 'Mongo'
                },
                {
                    country: 'Singapore'
                }
            ]
        }, options);

        const find2 = await Airline.find({
            callsign: 'Mongo',
            country: 'Singapore'
        }, options)

        console.log(1,find);
        console.log(2,find2);

        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find2.rows.length, 1);

        await removeDocuments(); 
    });
});