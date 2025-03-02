import { PartialType } from '@nestjs/swagger'
import { CreateArrivalDto } from './create-arrival.dto'

export class UpdateArrivalDto extends PartialType(CreateArrivalDto) {}
