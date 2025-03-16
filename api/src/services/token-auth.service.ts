import { ExecutionContext, Injectable } from '@nestjs/common'
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
    const header = request.get('Authorization')

    const bearerRegex = /^Bearer (?<token>.+)/

    if (!header || !bearerRegex.test(header)) {
      return true
    }

    const jwtToken = bearerRegex.exec(header)!.groups!['token']

    const token = jwt.verify(jwtToken, config.jwt.secret) as JwtToken

    try {
      const user = await this.userModel.findById(token.id)

      if (user && user.token === jwtToken) {
        request.user = user
        return true
      }

      return false
    } catch {
      return false
    }
  }
}
