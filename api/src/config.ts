import { join } from 'path'
import * as ms from 'ms'

const config = {
  endpointProtection: process.env.DISABLE_ENDPOINT_PROTECTION !== '1',
  mandatoryAuthentication: process.env.DISABLE_MANDATORY_AUTHENTICATION !== '1',
  server: {
    port: 8000,
  },
  mongo: {
    host: `mongodb://${ process.env.MONGO_HOST ?? 'localhost' }/`,
    db: process.env.MONGO_DATABASE ?? 'fulfillment-center',
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
  },
  jwt: {
    expiresIn: '30d' as ms.StringValue,
    secret: process.env.JWT_SECRET as string,
  },
  csrf: {
    origin: `${ process.env.ORIGIN }`.split(',').map(x => `http://${ x }`),
  },
  saltWorkFactor: 10,
  rootPath: join(__dirname, '..'),
  publicPath: 'public',
}

export default config
