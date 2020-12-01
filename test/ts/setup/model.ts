import mongoose from 'mongoose';
import * as ottoman from 'ottoman';
import { initMongoose, initOttoman } from './global.setup';

// type Position = [lon: number, lat: number, alt: number];

interface Location {
    type: 'Point',
    coordinates: Position,
}

interface AirplaneInfo {
    firstFlightAt: Date;
    numberOfFlightsSince: number;
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
    // location: Location; // test geo-spatial query
    // additional
    // test buffer, mixed type
}

const airplaneInfoSchema = {
    firstFlightAt: Date,
    numberOfFlightsSince: Number,
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
}

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
    info: airplaneInfoSchema,
    // location: locationSchema,
}

type MongooseAirplaneModel = AirplaneInterface & mongoose.Document;

const mongooseAirplaneSchema = new mongoose.Schema(airplaneSchema);
const ottomanAirplaneSchema = new ottoman.Schema(airplaneSchema);

const getMongooseModel = () => mongoose.models.Airplane || mongoose.model<MongooseAirplaneModel>('Airplane', mongooseAirplaneSchema);
const getOttomanModel = () => ottoman.model('Airplane', ottomanAirplaneSchema);

before(async () => {
    await initMongoose();
    await initOttoman();
});

export {
    AirplaneInterface,
    mongooseAirplaneSchema,
    ottomanAirplaneSchema,
    getMongooseModel,
    getOttomanModel,
};