import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { eagle, falcon, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test $gt function', async () => {
    it('mongoose - simple $gt should be able to work', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const falconAirplane = new Airplane(falcon);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(falconAirplane);

        const find = await Airplane.find({
            capacity: {
                $gt: 499
            }
        }).exec();
        assert.strictEqual(find.length, 2);

        const find2 = await Airplane.find({
            scheduledAt: {
                $gt: new Date('1 Dec 2020 00:00')
            }
        }).exec();
        assert.strictEqual(find2.length, 2);

        await Airplane.remove({}).exec();
    });

    it('ottoman - simple $gt should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const falconAirplane = new Airplane(falcon);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(falconAirplane);

        const find =  await Airplane.find({
            capacity: {
                $gt: 100
            },
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find.rows.length, 3);

        const find2 =  await Airplane.find({
            scheduledAt: {
                $gt: new Date('1 Dec 2020 00:00')
            },
        },
        {
            consistency: SearchConsistency.LOCAL
        });

        assert.strictEqual(find2.rows.length, 2);

        await removeDocuments();
    });
})