import assert from 'assert';
import { getDefaultInstance } from 'ottoman';

const assertAirline = (actual: any, expected: any) => {
    assert.strictEqual(actual.callsign, expected.callsign);
    assert.strictEqual(actual.country, expected.country);
    assert.strictEqual(actual.name, expected.name);
}

const removeDocuments = async () => {
    // console.log(getDefaultInstance().models);
    // console.log(getOttomanIntances());

    const query = `
    DELETE FROM \`testBucket\`
    `
    try {
        await getDefaultInstance().cluster.query(query, { scanConsistency: 'request_plus' });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export { assertAirline, removeDocuments };
