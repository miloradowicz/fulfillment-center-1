import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as path from 'path'
import { getRandomStr } from './getRandomString'

export function FileUploadInterceptor(fieldName = 'documents', maxCount = 10) {
  return FilesInterceptor(fieldName, maxCount, {
    storage: diskStorage({
      destination: './uploads/documents',
      filename: (_req, file, cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
        const originalExt = path.extname(originalName) || ''
        const { name } = path.parse(originalName)
        const uniqueSuffix = getRandomStr()
        cb(null, `${ name.normalize('NFKC').replace(/[^\p{L}\p{N}._-]/gu, '_') }-${ uniqueSuffix }${ originalExt }`)
      },
    }),
  })
}


