import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'

export class UpdateLogDto {
  @IsNotEmpty({ message: 'Поле коллекция обязательно.' })
  @IsString({ message: 'Поле коллекция должно быть строкой.' })
  collection: string

  @IsNotEmpty({ message: 'Поле документ обязательно.' })
  @IsString({ message: 'Поле документ должно быть строкой.' })
  @IsMongoId({ message: 'Поле документ должно быть идентификатором Монго.' })
  document: string

  @IsNotEmpty({ message: 'Поле пользователь обязательно.' })
  @IsString({ message: 'Поле пользователь должно быть строкой.' })
  user: string

  @IsNotEmpty({ message: 'Поле изменения обязательно.' })
  @IsString({ message: 'Поле изменения должно быть строкой.' })
  change: string
}
