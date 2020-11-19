import { SearchConsistency } from 'ottoman';
import { doc, doc2 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';
import assert from 'assert';

describe('test $nin function', async () => {
    it('mongoose - simple $nin should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find({
            country : {
                $nin : ['United State']
            }
        }).exec();
        assert.strictEqual(find.length, 1);
        console.log(find);

    });

    it('ottoman - simple $nin should be able to work', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);
        const option = { consistency: SearchConsistency.LOCAL};

        const find = await Airline.find({
            $not: [{
                $in : {
                    search_expr: 'country',
                    target_expr: ['United State'],
                }
            }]
        }, option);
        assert.strictEqual(find.rows.length, 1);

        console.log(find);

        await removeDocuments(); 
    });
});