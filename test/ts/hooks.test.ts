
import { getOttomanModel, mongooseAirplaneSchema, ottomanAirplaneSchema } from './setup/model';
import { removeDocuments } from './setup/util';
import assert from 'assert';
import { hawk } from './setup/fixtures';

describe('test hooks function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should show log before & after saving doc (pre & post hook)', async () => {
        const preHook = mongooseAirplaneSchema.pre("save", function() {
            console.log('from pre hook');
         });
         const postHook = mongooseAirplaneSchema.post("save", function() {
            console.log('from post hook');
         });

         const Airplane = getOttomanModel();
         const hawkAirplane = new Airplane(hawk);
 
         await Airplane.create(hawkAirplane);
         assert.ok(preHook);
         assert.ok(postHook);
    });

    it('ottoman - should show log before & after saving doc ( pre & post hook)', async () => {
        const preHook = ottomanAirplaneSchema.pre('save', function() {
            console.log('from pre hook');
        });
        const postHook = ottomanAirplaneSchema.post('save', function() {
            console.log('from post hook');
        });

        const Airplane = getOttomanModel();
        const hawkAirplane = new Airplane(hawk);

        await Airplane.create(hawkAirplane);
        assert.ok(preHook);
        assert.ok(postHook);
    });

    it('ottoman - should implement lowercase', async () => {
        // ottomanAirplaneSchema.pre('save', function uppercase(this: AirplaneInterface) {
        //    this.size = this.size.toUpperCase();
        // });

        const lowercase = ottomanAirplaneSchema.pre('save', async (document) => {
            document.size = document.size.toLowerCase();
            console.log(document.size);
         });

         const Airplane = getOttomanModel();
         const hawkAirplane = new Airplane(hawk);
 
         const created = await Airplane.create(hawkAirplane);
         assert.ok(lowercase);
    });

    it('ottoman - should implement uppercase', async () => {
        const uppercase = ottomanAirplaneSchema.pre('save', async (document) => {
            document.size = document.size.toUpperCase();
            console.log(document.size);
         });

         const Airplane = getOttomanModel();
         const hawkAirplane = new Airplane(hawk);
 
         const created = await Airplane.create(hawkAirplane);
         assert.ok(uppercase);
    });
})