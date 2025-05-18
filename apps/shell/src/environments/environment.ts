import { IAppConfig } from '@youtube/common-ui';

export const environment: IAppConfig = {
  production: false,
  geoApiKey: 'a34e41fbc59c46df81bfe20bb18d7e95',
  backendUrl: 'http://localhost:3333',
  apiKey: '',
  remotesUrl: {
    watchApp: 'http://localhost:4201',
    likesApp: 'http://localhost:4202',
    historyApp: 'http://localhost:4203',
  },
};
