import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import fs from 'fs';
import { Application } from '../../declarations';

interface Data {}

interface ServiceOptions {}

export class Otto implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Data> {
    const Model = this.app.get('ottomanClient').getModel('data');
    return Model.findById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    const bufferString = fs.readFileSync(`${__dirname}/couchbase-logs-1.jpg`, 'base64');
    const Model = this.app.get('ottomanClient').getModel('data');
    const myData = new Model({ name: 'cb-logs.jpg', data: bufferString });

    return myData.save();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}
