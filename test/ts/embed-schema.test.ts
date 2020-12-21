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
    // location: {
    //     type: 'Point',
    //     coordinates: [1.23, 4.56],
    // }
}

describe('test update function', async () => {
    it('mongoose - should find doc', async () => {
        const Airplane = getMongooseModel();
        const cbAirlines = new Airplane(airplane);
        await Airplane.create(cbAirlines);

        const find = await Airplane.find().exec();
        console.log('mongoose', JSON.stringify(find, null, 2));
    });

    it('ottoman - should find doc', async () => {
        const Airplane = getOttomanModel();
        const cbAirlines = new Airplane(airplane);
        await Airplane.create(cbAirlines);
        const options = { consistency: SearchConsistency.LOCAL }

        const find = await Airplane.find({}, options);
        console.log('ottoman', JSON.stringify(find.rows, null, 2));

        await removeDocuments();
    });

    it('a', async () => {
        const childSchema = new ottoman.Schema({
            name: {
                type: String,
            }
        });
        // const nestedChildSchema = new ottoman.Schema({
        //     type: {
        //         type: String,
        //         required: true,
        //         enum: ['Point'],
        //     },
        //     coordinates: {
        //         type: [Number],
        //         required: true,
        //     }
        // })
        const parentSchema = new ottoman.Schema({
        // Array of subdocuments
        children: [childSchema],
        // Single nested subdocument.
        // child: childSchema,
        // nestedChild: nestedChildSchema,
        });

        const model = ottoman.model('Airplane', parentSchema);
        model.create({
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
            // nestedChild: {
            //     type: 'Point',
            //     coordinates: [1, 2, 3]
            // }
        })

        const options = { consistency: SearchConsistency.LOCAL }

        const find = await model.find({}, options);
        console.log('ottoman', JSON.stringify(find.rows, null, 2));

        await removeDocuments();
    });

    it('b', async () => {
        const childSchema = new ottoman.Schema({
            name: {
                type: String,
            }
        });
        const parentSchema = new ottoman.Schema({
            children: [childSchema],
        });

        const model = ottoman.model('Airplane', parentSchema);
        model.create({
            children: [
                {
                    name: 'a',
                },
                {
                    name: 'b'
                }
            ],
            // child: {
            //     name: 'c'
            // },
        })

        const options = { consistency: SearchConsistency.LOCAL }

        const find = await model.find({}, options);
        console.log('ottoman', JSON.stringify(find.rows, null, 2));

        await removeDocuments();
    });
})