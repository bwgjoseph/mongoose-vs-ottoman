import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc, doc2 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';

describe('test $limit function', async () => {
    it('mongoose - simple limit should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const limitResult = await Airline.find({
             operational: true
        }).limit(2).exec();
        assert.ok(limitResult.length === 2);
    });

    it('ottoman - simple limit should be able to work', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find(
            {
                operational: true
            },
            {
                limit: 2,
                consistency: SearchConsistency.LOCAL
            },
        );
        assert.ok(find.rows.length === 2, 'expected to have 2 result, with limit');

        await removeDocuments();
    });
});