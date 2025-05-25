import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { SystemConfigService } from 'src/system-config/system-config.service';

@Injectable()
export class FileService {
  private readonly BE_CONFIG_KEY = 'be.config';
  private readonly logger = new Logger(FileService.name);
  constructor(private readonly systemConfigService: SystemConfigService) {
  }

  async getPresignedUrl(userId: string, fileName: string) {
    const beConfig = await this.systemConfigService.getConfigValueByKey(this.BE_CONFIG_KEY);
    this.logger.log(`BE Config: ${JSON.stringify(beConfig)}`);

    const minioClient = new Minio.Client({
      endPoint: beConfig.minio.endPoint,
      useSSL: beConfig.minio.useSSL,
      accessKey: beConfig.minio.accessKey,
      secretKey: beConfig.minio.secretKey,
    });

    const url = await minioClient.presignedPutObject("user", `${userId}/${fileName}`);
    this.logger.log(`Presigned URL: ${url}`);
    return url;
  }
}
