import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { falcon, hawk, sparrow } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $sort function', async () => {
    it('mongoose - simple $sort should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const sparrowAirplane = new Airplane(sparrow);
        const falconAirplane = new Airplane(falcon);
        await Airplane.create(sparrowAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(falconAirplane);

        const find = await Airplane.find(
            {
                operational: true
            })
            .sort({ 'callsign': 1 })
            .exec();

        assert.strictEqual(find[0].callsign, "Falcon");
        assert.strictEqual(find[1].callsign, "Hawk");
        assert.strictEqual(find[2].callsign, "Sparrow");

        await Airplane.remove({}).exec();
    });

    it('ottoman - simple sort should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const falconAirplane = new Airplane(falcon);
        const sparrowAirplane = new Airplane(sparrow);
        await Airplane.create(falconAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(sparrowAirplane);

        const find = await Airplane.find(
            {
                operational: true
            },
            {
                sort: {
                    callsign: 'ASC'
                },
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].callsign, "Falcon");
        assert.strictEqual(find.rows[1].callsign, "Hawk");
        assert.strictEqual(find.rows[2].callsign, "Sparrow");

        await removeDocuments();
    });
});