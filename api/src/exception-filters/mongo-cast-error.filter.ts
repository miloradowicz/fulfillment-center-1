import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { Error } from 'mongoose'

@Catch(Error.CastError)
export class CastErrorFilter implements ExceptionFilter {
  catch(exception: Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    const errors = {
      [exception.path]: {
        name: exception.name,
        messages: [
          `"${ exception.value }" is not a valid ${ exception.path }; value must be convertible to type "${ exception.kind }"`,
        ],
      },
    }

    res.status(400).json({ type: 'ValidationError', errors })
  }
}
