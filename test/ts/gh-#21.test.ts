import assert from 'assert';
import * as ottoman from 'ottoman';
import { SearchConsistency } from 'ottoman';
import { removeDocuments } from './setup/util';

describe('test $lt, $gt, $btw operator for gh-#21', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('verify gh-#21 p1 - date parsing', async () => {
        const schema = new ottoman.Schema({ name: String, date: { type: Date } });
        const DummyDate = ottoman.getModel('DummyDate') || ottoman.model('DummyDate', schema);
        await DummyDate.create({ name: 'Dummy', date: new Date('10 Dec 2020 00:00') });
        const options = { consistency: SearchConsistency.LOCAL };
        await DummyDate.find({
            $or: [
                { date: { $gt: '2020-12-01', $btw: ['2020-12-01', '2020-12-11'] } },
                { date: { $lt: '2020-12-11' } },
                { date: { $btw: ['2020-12-01', '2020-12-11'] } },
            ],
        }, options);

        await removeDocuments();
    });

    it('verify gh-#21 p2 - return type', async () => {
        const schema = new ottoman.Schema({ name: String, date: { type: Date } });
        const DummyDate = ottoman.getModel('DummyDate') || ottoman.model('DummyDate', schema);
        const result = await DummyDate.create({ name: 'Dummy', date: new Date('10 Dec 2020 00:00') });
        // this is a object instead of string
        assert.ok(result.date instanceof Date);
        const options = { consistency: SearchConsistency.LOCAL };
        const doc = await DummyDate.find({
            $or: [
                { date: { $gt: '2020-12-01', $btw: ['2020-12-01', '2020-12-11'] } },
                { date: { $lt: '2020-12-11' } },
                { date: { $btw: ['2020-12-01', '2020-12-11'] } },
            ],
        }, options);
        assert.ok(doc.rows[0].date instanceof Date);

        await removeDocuments();
    });

    it('verify gh-#21 p3 - $gt', async () => {
        const schema = new ottoman.Schema({ name: String, date: { type: Date } });
        const DummyDate = ottoman.getModel('DummyDate') || ottoman.model('DummyDate', schema);
        await DummyDate.create({ name: 'Dummy', date: new Date('10 Dec 2020 00:00') });
        const options = { consistency: SearchConsistency.LOCAL };
        const doc = await DummyDate.find({
            date: {
                $gt: '2021-12-11'
            },
        }, options);
        assert.strictEqual(doc.rows.length, 0);

        await removeDocuments();
    });

    it('verify gh-#21 p3 - $lt', async () => {
        const schema = new ottoman.Schema({ name: String, date: { type: Date } });
        const DummyDate = ottoman.getModel('DummyDate') || ottoman.model('DummyDate', schema);
        await DummyDate.create({ name: 'Dummy', date: new Date('10 Dec 2020 00:00') });
        const options = { consistency: SearchConsistency.LOCAL };
        const doc = await DummyDate.find({
            date: {
                $lt: '2021-12-11'
            },
        }, options);
        assert.strictEqual(doc.rows.length, 1);

        await removeDocuments();
    });

    it('verify gh-#21 p4 - $gt isostring', async () => {
        const schema = new ottoman.Schema({ name: String, date: { type: Date } });
        const DummyDate = ottoman.getModel('DummyDate') || ottoman.model('DummyDate', schema);
        await DummyDate.create({ name: 'Dummy', date: new Date('10 Dec 2021 00:00') });
        const options = { consistency: SearchConsistency.LOCAL };
        const doc = await DummyDate.find({
            date: {
                $gt: '2000-12-03T14:31:51.229Z'
            },
        }, options);
        assert.strictEqual(doc.rows.length, 1);

        const doc2 = await DummyDate.find({
            date: {
                $gt: '2022-12-03T14:31:51.229Z'
            },
        }, options);
        assert.strictEqual(doc2.rows.length, 0);

        const doc3 = await DummyDate.find({
            date: {
                $gt: new Date().toISOString()
            },
        }, options);
        assert.strictEqual(doc3.rows.length, 1);

        await removeDocuments();
    });

    it('verify gh-#21 p4 - $lt isostring', async () => {
        const schema = new ottoman.Schema({ name: String, date: { type: Date } });
        const DummyDate = ottoman.getModel('DummyDate') || ottoman.model('DummyDate', schema);
        await DummyDate.create({ name: 'Dummy', date: new Date('10 Dec 2021 00:00') });
        const options = { consistency: SearchConsistency.LOCAL };
        const doc = await DummyDate.find({
            date: {
                $lt: '2022-12-03T14:31:51.229Z'
            },
        }, options);
        assert.strictEqual(doc.rows.length, 1);

        const doc2 = await DummyDate.find({
            date: {
                $lt: '2019-12-03T14:31:51.229Z'
            },
        }, options);
        assert.strictEqual(doc2.rows.length, 0);

        const doc3 = await DummyDate.find({
            date: {
                $lt: new Date().toISOString()
            },
        }, options);
        assert.strictEqual(doc3.rows.length, 0);

        await removeDocuments();
    });

    it('verify gh-#21 p5 - $btw', async () => {
        const schema = new ottoman.Schema({ name: String, date: { type: Date } });
        const DummyDate = ottoman.getModel('DummyDate') || ottoman.model('DummyDate', schema);
        await DummyDate.create({ name: 'Dummy', date: new Date('10 Dec 2020 00:00') });
        const options = { consistency: SearchConsistency.LOCAL };
        const doc = await DummyDate.find({
            date: {
                $btw: ['2019-12-03T14:31:51.229Z', '2020-12-11']
            },
        }, options);
        assert.strictEqual(doc.rows.length, 1);

        const doc2 = await DummyDate.find({
            date: {
                $btw: ['2021-12-03T14:31:51.229Z', '2022-12-11']
            },
        }, options);
        assert.strictEqual(doc2.rows.length, 0);

        const doc3 = await DummyDate.find({
            date: {
                $btw: ['2018-12-03T14:31:51.229Z', '2019-12-11']
            },
        }, options);
        assert.strictEqual(doc3.rows.length, 0);

        await removeDocuments();
    });
})