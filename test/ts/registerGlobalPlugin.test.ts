import { assert } from 'chai';
import { Ottoman, registerGlobalPlugin, Schema, SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';

const pluginLog = (schema: any) => {
    schema.pre('save', function (doc: any) {
        console.log('[plugin] doc 1', doc);
        doc.plugin = 'registered from plugin!'
    });
};

const pluginLog2 = (schema: any) => {
    schema.pre('save', function (doc: any) {
        console.log('[plugin] doc 2', doc);
        doc.plugin = 'registered from plugin!'
    });
};

registerGlobalPlugin(...[pluginLog, pluginLog2]);

let ottoman: Ottoman;

const initOttoman = async (searchConsistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ scopeName: 'testScope123', collectionName: 'testCollection', searchConsistency });

    ottoman.connect({
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

describe('test manage bucket, scope and collection', async () => {
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
        assert.strictEqual(doc.plugin, 'registered from plugin!');
    });
});