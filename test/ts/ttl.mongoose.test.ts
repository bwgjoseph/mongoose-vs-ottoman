import assert from 'assert';
import { hawk } from './setup/fixtures';
import { getMongooseModel } from './setup/model';
import { assertAirline, removeDocuments } from './setup/util';

describe('test ttl function for mongoose', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should create new doc then by using ttl, delete the doc after 5 secs', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane({ ...hawk, createdAt: new Date('21 May 2021 11:30'), });

        const created = await Airplane.create(hawkAirplane);
        assertAirline(created, hawkAirplane);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 1);
        console.log(find);

        //find db again after 6 secs, gave 1 more sec as buffer
        await new Promise(resolve => setTimeout(resolve, 6000));
        console.log('wait for 6 sec');
        const findAfter5 = await Airplane.find({}).exec();
        assert.strictEqual(findAfter5.length, 0);
        console.log(findAfter5);
    }).timeout(10000);
})