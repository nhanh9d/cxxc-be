import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { DiscordLogger } from 'src/shared/services/discord.log.service';

// this.minioClient = new Minio.Client({
//   endPoint: '288b-2401-d800-91c1-d3f1-c449-6648-7c0a-aee2.ngrok-free.app',
//   useSSL: true,
//   accessKey: 'WuPiCTOhLJaIKz7LbzTK',
//   secretKey: 'xz7WkmlpLsIwaUfzR38se1dJzSNg3wITXDYRJmVj',
// })

@Injectable()
export class FileService {
  private readonly BE_CONFIG_KEY = 'be.config';
  private readonly logger = new Logger(FileService.name);
  constructor(private readonly systemConfigService: SystemConfigService, private readonly discordLogger: DiscordLogger) {
  }

  async getPresignedUrl(userId: string, fileName: string) {
    const beConfig = await this.systemConfigService.getConfigValueByKey(this.BE_CONFIG_KEY);
    this.logger.log(`BE Config: ${JSON.stringify(beConfig)}`);
    this.discordLogger.log(`BE Config: ${JSON.stringify(beConfig)}`);

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
