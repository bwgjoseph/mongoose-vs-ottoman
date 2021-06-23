import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { falcon, hawk, sparrow } from './setup/fixtures';
import { getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $isNull, $isNotNull function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('ottoman - $isNull', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane({ ...hawk, email: null });
        const falconAirplane = new Airplane(falcon);
        const sparrowAirplane = new Airplane(sparrow);
        await Airplane.create(falconAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(sparrowAirplane);

        const find = await Airplane.find(
        {
            email: { $isNull: true }
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].callsign, 'Hawk');
        assert.strictEqual(find.rows[0].capacity, 250);

        await removeDocuments();
    });

    it('ottoman - $isNotNull', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane({ ...hawk, email: null });
        const falconAirplane = new Airplane(falcon);
        const sparrowAirplane = new Airplane(sparrow);
        await Airplane.create(falconAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(sparrowAirplane);

        const find = await Airplane.find(
        {
            email: { $isNotNull: true }
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        assert.strictEqual(find.rows.length, 2);

        await removeDocuments();
    });
});