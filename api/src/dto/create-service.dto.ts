import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import mongoose from 'mongoose'

class LogDto {
  @IsNotEmpty({ message: 'Заполните поле пользователя.' })
  user: string

  @IsNotEmpty({ message: 'Заполните описание изменения.' })
  change: string

  @IsNotEmpty({ message: 'Заполните дату изменения.' })
  date: Date
}

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Поле наименование обязательно для заполнения.' })
  name: string

  @IsNotEmpty({ message: 'Поле категория услуги обязательно для заполнения.' })
  serviceCategory: mongoose.Schema.Types.ObjectId

  @IsNotEmpty({ message: 'Поле цена обязательно для заполнения.' })
  @IsPositive({ message: 'Поле цена должно быть положительным числом.' })
  price: number

  @IsOptional()
  @IsString({ message: 'Поле описание должно быть текстом.' })
  description: string

  @IsNotEmpty({ message: 'Поле тип услуги обязательно для заполнения.' })
  @IsEnum(['внутренняя', 'внешняя'], {
    message: 'Тип услуги должен быть "внутренняя" или "внешняя".',
  })
  type: 'внутренняя' | 'внешняя'

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LogDto)
  logs?: LogDto[]
}
