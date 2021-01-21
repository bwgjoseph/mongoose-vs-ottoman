import mongoose from 'mongoose';
import * as ottoman from 'ottoman';
import { initMongoose, initOttoman } from './global.setup';

type Position = [lon: number, lat: number, alt?: number];

interface Location {
    type: 'Point',
    coordinates: Position,
}

interface AirplaneInfo {
    firstFlightAt: Date;
    numberOfFlightsSince: number;
    callsign?: string;
}

interface AirplaneInterface {
    callsign: string;
    name: string; // test $eq, $neq
    operational: boolean;
    destination: [string]; // test $in, $nin
    scheduledAt: Date; // test $gt, $lt, $btw
    capacity: number; // test $gt, $lt, $btw
    model: 'A380' | '737 NG' | '767-300F'; // test enum
    size: string; // test enum [s, m, l], test uppercase
    info: AirplaneInfo; // test nested object query
    location: Location; // test geo-spatial query
    extension: unknown; // test MixedType
}

const airplaneInfoSchema = {
    firstFlightAt: Date,
    numberOfFlightsSince: Number,
    callsign: String,
}

const locationSchema = {
    type: {
        type: String,
        required: true,
        enum: ['Point'],
    },
    coordinates: {
        type: [Number],
        required: true,
    }
};

const airplaneSchema = {
    callsign: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    operational: {
        type: Boolean,
        default: true
    },
    destination: [String],
    scheduledAt: Date,
    capacity: {
        type: Number,
        min: 0,
        default: 0,
    },
    model: {
        type: String,
        enum: [
            'A380',
            '737 NG',
            '767-300F',
        ],
        required: true,
    },
    size: {
        type: String,
        enum: [
            'S',
            'M',
            'L',
        ],
        uppercase: true,
    },
    info: airplaneInfoSchema
}

type MongooseAirplaneModel = AirplaneInterface & mongoose.Document;

const mongooseAirplaneSchema = new mongoose.Schema({ ...airplaneSchema, location: new mongoose.Schema(locationSchema), extension: mongoose.SchemaTypes.Mixed });
const mongooseAirplaneNonStrictSchema = new mongoose.Schema({ ...airplaneSchema, location: new mongoose.Schema(locationSchema), extension: mongoose.SchemaTypes.Mixed }, { strict: false });
const ottomanAirplaneSchema = new ottoman.Schema({ ...airplaneSchema, location: new ottoman.Schema(locationSchema), extension: ottoman.Schema.Types.Mixed });
const ottomanAirplaneNonStrictSchema = new ottoman.Schema({ ...airplaneSchema, location: new ottoman.Schema(locationSchema), extension: ottoman.Schema.Types.Mixed }, { strict: false });

const getMongooseModel = () => mongoose.models.Airplane || mongoose.model<MongooseAirplaneModel>('Airplane', mongooseAirplaneSchema);
const getMongooseNonStrictModel = () => mongoose.models.AirplaneNonStrict || mongoose.model<MongooseAirplaneModel>('AirplaneNonStrict', mongooseAirplaneNonStrictSchema);
const getOttomanModel = () => ottoman.getModel('Airplane') || ottoman.model('Airplane', ottomanAirplaneSchema);
const getOttomanNonStrictModel = () => ottoman.getModel('AirplaneNonStrict') || ottoman.model('AirplaneNonStrict', ottomanAirplaneNonStrictSchema);

before(async () => {
    await initMongoose();
    await initOttoman();
});

export {
    AirplaneInterface,
    mongooseAirplaneSchema,
    mongooseAirplaneNonStrictSchema,
    ottomanAirplaneSchema,
    ottomanAirplaneNonStrictSchema,
    getMongooseModel,
    getMongooseNonStrictModel,
    getOttomanModel,
    getOttomanNonStrictModel,
};
