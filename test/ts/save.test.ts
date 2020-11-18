import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import doc from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';

describe.only('test save function', async () => {
    it('mongoose - should save doc', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);

        created.callsign = "Hello";
        await created.save();
        const find = await Airline.find(cbAirlines).exec();
        assert.strictEqual(find[0].callsign, created.callsign);
    })

    it('ottoman - should save doc', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);
        const options = { consistency: SearchConsistency.LOCAL }

        created.callsign = "Hi";
        await created.save();

        const find = await Airline.find({}, options);
        assert.strictEqual(find.rows[0].callsign, created.callsign);

        await Airline.remove(created.id);
    })
})