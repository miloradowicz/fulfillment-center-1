import { IsNotEmpty, IsOptional, Matches } from 'class-validator'
import { Regex } from 'src/enums'

export class CreateCounterpartyDto {
  @IsNotEmpty({ message: 'Заполните имя контрагента.' }) name: string

  @IsOptional()
  @Matches(Regex.phone, {
    message: 'Неверный формат номера телефона.',
  })
  phone_number: string

  @IsOptional() address: string

}
