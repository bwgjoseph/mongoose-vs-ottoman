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
        await generator.create(new generator({}));
        const options = { select: ['meta().id', 'customGKey'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        assert.strictEqual(doc.rows.length, 1);
        assert.ok(Object.keys(doc.rows[0]).includes(idKey));
        assert.ok(Object.keys(doc.rows[0].id === `gen::_default--DummyDate::${doc.id}`));

        await removeDocuments();
    });

    it('gh-#29 p1', async () => {
        const random = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const generated = random();

        const keyGenerator = ({ metadata, id }: {
            metadata: ModelMetadata;
            id: any;
        }) => `gen::${metadata.scopeName}--${metadata.collectionName}::${random()}`;
        const schema = new ottoman.Schema({
            id: { type: String, default: () => generated }});
        const generator = ottoman.model('DummyDate', schema, { keyGenerator });
        await generator.create(new generator({}));
        const options = { select: ['meta().id', '*'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        assert.strictEqual(doc.rows.length, 1);
        // unable to find the doc
        await generator.findById(generated);

        await removeDocuments();
    });

    it('gh-#29 p2', async () => {
        const random = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const generated = random();

        const keyGenerator = ({ metadata, id }: {
            metadata: ModelMetadata;
            id: any;
        }) => `gen::${metadata.scopeName}--${generated}--${metadata.collectionName}::`;
        const schema = new ottoman.Schema({
            id: { type: String, default: () => generated }});
        const generator = ottoman.model('DummyDate', schema, { keyGenerator });
        await generator.create(new generator({}));
        const options = { select: ['meta().id', '*'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        assert.strictEqual(doc.rows.length, 1);
        // it shouldn't be able to find back the doc?
        await generator.findById(generated);

        await removeDocuments();
    });

    it('gh-#29 p3', async () => {
        const g = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const keyGenerator = ({ metadata, id }: {
            metadata: ModelMetadata;
            id: any;
        }) => `gen::${metadata.scopeName}--${g()}--${metadata.collectionName}::`;
        const schema = new ottoman.Schema({
            id: { type: String, default: () => g() },
            name: { type: String },
        });
        const generator = ottoman.model('DummyDate', schema, { keyGenerator });
        await generator.create(new generator({ id: '1', name: 'a' }));
        await generator.create(new generator({ id: '2', name: 'b' }));
        await generator.create(new generator({ id: '3', name: 'c' }));
        const options = { select: ['meta().id', '*'], consistency: SearchConsistency.LOCAL }
        const doc = await generator.find({}, options);
        console.log(JSON.stringify(doc, null, 2));
        console.log(await generator.findById('2'));

        // await removeDocuments();
    });
})