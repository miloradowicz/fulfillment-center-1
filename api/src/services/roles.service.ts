import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../schemas/user.schema'
import { RequestWithUser } from 'src/types'
import { ROLES_KEY } from 'src/decorators/roles.decorator'

@Injectable()
export class RolesService {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async checkAuthorization(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) {
      return true
    }

    if (!requiredRoles.length) {
      return false
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const _user = request.user

    if (!_user) {
      return false
    }

    const user = await this.userModel.findById(_user._id)
    return !!user && requiredRoles.includes(user.role)
  }
}
