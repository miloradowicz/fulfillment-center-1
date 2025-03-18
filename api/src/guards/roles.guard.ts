import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { RolesService } from 'src/services/roles.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly rolesService: RolesService) {}

  async canActivate(context: ExecutionContext) {
    return this.rolesService.checkAuthorization(context)
  }
}
