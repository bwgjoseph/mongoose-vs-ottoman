import { assert } from 'chai';
import { Ottoman, registerGlobalPlugin, Schema, SearchConsistency } from 'ottoman';
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

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ scopeName: 'testScope123', collectionName: 'testCollection', consistency });

    await ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    await ottoman.start();

    await removeDocuments();
}

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

/**
 * To run standalone
 * [23/8] not working - timeout - beta.3
 */
describe.skip('test manage bucket, scope and collection', async () => {
    before(async () => {
        await initOttoman(SearchConsistency.LOCAL);
    });

    it('ottoman - should create scope and collection', async () => {
        const MySchema = ottoman.model('myschema', schema, { idKey: '_id' });
        const schemaData = new MySchema({
            name: 'hello',
            operational: true,
        });

        const doc = await MySchema.create(schemaData);
        assert.strictEqual(doc.plugin, 'registered from plugin 2!');
    });
});