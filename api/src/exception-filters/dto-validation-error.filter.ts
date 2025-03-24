import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { Response } from 'express'

type ErrorObject = {
  [key: string]: {
    name?: string,
    messages?: string[],
  }
}

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

    const process = (errors: ValidationError[], path = ''): ErrorObject =>
      errors.reduce(
        (a, x) => ({
          ...a,
          ...(x.constraints ?
            {
              [path + x.property]: {
                name: 'DtoValidationError',
                messages: Object.values(x.constraints),
              },
            }
            : {}
          ),
          ...(x.children
            ? process(x.children, path + x.property + '/')
            : {}
          ),
        }),
        {},
      )

    res.status(400).json({ type: 'ValidationError', errors: process(exception.errors) })
  }
}
