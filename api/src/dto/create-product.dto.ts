import { IsMongoId, IsNotEmpty, IsOptional, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

class DynamicFieldDto {
  @IsNotEmpty({ message: 'Поле ключ обязательно для заполнения' })
  key: string

  @IsNotEmpty({ message: 'Поле лейбл обязательно для заполнения' })
  label: string

  @IsNotEmpty({ message: 'Поле значение обязательно для заполнения' })
  value: string
}

export class CreateProductDto {
  @IsNotEmpty({ message: 'Поле клиент обязательно для заполнения' })
  @IsMongoId({ message: 'Некорректный формат ID' })
  client: string

  @IsNotEmpty({ message: 'Поле название обязательно для заполнения' })
  @MinLength(3, { message: 'Название должно состоять минимум из 3 символов' })
  title: string

  @IsNotEmpty({ message: 'Поле штрих-код обязательно для заполнения' })
  barcode: string

  @IsNotEmpty({ message: 'Поле артикул обязательно для заполнения' })
  article: string

  @IsOptional()
  @Type(() => DynamicFieldDto)
  dynamic_fields?: DynamicFieldDto[] | string
}
