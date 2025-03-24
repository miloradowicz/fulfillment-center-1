import { IsNotEmpty, Matches, MinLength } from 'class-validator'
import { Regex } from 'src/enums'

export class LoginDto {
  @IsNotEmpty({ message: 'Поле эл. почты не должно быть пустым.' })
  @Matches(Regex.email, {
    message: 'Неверный формат эл. почты',
  })
  email: string

  @IsNotEmpty({ message: 'Поле пароля не должно быть пустым.' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string
}
