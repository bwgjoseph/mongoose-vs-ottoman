import assert from 'assert';
import { hawk } from './setup/fixtures';
import { getMongooseModel } from './setup/model';
import { assertAirline, removeDocuments } from './setup/util';
import sinon from 'sinon';

describe('test ttl function for mongoose', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should create new doc then by using ttl, delete the doc after 5 secs', async () => {
        const date = new Date();
        const timeToExpire = 5000; // ms
        const clock = sinon.useFakeTimers(date);
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane({ ...hawk, expiresAt: new Date(+date + timeToExpire) });

        const created = await Airplane.create(hawkAirplane);
        assertAirline(created, hawkAirplane);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 1);

        // the clock did jump but seem to have no effect on the database time though
        console.log('before tick', new Date(clock.now));
        clock.tick(100 * 10 * 1000);
        console.log('after tick', new Date(clock.now));

        // this would definitely work but we need to increase the test timeout to 60000
        // See https://github.com/bwgjoseph/mongoose-vs-ottoman/issues/89 on how
        // this test should be written
        // await new Promise(resolve => setTimeout(resolve, 60000));

        const findAfter5 = await Airplane.find({}).exec();
        assert.strictEqual(findAfter5.length, 0);

        clock.restore();
    });
})