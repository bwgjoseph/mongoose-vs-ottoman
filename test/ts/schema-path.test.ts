import assert from 'assert';
import { Schema } from 'ottoman';
import { ottomanAirplaneSchema } from './setup/model';
import { removeDocuments } from './setup/util';

function doesFieldExist(schema: Schema, fieldName: string): boolean {
    return !!schema.path(fieldName)
  }

describe('test schema-path function', async () => {
    before(async () => {
        await removeDocuments();
    });

    it('ottoman - check if field exists in schema', async () => {
        assert.ok(doesFieldExist(ottomanAirplaneSchema, 'name'));
        assert.ok(!doesFieldExist(ottomanAirplaneSchema, 'namex'));
    });
})