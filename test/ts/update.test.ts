import mongoose from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';
import assert from 'assert';

interface AirlineInterface {
    callsign: string;
    contry: string;
    name: string;
}

type AirlineModel = AirlineInterface & mongoose.Document;

describe('test update function', async () => {
    const schema = {
        callsign: String,
        country: String,
        name: String
    };

    const doc = {
        callsign: 'Couchbase',
        country: 'United State',
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

        connect({
            connectionString: 'couchbase://localhost',
            bucketName: 'testBucket',
            username: 'user',
            password: 'password'
        });

        await start();
    })

    it('mongoose - should patch doc', async () => {
        const airlineSchema = new mongoose.Schema(schema);
        const Airline = mongoose.model<AirlineModel>('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);

        cbAirlines.callsign = 'aab';
        await Airline.updateOne({ _id: cbAirlines._id }, cbAirlines);
        console.log(await Airline.find());
        assert.strictEqual(created.callsign, cbAirlines.callsign);
    });

    it('ottoman - should update doc', async () => {
        const airlineSchema = new Schema(schema);
        const Airline = model('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);
        const options = { consistency: SearchConsistency.LOCAL }

        const change = await Airline.update({ callsign: 'abc' }, created.id);
        const find = await Airline.find({}, options);
        console.log(find);
        assert.strictEqual(find.rows[0].callsign, change.callsign);
        
        await Airline.remove(created.id);
    });
})