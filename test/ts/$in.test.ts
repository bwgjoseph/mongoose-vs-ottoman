import mongoose from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';
import assert from 'assert';

interface AirlineInterface {
    callsign: string;
    contry: string;
    name: string;
}

type AirlineModel = AirlineInterface & mongoose.Document;

describe('test $in function', async () => {
    const schema = {
        callsign: String,
        country: String,
        name: String,
    };

    const doc = {
        callsign: 'Couchbase',
        country: 'United State',
        name: 'Couchbase Airlines'
    };

    const doc2 = {
        callsign: 'Mongo',
        country: 'Singapore',
        name: 'Mongo Airlines'
    };

    before(async () => {
        mongoose.set('useFindAndModify', false);

        await mongoose.connect('mongodb://root:password@localhost:28017/test?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });

        await mongoose.connection.dropDatabase();

        connect({
            connectionString: 'couchbase://localhost',
            bucketName: 'testBucket',
            username: 'user',
            password: 'password'
        });

        await start();
    });

    it('mongoose - simple $in should be able to work', async () => {
        const airlineSchema = new mongoose.Schema(schema)
        const Airline = mongoose.model<AirlineModel>('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find({
            country : {
                 $in : "United State"
                 }
        });
        console.log(find);
        assert.strictEqual(find.length, 1);
        
    });

    it('ottoman - simple $in should be able to work', async () => {
        const airlineSchema = new Schema(schema);
        const option = {consistency: SearchConsistency.LOCAL};
        const Airline = model('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const created1 = await Airline.create(mgAirlines);
        const created2 =await Airline.create(cbAirlines);

        const find = await Airline.find({
            $in: { 
                search_expr: 'country',
                target_expr: ['Singapore']
                 }
        }, option);
        assert.strictEqual(find.rows.length, 1);

        await Airline.remove(created1.id);
        await Airline.remove(created2.id);
    });
});