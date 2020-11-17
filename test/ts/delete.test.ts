import mongoose from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';
import assert from 'assert';

interface AirlineInterface {
    callsign: string;
    contry: string;
    name: string;
}

type AirlineModel = AirlineInterface & mongoose.Document;

describe('test delete function', async () => {
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

    it('mongoose - should remove doc', async () => {
        const airlineSchema = new mongoose.Schema(schema)
        const Airline = mongoose.model<AirlineModel>('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        await Airline.create(cbAirlines);

        await cbAirlines.remove();
        const find = await Airline.find();
        assert.strictEqual(find.length, 0);
        console.log(find);
        //assert.strictEqual(find.length, 0);
    });

    it('ottoman - should remove doc', async () => {
        const airlineSchema = new Schema(schema);
        const Airline = model('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);
        const option = {consistency: SearchConsistency.LOCAL};

        await Airline.remove(created.id);
        const find = await Airline.find({}, option);
        assert.strictEqual(find.rows.length, 0);
        console.log('aa', await Airline.find());
    });
})