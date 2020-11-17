import assert from 'assert';
import mongoose from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';

interface AirlineInterface {
    callsign: string;
    country: string;
    name: string;
}

type AirlineModel = AirlineInterface & mongoose.Document;

describe('test create function', async () => {
    const schema = {
        callsign: String,
        country: String,
        name: String
    };

    const doc = {
        callsign: 'Couchbase',
        country: 'United States',
        name: 'Couchbase Airlines'
    };

    before(async () => {
        mongoose.set('useFindAndModify', false);

        await mongoose.connect('mongodb://root:password@localhost:28017/test?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });

        await mongoose.connection.dropDatabase();

        // how to connect to scope/collection?
        connect({
            connectionString: 'couchbase://localhost',
            bucketName: 'testBucket',
            username: 'user',
            password: 'password'
        });

        // how to drop the bucket/scope/collection?
        // how to remove all docs from a bucket/scope/collection?
        await start();
    })

    it('mongoose - should create new doc', async () => {
        const airlineSchema = new mongoose.Schema(schema)
        const Airline = mongoose.model<AirlineModel>('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);

        const created = await Airline.create(cbAirlines);
        assert.strictEqual(created.callsign, cbAirlines.callsign);
        assert.strictEqual(created.country, cbAirlines.country);
        assert.strictEqual(created.name, cbAirlines.name);

        const find = await Airline.find().exec();
        assert.strictEqual(find.length, 1);
    });

    it('ottoman - should create new doc', async () => {
        const airlineSchema = new Schema(schema);
        const Airline = model('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);

        const created = await Airline.create(cbAirlines);
        assert.strictEqual(created.callsign, cbAirlines.callsign);
        assert.strictEqual(created.country, cbAirlines.country);
        assert.strictEqual(created.name, cbAirlines.name);

        // Because not sure how to remove all docs before the test run,
        // there will always have multiple copies
        const options = { consistency: SearchConsistency.LOCAL }
        const find = await Airline.find({}, options);
        assert.strictEqual(find.rows.length, 1);
    });
})