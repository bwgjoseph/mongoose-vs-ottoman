import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { eagle, falcon, hawk, vulture } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test nested queries function', async () => {
    it('mongoose - simple nested queries should be able to work.', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const falconAirplane = new Airplane(falcon);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(hawkAirplane);
        await Airplane.create(eagleAirplane);
        await Airplane.create(falconAirplane);
        await Airplane.create(vultureAirplane);

        const find = await Airplane.find({
            $and: [
                {
                    name : {
                        $eq : 'Couchbase Airlines'
                    }
                },
                {
                    operational : {
                        $eq : true
                    }
                }
            ]
        }).exec();
        assert.strictEqual(find.length, 2);

        const find2 = await Airplane.find({
            $and: [
                {
                    name : {
                        $ne : 'Couchbase Airlines'
                    }
                },
                {
                    operational : {
                        $ne : true
                    }
                }
            ]
        }).exec();
        assert.strictEqual(find2.length, 1);

        const find3 = await Airplane.find({
            $or: [
                {
                    name : {
                        $eq : 'Couchbase Airlines'
                    }
                },
                {
                    operational : {
                        $eq : true
                    }
                }
            ]
        }).exec();
        assert.strictEqual(find3.length, 3);

        const find4 = await Airplane.find({
            $or: [
                {
                    name : {
                        $ne : 'Couchbase Airlines'
                    }
                },
                {
                    operational : {
                        $ne : true
                    }
                }
            ]
        }).exec();
        assert.strictEqual(find4.length, 2);
        await Airplane.remove({});
    });

    it('ottoman - simple nested queries should be able to work', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const eagleAirplane = new Airplane(eagle);
        const falconAirplane = new Airplane(falcon);
        const vultureAirplane = new Airplane(vulture);
        await Airplane.create(eagleAirplane);
        await Airplane.create(hawkAirplane);
        await Airplane.create(falconAirplane);
        await Airplane.create(vultureAirplane);

        const find = await Airplane.find({
            $and: [
                {
                    name : {
                        $eq : 'Couchbase Airlines'
                    }
                },
                {
                    operational : {
                        $eq : true
                    }
                }
            ]
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find.rows.length, 2);

        const find2 = await Airplane.find({
            $and: [
                {
                    name : {
                        $neq : 'Couchbase Airlines'
                    }
                },
                {
                    operational : {
                        $neq : true
                    }
                }
            ]
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find2.rows.length, 1);

        const find3 = await Airplane.find({
            $or: [
                {
                    name : {
                        $eq : 'Couchbase Airlines'
                    }
                },
                {
                    operational : {
                        $eq : true
                    }
                }
            ]
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find3.rows.length, 3);

        const find4 = await Airplane.find({
            $or: [
                {
                    name : {
                        $neq : 'Couchbase Airlines'
                    }
                },
                {
                    operational : {
                        $neq : true
                    }
                }
            ]
        },
        {
            consistency: SearchConsistency.LOCAL
        });
        assert.strictEqual(find4.rows.length, 2);

        await removeDocuments();

    });
});