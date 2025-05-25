import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { SystemConfigModule } from 'src/system-config/system-config.module';
@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [SystemConfigModule]
})
export class FileModule {}
