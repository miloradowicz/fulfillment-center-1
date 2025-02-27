import { Module } from '@nestjs/common';
import { MongoModule } from 'src/mongo/mongo.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [MongoModule],
  providers: [SeederService],
})
export class SeederModule {}
