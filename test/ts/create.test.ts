import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { assertAirline, removeDocuments } from './setup/util';

describe('test create function', async () => {
    it('mongoose - should create new doc', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);

        const created = await Airline.create(cbAirlines);
        assertAirline(created, cbAirlines);

        const find = await Airline.find().exec();
        assert.strictEqual(find.length, 1);
    });

    it('ottoman - should create new doc', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);

        const created = await Airline.create(cbAirlines);
        assertAirline(created, cbAirlines);

        // Because not sure how to remove all docs before the test run,
        // there will always have multiple copies
        const options = { consistency: SearchConsistency.LOCAL }
        const find = await Airline.find({}, options);
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments(); 
    });
})