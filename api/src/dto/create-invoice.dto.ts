import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
  ValidateIf,
  IsNumber,
} from 'class-validator'
import { Type } from 'class-transformer'
import mongoose from 'mongoose'

export class InvoiceServiceDto {
  @IsNotEmpty({ message: 'Укажите услугу.' })
  service: mongoose.Types.ObjectId

  @IsOptional()
  @IsPositive({ message: 'Количество должно быть больше 0.' })
  service_amount: number = 1

  @ValidateIf((o: InvoiceServiceDto) => o.service_price !== undefined)
  @Type(() => Number)
  @IsNumber({}, { message: 'Цена должна быть числом.' })
  @IsPositive({ message: 'Цена должна быть больше 0.' })
  service_price?: number
}

export class InvoiceLogDto {
  @IsNotEmpty({ message: 'Укажите пользователя.' })
  user: mongoose.Types.ObjectId

  @IsNotEmpty({ message: 'Опишите изменение.' })
  change: string

  @IsNotEmpty({ message: 'Укажите дату изменения.' })
  date: Date
}

export class CreateInvoiceDto {
  @IsNotEmpty({ message: 'Укажите клиента.' })
  client: mongoose.Types.ObjectId

  @IsArray({ message: 'Список услуг должен быть массивом.' })
  @ValidateNested({ each: true })
  @Type(() => InvoiceServiceDto)
  services: InvoiceServiceDto[]

  @IsNotEmpty({ message: 'Укажите итоговую сумму.' })
  @IsPositive({ message: 'Сумма должна быть больше 0.' })
  totalAmount: number

  @IsOptional()
  @IsEnum(['в ожидании', 'оплачено', 'частично оплачено'], {
    message: 'Статус должен быть одним из: "в ожидании", "оплачено", "частично оплачено"',
  })
  status?: 'в ожидании' | 'оплачено' | 'частично оплачено'

  @IsOptional()
  associatedArrival?: mongoose.Types.ObjectId

  @IsOptional()
  associatedOrder?: mongoose.Types.ObjectId

  @IsOptional()
  @IsArray({ message: 'Заполните список логов.' })
  @ValidateNested({ each: true })
  @Type(() => InvoiceLogDto)
  logs?: InvoiceLogDto[]
}
