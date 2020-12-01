import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk, eagle } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $and function', async () => {
    it('mongoose - simple $and should be able to work. There should be no findings as no data has callsign Hawk & name Emirates Airline', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);

        const find = await Airplane.find({
            $and: [
                {
                    callsign: 'Hawk'
                },
                {
                    name: 'Emirates Airlines'
                }
            ]
        }).exec();
        assert.strictEqual(find.length, 0);
    });

    it('ottoman - simple $and should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);

        const find = await Airplane.find({
            $and: [
                {
                    callsign: 'Hawk'
                },
                {
                    name: 'Emirates Airlines'
                }
            ]
        }, 
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find.rows.length, 0);

        const find2 = await Airplane.find({
            $and: [
                {
                    callsign: 'Hawk'
                },
                {
                    name: 'Couchbase Airlines'
                }
            ]
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find2.rows.length, 1);
        assert.strictEqual(find2.rows[0].callsign, "Hawk");
        assert.strictEqual(find2.rows[0].name, "Couchbase Airlines");

        const find3 = await Airplane.find({
            callsign: 'Hawk',
            name: 'Couchbase Airlines'
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find3.rows.length, 1);
        assert.strictEqual(find3.rows[0].callsign, "Hawk");
        assert.strictEqual(find3.rows[0].name, "Couchbase Airlines");

        await removeDocuments();

    });
});