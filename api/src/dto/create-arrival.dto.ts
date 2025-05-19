import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsPositive, ValidateIf,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import mongoose from 'mongoose'

class ProductDto {
  @IsNotEmpty({ message: 'Заполните поле товара.' })
  product: string

  @IsOptional({ message: 'Заполните описание товара.' })
  @IsOptional()
  description: string

  @IsNotEmpty({ message: 'Заполните количество товара.' })
  @IsPositive({ message: 'Количество товара должно быть больше 0.' })
  amount: number
}

class LogDto {
  @IsNotEmpty({ message: 'Заполните поле пользователя.' })
  user: string

  @IsNotEmpty({ message: 'Заполните описание изменения.' })
  change: string

  @IsNotEmpty({ message: 'Заполните дату изменения.' })
  date: Date
}

export class DefectDto {
  @IsNotEmpty({ message: 'Заполните поле товара.' })
  product: mongoose.Types.ObjectId

  @IsNotEmpty({ message: 'Заполните описание дефекта.' })
  defect_description: string

  @IsNotEmpty({ message: 'Заполните количество дефектных товаров.' })
  @IsPositive({ message: 'Количество дефектных товаров должно быть больше 0.' })
  amount: number
}

export class ServiceDto {
  @IsNotEmpty({ message: 'Заполните название услуги.' })
  service: mongoose.Types.ObjectId

  @IsOptional()
  @IsPositive({ message: 'Количество оказанной услуги должно быть больше 0.' })
  service_amount: number = 1

  @ValidateIf((o: ServiceDto) => o.service_price !== undefined)
  @Type(() => Number)
  @IsNumber({}, { message: 'Цена должна быть числом.' })
  @IsPositive({ message: 'Цена должна быть больше 0.' })
  service_price?: number

  @IsNotEmpty({ message: 'Заполните название услуги.' })
  service_type: string
}

export class ReceivedProductDto {
  @IsNotEmpty({ message: 'Заполните поле товара.' })
  product: mongoose.Types.ObjectId

  @IsOptional({ message: 'Заполните описание товара.' })
  @IsOptional()
  description: string

  @IsNotEmpty({ message: 'Заполните количество товара.' })
  @IsPositive({ message: 'Количество товара должно быть больше 0.' })
  amount: number
}

export class CreateArrivalDto {
  @IsNotEmpty({ message: 'Заполните поле клиента.' })
  client: mongoose.Types.ObjectId

  @IsNotEmpty({ message: 'Заполните склад, на который прибыла поставка.' })
  stock: mongoose.Types.ObjectId

  @ArrayNotEmpty({ message: 'Заполните список товаров' })
  @IsArray({ message: 'Заполните список товаров.' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[]

  @IsNotEmpty({ message: 'Заполните дату прибытия' })
  @IsDate({ message: 'Заполните дату прибытия' })
  @Type(() => Date)
  arrival_date: Date

  @IsOptional()
  sent_amount: string

  @IsOptional()
  pickup_location: string

  @IsOptional()
  shipping_agent?: mongoose.Types.ObjectId | null

  @IsOptional()
  documents?: Array<{ document: string }> | string[] | string

  @IsOptional()
  @IsEnum(['ожидается доставка', 'получена', 'отсортирована'], {
    message: 'Статус должен быть одним из: "ожидается доставка", "получена", "отсортирована"',
  })
  arrival_status: 'ожидается доставка' | 'получена' | 'отсортирована'

  @IsOptional()
  @IsArray({ message: 'Заполните список логов.' })
  @ValidateNested({ each: true })
  @Type(() => LogDto)
  logs?: LogDto[]

  @IsOptional()
  @IsArray({ message: 'Заполните список дефектов.' })
  @ValidateNested({ each: true })
  @Type(() => DefectDto)
  defects?: DefectDto[]

  @IsOptional()
  @IsArray({ message: 'Заполните список полученных товаров.' })
  @ValidateNested({ each: true })
  @Type(() => ReceivedProductDto)
  received_amount?: ReceivedProductDto[]

  @IsOptional()
  @IsArray({ message: 'Заполните список оказанных услуг.' })
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services?: ServiceDto[]

  @IsOptional()
  comment: string
}
