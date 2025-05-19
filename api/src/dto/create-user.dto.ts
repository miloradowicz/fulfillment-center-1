import { IsEnum, IsNotEmpty, Matches, MinLength } from 'class-validator'
import { MongoDocumentExists } from 'src/validators/mongo-document-exists'
import { User } from 'src/schemas/user.schema'
import { Regex } from 'src/enums'
import { RolesList, RolesType } from 'src/enums'

export class CreateUserDto {
  @IsNotEmpty({ message: 'Заполните поле эл. почту.' })
  @MongoDocumentExists(User, 'email', { message: 'Пользователь с такой электронной почтой уже существует' }, true)
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
