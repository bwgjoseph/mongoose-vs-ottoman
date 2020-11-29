import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc, doc2, doc6 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';

describe('test $skip function', async () => {
    it('mongoose - simple skip should be able to work', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const mgAirlines = new Airline(doc2);
        const neAirlines = new Airline(doc6);
        await Airline.create(mgAirlines);
        await Airline.create(cbAirlines);
        await Airline.create(neAirlines);

        const result = await Airline.find({
            operational: true
        }).skip(1).exec();
        assert.ok(result.length === 2);
    });

    it('ottoman - simple skip should be able to work', async () => {
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
                skip: 1,
                consistency: SearchConsistency.LOCAL
            },
        );
        assert.ok(find.rows.length === 2);

        await removeDocuments();
    });
});