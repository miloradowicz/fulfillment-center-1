import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator'
import mongoose from 'mongoose'

class WriteOffDto {
  @IsNotEmpty({ message: 'Заполните поле товара.' })
  product: mongoose.Types.ObjectId

  @IsNotEmpty({ message: 'Заполните количество товара.' })
  @IsPositive({ message: 'Количество товара должно быть больше 0.' })
  amount: number

  @IsNotEmpty({ message: 'Укажите причину.' })
  reason: string
}

export class CreateWriteOffDto {
    @ArrayNotEmpty({ message: 'Заполните список товаров' })
    @IsArray({ message: 'Заполните список товаров.' })
    @ValidateNested({ each: true })
    @Type(() => WriteOffDto)
    write_offs: WriteOffDto[]
}
