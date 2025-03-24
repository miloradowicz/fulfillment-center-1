import { IsNotEmpty } from 'class-validator'

export class CreateServiceCategoryDto {
  @IsNotEmpty({ message: 'Заполните название категории услуги.' })
  name: string
}
