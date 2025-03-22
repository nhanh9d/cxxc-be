import { Controller, Get, Param } from '@nestjs/common';
import { FileService } from './file.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('file')
export class FileController {

  constructor(private readonly fileService: FileService) { }

  @Public()
  @Get("get-upload-url/:userId/:fileName")
  async getUploadUrl(@Param("userId") userId: string, @Param("fileName") fileName: string): Promise<string> {
    return await this.fileService.getPresignedUrl(userId, fileName);
  }
}
