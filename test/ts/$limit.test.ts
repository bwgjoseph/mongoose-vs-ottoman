import { SearchConsistency, getDefaultConnection, Query } from 'ottoman';
import { doc, doc2 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';
import assert from 'assert';


describe('test $limit function', async () => {
    it('mongoose - simple limit should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const limitResult = await Airline.find({
             operational: true
             },
            null,
            {
                limit:2
            });
        console.log(limitResult);
    });


    it('ottoman - simple limit should be able to work', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

         const options = { consistency: SearchConsistency.LOCAL };
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

        const find = await Airline.find({
             operational: true
             },
            {
                limit: 2
            }, options);
        console.log(JSON.stringify(find.rows, null, 2));


        await removeDocuments(); 
    });
});