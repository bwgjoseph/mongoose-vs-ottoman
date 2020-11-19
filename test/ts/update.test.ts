import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';

describe('test update function', async () => {
    it('mongoose - should patch doc', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);

        cbAirlines.callsign = 'aab';
        await Airline.updateOne({ _id: cbAirlines._id }, cbAirlines).exec();
        console.log(await Airline.find().exec());
        assert.strictEqual(created.callsign, cbAirlines.callsign);
    });

    it('ottoman - should update doc', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);
        const options = { consistency: SearchConsistency.LOCAL }

        const change = await Airline.update({ callsign: 'abc' }, created.id);
        const find = await Airline.find({}, options);
        console.log(find);
        assert.strictEqual(find.rows[0].callsign, change.callsign);

        await removeDocuments();  
    });
})