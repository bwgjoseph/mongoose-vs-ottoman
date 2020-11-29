import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc, doc2, doc6 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';

describe('test $sort function', async () => {
    it('mongoose - simple $sort should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const neAirlines = new Airline(doc6);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);
        await Airline.create(neAirlines);

        const find = await Airline.find(
            {
                operational: true
            })
            .sort({ 'name': 1 })
            .exec();

        assert.strictEqual(find[0].name, "Couchbase Airlines");
        assert.strictEqual(find[1].name, "Mongo Airlines");
        assert.strictEqual(find[2].name, "NE Airlines");
    });

    it('ottoman - simple sort should be able to work', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const neAirlines = new Airline(doc6);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);
        await Airline.create(neAirlines);

        const find = await Airline.find(
            {
                operational: true
            },
            {
                sort: {
                    name: 'ASC'
                },
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].name, "Couchbase Airlines");
        assert.strictEqual(find.rows[1].name, "Mongo Airlines");
        assert.strictEqual(find.rows[2].name, "NE Airlines");

        await removeDocuments();
    });
});