const doc = {
    callsign: 'Couchbase',
    country: 'United State',
    name: 'Couchbase Airlines',
    hpnumber: 1234,
    operational: true,
    flyingTo: ['Japan', 'Indonesia', 'Korea', 'China', 'Japan'],
    timeOfFlight: Date.now()
};

const doc2 = {
    callsign: 'Mongo',
    country: 'Singapore',
    name: 'Mongo Airlines',
    hpnumber: 5678,
    operational: true,
    flyingTo: ['Thailand', 'UK', 'USA', 'Malaysia', 'Japan', 'Japan']
};

const doc3 = {
    callsign: 'SQL',
    country: 'Australia',
    name: 'SQL Airlines',
    hpnumber: 9999,
    operational: false,
    flyingTo: []
};

const doc4 = {
    callsign: 'Couchbase',
    country: 'United State',
    name: 'Couchbase Airlines',
    hpnumber: 1234,
    operational: true,
    flyingTo: ['Japan', 'Indonesia', 'Korea', 'China', 'Japan'],
    direction: 'A',
    timeOfFlight: Date.now()
};

export { 
    doc, 
    doc2,
    doc3,
    doc4
};
