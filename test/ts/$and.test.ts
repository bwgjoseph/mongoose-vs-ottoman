import assert from 'assert';
import mongoose from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';

interface AirlineInterface {
    callsign: string;
    country: string;
    name: string;
}

type AirlineModel = AirlineInterface & mongoose.Document;


describe('test $and function', async () => {
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

    it('mongoose - simple $and should be able to work. There should be no findings as no data has callsign Mongo & Malaysia', async () => {
        const airlineSchema = new mongoose.Schema(schema)
        const Airline = mongoose.model<AirlineModel>('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        const find = await Airline.find({
            $and: [
                {
                    callsign: 'Mongo'
                },
                {
                    country: 'Malaysia'
                }
            ]
        }).exec();
        assert.strictEqual(find.length, 0);
        console.log(find);
    });

    it('ottoman - simple $and should be able to work', async () => {
        const airlineSchema = new Schema(schema)
        const Airline = model('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const created1 = await Airline.create(mgAirlines);
        const created2 = await Airline.create(cbAirlines);

        const options = { consistency: SearchConsistency.LOCAL }
        const find = await Airline.find({
            $and: [
                {
                    callsign: 'Mongo'
                },
                {
                    country: 'Singapore'
                }
            ]
        }, options);

        const find2 = await Airline.find({
            callsign: 'Mongo',
            country: 'Singapore'
        }, options)

        console.log(1,find);
        console.log(2,find2);

        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find2.rows.length, 1);

        await Airline.remove(created1.id);
        await Airline.remove(created2.id);
    });
});