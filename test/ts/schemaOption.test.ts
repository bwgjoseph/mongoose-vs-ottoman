import assert from 'assert';
import { ValidationError } from 'ottoman';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test schema options', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - lowercase test', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        assert.strictEqual(hawk.email, 'Hawk@gmail.com');

        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.email, 'hawk@gmail.com');
        await Airplane.remove({}).exec();
    });

    it('ottoman - lowercase test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        assert.strictEqual(hawk.email, 'Hawk@gmail.com');

        //created
        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.email, 'hawk@gmail.com');

        //find
        const find = await Airplane.findById(created.id);
        assert.strictEqual(find.email, 'hawk@gmail.com');

        await removeDocuments();
    });

    it('mongoose - uppercase test', async () => {
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);
        assert.strictEqual(hawk.type, 'Economy');

        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.type, 'ECONOMY');
        await Airplane.remove({}).exec();
    });

    it('ottoman - uppercase test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        assert.strictEqual(hawk.type, 'Economy');

        //created
        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.type, 'ECONOMY');

        //find
        const find = await Airplane.findById(created.id);
        assert.strictEqual(find.type, 'ECONOMY');

        await removeDocuments();
    });

    it('ottoman - trim test', async () => {
        const Airplane = getOttomanModel();
        const eagleAirplane = new Airplane({ ...eagle, type: ' First Class '});

        const created = await Airplane.create(eagleAirplane);
        assert.strictEqual(created.type, 'FIRST CLASS');

        const find = await Airplane.findById(created.id);
        assert.strictEqual(find.type, 'FIRST CLASS');

        await removeDocuments();
    });

    it('ottoman - min/maxLength test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        try {
            await Airplane.create({ ...hawkAirplane, email: 'a' });
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.name, 'ValidationError');
                assert.strictEqual(error.message, `Property 'email' is shorter than the minimum allowed length '5'`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        try {
            const created = await Airplane.create(hawkAirplane);
            await Airplane.updateById(created.id, { email: 'a' })
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.name, 'ValidationError');
                assert.strictEqual(error.message, `Property 'email' is shorter than the minimum allowed length '5'`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        try {
            await Airplane.create({ ...hawkAirplane, email: 'morethan15characters' });
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.name, 'ValidationError');
                assert.strictEqual(error.message, `Property 'email' is longer than the maximum allowed length '15'`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        try {
            const created = await Airplane.create(hawkAirplane);
            await Airplane.updateById(created.id, { email: 'morethan15characters' })
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.name, 'ValidationError');
                assert.strictEqual(error.message, `Property 'email' is longer than the maximum allowed length '15'`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        await removeDocuments();
    });

    it('ottoman - min/max test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        try {
            await Airplane.create({ ...hawkAirplane, capacity: -1 });
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.name, 'ValidationError');
                assert.strictEqual(error.message, `Property 'capacity' is less than the minimum allowed value of '0'`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        try {
            const created = await Airplane.create(hawkAirplane);
            await Airplane.updateById(created.id, { capacity: -1 })
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.name, 'ValidationError');
                assert.strictEqual(error.message, `Property 'capacity' is less than the minimum allowed value of '0'`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        try {
            await Airplane.create({ ...hawkAirplane, capacity: 551 });
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.name, 'ValidationError');
                assert.strictEqual(error.message, `Property 'capacity' is more than the maximum allowed value of '550'`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        try {
            const created = await Airplane.create(hawkAirplane);
            await Airplane.updateById(created.id, { capacity: 551 })
        } catch (error) {
            if (error instanceof ValidationError) {
                assert.strictEqual(error.name, 'ValidationError');
                assert.strictEqual(error.message, `Property 'capacity' is more than the maximum allowed value of '550'`);
            } else {
                assert.fail('unexpected exception');
            }
        }

        await removeDocuments();
    });
})