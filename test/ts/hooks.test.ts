
import { getMongooseHookModel, getOttomanHookModel, mongooseAirplaneHookSchema, ottomanAirplaneHookSchema } from './setup/model';
import { removeDocuments } from './setup/util';
import assert from 'assert';
import { hawk } from './setup/fixtures';

describe('test hooks function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should test pre and post save hook', async () => {
        mongooseAirplaneHookSchema.pre('save', function() {
            assert.strictEqual((this as any).callsign, 'Hawk');
        });
        mongooseAirplaneHookSchema.post('save', function() {
            (this as any).callsign = 'postHawk';
        });

        const Airplane = getMongooseHookModel();
        const hawkAirplane = new Airplane(hawk);

        const result = await Airplane.create(hawkAirplane);
        assert.strictEqual(result.callsign, 'postHawk');
    });

    it('ottoman - should test pre and post save hook', async () => {
        ottomanAirplaneHookSchema.pre('save', function(doc) {
            assert.strictEqual(doc.callsign, 'Hawk');
        });
        ottomanAirplaneHookSchema.post('save', function(doc) {
            doc.callsign = 'postHawk';
        });

        const Airplane = getOttomanHookModel();
        const hawkAirplane = new Airplane(hawk);

        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.callsign, 'postHawk');
    });

    it('ottoman - should convert doc name to lowercase in pre save hook', async () => {
        ottomanAirplaneHookSchema.pre('save', async (doc) => {
            assert.strictEqual(doc.name, 'Couchbase Airlines');
            doc.name = doc.name.toLowerCase();
        });

        const Airplane = getOttomanHookModel();
        const hawkAirplane = new Airplane(hawk);

        const created = await Airplane.create(hawkAirplane);
        assert.strictEqual(created.name, 'couchbase airlines');
    });
})