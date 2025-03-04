import { Module } from '@nestjs/common'
import { CsrfController } from 'src/controllers/csrf.controller'

@Module({
  controllers: [CsrfController],
})
export class CsrfModule {}
