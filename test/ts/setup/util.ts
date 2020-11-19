import assert from 'assert';
import { getDefaultConnection } from 'ottoman';

const assertAirline = (actual: any, expected: any) => {
    assert.strictEqual(actual.callsign, expected.callsign);
    assert.strictEqual(actual.country, expected.country);
    assert.strictEqual(actual.name, expected.name);
}

const removeDocuments = async () => {
    const query = `
    DELETE FROM \`testBucket\`
    `
    await getDefaultConnection().query(query);
}

export { assertAirline, removeDocuments };
