import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import config from './config'
import { NestExpressApplication } from '@nestjs/platform-express'
import {  ValidationError, ValidationPipe } from '@nestjs/common'
import { DtoValidationError, DtoValidationErrorFilter } from './exception-filters/dto-validation-error.filter'
import { CastErrorFilter } from './exception-filters/mongo-cast-error.filter'
import * as cookieParser from 'cookie-parser'
import * as csurf from 'csurf'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(cookieParser())
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
      },
    }),
  )
  app.enableCors({
    credentials:true,
    origin: 'http://localhost:5173',
  })
  app.useStaticAssets(join(config.rootPath, config.publicPath))
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[]) => {
        throw new DtoValidationError(validationErrors)
      },
      transform: true,
    }),
  )
  app.useGlobalFilters(new DtoValidationErrorFilter(), new CastErrorFilter())
  await app.listen(config.server.port)
}
bootstrap().catch(console.error)
