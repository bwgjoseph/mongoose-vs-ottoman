import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test replaceById function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('ottoman - should replace doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        const findbefore = await Airplane.find({},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(findbefore.rows.length, 1);
        assert.strictEqual(findbefore.rows[0].callsign, 'Hawk');

        const change = await Airplane.replaceById(created.id,
            {
                callsign: 'abc',
                name: 'ABC Airlines',
                model: 'A380',
                location: {
                    type: 'Point',
                    coordinates: [
                        1.22,
                        2.33,
                        1.11
                    ]
                },
            },
        );
        assert.strictEqual(change.callsign, 'abc');
        assert.strictEqual(change.name, 'ABC Airlines');
        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows[0].callsign, change.callsign);
        assert.strictEqual(find.rows[0].name, change.name);

        await removeDocuments();
    });

    it('ottoman - should not replace doc as it is a partial and incomplete doc', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        const findbefore = await Airplane.find({},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(findbefore.rows.length, 1);
        assert.strictEqual(findbefore.rows[0].callsign, 'Hawk');

        try {
            await Airplane.replaceById(created.id,
                {
                    callsign: 'abc',
                },
            );
        } catch (error) {
            assert.strictEqual(error.message, 'Property name is required, Property model is required');
        }

        await removeDocuments();
    });

    it('ottoman - should not replace doc when id does not match', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        await Airplane.create(hawkAirplane);
        const findbefore = await Airplane.find({},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(findbefore.rows.length, 1);
        assert.strictEqual(findbefore.rows[0].callsign, 'Hawk');

        try {
            await Airplane.replaceById('nosuchid',
                {
                    callsign: 'abc',
                    name: 'ABC Airlines',
                    model: 'A380',
                    location: {
                        type: 'Point',
                        coordinates: [
                            1.22,
                            2.33,
                            1.11
                        ]
                    },
                    }
            );
        } catch (error) {
            assert.strictEqual(error.message, 'document not found');
        }

        await removeDocuments();
    });
})