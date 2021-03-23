import { AirplaneInterface } from "./model";

const hawk: AirplaneInterface = {
    callsign: 'Hawk',
    name: 'Couchbase Airlines',
    operational: true,
    destination: ['Japan'],
    scheduledAt: new Date('20 Nov 2020 11:30'),
    capacity: 250,
    model: 'A380',
    size: 'S',
    info: {
        firstFlightAt: new Date('12 Jan 2010 13:10'),
        numberOfFlightsSince: 10000,
        callsign: 'Hawk2',
    },
    location: {
        type: 'Point',
        coordinates: [
            1.22,
            2.33,
            1.11
        ]
    },
    type: 'Economy',
    extension: 'abc',
    email: 'Hawk@gmail.com',
}

const eagle: AirplaneInterface = {
    callsign: 'Eagle',
    name: 'Couchbase Airlines',
    operational: true,
    destination: ['United States'],
    scheduledAt: new Date('20 Dec 2020 00:30'),
    capacity: 500,
    model: '767-300F',
    size: 'L',
    info: {
        firstFlightAt: new Date('02 Dec 16 12:00'),
        numberOfFlightsSince: 4500
    },
    location: {
        type: 'Point',
        coordinates: [
            1.346,
            2.847,
            2.560
        ]
    },
    type: 'First class',
    extension: 123,
    email: 'Eagle@gmail.com',
}

const falcon: AirplaneInterface = {
    callsign: 'Falcon',
    name: 'Mongo Airlines',
    operational: true,
    destination: ['Norway'],
    scheduledAt: new Date('26 Dec 2020 03:25'),
    capacity: 550,
    model: '767-300F',
    size: 'L',
    info: {
        firstFlightAt: new Date('20 Feb 2019 10:00'),
        numberOfFlightsSince: 2000
    },
    location: {
        type: 'Point',
        coordinates: [
            1.00,
            2.77,
            1.99
        ]
    },
    type: 'First class',
    extension: true,
    email: 'Falcon@gmail.com',
}

const sparrow: AirplaneInterface = {
    callsign: 'Sparrow',
    name: 'Mongo Airlines',
    operational: true,
    destination: ['Thailand'],
    scheduledAt: new Date('1 Dec 2020 11:25'),
    capacity: 270,
    model: 'A380',
    size: 'S',
    info: {
        firstFlightAt: new Date('20 May 2017 10:00'),
        numberOfFlightsSince: 3750
    },
    location: {
        type: 'Point',
        coordinates: [
            1.3456,
            2.7889,
            1.2344
        ]
    },
    type: 'Economy',
    extension: new Date(),
    email: 'Sparrow@gmail.com',
}

const vulture: AirplaneInterface = {
    callsign: 'Vulture',
    name: 'NE Airlines',
    operational: false,
    destination: ['India'],
    scheduledAt: new Date('1 May 2021 14:10'),
    capacity: 325,
    model: '737 NG',
    size: 'M',
    info: {
        firstFlightAt: new Date('20 May 2007 06:15'),
        numberOfFlightsSince: 15000
    },
    location: {
        type: 'Point',
        coordinates: [
            1.000,
            2.000,
            1.000
        ]
    },
    type: 'Private',
    extension: ['32da'],
    email: 'Vulture@gmail.com',
}

const bird: AirplaneInterface = {
    callsign: 'Bird',
    name: 'Bird Airlines',
    operational: true,
    destination: ['Taiwan'],
    scheduledAt: new Date('2 Jan 2021 00:30'),
    capacity: 500,
    model: '767-300F',
    size: 'L',
    info: {
        firstFlightAt: new Date('02 Aug 19 12:00'),
        numberOfFlightsSince: 1500
    },
    location: {
        type: 'Point',
        coordinates: [
            1.88,
            2.22,
            1.22,
        ]
    },
    type: 'First class',
    extension: [
        {
            external: 'field',
            isNumber: true,
        },
    ],
    email: 'Bird@gmail.com',
}

export {
    hawk,
    eagle,
    falcon,
    sparrow,
    vulture,
    bird,
};
