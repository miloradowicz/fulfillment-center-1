import { IsEnum, IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: 'Заполните поле эл. почту.' })
  @Matches(/^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/, {
    message: 'Неверный формат эл. почты',
  })
  email: string

  @IsNotEmpty({ message: 'Заполните эл. почту.' })
  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  password: string

  @IsOptional()
  confirmPassword: string

  @IsNotEmpty({ message: 'Заполните поле отображаемое имя.' })
  displayName: string

  @IsOptional()
  @IsEnum(['root', 'admin', 'manager', 'stock-worker'], {
    message: 'Неверная роль. Доступные значения: root, admin, manager, stock-worker.',
  })
  role: 'root' | 'admin' | 'manager' | 'stock-worker'
}

