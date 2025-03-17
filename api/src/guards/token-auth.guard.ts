import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { TokenAuthService } from 'src/services/token-auth.service'


@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly authnService: TokenAuthService) {}

  async canActivate(context: ExecutionContext) {
    if (!(await this.authnService.getUserForToken(context))) {
      throw new UnauthorizedException()
    }

    return true
  }
}
