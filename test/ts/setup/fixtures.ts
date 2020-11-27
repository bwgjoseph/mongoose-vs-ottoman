const doc = {
    callsign: 'Couchbase',
    country: 'United State',
    name: 'Couchbase Airlines',
    hpnumber: 1234,
    flyingTo: ['Japan', 'Indonesia', 'Korea', 'China', 'Japan'],
    timeOfFlight: Date.now(),
    // data: Buffer.from('a'),
    //a: {"name": "Joe", "rank": "Sergeant", "gender": "M", "StaffID": 12344}
};

const doc2 = {
    callsign: 'Mongo',
    country: 'Singapore',
    name: 'Mongo Airlines',
    hpnumber: 5678,
    flyingTo: ['Thailand', 'UK', 'USA', 'Malaysia', 'Japan', 'Japan'],
    timeOfFlight: new Date('20 Dec 2020 00:00')

};

const doc3 = {
    callsign: 'SQL',
    country: 'Australia',
    name: 'SQL Airlines',
    hpnumber: 9999,
    operational: false,
    flyingTo: [],
    timeOfFlight: new Date('10 Jan 2015 14:30'),
};

const doc4 = {
    callsign: 'NE',
    country: 'Japan',
    name: 'NE Airlines',
    hpnumber: 1234,
    flyingTo: ['Japan', 'Indonesia', 'Korea', 'China', 'Japan'],
    direction: 'a',
    timeOfFlight: Date.now()
};

const doc5 = {
    name1: 'Hi',
}

const doc6 = {
    callsign: 'NE',
    country: 'Japan',
    name: 'NE Airlines',
    hpnumber: 1234,
    flyingTo: ['Japan', 'Indonesia', 'Korea', 'China', 'Japan'],
    direction: 'A',
    timeOfFlight: Date.now()
};

export { 
    doc, 
    doc2,
    doc3,
    doc4,
    doc5,
    doc6
};
