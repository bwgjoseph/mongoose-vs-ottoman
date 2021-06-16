import assert from 'assert';
import { model, Schema, SearchConsistency, Ottoman } from 'ottoman';
import { removeDocuments } from './setup/util';

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    const ottoman = new Ottoman({ scopeName: '_default', collectionName: '_default', consistency });

    ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    await ottoman.start();

    await removeDocuments();

    return ottoman;
}

describe('test populate function', async () => {
    before(async () => {
        await initOttoman(SearchConsistency.LOCAL);
    });

    it('ottoman - populate', async () => {
        const postSchema = new Schema({ title: String });
        const commentSchema = new Schema({ text: String, post: { type: String, ref: 'post' }});

        const postModel = model('post', postSchema);
        const commentModel = model('comment', commentSchema);

        const post = await postModel.create({ title: 'titleA' });
        const comment = await commentModel.create({ text: 'commentA', post: post.id });

        const populateA = await comment._populate();
        assert.deepStrictEqual(populateA.post, post);

        const { rows: populateB } = await commentModel.find({}, { populate: 'post' });
        assert.deepStrictEqual(populateB[0].post, post);
    });
});