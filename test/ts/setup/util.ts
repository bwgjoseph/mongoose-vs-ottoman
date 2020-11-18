import assert from 'assert';

const assertAirline = (actual: any, expected: any) => {
    assert.strictEqual(actual.callsign, expected.callsign);
    assert.strictEqual(actual.country, expected.country);
    assert.strictEqual(actual.name, expected.name);
}

export default assertAirline;
