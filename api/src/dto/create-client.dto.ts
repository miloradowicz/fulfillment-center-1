import { IsNotEmpty, IsOptional, Matches } from 'class-validator'
import { Regex } from 'src/enums'

export class CreateClientDto {
  @IsNotEmpty({ message: 'Заполните имя клиента.' }) name: string

  @IsNotEmpty({ message: 'Заполните номер телефона клиента.' })
  @Matches(Regex.phone, {
    message: 'Неверный формат номера телефона.',
  })
  phone_number: string

  @IsNotEmpty({ message: 'Заполните эл. почту клиента.' })
  @Matches(Regex.email, {
    message: 'Неверный формат эл. почты, пример: client@gmail.com/client@mail.ru',
  })
  email: string

  @IsNotEmpty({ message: 'Заполните ИНН клиента.' }) inn: string

  @IsOptional() address: string
  @IsOptional() banking_data: string
  @IsOptional() ogrn: string
}
