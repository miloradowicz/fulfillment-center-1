import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { Response } from 'express'

export class DtoValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super()
  }
}

@Catch(DtoValidationError)
export class DtoValidationErrorFilter implements ExceptionFilter {
  catch(exception: DtoValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    const errors = exception.errors.reduce(
      (a, x) => ({
        ...a,
        ...(x.constraints
          ? {
            [x.property]: {
              name: 'DtoValidationError',
              messages: Object.values(x.constraints),
            },
          }
          : {}),
      }),
      {},
    )

    res.status(400).json({ type: 'ValidationError', errors })
  }
}
