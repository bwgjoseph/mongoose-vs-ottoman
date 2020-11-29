import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc4 } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { assertAirline, removeDocuments } from './setup/util';

describe('test enum function', async () => {
    it('mongoose - should create new doc', async () => {
        const Airline = getMongooseModel();
        const neAirlines = new Airline(doc4);

        const created = await Airline.create(neAirlines);
        assertAirline(created, neAirlines);

        const find = await Airline.find().exec();
        assert.strictEqual(find.length, 1);
    });

    it('ottoman - should create new doc', async () => {
        const Airline = getOttomanModel();
        const neAirlines = new Airline(doc4);

        const created = await Airline.create(neAirlines);
        assertAirline(created, neAirlines);

        const options = { consistency: SearchConsistency.LOCAL }
        const find = await Airline.find({}, options);
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].direction, 'A');

        await removeDocuments();
    });
})