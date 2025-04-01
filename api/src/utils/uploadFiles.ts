import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as path from 'path'
import { getRandomStr } from './getRandomString'

export function FileUploadInterceptor(fieldName = 'documents', maxCount = 10) {
  return FilesInterceptor(fieldName, maxCount, {
    storage: diskStorage({
      destination: './uploads/documents',
      filename: (_req, file, cb) => {
        const originalExt = path.extname(file.originalname) || ''
        const { name } = path.parse(file.originalname)
        const uniqueSuffix = getRandomStr()
        cb(null, `${ name.replaceAll(' ', '_') }-${ uniqueSuffix }${ originalExt }`)
      },
    }),
  })
}
