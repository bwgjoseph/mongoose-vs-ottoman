import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc, doc2, doc3 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';

describe('test $gt function', async () => {
    it('mongoose - simple $gt should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const sqAirlines = new Airline(doc3);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);
        await Airline.create(sqAirlines);

        const find = await Airline.find({
            quantity: {
                $gt: 100
            }
        }).exec();
        assert.strictEqual(find.length, 2);

        const find2 = await Airline.find({
            timeOfFlight: {
                $gt: Date.now()
            }
        }).exec();
        assert.strictEqual(find2.length, 1);
    });

    it('ottoman - simple $gt should be able to work', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const sqAirlines = new Airline(doc3);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);
        await Airline.create(sqAirlines);
        const options = { consistency: SearchConsistency.LOCAL };

        const find =  await Airline.find({
            quantity: {
                $gt: 100
            },
        }, options);
        assert.strictEqual(find.rows.length, 2);

        // can't query for date
        const find2 =  await Airline.find({
            timeOfFlight: {
                $gt: Date.now()
            },
        }, options);

        console.log("$gt time", find2);
        // assert.strictEqual(find.rows.length, 2);

        await removeDocuments();
    });
})