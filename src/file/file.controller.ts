import { Controller, Get, Param } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {

  constructor(private readonly fileService: FileService) { }

  @Get("get-upload-url/:userId/:fileName")
  async getUploadUrl(@Param("userId") userId: string, @Param("fileName") fileName: string): Promise<string> {
    return await this.fileService.getPresignedUrl(userId, fileName);
  }
}
