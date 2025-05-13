import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { ConfigType, DataType } from './entity/system-config.entity';

@Injectable()
export class SystemConfigInitService implements OnModuleInit {
  private readonly FE_CONFIG_KEY = 'fe.config';
  private readonly BE_CONFIG_KEY = 'be.config';
  private readonly logger = new Logger(SystemConfigInitService.name);
  constructor(private readonly systemConfigService: SystemConfigService) { }

  async onModuleInit() {
    await this.addFeConfig();
    await this.addBeConfig();
  }

  private async addFeConfig() {
    const feConfig = {
      fileUrl: process.env.FE_FILE_URL,
      minio: {
        useSSL: process.env.MINIO_USE_SSL,
        endPoint: process.env.MINIO_ENDPOINT,
        port: process.env.MINIO_PORT
      }
    };

    try {
      // Kiểm tra xem config đã tồn tại chưa
      const existingConfig = await this.systemConfigService.findByKey(this.FE_CONFIG_KEY).catch(() => null);

      if (existingConfig) {
        this.logger.log('Frontend config already exists, try to remove it');
        await this.systemConfigService.remove(this.FE_CONFIG_KEY);
      }

      // Nếu chưa tồn tại, tạo mới
      await this.systemConfigService.upsert(this.FE_CONFIG_KEY, {
        key: this.FE_CONFIG_KEY,
        description: 'Frontend configuration',
        type: ConfigType.GENERAL,
        dataType: DataType.JSON,
        value: JSON.stringify(feConfig),
        isEncrypted: true
      });

      this.logger.log('Frontend config initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing frontend config:', error);
    }
  }

  private async addBeConfig() {
    const beConfig = {
      minio: {
        useSSL: process.env.MINIO_USE_SSL,
        endPoint: process.env.MINIO_ENDPOINT,
        port: process.env.MINIO_PORT,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY
      }
    };

    try {
      await this.systemConfigService.upsert(this.BE_CONFIG_KEY, {
        key: this.BE_CONFIG_KEY,
        description: 'Backend configuration',
        type: ConfigType.GENERAL,
        dataType: DataType.JSON,
        value: JSON.stringify(beConfig),
        isEncrypted: true
      });

      this.logger.log('Backend config initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing backend config:', error);
    }
  }
} 
