import { createParamDecorator } from '@nestjs/common'
import { RequestWithUser } from 'src/types'

export const User = createParamDecorator((_, context) => {
  const request = context.switchToHttp().getRequest<RequestWithUser>()

  return request.user
})
