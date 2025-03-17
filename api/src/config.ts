import { join } from 'path'

const config = {
  server: {
    port: 8000,
  },
  mongo: {
    host: 'mongodb://localhost/',
    db: 'fulfillment-center',
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
  csrf: {
    origin: process.env.ORIGIN as string,
  },
  saltWorkFactor: 10,
  rootPath: join(__dirname, '..'),
  publicPath: 'public',
}

export default config
