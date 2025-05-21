import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import config from './config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationError, ValidationPipe } from '@nestjs/common'
import { DtoValidationError, DtoValidationErrorFilter } from './exception-filters/dto-validation-error.filter'
import { CastErrorFilter } from './exception-filters/mongo-cast-error.filter'
import * as cookieParser from 'cookie-parser'
import * as csurf from 'csurf'
import { useContainer } from 'class-validator'
import * as express from 'express'
import { join } from 'path'
import { TokenAuthGuard } from './guards/token-auth.guard'
import { TokenAuthService } from './services/token-auth.service'
import { RolesGuard } from './guards/roles.guard'
import { RolesService } from './services/roles.service'
import { ValidationErrorFilter } from './exception-filters/mongo-validation-error.filter'
import { existsSync, readFileSync } from 'fs'

async function bootstrap() {
  const httpsOptions = existsSync(config.server.sslPrivateKeyLocation) && existsSync(config.server.sslCertificateLocation) ? {
    key: readFileSync(config.server.sslPrivateKeyLocation),
    cert: readFileSync(config.server.sslCertificateLocation),
  } : undefined
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions })
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.use('/uploads', express.static(config.server.uploadsPath))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ limit: '10mb', extended: true }))
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
    credentials: true,
    origin: config.csrf.origin,
  })
  app.useGlobalGuards(new TokenAuthGuard(app.get(TokenAuthService)), new RolesGuard(app.get(RolesService)))
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[]) => {
        throw new DtoValidationError(validationErrors)
      },
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  app.useGlobalFilters(new DtoValidationErrorFilter(), new CastErrorFilter(), new ValidationErrorFilter)
  await app.listen(config.server.port)
}
bootstrap().catch(console.error)
