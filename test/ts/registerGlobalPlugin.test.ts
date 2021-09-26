import { assert } from 'chai';
import { getModel, model, Ottoman, registerGlobalPlugin, Schema, SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';

const pluginLog = (pSchema: any) => {
    pSchema.pre('save', function (doc: any) {
        doc.operational = false;
    });
};

const pluginLog2 = (pSchema: any) => {
    pSchema.pre('save', function (doc: any) {
        doc.plugin = 'registered from plugin 2!'
    });
};

registerGlobalPlugin(pluginLog);
registerGlobalPlugin(pluginLog2);

let ottoman: Ottoman;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    operational: {
        type: Boolean,
        default: true
    },
    plugin: String,
})

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ consistency });

    await ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    await ottoman.start();

    model('myschema', schema, { idKey: '_id' });

    await removeDocuments();
}

/**
 * To run standalone
 * See #113
 */
describe.skip('test register global plugins', async () => {
    before(async () => {
        await initOttoman(SearchConsistency.LOCAL);
    });

    it('ottoman - should trigger pluginLog and pluginLog2', async () => {
        const MySchema = getModel('myschema');
        const schemaData = new MySchema({
            name: 'hello',
            operational: true,
        });

        const doc = await MySchema.create(schemaData);
        assert.strictEqual(doc.operational, false); // plugin
        assert.strictEqual(doc.plugin, 'registered from plugin 2!'); // plugin2
    });
});