import { ValidationOptions, registerDecorator } from 'class-validator'
import { IsMongoDocumentRule } from './mongo-document-exists.rule'
import { Type } from '@nestjs/common'

export const MongoDocumentExists =
  <TModel extends object>(
    Model: Type<TModel>,
    fieldName?: string,
    options?: ValidationOptions,
    inverse?: boolean,
  ) =>
    (object: object, propertyName: string) =>
      registerDecorator({
        name: 'IsMongoDocument',
        target: object.constructor,
        propertyName,
        options,
        constraints: [Model, fieldName, inverse, options],
        validator: IsMongoDocumentRule,
      })
