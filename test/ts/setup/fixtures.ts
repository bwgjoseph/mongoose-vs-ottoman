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
//     location: {
//         type: 'Point',
//         coordinates: [
//             1.22,
//             2.33,
//             1.11
//         ]
//     }
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
    // location: {
    //     type: 'Point',
    //     coordinates: [
    //         1.346,
    //         2.847,
    //         2.560
    //     ]
    // }
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
    // location: {
    //     type: 'Point',
    //     coordinates: [
    //         1.00,
    //         2.77,
    //         1.99
    //     ]
    // }
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
    // location: {
    //     type: 'Point',
    //     coordinates: [
    //         1.3456,
    //         2.7889,
    //         1.2344
    //     ]
    // }
}

const vulture: AirplaneInterface = {
    callsign: 'Vulture',
    name: 'NE Airlines',
    operational: false,
    destination: ['India'],
    scheduledAt: new Date('1 May 2021 14:10'),
    capacity: 350,
    model: '737 NG',
    size: 'M',
    info: {
        firstFlightAt: new Date('20 May 2007 18:15'),
        numberOfFlightsSince: 15000
    },
    // location: {
    //     type: 'Point',
    //     coordinates: [
    //         1.000,
    //         2.000,
    //         1.000
    //     ]
    // }
}

export {
    hawk,
    eagle,
    falcon,
    sparrow,
    vulture
};
