import mongoose, { Model } from 'mongoose';
import * as ottoman from 'ottoman';

interface AirlineInterface {
    callsign: string;
    country: string;
    name: string;
}

const schema = {
    callsign: String,
    country: String,
    name: String
};

type MongooseAirlineModel = AirlineInterface & mongoose.Document;

const mongooseAirlineSchema = new mongoose.Schema(schema);
const ottomanAirlineSchema = new ottoman.Schema(schema);

const initMongoose = async () => {
    mongoose.set('useFindAndModify', false);

    await mongoose.connect('mongodb://root:password@localhost:28017/test?authSource=admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4
    });

    await mongoose.connection.dropDatabase();
}

const initOttoman = async () => {
    ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    // how to drop the bucket/scope/collection?
    // how to remove all docs from a bucket/scope/collection?
    await ottoman.start();
}

const getMongooseModel = (): Model<MongooseAirlineModel> => mongoose.models.Airline || mongoose.model<MongooseAirlineModel>('Airline', mongooseAirlineSchema);
const getOttomanModel = () => ottoman.model('Airline', ottomanAirlineSchema);

before(async () => {
    await initMongoose();
    await initOttoman();
});

export {
    mongooseAirlineSchema,
    ottomanAirlineSchema,
    getMongooseModel,
    getOttomanModel
};
