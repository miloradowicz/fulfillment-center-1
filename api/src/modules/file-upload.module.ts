import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { FilesService } from '../services/files.service'
import * as path from 'path'
import * as fs from 'fs'
import { FilesController } from '../controllers/files.controller'
import { DbModule } from './db.module'
import config from 'src/config'

@Module({
  imports: [
    DbModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = config.server.uploadsPath
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }
          cb(null, uploadDir)
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          const ext = path.extname(file.originalname)
          cb(null, file.fieldname + '-' + uniqueSuffix + ext)
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.xlsx']
        const ext = path.extname(file.originalname).toLowerCase()
        if (allowedTypes.includes(ext)) {
          cb(null, true)
        } else {
          cb(new Error('Неподдерживаемый формат файла!'), false)
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10,
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})

export class FilesModule {}
