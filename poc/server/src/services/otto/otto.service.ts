// Initializes the `otto` service on path `/otto`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Otto } from './otto.class';
import hooks from './otto.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'otto': Otto & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/otto', new Otto(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('otto');

  service.hooks(hooks);
}
