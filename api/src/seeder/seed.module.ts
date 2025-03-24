import { Module } from '@nestjs/common'
import { SeederService } from './seeder.service'
import { DbModule } from '../modules/db.module'

@Module({
  imports: [DbModule],
  providers: [SeederService],
})
export class SeedModule {}
