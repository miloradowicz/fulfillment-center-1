import { Controller, Delete, Param } from '@nestjs/common'
import { FilesService } from '../services/files.service'


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Delete(':filename')
  async removeFile(@Param('filename') filename: string) {
    await this.filesService.deleteFile(filename)
    return { message: 'Файл успешно удалён' }
  }
}
