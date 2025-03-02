import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import config from './config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationError, ValidationPipe } from '@nestjs/common'
import { DtoValidationError, DtoValidationErrorFilter } from './exception-filters/dto-validation-error.filter'
import { CastErrorFilter } from './exception-filters/mongo-cast-error.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
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
