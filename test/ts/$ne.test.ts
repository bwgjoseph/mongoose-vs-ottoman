import { SearchConsistency } from 'ottoman';
import { doc, doc2 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';
import assert from 'assert';


describe('test $ne function', async () => {
    it('mongoose - simple $ne should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find({
            country : {
                $ne : 'United State'
            }
        }).exec();
        assert.strictEqual(find.length, 1);
        console.log(find);

    });

    it('ottoman - simple $neq should be able to work', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);
        const option = { consistency: SearchConsistency.LOCAL};

        //$neq for ottoman works for number but not string.
        const find = await Airline.find({
            hpnumber : {
                $neq : 1234
            }
        }, option);
        const find2 = await Airline.find({
            country : {
                $neq : 'Singapore'
            }
        }, option);
        console.log(1, find);
        console.log(2, find2);
        assert.strictEqual(find.rows.length, 1);


        await removeDocuments(); 
    });
});