import { IsNotEmpty, IsOptional, Matches } from 'class-validator'

export class CreateClientDto {
  @IsNotEmpty({ message: 'Заполните имя клиента.' }) full_name: string

  @IsNotEmpty({ message: 'Заполните номер телефона клиента.' })
  @Matches(/^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4})$/, {
    message: 'Неверный формат номера телефона.',
  })
  phone_number: string

  @IsNotEmpty({ message: 'Заполните эл. почту клиента.' })
  @Matches(/^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/, {
    message: 'Неверный формат эл. почты, пример: client@gmail.com/client@mail.ru',
  })
  email: string

  @IsNotEmpty({ message: 'Заполните ИНН клиента.' }) inn: string

  @IsOptional() address: string
  @IsOptional() company_name: string
  @IsOptional() banking_data: string
  @IsOptional() ogrn: string
}
