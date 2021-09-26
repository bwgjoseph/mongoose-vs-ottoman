import assert from 'assert';
import { getDefaultInstance, SearchConsistency } from 'ottoman';
import { eagle, hawk, vulture } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';
import { QueryScanConsistency } from 'couchbase';

describe('test $limit function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - limit', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);

        const limitResult = await Airplane.find({
             operational: true
        }).limit(2).exec();
        assert.ok(limitResult.length === 2);

        await Airplane.remove({}).exec();
    });

    it('mongoose - limit 0', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);

        const limitResult = await Airplane.find({
             operational: true
        }).limit(0).exec();
        assert.ok(limitResult.length === 2);

        await Airplane.remove({}).exec();
    });

    it('mongoose - negative limit', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);

        // https://docs.mongodb.com/manual/reference/method/cursor.limit/#negative-values
        const limitResult = await Airplane.find({
             operational: true
        }).limit(-2).exec();
        assert.ok(limitResult.length === 2);

        await Airplane.remove({}).exec();
    });

    it('ottoman - limit', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);

        const find = await Airplane.find(
            {
                operational: true
            },
            {
                limit: 2,
                consistency: SearchConsistency.LOCAL
            },
        );
        assert.ok(find.rows.length === 2, 'expected to have 2 result, with limit');

        await removeDocuments();
    });

    it('ottoman - limit 0 (#80)', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);

        const find = await Airplane.find(
            {
                // operational: true
            },
            {
                limit: 0,
                consistency: SearchConsistency.LOCAL
            },
        );

        assert.ok(find.rows.length === 0, 'expected to have 0 result, with limit 0');

        // using query should also returns the same result
        const query = `
            SELECT * FROM \`testBucket\` LIMIT 0
            `;
        const queryFind = await getDefaultInstance().cluster.query(query, { scanConsistency: QueryScanConsistency.RequestPlus });

        assert.ok(queryFind.rows.length === 0, 'expected to have 0 result, with limit 0');

        await removeDocuments();
    });

    it('ottoman - negative limit (#91)', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(vultureAirplane);

        const f = await Airplane.find({}, { consistency: SearchConsistency.LOCAL });
        assert.ok(f.rows.length === 3);

        const find = await Airplane.find(
            {},
            {
                limit: -10,
                consistency: SearchConsistency.LOCAL
            },
        );

        assert.ok(find.rows.length === 0, 'expected to have 0 result, with limit -1');

        // using query should also returns the same result
        const query = `
            SELECT * FROM \`testBucket\` LIMIT -10
            `;
        const queryFind = await getDefaultInstance().cluster.query(query, { scanConsistency: QueryScanConsistency.RequestPlus });

        assert.ok(queryFind.rows.length === 0, 'expected to have 0 result, with limit -1');

        await removeDocuments();
    });
});