import assert from 'assert';
import { SearchConsistency, Query, getDefaultConnection } from 'ottoman';
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
               hpnumber: {
                   $gt: 1235
               }
           });
           console.log(find);

           const find2 = await Airline.find({
               timeOfFlight: {
                   $gt: Date.now()
               }
           });
           console.log("$gt time", find2);
           assert.strictEqual(find.length, 2);
           
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


        // options = { consistency: SearchConsistency.LOCAL }

        const find =  await Airline.find(
            {
                hpnumber: {
                    $gt: 1235
                },
            }, options
            );
        
        console.log("basic $gt", find);
        const x = new Date();
        console.log(x);

        const find2 =  await Airline.find(
            {
                timeOfFlight: {
                    $gt: x
                },
            },
            options
            );
    
    console.log("$gt time", find2);
    //assert.strictEqual(find.rows.length, 2);

    await removeDocuments();
    });
})