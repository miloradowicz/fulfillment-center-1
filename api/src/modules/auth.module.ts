import { Module } from '@nestjs/common'
import { DbModule } from './db.module'
import { TokenAuthService } from 'src/services/token-auth.service'
import { RolesService } from 'src/services/roles.service'

@Module({
  imports: [DbModule],
  providers: [TokenAuthService, RolesService],
  exports: [TokenAuthService, RolesService],
})
export class AuthModule {}
