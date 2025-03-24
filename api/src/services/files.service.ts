import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class FilesService {
  getFilePath(filename: string): string {
    if (!filename) {
      console.error('Имя файла не определено')
      throw new BadRequestException('Имя файла не определено')
    }
    return `/uploads/documents/${ filename }`
  }
}
