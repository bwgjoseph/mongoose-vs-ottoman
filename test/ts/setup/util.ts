import assert from 'assert';
import { getDefaultInstance } from 'ottoman';

const assertAirline = (actual: any, expected: any) => {
    assert.strictEqual(actual.callsign, expected.callsign);
    assert.strictEqual(actual.country, expected.country);
    assert.strictEqual(actual.name, expected.name);
}

const removeDocuments = async () => {
    const query = `
    DELETE FROM \`testBucket\`
    `
    await getDefaultInstance().query(query);
}

export { assertAirline, removeDocuments };
