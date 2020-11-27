import mongoose, { Model } from 'mongoose';
import * as ottoman from 'ottoman';

interface AirlineInterface {
    callsign: string;
    country: string;
    name: string;
    hpnumber?: number;
    operational?: boolean;
    flyingTo?: [string];
    direction?: string;
    timeOfFlight?: Date;
    //a: object;
}

const schema = {
    callsign: {
        type: String,
        required: true,
    },
    country: String,
    name: String,
    hpnumber: {
        type: Number

    },
    operational: {
        type: Boolean,
        default: true
    },
    flyingTo: [String],
    direction: {
        type: String,
        enum: [
            'A',
            'B',
            'C',
        ],
        uppercase: true,
    },
    timeOfFlight: {
        type: Date,
    },
    // a: {
    //     type: Object,
    //     required: true,
    // }
};

const schemaRef = {
    nameRef: String,

}

type MongooseAirlineModel = AirlineInterface & mongoose.Document;

const mongooseAirlineSchema = new mongoose.Schema(schema);
const ottomanAirlineSchema = new ottoman.Schema(schema);
const ottomanRefSchema = new ottoman.Schema(schemaRef);

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

const getMongooseModel = () => mongoose.models.Airline || mongoose.model<MongooseAirlineModel>('Airline', mongooseAirlineSchema);
const getOttomanModel = () => ottoman.model('Airline', ottomanAirlineSchema);
const getOttomanModelRef = () => ottoman.model('ref', ottomanRefSchema);

before(async () => {
    await initMongoose();
    await initOttoman();
});

export {
    mongooseAirlineSchema,
    ottomanAirlineSchema,
    ottomanRefSchema,
    getMongooseModel,
    getOttomanModel,
    getOttomanModelRef
};
