import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import mongoose from 'mongoose'

class ProductDto {
  @IsNotEmpty({ message: 'Поле товар не должно быть пустым.' })
  @IsMongoId({ message: 'Некорректный формат ID' })
  product: mongoose.Types.ObjectId

  @IsOptional()
  description: string

  @IsNotEmpty({ message: 'Поле количество товара не должно быть пустым.' })
  @IsInt({ message: 'Поле количество товара должно являться числом' })
  @IsPositive({ message: 'Поле количество товарa не может быть отрицательным' })
  amount: number
}

class LogDto {
  @IsNotEmpty({ message: 'Поле пользователь не должно быть пустым.' })
  @IsMongoId({ message: 'Некорректный формат ID' })
  user: string

  @IsNotEmpty({ message: 'Поле описание изменения не должно быть пустым.' })
  change: string

  @IsNotEmpty({ message: 'Поле дата изменения не должно быть пустым.' })
  date: Date
}

class DefectDto {
  @IsNotEmpty({ message: 'Поле товар не должно быть пустым.' })
  @IsMongoId({ message: 'Некорректный формат ID' })
  product: mongoose.Types.ObjectId

  @IsNotEmpty({ message: 'Поле описание дефекта не должно быть пустым.' })
  defect_description: string

  @IsNotEmpty({ message: 'Поле количество дефектных товаров не должно быть пустым.' })
  @IsInt({ message: 'Поле количество дефектных товаров должно являться числом' })
  @IsPositive({ message: 'Поле количество дефектных товаров не может быть отрицательным' })
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


export class CreateOrderDto {
  @IsNotEmpty({ message: 'Поле клиент обязательно для заполнения' })
  client: mongoose.Types.ObjectId

  @IsArray({ message: 'Заполните список товаров.' }) // Это сообщение пользователь никогда не увидит, т.к. формирование массива происходит программно.
  @ArrayNotEmpty({ message: 'Список товаров не может быть пустым' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[]

  @IsNotEmpty({ message: 'Поле сумма заказа обязательно для заполнения' })
  @IsInt({ message: 'Поле сумма заказа должно являться числом' })
  @IsPositive({ message: 'Поле сумма заказа не может равняться 0' })
  price: number

  @IsNotEmpty({ message: 'Поле дата отправки обязательно для заполнения' })
  @IsDate({ message: 'Заполните дату отправки' })
  @Type(() => Date)
  sent_at: Date

  @IsNotEmpty({ message: 'Поле склад обязательно для заполнения.' })
  stock: mongoose.Types.ObjectId

  @IsOptional()
  delivered_at?: string = undefined

  @IsOptional()
  comment?: string = undefined

  @IsOptional()
  documents?: Array<{ document: string }> | string[] | string = undefined

  @IsOptional()
  @IsEnum(['в сборке', 'в пути', 'доставлен'], {
    message: 'Статус должен быть одним из: "в сборке", "в пути", "доставлен"',
  })
  status?: 'в сборке' | 'в пути' | 'доставлен' = undefined

  @IsOptional()
  @IsArray({ message: 'Заполните список логов.' }) // Это сообщение пользователь никогда не увидит, т.к. формирование массива происходит программно.
  @ValidateNested({ each: true })
  @Type(() => LogDto)
  logs?: LogDto[]

  @IsOptional()
  @IsArray({ message: 'Заполните список оказанных услуг.' })
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services?: ServiceDto[] = undefined

  @IsOptional()
  @IsArray({ message: 'Заполните список дефектов.' }) // Это сообщение пользователь никогда не увидит, т.к. формирование массива происходит программно.
  @ValidateNested({ each: true })
  @Type(() => DefectDto)
  defects?: DefectDto[] = undefined
}
