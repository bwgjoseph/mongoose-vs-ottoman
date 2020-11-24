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

        // const where = {
        //     operational: { $eq: true }
        // }

        // const query = new Query({where}, 'testBucket')
        // .select([
        //     {$field: 'name'},
        //     {$field: 'callsign'},
        //     {$field: 'id'},
        //     {$field: 'operational'},
        //     {$field: 'flyingTo'}
        // ])
        // .limit(1)
        // .build();
        //const result = await Airline.find([{$field: 'flyingTo'}]).limit(2).build();
        //const find = await Airline.find(result, options);
        // console.log('query language', query);
        // const showResults = await getDefaultConnection().query(result);
        // console.log('show results', showResults);

        // const results = await getDefaultConnection().query(query);
        // console.log('results', results);

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