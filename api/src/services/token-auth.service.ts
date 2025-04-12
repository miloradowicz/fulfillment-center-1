import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/schemas/user.schema'
import { JwtToken, RequestWithUser } from 'src/types'
import * as jwt from 'jsonwebtoken'
import config from 'src/config'
import { Reflector } from '@nestjs/core'
import { PUBLIC_KEY } from 'src/decorators/public.decorator'

@Injectable()
export class TokenAuthService {
  constructor(
      private readonly reflector: Reflector,
      @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async getUserForToken(context: ExecutionContext) {
    const mandatoryAuthentication = config.mandatoryAuthentication
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const token = request.cookies?.token as string | undefined
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(PUBLIC_KEY, [context.getHandler(), context.getClass()])

    if (!token) {
      return isPublic || !mandatoryAuthentication
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtToken
      const user = await this.userModel.findById(decoded.id)

      if (user && user.token === token) {
        request.user = user
        return true
      }

      if (isPublic) {
        return true
      }
    } catch {
      if (isPublic) {
        return true
      }
    }

    throw new UnauthorizedException('Неверный токен')
  }

}
