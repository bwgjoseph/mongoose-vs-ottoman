import { BucketExistsError, BucketType, CompressionMode, ConflictResolutionType, CreateBucketOptions, DurabilityLevel, EvictionPolicy } from 'couchbase';
import { model, Ottoman, Schema, SearchConsistency } from 'ottoman';

let ottoman: Ottoman;

const initOttoman = async (consistency: SearchConsistency = SearchConsistency.NONE) => {
    ottoman = new Ottoman({ consistency });

    await ottoman.connect({
        connectionString: 'couchbase://localhost',
        bucketName: 'testBucket',
        username: 'user',
        password: 'password'
    });

    const testSchema = new Schema({ name: String });
    model('testModel', testSchema);
    await ottoman.start();
}

/**
 * To run standalone
 * See #111
 */
describe.skip('test manage bucket, scope and collection', async () => {
    before(async () => {
        await initOttoman();
    });

    it('ottoman - should create bucket', async () => {
        // const bucketOptions: CreateBucketOptions = {
        //     parentSpan: RequestSpan,
        //     timeout: 1000
        // }

        await ottoman.bucketManager.createBucket({
            name: 'tempBucket',
            flushEnabled: false,
            ramQuotaMB: 100,
            numReplicas: 1,
            replicaIndexes: false,
            bucketType: BucketType.Couchbase,
            // note the fieldname conflict
            evictionPolicy: EvictionPolicy.ValueOnly,
            ejectionMethod: EvictionPolicy.ValueOnly,
            // note the fieldname conflict
            maxExpiry: 0,
            maxTTL: 0,
            // note the fieldname and type conflict
            minimumDurabilityLevel: DurabilityLevel.None, // DurabilityLevel
            durabilityMinLevel: 'none', // string
            compressionMode: CompressionMode.Passive,
            conflictResolutionType: ConflictResolutionType.SequenceNumber,
        }).then(async () => {
            await ottoman.collectionManager.createScope('tempScope');
            await ottoman.collectionManager.createCollection({
                name: 'tempCollection',
                scopeName: 'tempScope'
            });
        }).catch(async (error) => {
            if (error instanceof BucketExistsError) {
                console.log(error);
            }
        });

        // await ottoman.bucketManager.dropBucket('tempBucket');
    })

    // it('ottoman - should create scope', async () => {
    //     await ottoman.collectionManager.createScope('tempScope12344');
    // })

    // it('ottoman - should create scope and collection', async () => {
    //     await ottoman.collectionManager.dropScope('testScope')
    //     await ottoman.collectionManager.createScope('testScope')
    //     await ottoman.collectionManager.createCollection({ name: 'testCollection', scopeName: 'testScope' })
    // });
});