import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { doc } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/global.setup';
import { removeDocuments } from './setup/util';

describe('test delete function', async () => {
    it('mongoose - should remove doc', async () => {
        const Airline = getMongooseModel();
        const cbAirlines = new Airline(doc);
        await Airline.create(cbAirlines);

        await cbAirlines.remove();
        const find = await Airline.find().exec();
        assert.strictEqual(find.length, 0);
    });

    it('ottoman - should remove doc', async () => {
        const Airline = getOttomanModel();
        const cbAirlines = new Airline(doc);
        const created = await Airline.create(cbAirlines);
        const option = {consistency: SearchConsistency.LOCAL};

        await Airline.remove(created.id);
        const find = await Airline.find({}, option);
        assert.strictEqual(find.rows.length, 0);
        console.log('aa', await Airline.find());

        await removeDocuments(); 
    });
})