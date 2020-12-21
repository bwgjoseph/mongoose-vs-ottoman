import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $or function', async () => {
    it('mongoose - simple $or should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);

        //results should show 2 data set
        const find = await Airplane.find({
            $or: [
                {
                    callsign: 'Hawk'
                },
                {
                    callsign: 'Eagle'
                }
            ]
        }).exec();
        assert.strictEqual(find.length, 2);

        //results should show nothing
        const find2 = await Airplane.find({
            $or: [
                {
                    callsign: 'Howk'
                },
                {
                    callsign: 'Egle'
                }
            ]
        }).exec();
        assert.strictEqual(find2.length, 0);
    });

    it('ottoman - simple $or should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        const options = { consistency: SearchConsistency.LOCAL }

        //results should show 2 data set
        const find = await Airplane.find({
            $or: [
                {
                    callsign: 'Hawk'
                },
                {
                    callsign: 'Eagle'
                }
            ]
        }, options);
        assert.strictEqual(find.rows.length, 2);

        //results should show nothing
        const find2 = await Airplane.find({
            $or: [
                {
                    callsign: 'Howk'
                },
                {
                    callsign: 'Egle'
                }
            ]
        }, options);
        assert.strictEqual(find2.rows.length, 0);

        await removeDocuments();
    });
});