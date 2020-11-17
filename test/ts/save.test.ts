import assert from 'assert';
import mongoose, { Collection } from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';

interface AirlineInterface {
    callsign: string;
    country: string;
    name: string;
    // timeOfFlight: number;
}

type AirlineModel = AirlineInterface & mongoose.Document;

describe.only('test save function', async () => {
    const schema = {
        callsign: String,
        country: String,
        name: String,
        // timeOfFlight: Number
    };

    const doc = {
        callsign: 'Couchbase',
        country: 'United State',
        name: 'Couchbase Airlines',

    };

    before(async () => {
        mongoose.set('useFindAndModify', false);

        await mongoose.connect('mongodb://root:password@localhost:28017/test?authSOurce=admin', {
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
    })

    it('mongoose - should save doc', async () => {
        const airlineSchema = new mongoose.Schema(schema);
        const Airline = mongoose.model<AirlineModel>('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);

        cbAirlines.callsign = "Hello";
        await cbAirlines.save();
        const find = await Airline.find(cbAirlines);
        console.log(find);
        assert.strictEqual(created.callsign, cbAirlines.callsign);
    })

    it('ottoman - should save doc', async () => {
        const airlineSchema = new Schema(schema);
        const Airline = model('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);
        const options = { consistency: SearchConsistency.LOCAL }


        cbAirlines.callsign = "Hi";
        await cbAirlines.save();
        console.log(2,cbAirlines);

        const find = await Airline.find({}, options);
        console.log(3,find);
        assert.strictEqual(find.rows[0].callsign, cbAirlines.callsign);

        await Airline.remove(created.id);
    })
})