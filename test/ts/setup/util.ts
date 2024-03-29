import assert from 'assert';
import { QueryScanConsistency } from 'couchbase';
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
    try {
        await getDefaultInstance().cluster.query(query, { scanConsistency: QueryScanConsistency.RequestPlus });
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export { assertAirline, removeDocuments };
