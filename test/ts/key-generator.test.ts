import assert from 'assert';
import * as ottoman from 'ottoman';
import { SearchConsistency } from 'ottoman';
import { ModelMetadata } from 'ottoman/lib/types/model/interfaces/model-metadata.interface';
import { removeDocuments } from './setup/util';

describe('test keyGenerator function', async () => {
    it('should generator custom key', async () => {
        const keyGenerator = ({ metadata, id }: {
            metadata: ModelMetadata;
            id: any;
        }) => `gen::${metadata.scopeName}--${metadata.collectionName}::${id}`;
        const idKey = 'customGKey';
        const schema = new ottoman.Schema({
            id: { type: String, default: () => 'mycustom::id' }});
        const generator = ottoman.model('DummyDate', schema, { keyGenerator, idKey });
        await generator.create();
        const options = { select: ['meta().id', 'customGKey'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        assert.strictEqual(doc.rows.length, 1);
        assert.ok(Object.keys(doc.rows[0]).includes(idKey));
        assert.ok(Object.keys(doc.rows[0].id === `gen::_default--DummyDate::${doc.id}`));

        await removeDocuments();
    });
})