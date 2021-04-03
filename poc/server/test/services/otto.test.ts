import assert from 'assert';
import app from '../../src/app';

describe('\'otto\' service', () => {
  it('registered the service', () => {
    const service = app.service('otto');

    assert.ok(service, 'Registered the service');
  });
});
