import assert from 'assert';
import mongoose from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';

interface AirlineInterface {
    callsign: string;
    country: string;
    name: string;
    // timeOfFlight: number;
}

type AirlineModel = AirlineInterface & mongoose.Document;

describe('test save function', async () => {
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

        created.callsign = "Hi";
        await created.save();

        const find = await Airline.find({}, options);
        assert.strictEqual(find.rows[0].callsign, created.callsign);

        await Airline.remove(created.id);
    })
})