import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'src/config';

@Module({
  imports: [MongooseModule.forRoot(new URL(config.mongo.db, config.mongo.host).href)],
  exports: [MongooseModule],
})
export class MongoModule {}
