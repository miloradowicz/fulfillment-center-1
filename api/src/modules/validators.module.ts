import { Module } from '@nestjs/common'
import { DbModule } from './db.module'
import { IsMongoDocumentRule } from 'src/validators/mongo-document-exists.rule'

@Module({
  imports: [DbModule],
  providers: [IsMongoDocumentRule],
})
export class ValidatorsModule {}
