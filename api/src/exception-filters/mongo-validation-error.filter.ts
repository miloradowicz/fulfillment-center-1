import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { Error } from 'mongoose'

@Catch(Error.ValidationError)
export class ValidationErrorFilter implements ExceptionFilter {
  catch(exception: Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    const errors = Object.entries(exception.errors).reduce(
      (a, [k, v]) => ({
        ...a,
        [k]: {
          name: v.name,
          messages: [v.message],
        },
      }),
      {},
    )

    res.status(400).json({ type: 'ValidationError', errors })
  }
}
