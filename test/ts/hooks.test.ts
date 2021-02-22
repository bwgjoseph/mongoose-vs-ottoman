import assert from 'assert';
import { SearchConsistency } from 'ottoman';
import { hawk } from './setup/fixtures';
import { getMongooseModel, getOttomanModel, mongooseAirplaneSchema, ottomanAirplaneSchema } from './setup/model';
import { assertAirline, removeDocuments } from './setup/util';

describe.only('test hooks function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should show log before & after saving doc (pre & post hook)', async () => {
        mongooseAirplaneSchema.pre("save", function() {
            console.log('from pre hook');
         });
         mongooseAirplaneSchema.post("save", function() {
            console.log('from post hook');
         });
        const Airplane = getMongooseModel();
        const hawkAirplane = new Airplane(hawk);

        const created = await Airplane.create(hawkAirplane);
        assertAirline(created, hawkAirplane);


        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 1);

        await Airplane.remove({}).exec();
    });

    it('ottoman - should show log before & after saving doc ( pre & post hook)', async () => {
        ottomanAirplaneSchema.pre('save', function() {
            console.log('from pre hook');
        });
        ottomanAirplaneSchema.post('save', function() {
            console.log('from post hook');
        });
        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);


        const created = await Airplane.create(hawkAirplane);
        assertAirline(created, hawkAirplane);
        const find = await Airplane.find(
            {},
            {
                consistency: SearchConsistency.LOCAL
            });
        assert.strictEqual(find.rows.length, 1);

        await removeDocuments();
    });
})