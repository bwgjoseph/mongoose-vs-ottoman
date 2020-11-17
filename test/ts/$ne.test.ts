import assert from 'assert';
import mongoose from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';

interface AirlineInterface {
    id: string;
    callsign: string;
    country: string;
    name: string;
    hpnumber: number;
}

type AirlineModel = AirlineInterface & mongoose.Document;


describe('test $ne function', async () => {
    const schema = {
        id: String,
        callsign: String,
        country: String,
        name: String,
        hpnumber: Number
    };

    const doc = {
        callsign: 'Couchbase',
        country: 'United State',
        name: 'Couchbase Airlines',
        hpnumber: 1234
    };

    const doc2 = {
        callsign: 'Mongo',
        country: 'Singapore',
        name: 'Mongo Airlines',
        hpnumber: 5678
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

    it('mongoose - simple $ne should be able to work', async () => {
        const airlineSchema = new mongoose.Schema(schema)
        const Airline = mongoose.model<AirlineModel>('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find({country : { $ne : "United State" }});
        assert.strictEqual(find.length, 1);
        console.log(find);
        
    });

    it('ottoman - simple $neq should be able to work', async () => {
        const airlineSchema = new Schema(schema);
        const Airline = model('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const created1 = await Airline.create(mgAirlines);
        const created2 = await Airline.create(cbAirlines);
        const option = { consistency: SearchConsistency.LOCAL};

        //$neq for ottoman works for number but not string. 
        const find = await Airline.find({hpnumber : { $neq : 1234 }}, option);
        const find2 = await Airline.find({country : { $neq : "Singapore" }}, option);
        console.log(1, find);
        console.log(2, find2);
        assert.strictEqual(find.rows.length, 1);


        await Airline.remove(created1.id);
        await Airline.remove(created2.id);
    });
});