import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc, doc2 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';

describe('test $in function', async () => {
    it('mongoose - simple $in should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find({
            country : {
                 $in : 'United State'
                 }
        }).exec();
        assert.strictEqual(find.length, 1);

    });

    it('ottoman - simple $in should be able to work', async () => {
        const option = {consistency: SearchConsistency.LOCAL};
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find({
            $in: {
                search_expr: 'country',
                target_expr: ['Singapore']
                 }
        }, option);
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });
});