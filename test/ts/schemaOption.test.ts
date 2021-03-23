import assert from 'assert';
import sizeof from 'object-sizeof';
import { eagle, hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

describe('test schema options', async () => {
    before(async () => {
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
        const eagleAirplane = new Airplane(eagle);
        assert.strictEqual(eagle.type, ' First class ');

        const created = await Airplane.create(eagleAirplane);
        assert.strictEqual(created.type, 'FIRST CLASS');
        const find = await Airplane.findById(created.id);
        assert.strictEqual(find.type, 'FIRST CLASS');

        await removeDocuments();
    });

    it('ottoman - min/maxLength test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        assert.ok(created.email, 'Within min/maxLength');
        assert.strictEqual(created.email, 'hawk@gmail.com');
        
        //string is within min/max length
        const find = await Airplane.findById(created.id);
        assert.strictEqual(find.email, 'hawk@gmail.com');
        assert.ok(find.email, 'Within min/maxLength');

        await removeDocuments();
    });

    it('ottoman - exceed maxLength test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane({ ...hawk, email: 'HAWK11111@gmail.com' });

        try {
            const created = await Airplane.create(hawkAirplane);
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
        }

        const eagleAirplane = new Airplane(eagle);
        const created2 = await Airplane.create(eagleAirplane);

        try {
            const update = await Airplane.updateById(created2.id, {email: 'HAWK11111@gmail.com'});
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
        }

        await removeDocuments();
    });

    it('ottoman - lesser than minLength test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane({ ...hawk, email: '123' });

        try {
            const created = await Airplane.create(hawkAirplane);
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
        }

        const eagleAirplane = new Airplane(eagle);
        const created2 = await Airplane.create(eagleAirplane);

        try {
            await Airplane.updateById(created2.id, {email: '123'});
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
        }
        await removeDocuments();
    });

    it('ottoman - min/max test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);
        const created = await Airplane.create(hawkAirplane);
        assert.ok(created.capacity, 'Within min/max');
        assert.strictEqual(created.capacity, 250);
        
        //string is within min/max length
        const find = await Airplane.findById(created.id);
        assert.strictEqual(find.capacity, 250);
        assert.ok(find.capacity, 'Within min/max');

        await removeDocuments();
    });

    it('ottoman - exceed max test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane({ ...hawk, capacity: 600 });

        try {
            const created = await Airplane.create(hawkAirplane);
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
        }

        const eagleAirplane = new Airplane(eagle);
        const created2 = await Airplane.create(eagleAirplane);

        try {
            const update = await Airplane.updateById(created2.id, {capacity: 600});
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
        }

        await removeDocuments();
    });

    it('ottoman - lesser than min test', async () => {
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane({ ...hawk, capacity: -1 });

        try {
            const created = await Airplane.create(hawkAirplane);
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
        }

        const eagleAirplane = new Airplane(eagle);
        const created2 = await Airplane.create(eagleAirplane);

        try {
            await Airplane.updateById(created2.id, {capacity: -1});
        } catch (error) {
            assert.strictEqual(error.name, 'ValidationError');
        }
        await removeDocuments();
    });
})