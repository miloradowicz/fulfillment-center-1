import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../schemas/user.schema'
import { RequestWithUser } from 'src/types'
import { ROLES_KEY } from 'src/decorators/roles.decorator'
import config from 'src/config'
import { Environment, RolesType } from 'src/enums'

@Injectable()
export class RolesService {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  checkAuthorization(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<RolesType[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (config.environment === Environment.development) {
      return true
    }

    if (!requiredRoles || !requiredRoles.length) {
      return true
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    if (!user) {
      return false
    }

    return !!user && requiredRoles.includes(user.role)
  }
}
