import assert from 'assert';
import mongoose from 'mongoose';
import { connect, model, Schema, SearchConsistency, start } from 'ottoman';

interface AirlineInterface {
    id: string,
    callsign: string;
    country: string;
    name: string;
    hpnumber: number;
}

type AirlineModel = AirlineInterface & mongoose.Document;

describe('test $or function', async () => {
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
        hpnumber: 123
    };

    const doc2 = {
        callsign: 'Mongo',
        country: 'Singapore',
        name: 'Mongo Airlines',
        hpnumber: 456
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

    it('mongoose - simple $or should be able to work', async () => {
        const airlineSchema = new mongoose.Schema(schema)
        const Airline = mongoose.model<AirlineModel>('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);

        //results should show 2 data set
        const find = await Airline.find({
            $or: [
                {
                    callsign: 'Couchbase'
                },
                {
                    callsign: 'Mongo'
                }
            ]
        }).exec();

        //results should show nothing
        const find2 = await Airline.find({
            $or: [
                {
                    callsign: 'Airbase'
                },
                {
                    callsign: 'Mango'
                }
            ]
        }).exec();
        console.log(find);
        assert.strictEqual(find.length, 2);
        assert.strictEqual(find2.length, 0);

    });

    it('ottoman - simple $or should be able to work', async () => {
        const airlineSchema = new Schema(schema)
        const Airline = model('Airline', airlineSchema);
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const created1 = await Airline.create(mgAirlines);
        const created2 = await Airline.create(cbAirlines);
        const options = { consistency: SearchConsistency.LOCAL }

        //results should show 2 data set
        const find = await Airline.find({
            $or: [
                {
                    callsign: 'Couchbase'
                },
                {
                    callsign: 'Mongo'
                }
            ]
        }, options);

        //results should show nothing
        const find2 = await Airline.find({
            $or: [
                {
                    callsign: 'Airbase'
                },
                {
                    callsign: 'Mango'
                }
            ]
        }, options);
        console.log(find);
        assert.strictEqual(find.rows.length, 2);
        assert.strictEqual(find2.rows.length, 0);


        await Airline.remove(created1.id);
        await Airline.remove(created2.id);
    });
});