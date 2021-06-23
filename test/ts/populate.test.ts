import assert from 'assert';
import { model, Schema, SearchConsistency, Ottoman, set, getModel } from 'ottoman';
import { removeDocuments } from './setup/util';

let postModel: any;
let commentModel: any;

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    set('DEBUG', true);

    const ottoman = new Ottoman({ scopeName: 'samp', collectionName: 'samp1', consistency });

    ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    const postSchema = new Schema({ title: String, createdAt: { type: Date, default: () => new Date() } });
    const commentSchema = new Schema({ text: String, post: { type: String, ref: 'post' }});

    postModel = getModel('post') || model('post', postSchema);
    commentModel = getModel('comment') || model('comment', commentSchema);

    await ottoman.start();

    await removeDocuments();

    return ottoman;
}

/**
 * To run standalone
 */
describe.skip('test populate function', async () => {
    before(async () => {
        await initOttoman(SearchConsistency.LOCAL);
    });

    it('ottoman - populate', async () => {
        const post = await postModel.create({ title: 'titleA' });
        const comment = await commentModel.create({ text: 'commentA', post: post.id });

        const populateA = await comment._populate();
        assert.deepStrictEqual(populateA.post, post);

        const { rows: populateB } = await commentModel.find({}, { populate: 'post' });
        console.log(populateB);
        assert.deepStrictEqual(populateB[0].post, post);

        const { rows: populateC } = await commentModel.find({}, { populate: { post: { select: ['id', 'title'] }} });
        assert.deepStrictEqual(populateC[0].post.id, post.id);
        assert.deepStrictEqual(populateC[0].post.title, post.title);
    });
});