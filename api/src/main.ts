import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import config from './config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationError, ValidationPipe } from '@nestjs/common'
import { DtoValidationError, DtoValidationErrorFilter } from './exception-filters/dto-validation-error.filter'
import { CastErrorFilter } from './exception-filters/mongo-cast-error.filter'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.useStaticAssets(join(config.rootPath, config.publicPath))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ limit: '10mb', extended: true }))
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
