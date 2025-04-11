import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/schemas/user.schema'
import { JwtToken, RequestWithUser } from 'src/types'
import * as jwt from 'jsonwebtoken'
import config from 'src/config'

@Injectable()
export class TokenAuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  public async getUserForToken(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const token = request.cookies?.token as string | undefined

    if (!token) {
      return null
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtToken
      const user = await this.userModel.findById(decoded.id)

      if (!user || user.token !== token) {
        throw new UnauthorizedException('Неверный токен')
      }

      request.user = user
      return true
    } catch {
      throw new UnauthorizedException('Неверный токен')
    }
  }

}
