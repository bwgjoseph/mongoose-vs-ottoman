import assert from 'assert';
import * as ottoman from 'ottoman';
import { SearchConsistency } from 'ottoman';
import { ModelMetadata } from 'ottoman/lib/types/model/interfaces/model-metadata.interface';
import { removeDocuments } from './setup/util';

describe('test keyGenerator function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('should be able to define custom key-generator', async () => {
        const keyGenerator = ({ metadata }: { metadata: ModelMetadata }) => `custom::${metadata.scopeName}--${metadata.collectionName}`;

        const schema = new ottoman.Schema({
            name: { type: String },
        });
        const generator = ottoman.model('Generator', schema, { keyGenerator });
        await generator.create(new generator({ name: 'a' }));

        const options = { select: ['meta().id', '*'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        assert.strictEqual(doc.rows.length, 1);

        const doc2 = await generator.findById(doc.rows[0].testBucket.id);
        assert.ok(doc2);
        assert.strictEqual(doc2.id, doc.rows[0].testBucket.id);
    });

    it('should be able to define custom key-generator with self-defined id', async () => {
        const keyGenerator = ({ metadata }: { metadata: ModelMetadata }) => `custom::${metadata.scopeName}--${metadata.collectionName}`;

        const schema = new ottoman.Schema({
            id: { type: String },
            name: { type: String },
        });
        const generator = ottoman.model('Generator1', schema, { keyGenerator });
        await generator.create(new generator({ id: '1', name: 'a' }));

        const options = { select: ['meta().id', '*'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        assert.strictEqual(doc.rows.length, 1);

        const doc2 = await generator.findById(doc.rows[0].testBucket.id);
        assert.ok(doc2);
        assert.strictEqual(doc2.id, doc.rows[0].testBucket.id);
    });

    it('should be able to define custom key-generator with idKey', async () => {
        const keyGenerator = ({ metadata }: { metadata: ModelMetadata }) => `custom::${metadata.scopeName}--${metadata.collectionName}`;

        const schema = new ottoman.Schema({
            id: { type: String },
            name: { type: String },
        });
        const generator = ottoman.model('Generator2', schema, { keyGenerator, idKey: 'hihi' });
        await generator.create(new generator({ id: '1', name: 'a' }));

        const options = { select: ['meta().id', '*'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        assert.strictEqual(doc.rows.length, 1);

        const doc2 = await generator.findById(doc.rows[0].testBucket.hihi);
        assert.ok(doc2);
        assert.strictEqual(doc2.hihi, doc.rows[0].testBucket.hihi);
    });

    it('should be able to define custom key-generator with idKey and default value', async () => {
        const random = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const keyGenerator = ({ metadata }: { metadata: ModelMetadata }) => `custom::${metadata.scopeName}--${metadata.collectionName}`;

        const once = random();
        const schema = new ottoman.Schema({
            id: { type: String, default: () => once },
            name: { type: String },
        });
        const generator = ottoman.model('Generator3', schema, { keyGenerator });
        await generator.create(new generator({ name: 'a' }));

        const options = { select: ['meta().id', '*'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        assert.strictEqual(doc.rows.length, 1);

        const doc2 = await generator.findById(once);
        assert.ok(doc2);
        assert.strictEqual(doc2.id, once);
    });
})