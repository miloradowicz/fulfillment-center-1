import { PartialType } from '@nestjs/swagger'
import { CreateWriteOffDto } from './create-write-off.dto'

export class UpdateWriteOffDto extends PartialType(CreateWriteOffDto) {}
