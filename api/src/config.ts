import { join } from 'path';

const config = {
  server: {
    port: 8000,
  },
  mongo: {
    host: 'mongodb://localhost/',
    db: 'fulfillment-center',
  },
  saltWorkFactor: 10,
  rootPath: join(__dirname, '..'),
  publicPath: 'public',
};

export default config;
