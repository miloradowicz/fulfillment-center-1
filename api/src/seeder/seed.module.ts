import { Module } from '@nestjs/common'
import { SeederService } from './seeder.service'
import { DbModule } from '../db/db.module'

@Module({
  imports: [DbModule],
  providers: [SeederService],
})
export class SeedModule {}
