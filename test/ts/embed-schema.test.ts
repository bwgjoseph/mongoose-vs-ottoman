import assert from 'assert';
import * as ottoman from 'ottoman';
import { SearchConsistency } from 'ottoman';
import { AirplaneInterface, getMongooseModel, getOttomanModel } from './setup/model';
import { removeDocuments } from './setup/util';

const airplane: AirplaneInterface = {
    callsign: 'call',
    name: 'plane',
    operational: true,
    destination: ['a'],
    scheduledAt: new Date(),
    capacity: 100,
    model: '737 NG',
    size: 'L',
    info: {
        firstFlightAt: new Date(),
        numberOfFlightsSince: 10,
    },
    location: {
        type: 'Point',
        coordinates: [1.22, 2.33, 1.11],
    },
    extension: {
        external: 'field'
    },
    type: ' Economy ',
    email: 'abc@gmail.com',
}

describe('test update function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('mongoose - should find doc', async () => {
        const Airplane = getMongooseModel();
        const cbAirlines = new Airplane(airplane);
        await Airplane.create(cbAirlines);

        const find = await Airplane.find().exec();
        assert.strictEqual(find.length, 1);
        assert.strictEqual(find[0].location.type, 'Point');
        assert.deepStrictEqual(find[0].location.coordinates[0], 1.22);
        assert.deepStrictEqual(find[0].location.coordinates[1], 2.33);
        assert.deepStrictEqual(find[0].location.coordinates[2], 1.11);

        await Airplane.remove({}).exec();
    });

    it('ottoman - should create doc with embed nested schema', async () => {
        const Airplane = getOttomanModel();
        const cbAirlines = new Airplane(airplane);
        await Airplane.create(cbAirlines);
        const options = { consistency: SearchConsistency.LOCAL }

        const find = await Airplane.find({}, options);
        assert.strictEqual(find.rows.length, 1);
        assert.strictEqual(find.rows[0].location.type, 'Point');
        assert.deepStrictEqual(find.rows[0].location.coordinates, [1.22, 2.33, 1.11]);

        await removeDocuments();
    });

    it('ottoman - should create doc with embed nested schema 2', async () => {
        const childSchema = new ottoman.Schema({
            name: {
                type: String,
            }
        });
        const nestedChildSchema = new ottoman.Schema({
            type: {
                type: String,
                required: true,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                required: true,
            }
        });
        const parentSchema = new ottoman.Schema({
            // Array of subdocuments
            children: [childSchema],
            // Single nested subdocument.
            child: childSchema,
            location: nestedChildSchema,
        });

        const model = ottoman.model('Airplane2', parentSchema);
        const data = {
            children: [
                {
                    name: 'a',
                },
                {
                    name: 'b'
                }
            ],
            child: {
                name: 'c'
            },
            location: {
                type: 'Point',
                coordinates: [1.23, 2.45, 3.56]
            }
        };
        await model.create(data);

        const options = { consistency: SearchConsistency.LOCAL }

        const find = await model.find({}, options);
        assert.ok(find.rows.length === 1);
        assert.ok(find.rows[0].location);

        await removeDocuments();
    });
})