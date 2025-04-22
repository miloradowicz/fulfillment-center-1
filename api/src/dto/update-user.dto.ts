import { PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { IsEnum, IsNotEmpty, Matches, MinLength } from 'class-validator'
import { Regex, RolesList, RolesType } from '../enums'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'Заполните поле эл. почту.' })
  @Matches(Regex.email, {
    message: 'Неверный формат эл. почты',
  })
  email: string

  @IsNotEmpty({ message: 'Заполните эл. почту.' })
  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  password: string

  @IsNotEmpty({ message: 'Заполните поле отображаемое имя.' })
  displayName: string

  @IsNotEmpty({ message: 'Заполните поле роль.' })
  @IsEnum(RolesList, {
    message: 'Неверная роль. Доступные значения: super-admin, admin, manager, stock-worker.',
  })
  role: RolesType
}
